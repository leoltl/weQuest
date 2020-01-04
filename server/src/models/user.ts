// tslint:max-classes-per-file
// tslint:disable: max-line-length

type Validator = (value: any) => boolean;

interface ColumnInterface {
  name: string;
  type: string | Validator;
  required?: boolean;
  primaryKey?: boolean;
}

interface JoinInterface {
  joinColumn: string;
  foreignModel: Model;
  foreignJoinColumn: string;
}

interface ModelInterface {
  table: string;
  columns?: {
    [alias: string]: ColumnInterface;
  };
  joins?: {
    [alias: string]: JoinInterface;
  };
}

type ColumnInput = {
  [column: string]: any | [any, string];
};

type ColumnAliases = string[];

class Model {

  public table: string;
  public columns: {
    [alias: string]: ColumnInterface;
  };
  public joins: {
    [alias: string]: JoinInterface;
  };

  constructor(model: ModelInterface) {
    this.table = model.table;
    this.columns = model.columns || {};
    this.joins = model.joins || {};
  }

  public addColumn(alias: string, column: ColumnInterface) {
    this.columns[alias] = column;
  }

  public addJoin(alias: string, join: JoinInterface) {
    this.joins[alias] = join;
  }

  public validate(input: ColumnAliases | ColumnInput): ColumnAliases | ColumnInput {
    return input instanceof Array ? this.validateColumnAliases(input) : this.validateColumnInput(input);
  }

  private validateColumnAliases(input: ColumnAliases): ColumnAliases {
    return input.reduce(
      (safeInput: ColumnAliases, alias): ColumnAliases => {

        // split alias by '.' to access join tables
        const joins = alias.split('.');
        if (joins.length > 1) {
          if (!(joins[0] in this.joins)) throw Error(`Unknown join relation: ${joins[0]}`);
          this.joins[joins[0]].foreignModel.validateColumnAliases([joins.slice(1).join('.')]) && safeInput.push(alias);

        } else {
          if (!(alias in this.columns)) { throw Error(`Unknown column: ${alias}`); }
          safeInput.push(alias);
        }

        return safeInput;
      },
      []);

  }

  private validateColumnInput(input: ColumnInput): ColumnInput {
    return Object.entries(input).reduce(
      (safeInput: ColumnInput, [alias, value]): ColumnInput => {

        // split alias by '.' to access join tables
        const joins = alias.split('.');
        if (joins.length > 1) {
          if (!(joins[0] in this.joins)) throw Error(`Unknown join relation: ${joins[0]}`);
          safeInput[alias] = this.joins[joins[0]].foreignModel.validateColumnInput({ [joins.slice(1).join('.')]: value }) && value;

        } else {
          if (!(alias in this.columns)) { throw Error(`Unknown column: ${alias}`); }

          const validator: Validator = typeof this.columns[alias].type === 'string' ?
            (val: any) => typeof val === this.columns[alias].type :
            this.columns[alias].type as Validator;

          if (!validator(value instanceof Array ? value[0] : value)) { throw Error(`Incorrect value for ${alias}.`); }

          safeInput[alias] = value;
        }

        return safeInput;
      },
      {});
  }

  public select(...columns: ColumnAliases): SQLQuery {
    // confirm that columns exist - NEED TO CHECK JOINS
    // this.validate(columns);
    // columns.forEach((column) => {
    //   if (!(column in this.columns)) { throw Error(`Unknown column: ${column}`); }
    // });

    // return new SQLQuery('SELECT', this.validate(columns), this);
    return SQLQuery.select(this, columns);
  }

}

type SQLQueryType = 'CREATE' | 'SELECT' | 'UPDATE' | 'DELETE';

interface SQLCondition {
  relation: 'AND' | 'OR';
  conditions: (ColumnInput | SQLCondition)[];
}

class SQLQuery {

  public type: SQLQueryType;
  public columns: string = '';
  public model: Model;
  public whereCondition: [string, any[]] = ['', []];
  public joins: Set<string> = new Set();
  public params: any[] = [];
  private paramCount = 1;

  constructor(type: SQLQueryType, model: Model) {
    this.type = type;
    this.model = model;
  }

  where(conditions: SQLCondition) {
    const [queryCondition, queryParams, paramCount, joins] = SQLQuery.parseCondition(this.model, conditions, this.paramCount);
    this.whereCondition = [queryCondition, queryParams];
    this.params.push(queryParams);
    this.paramCount = paramCount;
    joins.forEach(join => this.joins.add(join));
  }

  do(): string {
    // return sql
    // remove duplicates joins
    return 'string';
  }

  static select(model: Model, aliases: ColumnAliases = ['*']): SQLQuery {
    const query = new SQLQuery('SELECT', model);
    const [columns, joins] = this.parseColumns(model, aliases);
    query.columns = columns;
    joins.forEach(join => query.joins.add(join));
    return query;
  }

  static parseColumns(model: Model, aliases: ColumnAliases): [string, string[]] {
    const [names, joins] = aliases.reduce(
      ([names, joins]: [string[], string[]], alias: string): [string[], string[]] => {
        const [addName, addJoins] = SQLQuery.parseColumn(model, alias);
        return [names.concat(addName), joins.concat(addJoins)];

      },
      [[], []]);

    return [names.join(', '), joins];
  }

  // get column details
  // input: alias, operator, value
  // validate at bottomest level only, if value + operator supplied
  // returns tableName.columnName + condition (as applicable), necessary joins [], param, paramStart

  static parseColumn(model: Model, alias: string, value?: any, operator?: string, paramCount = 1, joins: string[] = []): [string, string[], any, number] {

    // split alias by '.' to access join tables
    const aliases = alias.split('.');
    if (aliases.length > 1) {
      if (!(aliases[0] in model.joins)) throw Error(`Unknown join relation: ${aliases[0]}`);

      const join = model.joins[aliases[0]];
      return SQLQuery.parseColumn(join.foreignModel, aliases.slice(1).join('.'), value, operator, paramCount, joins.concat(`JOIN ${join.foreignModel.table} ON ${model.table}.${model.columns[join.joinColumn].name} = ${join.foreignModel.table}.${join.foreignModel.columns[join.foreignJoinColumn].name}`));

    } else {
      if (alias === '*') return [`${model.table}.*`, joins, value, paramCount];

      value !== undefined && model.validate({ [alias]: value }) || model.validate([alias]);
      const table = `${model.table}.${model.columns[alias].name}`;

      if (value !== undefined) {
        return [`${table} ${operator !== undefined ? operator : '='} $${paramCount}`, joins, value, paramCount + 1];
      }

      return [table, joins, value, paramCount];

    }

  }

  static parseCondition(model: Model, condition: ColumnInput | SQLCondition, paramCount: number = 1, joins: string[] = []): [string, any[], number, string[]] {

    // condition is of type SQLCondition - recursive case
    if ('relation' in condition && 'conditions' in condition) {
      return (condition as SQLCondition).conditions.reduce(
        ([query, params, count, joins]: [string, any[], number, string[]], cond, i): [string, any[], number, string[]] => {
          const [subcolumns, subparams, newCount, newJoins] = SQLQuery.parseCondition(model, cond, count, joins);

          return [
            `${query + (i > 0 ? ` ${condition.relation} ` : '')}(${subcolumns})`,
            params.concat(subparams),
            newCount,
            newJoins];
        },
        ['', [], paramCount, joins]);

    }

    // condition is of type ColumnInput - base case
    // return Object.entries(model.validate(condition as ColumnInput)).reduce(
    //   ([query, params, count, joins]: [string, any[], number, string[]], [column, value], i): [string, any[], number, string[]] => {

    //     const allModels = column.split('.');
    //     const columnAlias = allModels[allModels.length - 1];
    //     let columnModel = model;
    //     for (let j = 0; j < allModels.length - 1; j = j + 1) {
    //       const join = SQLQuery.getJoin(columnModel, allModels[j]);
    //       if (!joins.includes(join)) { joins.push(join); }
    //       columnModel = model.joins[allModels[j]].foreignModel;
    //     }

    //     return [`${query + (i > 0 ? ' AND ' : '') + columnModel.table}.${columnModel.columns[columnAlias].name} ${value instanceof Array && value[1] || '='} $${count}`, params.concat(value instanceof Array ? value[0] : value), count + 1, joins];
    //   },
    //   ['', [], paramCount, joins]);

    return Object.entries(model.validate(condition as ColumnInput)).reduce(
      ([query, params, count, joins]: [string, any[], number, string[]], [column, value], i): [string, any[], number, string[]] => {

        const [addQuery, addJoins, addParam, newCount] = SQLQuery.parseColumn(model, column, value instanceof Array ? value[0] : value, value instanceof Array ? value[1] : undefined, count);

        return [query + (i > 0 ? ' AND ' : '') + addQuery, params.concat(addParam), newCount, joins.concat(addJoins)];
      },
      ['', [], paramCount, joins]);

  }

  // join string should include table names
  // static getJoin(model: Model, alias: string) {
  //   if (!(alias in model.joins)) { throw Error(`Unknown join relation: ${alias}`); }
  //   const join = model.joins[alias];
  //   return `JOIN ${join.foreignModel.table} ON ${model.columns[join.joinColumn].name} = ${join.foreignModel.columns[join.foreignJoinColumn].name}`;
  // }

  static createCondition(relation: 'AND' | 'OR', ...conditions: (ColumnInput | SQLCondition)[]): SQLCondition {
    return {
      relation,
      conditions: conditions.reduce(
        (conditions: (ColumnInput | SQLCondition)[], condition: ColumnInput | SQLCondition): (ColumnInput | SQLCondition)[] => {
          // condition is of type SQLCondition
          return 'relation' in condition && 'conditions' in condition ?
            conditions.concat(condition) :
            conditions.concat(Object.entries(condition).map(([column, value]) => ({ [column]: value })));
        },
        []),
    };
  }

}

const and = function (...conditions: (ColumnInput | SQLCondition)[]): SQLCondition {
  return SQLQuery.createCondition('OR', ...conditions);
};

const or = function (...conditions: (ColumnInput | SQLCondition)[]): SQLCondition {
  return SQLQuery.createCondition('OR', ...conditions);
};

// test data

const userSchema: ModelInterface = {
  table: 'users',
  columns: {
    id: {
      name: 'id',
      type: 'number',
      required: true,
    },
    name: {
      name: 'name',
      type: 'string',
      required: true,
    },
    email: {
      name: 'email',
      type: 'string',
      required: true,
    },
  },
  joins: {},
};

const requestSchema: ModelInterface = {
  table: 'requests',
  columns: {
    id: {
      name: 'id',
      type: 'number',
      required: true,
    },
    date: {
      name: 'name',
      type: 'string',
      required: true,
    },
    userId: {
      name: 'user_id',
      type: 'number',
      required: true,
    },
  },
  joins: {},
};

const bidSchema: ModelInterface = {
  table: 'bids',
  columns: {
    id: {
      name: 'id',
      type: 'number',
      required: true,
    },
    price: {
      name: 'price',
      type: 'number',
      required: true,
    },
    userId: {
      name: 'user_id',
      type: 'number',
      required: true,
    },
    requestId: {
      name: 'request_id',
      type: 'number',
      required: true,
    },
  },
  joins: {},
};

const userModel = new Model(userSchema);
const requestModel = new Model(requestSchema);
const bidModel = new Model(bidSchema);

userModel.addJoin('requests', {
  joinColumn: 'id',
  foreignJoinColumn: 'userId',
  foreignModel: requestModel,
});

userModel.addJoin('bids', {
  joinColumn: 'id',
  foreignJoinColumn: 'userId',
  foreignModel: bidModel,
});

requestModel.addJoin('users', {
  joinColumn: 'userId',
  foreignJoinColumn: 'id',
  foreignModel: userModel,
});

requestModel.addJoin('bids', {
  joinColumn: 'id',
  foreignJoinColumn: 'requestId',
  foreignModel: bidModel,
});

bidModel.addJoin('users', {
  joinColumn: 'userId',
  foreignJoinColumn: 'id',
  foreignModel: userModel,
});

bidModel.addJoin('requests', {
  joinColumn: 'requestId',
  foreignJoinColumn: 'id',
  foreignModel: requestModel,
});

const query = userModel.select(['name']);

query.where({
  relation: 'OR',
  conditions: [
    { name: 'hey' },
    { email: 'hey' },
    { ['requests.date']: 'hey' },
    {
      relation: 'AND',
      conditions: [
        { name: 'hey' },
        { email: 'hey' },
        { ['requests.date']: 'hey' },
      ],
    },
  ],
});

console.log(query);

const query2 = userModel.select(['name', 'bids.price']);

query2.where(or(and({ id: 2, ['requests.id']: 4 }), { name: 'John Doe' }));

console.log(query2);
