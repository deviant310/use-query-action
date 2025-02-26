import { useCallback, useMemo } from "react";

import {
  MutationState,
  useMutation,
  useMutationState,
  useQueryClient,
} from "@tanstack/react-query";

import { getQueryActionKey, QueryAction } from "../helpers";

export const useQueryActionEmitter: QueryActionEmitterHook = (
  action,
  options,
) => {
  type Action = typeof action;
  type Params = Parameters<Action>;
  type Data = Awaited<ReturnType<Action>>;

  const { onSuccess, onError } = options ?? {};

  const queryClient = useQueryClient();
  const queryKey = useMemo(() => [getQueryActionKey(action)], [action]);

  const { mutate } = useMutation({
    mutationKey: queryKey,
    mutationFn: (args: Params) => action(...args),
    onSuccess,
    onError,
  });

  const mutations = useMutationState({
    filters: { mutationKey: queryKey },
    select: mutation => mutation.state as MutationState<Data>,
  });

  const perform = useCallback(
    (...args: Params) => mutate(args),
    [mutate],
  ) as QueryActionEmitterHookInvoker<Action>;

  const { data, status, error } = mutations[mutations.length - 1] ?? {};

  const isLoading = status === "pending";
  const isSuccess = status === "success";

  const invalidate = useCallback(
    (...args: Params) => {
      queryClient.invalidateQueries({
        queryKey: queryKey.concat(args),
      });
    },
    [queryClient, queryKey],
  ) as QueryActionEmitterHookInvoker<Action>;

  return {
    data,
    isSuccess,
    isLoading,
    error,
    perform,
    invalidate,
  };
};

export interface QueryActionEmitterHook {
  <Action extends QueryAction, Data = Awaited<ReturnType<Action>>>(
    action: Action,
    options?: QueryActionEmitterHookOptions<Action>,
  ): QueryActionEmitterHookResult<Action, Data | undefined>;
}

export interface QueryActionEmitterHookOptions<Action extends QueryAction> {
  /**
   * Callback will be called when action successfully fetched
   */
  onSuccess?: (data: Awaited<ReturnType<Action>>) => void;

  /**
   * Callback will be called when error occurs
   */
  onError?: (error: unknown) => void;
}

export type QueryActionEmitterHookInvoker<Action extends QueryAction> =
  Parameters<Action> extends void[] & never[]
    ? (...args: void[] & never[]) => void
    : (...args: Parameters<Action>) => void;

export interface QueryActionEmitterHookResult<
  Action extends QueryAction,
  Data = Awaited<ReturnType<Action>>,
> {
  data: Data;
  isLoading: boolean;
  isSuccess: boolean;
  error: unknown;
  perform: QueryActionEmitterHookInvoker<Action>;
  invalidate: QueryActionEmitterHookInvoker<Action>;
}
