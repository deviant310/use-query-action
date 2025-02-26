import { QueryAction } from "./helpers";
import {
  useQueryActionSubscriber,
  QueryActionSubscriberHookOptions,
  QueryActionSubscriberHook,
  QueryActionSubscriberHookResult,
  useQueryActionEmitter,
  QueryActionEmitterHook,
  QueryActionEmitterHookResult,
} from "./hooks";

export const useQueryAction: QueryActionHook = (action, ...hookArgs) => {
  if (Array.isArray(hookArgs[0])) {
    const [args, options] = <const>[
      hookArgs[0],
      hookArgs[1] as QueryActionSubscriberHookOptions<typeof action> & {
        initialData: unknown;
      },
    ];

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
