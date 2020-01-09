/*
 * SQL Query Generator
 */

// tslint:disable: import-name
import camelcaseKeys from 'camelcase-keys';
import Model, { ColumnAliases, ColumnInput, PermittedColumns } from './model';

export type SQLRunner = (query: string, params?: any[]) => Promise<any[]>;

export type SQLQueryType = 'INSERT' | 'SELECT' | 'UPDATE' | 'DELETE' | 'MANUAL';

export type SQLConditionRelation = 'AND' | 'OR';

export interface SQLCondition {
  relation: SQLConditionRelation;
  conditions: (ColumnInput | SQLCondition)[];
}

export type SQLOrder = (string | [string, 'ASC' | 'DESC'])[];

export default class SQLQuery {
  private type: SQLQueryType;
  private columns: string = '';
  private model: Model;
  private insertValues: string = '';
  private joins: Set<string> = new Set();
  private whereCondition: string = '';
  private orderCondition: string = '';
  private limitCondition: string = '';
  private limitOne: boolean = false;
  private locked: boolean = false;
  private queryString: string = '';
  private params: any[] = [];

  private constructor(type: SQLQueryType, model: Model) {
    this.type = type;
    this.model = model;
  }

  public where(conditions: ColumnInput | SQLCondition): this {
    if (this.type === 'INSERT') throw Error('Cannot use WHERE with INSERT');

    const [queryCondition, queryParams, joins] = SQLQuery.parseCondition(
      this.model,
      conditions,
      this.params.length + 1,
      this.type === 'SELECT' ? true : false,
    );
    this.whereCondition = queryCondition;
    this.params.push(...queryParams);
    joins.forEach(join => this.joins.add(join));
    return this;
  }

  public order(input: SQLOrder): this {
    if (this.type !== 'SELECT') throw Error('Cannot only ORDER BY with SELECT');

    const [columns, joins] = input.reduce(
      (
        [columns, joins]: [string[], string[]],
        aliasValue: string | [string, 'ASC' | 'DESC'],
      ): [string[], string[]] => {
        const [alias, value] =
          aliasValue instanceof Array ? aliasValue : [aliasValue, 'ASC'];
        this.model.validate([alias]);
        const [addColumn, addJoins] = SQLQuery.parseColumn(
          this.model,
          alias,
          value,
          '',
          0,
          false,
        );
        return [columns.concat(addColumn), joins.concat(addJoins)];
      },
      [[], []],
    );

    this.orderCondition = columns.join(', ');
    joins.forEach(join => this.joins.add(join));
    return this;
  }

  public limit(max: number, offset?: number): this {
    max === 1 && (this.limitOne = true);
    this.limitCondition = `LIMIT ${max}${offset ? ` OFFSET ${offset}` : ''}`;
    return this;
  }

  public lock(): this {
    if (this.type !== 'SELECT') throw Error('Cannot only lock with SELECT');
    this.locked = true;
    return this;
  }

  /**
   * Stringifies query
   * @returns [query, params]
   */
  public do(): [string, any[]] {
    switch (this.type) {
      case 'SELECT':
        if (!this.columns) throw Error('No columns selected');

        return [
          `SELECT ${this.columns}
          FROM ${this.model.table}${
            this.joins.size ? ` ${Array.from(this.joins).join(' ')}` : ''
          }
          ${this.whereCondition ? `WHERE ${this.whereCondition}` : ''}
          ${this.orderCondition ? ` ORDER BY ${this.orderCondition}` : ''}
          ${this.limitCondition ? ` ${this.limitCondition}` : ''}
          ${this.locked ? ' FOR UPDATE' : ''}`,
          this.params,
        ];

      case 'INSERT':
        if (!this.columns) throw Error('No columns to insert into');
        if (!this.insertValues) throw Error('No values to be inserted');

        return [
          `INSERT INTO ${this.model.table} (${this.columns})
          VALUES (${this.insertValues})
          RETURNING *`,
          this.params,
        ];

      case 'UPDATE':
        if (!this.columns) throw Error('No columns to update');
        if (!this.insertValues) throw Error('No values to update');
        if (!this.whereCondition)
          throw Error('A WHERE condition is required for updates');

        return [
          `UPDATE ${this.model.table}
          ${
            this.columns.includes(',')
              ? `SET (${this.columns}) = (${this.insertValues})`
              : `SET ${this.columns} = ${this.insertValues}`
          }
          WHERE ${this.whereCondition}
          RETURNING *`,
          this.params,
        ];

      case 'MANUAL':
        return [this.queryString, this.params];

      case 'DELETE':
      default:
        return ['Unknown', []];
    }
  }

  public run(runner: SQLRunner): ReturnType<SQLRunner> | any {
    return runner(...this.do()).then(rows => {
      const output = rows.map(row => camelcaseKeys(row));
      return this.limitOne ? output[0] : output;
    });
  }

  static select(model: Model, aliases: ColumnAliases = ['*']): SQLQuery {
    const [columns, joins] = this.parseSelectColumns(model, aliases);

    const query = new this('SELECT', model);
    query.columns = columns;
    joins.forEach(join => query.joins.add(join));
    return query;
  }

  static insert(
    model: Model,
    input: ColumnInput,
    permitOnly?: PermittedColumns,
  ): SQLQuery {
    const [columns, values, params] = this.parseInsertUpdateColumns(
      model,
      input,
      true,
      permitOnly,
    );

    const query = new this('INSERT', model);
    query.columns = columns;
    query.insertValues = values;
    query.limitOne = true;
    query.params.push(...params);
    return query;
  }

  static update(
    model: Model,
    input: ColumnInput,
    permitOnly?: PermittedColumns,
  ): SQLQuery {
    const [columns, values, params] = this.parseInsertUpdateColumns(
      model,
      input,
      false,
      permitOnly,
    );

    const query = new this('UPDATE', model);
    query.columns = columns;
    query.insertValues = values;
    query.params.push(...params);
    return query;
  }

  static manual(
    model: Model,
    queryString: string,
    params: any[] = [],
  ): SQLQuery {
    const query = new this('MANUAL', model);
    query.queryString = queryString;
    query.params = params;
    return query;
  }

  static parseSelectColumns(
    model: Model,
    aliases: ColumnAliases,
  ): [string, string[]] {
    const [names, joins] = model.validate(aliases).reduce(
      (
        [names, joins]: [string[], string[]],
        alias: string,
      ): [string[], string[]] => {
        const [addName, addJoins] = this.parseColumn(model, alias);
        return [names.concat(addName), joins.concat(addJoins)];
      },
      [[], []],
    );

    return [names.join(', '), joins];
  }

  static parseInsertUpdateColumns(
    model: Model,
    input: ColumnInput,
    enforceRequired = false,
    permitOnly?: PermittedColumns,
  ): [string, string, any[]] {
    const [names, values, params] = Object.entries(
      model.validate(input, false, enforceRequired, permitOnly),
    ).reduce(
      (
        [names, values, params]: [string[], string[], any[]],
        [alias, value]: [string, any],
        i: number,
      ): [string[], string[], any[]] => {
        return [
          names.concat(model.columns[alias].name),
          values.concat(`$${i + 1}`),
          params.concat(value),
        ];
      },
      [[], [], []],
    );

    return [names.join(', '), values.join(', '), params];
  }

  /**
   * Get query-ready column details
   * @returns [queryCondition, joins, value, paramNext]
   */
  static parseColumn(
    model: Model,
    alias: string,
    value?: any,
    operator = '=',
    paramNext = 1,
    parameterized = true,
    joins: string[] = [],
  ): [string, string[], any, number] {
    // split alias by '.' to access join tables
    const aliases = alias.split('.');
    if (aliases.length > 1) {
      const join = model.joins[aliases[0]];

      return this.parseColumn(
        join.foreignInstance!(),
        aliases.slice(1).join('.'),
        value,
        operator,
        paramNext,
        parameterized,
        joins.concat(
          `JOIN ${join.foreignInstance!().table} ON ${model.table}.${
            model.columns[join.joinColumn].name
          } = ${join.foreignInstance!().table}.${
            join.foreignInstance!().columns[join.foreignJoinColumn].name
          }`,
        ),
      );
    }
    if (alias === '*') return [`${model.table}.*`, joins, value, paramNext];

    const table = `${model.table}.${model.columns[alias].name}`;

    return value === undefined
      ? [table, joins, value, paramNext]
      : parameterized
      ? [
          `${table + (operator ? ` ${operator}` : operator)} $${paramNext}`,
          joins,
          value,
          paramNext + 1,
        ]
      : [
          `${table + (operator ? ` ${operator}` : operator)} ${value}`,
          joins,
          undefined,
          paramNext,
        ];
  }

  /**
   * Get query-ready condition ('WHERE' ..)
   * @returns [queryCondition, params, joins, paramNext]
   */
  static parseCondition(
    model: Model,
    condition: ColumnInput | SQLCondition,
    paramNext = 1,
    permitJoins = true,
    joins: string[] = [],
  ): [string, any[], string[], number] {
    // condition is of type SQLCondition - recursive case
    if ('relation' in condition && 'conditions' in condition) {
      return (condition as SQLCondition).conditions.reduce(
        (
          [queryCondition, params, joins, next]: [
            string,
            any[],
            string[],
            number,
          ],
          subCondition,
          i,
        ): [string, any[], string[], number] => {
          const [
            subQueryCondition,
            subParams,
            newJoins,
            newNext,
          ] = this.parseCondition(
            model,
            subCondition,
            next,
            permitJoins,
            joins,
          );

          return [
            `${queryCondition +
              (i > 0 ? ` ${condition.relation} ` : '')}(${subQueryCondition})`,
            params.concat(subParams),
            newJoins,
            newNext,
          ];
        },
        ['', [], joins, paramNext],
      );
    }

    // condition is of type ColumnInput - base case
    return Object.entries(model.validate(condition, permitJoins)).reduce(
      (
        [queryCondition, params, joins, next]: [
          string,
          any[],
          string[],
          number,
        ],
        [column, valueOperator],
        i,
      ): [string, any[], string[], number] => {
        const [value, operator] =
          valueOperator instanceof Array
            ? valueOperator
            : [valueOperator, undefined];

        const [
          addQueryCondition,
          addJoins,
          addParam,
          newNext,
        ] = this.parseColumn(model, column, value, operator, next);

        return [
          queryCondition + (i > 0 ? ' AND ' : '') + addQueryCondition,
          params.concat(addParam),
          joins.concat(addJoins),
          newNext,
        ];
      },
      ['', [], joins, paramNext],
    );
  }

  static createCondition(
    relation: SQLConditionRelation,
    ...conditions: (ColumnInput | SQLCondition)[]
  ): SQLCondition {
    return {
      relation,
      conditions: conditions.reduce(
        (
          conditions: (ColumnInput | SQLCondition)[],
          condition: ColumnInput | SQLCondition,
        ): (ColumnInput | SQLCondition)[] => {
          // condition is of type SQLCondition
          return 'relation' in condition && 'conditions' in condition
            ? conditions.concat(condition)
            : conditions.concat(
                Object.entries(condition).map(([column, value]) => ({
                  [column]: value,
                })),
              );
        },
        [],
      ),
    };
  }
}

export const and = function(
  ...conditions: (ColumnInput | SQLCondition)[]
): SQLCondition {
  return SQLQuery.createCondition('AND', ...conditions);
};

export const or = function(
  ...conditions: (ColumnInput | SQLCondition)[]
): SQLCondition {
  return SQLQuery.createCondition('OR', ...conditions);
};
