/*
 * Data Model Abstract Class
 */

// tslint:disable-next-line: import-name
import SQLQuery from './sql';

export type Validator = (value: any) => boolean;

export interface Column {
  name: string;
  type: string | Validator;
  required?: boolean;
  primaryKey?: boolean;
}

export interface Join {
  joinColumn: string;
  foreignModel: typeof Model;
  foreignJoinColumn: string;
  foreignInstance?: () => Model;
}

/**
 * name/key: column key in model
 * value: [value, operator] or value
 * e.g. {
 *   name: 'John Doe'
 *   age: [25, '>=']
 * }
 */
export type ColumnInput = {
  [name: string]: any | [any, string];
};

/** array of column names (column keys in model) or of [name, alias]
 * e.g. [['name', 'username'], 'age']
 * will translate to 'model table'.name AS username, 'model table'.age
 */
export type ColumnNamesAliases = (string | [string, string])[];

export type PermittedColumns = WeakMap<Model, string[]>;

export default class Model {

  public alias: string = '';
  public table: string = '';
  public columns: {
    [name: string]: Column;
  } = {};
  public joins: {
    [name: string]: Join;
  } = {};
  public requiredColumns: string[] = [];
  public primaryKey: string = '';
  public safeColumns:  string[] = [];

  constructor(blockJoins: string[] = []) {
    this.init();

    if (this.table === '') throw Error('Table property is missing from the model. Model is meant to be an abstract class.');

    const newBlockJoins = !blockJoins.length && [this.alias] || blockJoins;
    Object.entries(this.joins).forEach(([columnName, join]: [string, Join]): void => {
      this.joins[columnName] = this.setJoinInstance(columnName, join, newBlockJoins);
    });
    this.setKeyColumns();
  }

  // to be implented in subclasses to initialize properties
  protected init(): void {}

  validate(
    input: ColumnNamesAliases, permitJoins?: boolean, enforceRequired?: boolean, permitOnly?: PermittedColumns,
  ): ColumnNamesAliases;
  validate(
    input: ColumnInput, permitJoins?: boolean, enforceRequired?: boolean, permitOnly?: PermittedColumns,
  ): ColumnInput;
  public validate(
    input: ColumnNamesAliases | ColumnInput, permitJoins = true, enforceRequired = false, permitOnly?: PermittedColumns,
  ) {

    // checks that all of the current model's required fields are present (e.g. CREATE operation)
    if (enforceRequired) {
      const inputColumns: string[] = input instanceof Array
        ? input.map(column => column instanceof Array ? column[0] : column)
        : Object.keys(input);

      this.requiredColumns.forEach((columnName: string) => {
        if (!inputColumns.includes(columnName)) throw Error(`Missing required column: ${columnName}`);
      });
    }

    return input instanceof Array ?
      this.validateColumnNames(input, permitJoins, enforceRequired, permitOnly) :
      this.validateColumnInput(input, permitJoins, enforceRequired, permitOnly);
  }

  private validateColumnNames(
    input: ColumnNamesAliases, permitJoins = true, enforceRequired = false, permitOnly?: PermittedColumns,
  ): ColumnNamesAliases {
    return input.reduce(
      (safeInput: ColumnNamesAliases, columnName): ColumnNamesAliases => {

        const [name, alias] = columnName instanceof Array ? columnName : [columnName, undefined];

        // split columnName by '.' to access join tables
        const joins = name.split('.');
        if (joins.length > 1) {
          // remove left/right joins indicators
          joins[0] = joins[0].replace(/[?!]$/, '');

          if (!permitJoins) throw Error(`Join relations not permitted: ${joins[0]}`);
          if (!(joins[0] in this.joins)) throw Error(`Unknown join relation: ${joins[0]}`);

          this.joins[joins[0]].foreignInstance!().validate(
            [alias ? [joins.slice(1).join('.'), alias] : joins.slice(1).join('.')],
            permitJoins,
            enforceRequired,
            permitOnly,
          ) && safeInput.push(columnName);

        } else {
          if (name !== '*' && !(name in this.columns)) throw Error(`Unknown column: ${name}`);
          if (permitOnly && (!permitOnly.has(this) || !permitOnly.get(this)!.includes(name))) throw Error(`Restricted column: ${name}`);
          if (name === '*' && enforceRequired) throw Error('Wildcard is not permitted');
          safeInput.push(columnName);
        }

        return safeInput;
      },
      []);

  }

  private validateColumnInput(input: ColumnInput, permitJoins = true, enforceRequired = false, permitOnly?: PermittedColumns): ColumnInput {
    return Object.entries(input).reduce(
      (safeInput: ColumnInput, [columnName, value]): ColumnInput => {

        // split columnName by '.' to access join tables
        const joins = columnName.split('.');
        if (joins.length > 1) {
          // remove left/right joins indicators
          joins[0] = joins[0].replace(/[?!]$/, '');

          if (!permitJoins) throw Error(`Join relation not permitted: ${joins[0]}`);
          if (!(joins[0] in this.joins)) throw Error(`Unknown join relations: ${joins[0]}`);

          safeInput[columnName] = this.joins[joins[0]].foreignInstance!().validate(
            { [joins.slice(1).join('.')]: value }, permitJoins, enforceRequired, permitOnly,
          ) && value;

        } else {
          if (columnName !== '*' && !(columnName in this.columns)) throw Error(`Unknown column: ${columnName}`);
          if (permitOnly && (!permitOnly.has(this) || !permitOnly.get(this)!.includes(columnName))) throw Error(`Restricted column: ${columnName}`);
          if (columnName === '*' && enforceRequired) throw Error('Wildcard is not permitted');

          if (columnName !== '*') {
            const validator: Validator = typeof this.columns[columnName].type === 'string' ?
              (val: any) => typeof val === this.columns[columnName].type :
              this.columns[columnName].type as Validator;

            if (!validator(value instanceof Array ? value[0] : value)) throw Error(`Incorrect value for ${columnName}.`);
          }

          safeInput[columnName] = value;
        }

        return safeInput;
      },
      {});
  }

  private setJoinInstance(columnName: string, join: Join, blockJoins: string[] = []): Join {
    let foreignInstance: Model;
    return {
      ...join,
      foreignInstance(): Model {
        if (foreignInstance) return foreignInstance;
        if (blockJoins.includes(columnName)) throw Error(`Too many joins. Accessing join ${columnName} would create an infinite loop.`);
        return (foreignInstance = new join.foreignModel(blockJoins.concat(columnName)));
      },
    };

  }

  private setKeyColumns(): void {
    const [requiredColumns, primaryKey] = Object.entries(this.columns).reduce(
      ([requiredColumns, primary]: [string[], string], [columnName, { required, primaryKey }]: [string, Column],
      ):[string[], string] => {
        return [
          required ? requiredColumns.concat(columnName) : requiredColumns,
          primaryKey ? columnName : primary,
        ];
      },
      [[], '']);

    this.requiredColumns = requiredColumns;
    this.safeColumns = Array.from(new Set(requiredColumns.concat(this.safeColumns)));
    this.primaryKey = primaryKey;
  }

  public select(...columns: ColumnNamesAliases): SQLQuery {
    return SQLQuery.select(this, columns.length ? columns : undefined);
  }

  public insert(input: ColumnInput, permitOnly: PermittedColumns = new WeakMap([[this, this.safeColumns]])): SQLQuery {
    return SQLQuery.insert(this, input, permitOnly);
  }

  public update(input: ColumnInput, permitOnly: PermittedColumns = new WeakMap([[this, this.safeColumns]])): SQLQuery {
    return SQLQuery.update(this, input, permitOnly);
  }

  // start manual sql queries using the SQLQuery interface
  public sql(queryString: string, params?: any[]): SQLQuery {
    return SQLQuery.manual(this, queryString, params);
  }

  public find(primary?: any): SQLQuery {
    return primary !== undefined ?
      this.select().where({ [this.primaryKey]: primary }).limit(1) :
      this.select().order([this.primaryKey]);
  }

  // columnName for insert
  public create(input: ColumnInput): SQLQuery {
    return this.insert(input);
  }

}
