import { useCallback, useMemo } from "react";

import {
  MutationState,
  useMutation,
  useMutationState,
  useQueryClient,
} from "@tanstack/react-query";

import { getQueryActionKey } from "../helpers";
import { QueryActionEmitterHook, QueryActionPerformer } from "../types";

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
  ) as QueryActionPerformer<Action>;

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
  ) as QueryActionPerformer<Action>;

  return {
    data,
    isSuccess,
    isLoading,
    error,
    perform,
    invalidate,
  };
};
