import { useQueryActionSubscriber, useQueryActionEmitter } from "./hooks";
import {
  QueryActionHook,
  QueryActionHookResult,
  QueryActionParams,
  QueryActionSubscriberHookOptions,
} from "./types";

export const useQueryAction: QueryActionHook = (action, ...hookArgs) => {
  const [args, options] = Array.isArray(hookArgs[0])
    ? <const>[
        hookArgs[0] as QueryActionParams<typeof action>,
        hookArgs[1] as QueryActionSubscriberHookOptions,
      ]
    : <const>[null, hookArgs[0]];

  return <QueryActionHookResult<typeof action>>(
    (args
      ? useQueryActionSubscriber.call(null, action, args, options)
      : useQueryActionEmitter.call(null, action, options))
  );
};
