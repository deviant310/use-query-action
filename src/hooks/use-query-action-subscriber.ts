import { useCallback, useMemo } from "react";

import { useQuery } from "@tanstack/react-query";

import { getQueryActionKey } from "../helpers";
import { QueryActionSubscriberHook } from "../types";

export const useQueryActionSubscriber: QueryActionSubscriberHook = (
  action,
  args,
  options,
) => {
  type Action = typeof action;
  type Data = Awaited<ReturnType<Action>>;

  const {
    keepData = "auto",
    refetchOnMount = true,
    onError,
    subscribeOnly = false,
  } = options ?? {};

  const queryKey = useMemo(
    () => [getQueryActionKey(action), ...args],
    [action, args],
  );

  const queryFn = useCallback(
    (): Promise<Data> => action(...args),
    [action, args],
  );

  const enabled = useMemo(() => {
    if (subscribeOnly) return false;

    return [...Array(action.length).keys()].every(key => args[key]);
  }, [action.length, args, subscribeOnly]);

  const gcTime = useMemo(() => {
    if (!enabled) return 0;
    if (keepData === "always") return Infinity;
    if (keepData === "never") return 0;
  }, [enabled, keepData]);

  const throwOnError = useCallback(
    (error: never) => {
      onError?.(error);

      return false;
    },
    [onError],
  );

  const {
    data,
    isFetching: isLoading,
    isSuccess,
    error,
  } = useQuery({
    queryKey,
    queryFn,
    enabled,
    refetchOnMount,
    gcTime,
    throwOnError,
  });

  return { data, isLoading, isSuccess, error };
};
