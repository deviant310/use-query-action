import { useCallback, useMemo } from "react";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { getQueryActionKey, QueryAction, QueryActionParams } from "../helpers";

export const useQueryActionSubscriber: QueryActionSubscriberHook = (
  action,
  args,
  options,
) => {
  type Action = typeof action;
  type Data = Awaited<ReturnType<Action>>;

  const { keepFresh, onError, subscribeOnly, ...restOptions } = options ?? {};

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

  const throwOnError = useCallback(
    (error: Error) => {
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
    gcTime,
    staleTime,
    throwOnError,
    ...restOptions,
  });

  return { data, isLoading, isSuccess, error };
};

export interface QueryActionSubscriberHook {
  <Action extends QueryAction, Data = Awaited<ReturnType<Action>>>(
    action: Action,
    params: QueryActionParams<Action>,
    options?: QueryActionSubscriberHookOptions<Action, Data>,
  ): QueryActionSubscriberHookResult<Action, Data | undefined>;
}

export interface QueryActionSubscriberHook {
  <Action extends QueryAction, Data = Awaited<ReturnType<Action>>>(
    action: Action,
    params: QueryActionParams<Action>,
    options?: QueryActionSubscriberHookOptions<Action, Data> & {
      initialData: Awaited<ReturnType<Action>>;
    },
  ): QueryActionSubscriberHookResult<Action, Data>;
}

export interface QueryActionSubscriberHook {
  <Action extends QueryAction, Data = Awaited<ReturnType<Action>>>(
    action: Action,
    params: QueryActionParams<Action>,
    options?: QueryActionSubscriberHookOptions<Action, Data> & {
      placeholderData: Awaited<ReturnType<Action>>;
    },
  ): QueryActionSubscriberHookResult<Action, Data>;
}

export interface QueryActionSubscriberHookOptions<
  Action extends QueryAction,
  Data = Awaited<ReturnType<Action>>,
> extends Omit<
    UseQueryOptions<Awaited<ReturnType<Action>>, Error, Data>,
    "queryKey" | "queryFn" | "staleTime" | "gcTime" | "throwOnError" | "enabled"
  > {
  /**
   * If `true` – once fetched `data` will never becomes staled.
   */
  keepFresh?: boolean;

  /**
   * Callback will be called when error occurs
   */
  onError?: (error: unknown) => void;

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
