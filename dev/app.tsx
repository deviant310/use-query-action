import { useCallback } from "react";

import { useQueryAction } from "../src";

export const App = () => {
  const { data, isLoading, perform } = useQueryAction(action);

  const onClick = useCallback(() => perform(), [perform]);

  return (
    <>
      <button onClick={onClick} disabled={isLoading}>
        Reload data
      </button>

      {!data && isLoading && <div>loading...</div>}

      {data && <div style={{ opacity: isLoading ? 0.5 : 1 }}>{data}</div>}
    </>
  );
};

const action = async () => {
  return new Promise<string>(resolve =>
    setTimeout(() => {
      resolve("data");
    }, 1000),
  );
};
