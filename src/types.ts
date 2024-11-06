/* eslint-disable @typescript-eslint/no-explicit-any */
export type QueryActionHook = QueryActionSubscriberHook &
  QueryActionEmitterHook;

export interface QueryActionSubscriberHook {
  <Action extends QueryAction>(
    action: Action,
    params: QueryActionParams<Action>,
    options?: QueryActionSubscriberHookOptions,
  ): QueryActionSubscriberHookResult<Action>;
}

export interface QueryActionEmitterHook {
  <Action extends QueryAction>(
    action: Action,
    options?: QueryActionEmitterHookOptions<Action>,
  ): QueryActionEmitterHookResult<Action>;
}

export interface QueryAction {
  (...params: Array<any>): Promise<any>;
}

export type QueryActionParams<
  Action extends QueryAction,
  Params extends Parameters<Action> = Parameters<Action>,
> = Params extends never[]
  ? []
  : { [K in keyof Params]: Params[K] | undefined };

export interface QueryActionInvalidator {
  (): void;
}

export type QueryActionPerformer<Action extends QueryAction> =
  Parameters<Action> extends void[] & never[]
    ? (...args: void[] & never[]) => void
    : (...args: Parameters<Action>) => void;

export interface QueryActionSubscriberHookOptions {
  /**
   * If `always` – once fetched `data` never becomes undefined.
   *
   * If `never` – `data` becomes undefined after component unmounting
   *
   * If `auto` – `data` keeping time defined by react-query
   *
   * @default auto
   */
  keepData?: "always" | "never" | "auto";

  /**
   * If `true` – only staled `data` will be refetched on component mounting.
   *
   * If `false` – `data` will never be refetched on component mounting.
   *
   * If `always` – `data` will always be refetched on component mounting.
   *
   * @default true
   */
  refetchOnMount?: boolean | "always";

  /**
   * Callback will be called when error occurs
   */
  onError?: (error: unknown) => void;

  /**
   * If `true` – action will never be fetched, only subscription will work
   *
   * @default false
   */
  subscribeOnly?: boolean;
}

export interface QueryActionEmitterHookOptions<Action extends QueryAction> {
  /**
   * Callback will be called when action successfully fetched
   */
  onSuccess?: (data: Awaited<ReturnType<Action>>) => void;

  /**
   * Callback will be called when error occurs
   */
  onError?: (error: unknown) => void;
}

export type QueryActionHookResult<Action extends QueryAction> =
  QueryActionSubscriberHookResult<Action> &
    QueryActionEmitterHookResult<Action>;

export interface QueryActionSubscriberHookResult<Action extends QueryAction> {
  data: Awaited<ReturnType<Action>> | undefined;
  isLoading: boolean;
  isSuccess: boolean;
  error: unknown;
}

export interface QueryActionEmitterHookResult<Action extends QueryAction> {
  data: Awaited<ReturnType<Action>> | undefined;
  isLoading: boolean;
  isSuccess: boolean;
  error: unknown;
  perform: QueryActionPerformer<Action>;
  invalidate: QueryActionPerformer<Action>;
}
