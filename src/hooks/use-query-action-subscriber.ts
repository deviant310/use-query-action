import { useCallback, useMemo } from "react";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { getQueryActionKey, QueryAction, QueryActionParams } from "../helpers";

export const useQueryActionSubscriber: QueryActionSubscriberHook = (
  action,
  args,
  options = {},
) => {
  type Action = typeof action;
  type Data = Awaited<ReturnType<Action>>;

  const { keepFresh, subscribeOnly, ...restOptions } = options;

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

    return Infinity;
  }, [enabled]);

  const staleTime = useMemo(() => {
    if (keepFresh) return Infinity;
  }, [keepFresh]);

  const {
    data,
    isFetching: isLoading,
    isSuccess,
    error,
  } = useQuery({
    queryKey,
    queryFn,
    enabled,
    gcTime,
    staleTime,
    ...restOptions,
  });

  return { data, isLoading, isSuccess, error };
};

export interface QueryActionSubscriberHook {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  <Action extends QueryAction, Data = Awaited<ReturnType<Action>>, _ = unknown>(
    action: Action,
    params: QueryActionParams<Action>,
    options?: QueryActionSubscriberHookOptions<Action, Data>,
  ): QueryActionSubscriberHookResult<Action, Data | undefined>;
}

export interface QueryActionSubscriberHook {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  <Action extends QueryAction, Data = Awaited<ReturnType<Action>>, _ = unknown>(
    action: Action,
    params: QueryActionParams<Action>,
    options?: QueryActionSubscriberHookOptions<Action, Data> & {
      initialData: Awaited<ReturnType<Action>>;
    },
  ): QueryActionSubscriberHookResult<Action, Data>;
}

export interface QueryActionSubscriberHookOptions<
  Action extends QueryAction,
  Data = Awaited<ReturnType<Action>>,
> extends Omit<
    UseQueryOptions<Awaited<ReturnType<Action>>, Error, Data>,
    "queryKey" | "queryFn" | "staleTime" | "gcTime" | "enabled"
  > {
  /**
   * If `true` – once fetched `data` will never becomes staled.
   */
  keepFresh?: boolean;

  /**
   * If `true` – action will never be fetched, only subscription will work
   */
  subscribeOnly?: boolean;
}

export interface QueryActionSubscriberHookResult<
  Action extends QueryAction,
  Data = Awaited<ReturnType<Action>>,
> {
  data: Data;
  isLoading: boolean;
  isSuccess: boolean;
  error: unknown;
}
