import { QueryAction, QueryActionParams } from "./helpers";
import {
  useQueryActionSubscriber,
  QueryActionSubscriberHookOptions,
  QueryActionSubscriberHook,
  QueryActionSubscriberHookResult,
  useQueryActionEmitter,
  QueryActionEmitterHook,
  QueryActionEmitterHookResult,
  QueryActionEmitterHookOptions,
} from "./hooks";

export type {
  QueryActionEmitterHookPerformer,
  QueryActionGuardedParameters,
} from "./hooks";

export const useQueryAction: QueryActionHook = (action, ...rest) => {
  const hookArgs = rest as [
    (
      | QueryActionParams<typeof action>
      | QueryActionEmitterHookOptions<typeof action>
    )?,
    (QueryActionSubscriberHookOptions<typeof action> & {
      initialData: unknown;
    })?,
  ];

  if (Array.isArray(hookArgs[0])) {
    const [args, options] = hookArgs;

    return <QueryActionHookResult<typeof action>>(
      useQueryActionSubscriber.call(null, action, args, options)
    );
  } else {
    const [options] = hookArgs;

    return <QueryActionHookResult<typeof action>>(
      useQueryActionEmitter.call(null, action, options)
    );
  }
};

export type QueryActionHook = QueryActionSubscriberHook &
  QueryActionEmitterHook;

export type QueryActionHookResult<Action extends QueryAction> =
  QueryActionSubscriberHookResult<Action> &
    QueryActionEmitterHookResult<Action>;

// New test file creation is not applicable to this file.
