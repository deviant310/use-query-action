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

  const {
    keepData = "auto",
    onError,
    subscribeOnly = false,
    ...restOptions
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
    throwOnError,
    ...restOptions,
  });

  return { data, isLoading, isSuccess, error };
};

export interface QueryActionSubscriberHook {
  <Action extends QueryAction, Data = Awaited<ReturnType<Action>>>(
    action: Action,
    params: QueryActionParams<Action>,
    options?: QueryActionSubscriberHookOptions<Action, Data> & {
      initialData?: Awaited<ReturnType<Action>>;
    },
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

export interface QueryActionSubscriberHookOptions<
  Action extends QueryAction,
  Data = Awaited<ReturnType<Action>>,
> extends Omit<
    UseQueryOptions<Awaited<ReturnType<Action>>, Error, Data>,
    "queryKey" | "queryFn" | "staleTime" | "gcTime" | "throwOnError" | "enabled"
  > {
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

export interface QueryActionSubscriberHookResult<
  Action extends QueryAction,
  Data = Awaited<ReturnType<Action>>,
> {
  data: Data;
  isLoading: boolean;
  isSuccess: boolean;
  error: unknown;
}
