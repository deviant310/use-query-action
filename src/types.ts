/* eslint-disable @typescript-eslint/no-explicit-any */
export type QueryActionHook = QueryActionSubscriberHook &
  QueryActionEmitterHook;

export interface QueryActionSubscriberHook {
  <Action extends QueryAction, Err = Error>(
    action: Action,
    params: QueryActionParams<Action>,
    options?: QueryActionSubscriberHookOptions<Err>,
  ): QueryActionSubscriberHookResult<Action, Err>;
}

export interface QueryActionEmitterHook {
  <Action extends QueryAction, Err = Error>(
    action: Action,
    options?: QueryActionEmitterHookOptions<Err>,
  ): QueryActionEmitterHookResult<Action, Err>;
}

export type QueryActionHookParams<Action extends QueryAction> = readonly [
  (QueryActionParams<Action> | QueryActionEmitterHookOptions)?,
  QueryActionSubscriberHookOptions?,
];

export interface QueryAction {
  (...params: Array<any>): Promise<any>;
}

export type QueryActionParams<
  Action extends QueryAction,
  Params extends Parameters<Action> = Parameters<Action>,
> = Params extends never[]
  ? []
  : { [K in keyof Params]: Params[K] | undefined };

export interface QueryActionSubscriberHookPerformer {
  (): void;
}

export type QueryActionEmitterHookPerformer<Action extends QueryAction> =
  Parameters<Action> extends void[] & never[]
    ? (...args: void[] & never[]) => void
    : (...args: Parameters<Action>) => void;

export interface QueryActionSubscriberHookOptions<Err = Error> {
  /**
   * If `true` – once fetched `data` never becomes undefined.
   *
   * If `false` – `data` becomes undefined after component unmounting
   *
   * @default undefined
   */
  keepData?: boolean;

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
   * `pending` will be set to `true` only if data is staled
   *
   * @default false
   */
  pendingOnlyStale?: boolean;

  /**
   * Callback will be called when error occurs
   */
  onError?(error: Err): void;

  /**
   * If `true` – action will never be fetched, only subscription will work
   *
   * @default false
   */
  subscribeOnly?: boolean;
}

export interface QueryActionEmitterHookOptions<Err = Error> {
  /**
   * Callback will be called when error occurs
   */
  onError?(error: Err): void;
}

export type QueryActionHookResult<
  Action extends QueryAction,
  Err = Error,
> = QueryActionSubscriberHookResult<Action, Err> &
  QueryActionEmitterHookResult<Action, Err>;

export interface QueryActionSubscriberHookResult<
  Action extends QueryAction,
  Err = Error,
> {
  data: Awaited<ReturnType<Action>> | undefined;
  perform: QueryActionSubscriberHookPerformer;
  isLoading: boolean;
  isSuccess: boolean;
  error: Err | null;
}

export interface QueryActionEmitterHookResult<
  Action extends QueryAction,
  Err = Error,
> {
  data: Awaited<ReturnType<Action>> | null;
  perform: QueryActionEmitterHookPerformer<Action>;
  isLoading: boolean;
  isSuccess: boolean;
  error: Err | null;
}
