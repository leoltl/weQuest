// tslint:max-classes-per-file
// tslint:disable: max-line-length

type Validator = (value: any) => boolean;

interface ColumnInterface {
  name: string;
  type: string | Validator;
  required: boolean;
}

interface JoinInterface {
  joinColumn: string;
  foreignModel: Model;
  foreignJoinColumn: string;
}

interface ModelInterface {
  table: string;
  columns: {
    [alias: string]: ColumnInterface;
  };
  joins: {
    [alias: string]: JoinInterface;
  };
}

type ColumnInput = {
  [column: string]: any | [any, string];
};

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
    this.columns = model.columns;
    this.joins = model.joins;
  }

  public addColumn(alias: string, column: ColumnInterface) {
    this.columns[alias] = column;
  }

  public addJoin(alias: string, join: JoinInterface) {
    this.joins[alias] = join;
  }

  public validate(input: ColumnInput): ColumnInput {
    return Object.entries(input).reduce(
      (safeInput: ColumnInput, [alias, value]): ColumnInput => {

        // split key by '.' to access join tables
        const joins = alias.split('.');
        if (joins.length > 1) {
          if (!(joins[0] in this.joins)) { throw Error(`Unknown join relation: ${joins[0]}`); }
          safeInput[alias] = this.joins[joins[0]].foreignModel.validate({ [joins.slice(1).join('.')]: value })[joins.slice(1).join('.')];

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

  public select(columns: string[]): SQLQuery {
    // confirm that columns exist
    columns.forEach((column) => {
      if (!(column in this.columns)) { throw Error(`Unknown column: ${column}`); }
    });

    return new SQLQuery('SELECT', columns, this);
  }

}

type SQLQueryType = 'CREATE' | 'SELECT' | 'UPDATE' | 'DELETE';

interface SQLCondition {
  relation: 'AND' | 'OR';
  conditions: (ColumnInput | SQLCondition)[];
}

class SQLQuery {

  public type: SQLQueryType;
  public columns: string[] = [];
  public model: Model;
  public whereCondition: [string, any[]] = ['', []];
  public joins: string[] = [];
  private paramCount = 1;

  constructor(type: SQLQueryType, columns: string[] = [], model: Model) {
    this.type = type;
    this.columns = columns;
    this.model = model;
  }

  where(conditions: SQLCondition) {
    const [queryCondition, queryParams, paramCount, joins] = SQLQuery.parseCondition(this.model, conditions, this.paramCount, this.joins);
    this.whereCondition = [queryCondition, queryParams];
    this.paramCount = paramCount;
    this.joins = joins;
  }

  static parseCondition(model: Model, condition: ColumnInput | SQLCondition, paramCount: number, joins: string[]): [string, any[], number, string[]] {

    // condition is of type SQLCondition
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

    // condition is of type ColumnInput
    return Object.entries(model.validate(condition as ColumnInput)).reduce(
      ([query, params, count, joins]: [string, any[], number, string[]], [column, value], i): [string, any[], number, string[]] => {

        const allModels = column.split('.');
        const columnAlias = allModels[allModels.length - 1];
        let columnModel = model;
        for (let j = 0; j < allModels.length - 1; j = j + 1) {
          const join = SQLQuery.getJoin(columnModel, allModels[j]);
          if (!joins.includes(join)) { joins.push(join); }
          columnModel = model.joins[allModels[j]].foreignModel;
        }

        return [`${query + (i > 0 ? ' AND ' : '') + columnModel.table}.${columnModel.columns[columnAlias].name} ${value instanceof Array && value[1] || '='} $${count}`, params.concat(value instanceof Array ? value[0] : value), count + 1, joins];
      },
      ['', [], paramCount, joins]);

  }

  static getJoin(model: Model, alias: string) {
    if (!(alias in model.joins)) { throw Error(`Unknown join relation: ${alias}`); }
    const join = model.joins[alias];
    return `JOIN ${join.foreignModel.table} ON ${join.joinColumn} = ${join.foreignJoinColumn}`;
  }

}

const and = function (columns: ColumnInput): SQLCondition {
  return {
    relation: 'AND',
    conditions: Object.entries(columns).map(([column, value]) => ({ [column]: value })),
  };
};

const or = function (columns: ColumnInput): SQLCondition {
  return {
    relation: 'OR',
    conditions: Object.entries(columns).map(([column, value]) => ({ [column]: value })),
  };
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

const userModel = new Model(userSchema);
const requestModel = new Model(requestSchema);

userModel.addJoin('requests', {
  joinColumn: 'id',
  foreignJoinColumn: 'userId',
  foreignModel: requestModel,
});

requestModel.addJoin('users', {
  joinColumn: 'userId',
  foreignJoinColumn: 'id',
  foreignModel: userModel,
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
