import { parseQueryActionHookArgs } from "./helpers";
import { useQueryActionSubscriber, useQueryActionEmitter } from "./hooks";
import {
  QueryActionHook,
  QueryActionHookParams,
  QueryActionHookResult,
  QueryActionSubscriberHookOptions,
} from "./types";
// TODO вынести в отдельный пакет, здесь обернуть в useRequestAction
export const useQueryAction: QueryActionHook = (action, ...hookArgs) => {
  const [args, options] = parseQueryActionHookArgs(
    hookArgs as QueryActionHookParams<typeof action>,
  );

  return <QueryActionHookResult<typeof action, never>>(
    (args
      ? useQueryActionSubscriber.call(
          null,
          action,
          args,
          options as QueryActionSubscriberHookOptions,
        )
      : useQueryActionEmitter.call(null, action))
  );
};
