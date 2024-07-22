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
    keepData,
    pendingOnlyStale,
    refetchOnMount,
    onError,
    subscribeOnly,
  }: typeof options = {
    pendingOnlyStale: false,
    refetchOnMount: true,
    subscribeOnly: false,
    ...options,
  };

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
    if (keepData === true) return Infinity;
    if (keepData === false) return 0;
  }, [enabled, keepData]);

  const throwOnError = useCallback(
    (error: never) => {
      onError?.(error);

      return false;
    },
    [onError],
  );

  const { data, isFetching, isSuccess, isStale, refetch, error } = useQuery({
    queryKey,
    queryFn,
    enabled,
    refetchOnMount,
    gcTime,
    throwOnError,
  });

  const perform = useCallback(() => {
    refetch();
  }, [refetch]);

  const isLoading = useMemo(() => {
    if (pendingOnlyStale) return isFetching && isStale;

    return isFetching;
  }, [isFetching, isStale, pendingOnlyStale]);

  return { data, perform, isLoading, isSuccess, error };
};
