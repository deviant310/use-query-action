/* eslint-disable @typescript-eslint/no-explicit-any */
export interface QueryAction {
  (...params: Array<any>): Promise<any>;
}

export type QueryActionParams<
  Action extends QueryAction,
  Params extends Parameters<Action> = Parameters<Action>,
> = Params extends never[]
  ? []
  : { [K in keyof Params]: Params[K] | undefined };
