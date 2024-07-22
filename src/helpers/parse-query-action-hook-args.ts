import { QueryAction, QueryActionHookParams } from "../types";

export const parseQueryActionHookArgs = <Action extends QueryAction>(
  hookArgs: QueryActionHookParams<Action>,
) => {
  const [arg1, arg2] = hookArgs;

  return Array.isArray(arg1) ? <const>[arg1, arg2] : <const>[null, arg1];
};
