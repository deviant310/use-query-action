import { QueryAction } from "./query-action";

const actionsKeysMap = new WeakMap<QueryAction, string>();

export const getQueryActionKey = (action: QueryAction) => {
  if (actionsKeysMap.has(action)) return <string>actionsKeysMap.get(action);

  const uniqueKeyPart = Math.random().toFixed(20).split(".")[1];
  const key = `${uniqueKeyPart}_${action.name}`;

  actionsKeysMap.set(action, key);

  return key;
};
