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
  [alias: string]: any | [any, string];
};

type ColumnAliases = string[];

type PermittedColumns = WeakMap<Model, ColumnAliases>;

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

  public validate(input: ColumnAliases | ColumnInput, permitJoins = true, enforceRequired = false, permitOnly?: PermittedColumns): ColumnAliases | ColumnInput {

    if (enforceRequired) {
      const inputColumns: ColumnAliases = input instanceof Array ? input : Object.keys(input);
      this.requiredColumns.forEach((alias: string) => {
        if (!inputColumns.includes(alias)) throw Error(`Missing required column: ${alias}`);
      });
    }

    return input instanceof Array ? this.validateColumnAliases(input, permitJoins, enforceRequired) : this.validateColumnInput(input, permitJoins, enforceRequired);
  }

  private validateColumnAliases(input: ColumnAliases, permitJoins = true, enforceRequired = false, permitOnly?: PermittedColumns): ColumnAliases {
    return input.reduce(
      (safeInput: ColumnAliases, alias): ColumnAliases => {

        // split alias by '.' to access join tables
        const joins = alias.split('.');
        if (joins.length > 1) {
          if (!permitJoins) throw Error(`Join relations not permitted: ${joins[0]}`);
          if (!(joins[0] in this.joins)) throw Error(`Unknown join relation: ${joins[0]}`);
          this.joins[joins[0]].foreignModel.validate([joins.slice(1).join('.')], permitJoins, enforceRequired, permitOnly) && safeInput.push(alias);

        } else {
          if (alias !== '*' && !(alias in this.columns)) throw Error(`Unknown column: ${alias}`);
          if (permitOnly && (!permitOnly.has(this) || !permitOnly.get(this)!.includes(alias))) throw Error(`Restricted column: ${alias}`);
          if (alias === '*' && enforceRequired) throw Error('Wildcard is not permitted');
          safeInput.push(alias);
        }

        return safeInput;
      },
      []);

  }

  private validateColumnInput(input: ColumnInput, permitJoins = true, enforceRequired = false, permitOnly?: PermittedColumns): ColumnInput {
    return Object.entries(input).reduce(
      (safeInput: ColumnInput, [alias, value]): ColumnInput => {

        // split alias by '.' to access join tables
        const joins = alias.split('.');
        if (joins.length > 1) {
          if (!permitJoins) throw Error(`Join relation not permitted: ${joins[0]}`);
          if (!(joins[0] in this.joins)) throw Error(`Unknown join relations: ${joins[0]}`);
          safeInput[alias] = this.joins[joins[0]].foreignModel.validate({ [joins.slice(1).join('.')]: value }, permitJoins, enforceRequired, permitOnly) && value;

        } else {
          if (alias !== '*' && !(alias in this.columns)) throw Error(`Unknown column: ${alias}`);
          if (permitOnly && (!permitOnly.has(this) || !permitOnly.get(this)!.includes(alias))) throw Error(`Restricted column: ${alias}`);
          if (alias === '*' && enforceRequired) throw Error('Wildcard is not permitted');

          if (alias !== '*') {
            const validator: Validator = typeof this.columns[alias].type === 'string' ?
              (val: any) => typeof val === this.columns[alias].type :
              this.columns[alias].type as Validator;

            if (!validator(value instanceof Array ? value[0] : value)) throw Error(`Incorrect value for ${alias}.`);
          }

          safeInput[alias] = value;
        }

        return safeInput;
      },
      {});
  }

  public get requiredColumns(): ColumnAliases {
    return Object.entries(this.columns).reduce(
      (requiredColumns: ColumnAliases, [alias, { required }]: [string, ColumnInterface]) => {
        return required ? requiredColumns.concat(alias) : requiredColumns;
      },
      []);
  }

  public select(...columns: ColumnAliases): SQLQuery {
    return SQLQuery.select(this, columns.length ? columns : undefined);
  }

  public insert(input: ColumnInput): SQLQuery {
    return SQLQuery.insert(this, input, new WeakMap([[this, this.requiredColumns]]));
  }

  public update(input: ColumnInput): SQLQuery {
    return SQLQuery.update(this, input, new WeakMap([[this, this.requiredColumns]]));
  }

}

type SQLQueryType = 'INSERT' | 'SELECT' | 'UPDATE' | 'DELETE';

interface SQLCondition {
  relation: 'AND' | 'OR';
  conditions: (ColumnInput | SQLCondition)[];
}

class SQLQuery {

  public type: SQLQueryType;
  public columns: string = '';
  public model: Model;
  public insertValues: string = '';
  public joins: Set<string> = new Set();
  public whereCondition: string = '';
  public params: any[] = [];

  constructor(type: SQLQueryType, model: Model) {
    this.type = type;
    this.model = model;
  }

  where(conditions: SQLCondition) {
    if (this.type === 'INSERT') throw Error('Cannot use WHERE on INSERT');
    const [queryCondition, queryParams, paramNext, joins] = SQLQuery.parseCondition(this.model, conditions, this.params.length + 1, this.type === 'SELECT' ? true : false);
    this.whereCondition = queryCondition;
    this.params.push(queryParams);
    joins.forEach(join => this.joins.add(join));
    return this;
  }

  do(): [string, any[]] {

    switch (this.type) {
      case 'SELECT':

        if (!this.columns) throw Error('No columns selected');

        return [`SELECT ${this.columns} FROM ${this.model.table}${this.joins.size ? ` ${Array.from(this.joins).join(' ')}` : ''}${this.whereCondition ? ` WHERE ${this.whereCondition}` : ''}`, this.params];

      case 'INSERT':

        if (!this.columns) throw Error('No columns to insert into');
        if (!this.insertValues) throw Error('No values to be inserted');

        return [`INSERT INTO ${this.model.table} (${this.columns}) VALUES (${this.insertValues}) RETURNING *`, this.params];

      case 'UPDATE':

        if (!this.columns) throw Error('No columns to update');
        if (!this.insertValues) throw Error('No values to update');
        if (!this.whereCondition) throw Error('A WHERE condition is required for updates');

        return [`UPDATE ${this.model.table} SET (${this.columns}) = (${this.insertValues}) WHERE ${this.whereCondition} RETURNING *`, this.params];

      case 'DELETE':
      default:
        return ['Unknown', []];
    }
  }

  run(query: (queryString: string, params: string[]) => Promise<string[]>): Promise<string[]> {
    return query(...this.do());
  }

  static select(model: Model, aliases: ColumnAliases = ['*']): SQLQuery {
    const [columns, joins] = this.parseSelectColumns(model, aliases);

    const query = new this('SELECT', model);
    query.columns = columns;
    joins.forEach(join => query.joins.add(join));
    return query;
  }

  static insert(model: Model, input: ColumnInput, permitOnly?: PermittedColumns) {
    const [columns, values, params] = this.parseInsertUpdateColumns(model, input, true, permitOnly);

    const query = new this('INSERT', model);
    query.columns = columns;
    query.insertValues = values;
    query.params.push(...params);
    return query;
  }

  static update(model: Model, input: ColumnInput, permitOnly?: PermittedColumns) {
    const [columns, values, params] = this.parseInsertUpdateColumns(model, input, false, permitOnly);

    const query = new this('UPDATE', model);
    query.columns = columns;
    query.insertValues = values;
    query.params.push(...params);
    return query;
  }

  static parseSelectColumns(model: Model, aliases: ColumnAliases): [string, string[]] {
    const [names, joins] = model.validate(aliases).reduce(
      ([names, joins]: [string[], string[]], alias: string): [string[], string[]] => {
        const [addName, addJoins] = this.parseColumn(model, alias);
        return [names.concat(addName), joins.concat(addJoins)];
      },
      [[], []]);

    return [names.join(', '), joins];
  }

  static parseInsertUpdateColumns(model: Model, input: ColumnInput, enforceRequired = false, permitOnly?: PermittedColumns): [string, string, any[]] {
    const [names, values, params] = Object.entries(model.validate(input, false, enforceRequired, permitOnly)).reduce(
      ([names, values, params]: [string[], string[], any[]], [alias, value]: [string, any], i: number): [string[], string[], any[]] => {
        return [names.concat(model.columns[alias].name), values.concat(`$${i + 1}`), params.concat(value)];
      },
      [[], [], []]);

    return [names.join(', '), values.join(', '), params];
  }

  // get column details
  // input: alias, operator, value
  // validate at bottomest level only, if value + operator supplied
  // returns tableName.columnName + condition (as applicable), necessary joins [], param, paramStart

  static parseColumn(model: Model, alias: string, value?: any, operator?: string, paramNext = 1, joins: string[] = []): [string, string[], any, number] {

    // split alias by '.' to access join tables
    const aliases = alias.split('.');
    if (aliases.length > 1) {
      const join = model.joins[aliases[0]];
      return this.parseColumn(join.foreignModel, aliases.slice(1).join('.'), value, operator, paramNext, joins.concat(`JOIN ${join.foreignModel.table} ON ${model.table}.${model.columns[join.joinColumn].name} = ${join.foreignModel.table}.${join.foreignModel.columns[join.foreignJoinColumn].name}`));

    }
    if (alias === '*') return [`${model.table}.*`, joins, value, paramNext];

    const table = `${model.table}.${model.columns[alias].name}`;

    return value !== undefined ?
      [`${table} ${operator !== undefined ? operator : '='} $${paramNext}`, joins, value, paramNext + 1] : [table, joins, value, paramNext];

  }

  static parseCondition(model: Model, condition: ColumnInput | SQLCondition, paramNext: number = 1, permitJoins = true, joins: string[] = []): [string, any[], number, string[]] {

    // condition is of type SQLCondition - recursive case
    if ('relation' in condition && 'conditions' in condition) {
      return (condition as SQLCondition).conditions.reduce(
        ([queryCondition, params, next, joins]: [string, any[], number, string[]], subCondition, i): [string, any[], number, string[]] => {
          const [subQueryCondition, subParams, newNext, newJoins] = this.parseCondition(model, subCondition, next, permitJoins, joins);

          return [
            `${queryCondition + (i > 0 ? ` ${condition.relation} ` : '')}(${subQueryCondition})`,
            params.concat(subParams),
            newNext,
            newJoins];
        },
        ['', [], paramNext, joins]);

    }

    // condition is of type ColumnInput - base case
    return Object.entries(model.validate(condition, permitJoins)).reduce(
      ([queryCondition, params, next, joins]: [string, any[], number, string[]], [column, value], i): [string, any[], number, string[]] => {

        const [addQueryCondition, addJoins, addParam, newNext] = this.parseColumn(model, column, value instanceof Array ? value[0] : value, value instanceof Array ? value[1] : undefined, next);

        return [queryCondition + (i > 0 ? ' AND ' : '') + addQueryCondition, params.concat(addParam), newNext, joins.concat(addJoins)];
      },
      ['', [], paramNext, joins]);

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
  return SQLQuery.createCondition('AND', ...conditions);
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
      primaryKey: true,
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
      primaryKey: true,
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

const query = userModel.select('name');

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

const query2 = userModel.select('name', 'bids.price');

query2.where(or(and({ id: 2, ['requests.id']: 4 }), { name: 'John Doe' }));

console.log(query2);
console.log(query2.do());

console.log(userModel.select().do());
