import { useCallback, useState } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { getQueryActionKey } from "../helpers";
import {
  QueryActionEmitterHook,
  QueryActionEmitterHookPerformer,
} from "../types";

export const useQueryActionEmitter: QueryActionEmitterHook = (
  action,
  options,
) => {
  type Action = typeof action;
  type Params = Parameters<Action>;
  type Data = Awaited<ReturnType<Action>>;

  const { onError }: typeof options = { ...options };

  const queryClient = useQueryClient();
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [isSuccess, setSuccess] = useState(false);

  const perform = useCallback(
    (...args: Params) => {
      setData(null);
      setError(null);
      setSuccess(false);
      setLoading(true);

      queryClient
        .fetchQuery({
          queryFn: () => action(...args),
          queryKey: [getQueryActionKey(action), ...args],
          gcTime: 0,
        })
        .then(data => {
          setData(data);
          setSuccess(true);
        })
        .catch(err => {
          setError(err);
          onError?.(err);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [action, onError, queryClient],
  ) as QueryActionEmitterHookPerformer<Action>;

  return {
    data,
    perform,
    isSuccess,
    isLoading,
    error: error as never,
  };
};
