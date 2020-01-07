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

export type ColumnInput = {
  [alias: string]: any | [any, string];
};

export type ColumnAliases = string[];

export type PermittedColumns = WeakMap<Model, ColumnAliases>;

export default class Model {
  public alias: string = '';
  public table: string = '';
  public columns: {
    [alias: string]: Column;
  } = {};
  public joins: {
    [alias: string]: Join;
  } = {};
  public requiredColumns: string[] = [];
  public primaryKey: string = '';

  constructor(blockJoins: string[] = []) {
    this.init();

    if (this.table === '')
      throw Error(
        'Table property is missing from the model. Model is meant to be an abstract class.',
      );

    const newBlockJoins = (!blockJoins.length && [this.alias]) || blockJoins;
    Object.entries(this.joins).forEach(
      ([alias, join]: [string, Join]): void => {
        this.joins[alias] = this.setJoinInstance(alias, join, newBlockJoins);
      },
    );
    this.setKeyColumns();
  }

  // to be implented in subclasses to initialize properties
  protected init(): void {}

  validate(
    input: ColumnAliases,
    permitJoins?: boolean,
    enforceRequired?: boolean,
    permitOnly?: PermittedColumns,
  ): ColumnAliases;
  validate(
    input: ColumnInput,
    permitJoins?: boolean,
    enforceRequired?: boolean,
    permitOnly?: PermittedColumns,
  ): ColumnInput;
  public validate(
    input: ColumnAliases | ColumnInput,
    permitJoins = true,
    enforceRequired = false,
    permitOnly?: PermittedColumns,
  ) {
    if (enforceRequired) {
      const inputColumns: ColumnAliases =
        input instanceof Array ? input : Object.keys(input);
      this.requiredColumns.forEach((alias: string) => {
        if (!inputColumns.includes(alias))
          throw Error(`Missing required column: ${alias}`);
      });
    }

    return input instanceof Array
      ? this.validateColumnAliases(
          input,
          permitJoins,
          enforceRequired,
          permitOnly,
        )
      : this.validateColumnInput(
          input,
          permitJoins,
          enforceRequired,
          permitOnly,
        );
  }

  private validateColumnAliases(
    input: ColumnAliases,
    permitJoins = true,
    enforceRequired = false,
    permitOnly?: PermittedColumns,
  ): ColumnAliases {
    return input.reduce((safeInput: ColumnAliases, alias): ColumnAliases => {
      // split alias by '.' to access join tables
      const joins = alias.split('.');
      if (joins.length > 1) {
        if (!permitJoins)
          throw Error(`Join relations not permitted: ${joins[0]}`);
        if (!(joins[0] in this.joins))
          throw Error(`Unknown join relation: ${joins[0]}`);

        this.joins[joins[0]].foreignInstance!().validate(
          [joins.slice(1).join('.')],
          permitJoins,
          enforceRequired,
          permitOnly,
        ) && safeInput.push(alias);
      } else {
        if (alias !== '*' && !(alias in this.columns))
          throw Error(`Unknown column: ${alias}`);
        if (
          permitOnly &&
          (!permitOnly.has(this) || !permitOnly.get(this)!.includes(alias))
        )
          throw Error(`Restricted column: ${alias}`);
        if (alias === '*' && enforceRequired)
          throw Error('Wildcard is not permitted');
        safeInput.push(alias);
      }

      return safeInput;
    }, []);
  }

  private validateColumnInput(
    input: ColumnInput,
    permitJoins = true,
    enforceRequired = false,
    permitOnly?: PermittedColumns,
  ): ColumnInput {
    return Object.entries(input).reduce(
      (safeInput: ColumnInput, [alias, value]): ColumnInput => {
        // split alias by '.' to access join tables
        const joins = alias.split('.');
        if (joins.length > 1) {
          if (!permitJoins)
            throw Error(`Join relation not permitted: ${joins[0]}`);
          if (!(joins[0] in this.joins))
            throw Error(`Unknown join relations: ${joins[0]}`);

          safeInput[alias] =
            this.joins[joins[0]].foreignInstance!().validate(
              { [joins.slice(1).join('.')]: value },
              permitJoins,
              enforceRequired,
              permitOnly,
            ) && value;
        } else {
          if (alias !== '*' && !(alias in this.columns))
            throw Error(`Unknown column: ${alias}`);
          if (
            permitOnly &&
            (!permitOnly.has(this) || !permitOnly.get(this)!.includes(alias))
          )
            throw Error(`Restricted column: ${alias}`);
          if (alias === '*' && enforceRequired)
            throw Error('Wildcard is not permitted');

          if (alias !== '*') {
            const validator: Validator =
              typeof this.columns[alias].type === 'string'
                ? (val: any) => typeof val === this.columns[alias].type
                : (this.columns[alias].type as Validator);

            if (!validator(value instanceof Array ? value[0] : value))
              throw Error(`Incorrect value for ${alias}.`);
          }

          safeInput[alias] = value;
        }

        return safeInput;
      },
      {},
    );
  }

  private setJoinInstance(
    alias: string,
    join: Join,
    blockJoins: string[] = [],
  ): Join {
    let foreignInstance: Model;
    return {
      ...join,
      foreignInstance(): Model {
        if (foreignInstance) return foreignInstance;
        if (blockJoins.includes(alias))
          throw Error(
            `Too many joins. Accessing join ${alias} would create an infinite loop.`,
          );
        return (foreignInstance = new join.foreignModel(
          blockJoins.concat(alias),
        ));
      },
    };
  }

  private setKeyColumns(): void {
    const [requiredColumns, primaryKey] = Object.entries(this.columns).reduce(
      (
        [requiredColumns, primary]: [ColumnAliases, string],
        [alias, { required, primaryKey }]: [string, Column],
      ): [ColumnAliases, string] => {
        return [
          required ? requiredColumns.concat(alias) : requiredColumns,
          primaryKey ? alias : primary,
        ];
      },
      [[], ''],
    );

    this.requiredColumns = requiredColumns;
    this.primaryKey = primaryKey;
  }

  public select(...columns: ColumnAliases): SQLQuery {
    return SQLQuery.select(this, columns.length ? columns : undefined);
  }

  public insert(
    input: ColumnInput,
    permitOnly: PermittedColumns = new WeakMap([[this, this.requiredColumns]]),
  ): SQLQuery {
    return SQLQuery.insert(this, input, permitOnly);
  }

  public update(input: ColumnInput): SQLQuery {
    return SQLQuery.update(
      this,
      input,
      new WeakMap([[this, this.requiredColumns]]),
    );
  }

  // start manual sql queries using the SQLQuery interface
  public sql(queryString: string, params?: any[]): SQLQuery {
    return SQLQuery.manual(this, queryString, params);
  }

  public find(primary?: any): SQLQuery {
    return primary !== undefined
      ? this.select()
          .where({ [this.primaryKey]: primary })
          .limit(1)
      : this.select().order([this.primaryKey]);
  }

  // alias for insert
  public create(input: ColumnInput): SQLQuery {
    return this.insert(input);
  }
}
