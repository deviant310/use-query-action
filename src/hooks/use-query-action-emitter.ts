import { useCallback, useMemo } from "react";

import {
  MutationState,
  useMutation,
  UseMutationOptions,
  useMutationState,
  useQueryClient,
} from "@tanstack/react-query";

import { getQueryActionKey, QueryAction } from "../helpers";

export const useQueryActionEmitter: QueryActionEmitterHook = (
  action,
  options = {},
) => {
  type Action = typeof action;
  type Params = Parameters<Action>;
  type Data = Awaited<ReturnType<Action>>;

  const { onPerform, ...restOptions } = options;

  const queryClient = useQueryClient();
  const queryKey = useMemo(() => [getQueryActionKey(action)], [action]);

  const { mutate } = useMutation({
    mutationKey: queryKey,
    mutationFn: (args: Params) => action(...args),
    onMutate: onPerform,
    ...restOptions,
  });

  const mutations = useMutationState({
    filters: { mutationKey: queryKey },
    select: mutation => mutation.state as MutationState<Data>,
  });

  const perform = useCallback(
    (...args: Params) => mutate(args),
    [mutate],
  ) as QueryActionEmitterHookPerformer<Action>;

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
  ) as QueryActionEmitterHookInvalidator<Action>;

  const setData = useCallback<QueryActionEmitterHookDataSetter<Action>>(
    (updater, ...args) => {
      queryClient.setQueryData(queryKey.concat(args), updater);
    },
    [queryClient, queryKey],
  );

  return {
    data,
    isSuccess,
    isLoading,
    error,
    perform,
    invalidate,
    setData,
  };
};

export interface QueryActionEmitterHook {
  <
    Action extends QueryAction,
    Data = Awaited<ReturnType<Action>>,
    Context = unknown,
  >(
    action: Action,
    options?: QueryActionEmitterHookOptions<Action, Context>,
  ): QueryActionEmitterHookResult<Action, Data | undefined>;
}

export interface QueryActionEmitterHookOptions<
  Action extends QueryAction,
  Context = unknown,
> extends Omit<
    UseMutationOptions<
      Awaited<ReturnType<Action>>,
      Error,
      Parameters<Action>,
      Context
    >,
    "mutationKey" | "mutationFn" | "onMutate"
  > {
  onPerform?(args: Parameters<Action>): Context;
}

export type QueryActionGuardedParameters<Action extends QueryAction> =
  Parameters<Action> extends void[] & never[]
    ? void[] & never[]
    : Parameters<Action>;

export type QueryActionEmitterHookPerformer<Action extends QueryAction> = (
  ...args: QueryActionGuardedParameters<Action>
) => void;

export type QueryActionEmitterHookInvalidator<Action extends QueryAction> = (
  ...args: QueryActionGuardedParameters<Action>
) => void;

export type QueryActionEmitterHookDataSetter<
  Action extends QueryAction,
  Data = Awaited<ReturnType<Action>>,
> = (updater: (data: Data) => Data, ...args: Parameters<Action>) => void;

export interface QueryActionEmitterHookResult<
  Action extends QueryAction,
  Data = Awaited<ReturnType<Action>>,
> {
  data: Data;
  isLoading: boolean;
  isSuccess: boolean;
  error: unknown;
  perform: QueryActionEmitterHookPerformer<Action>;
  invalidate: QueryActionEmitterHookInvalidator<Action>;
  setData: QueryActionEmitterHookDataSetter<Action>;
}
