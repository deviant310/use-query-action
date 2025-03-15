import { useCallback } from "react";

import { useQueryAction } from "../src";

export const App = () => {
  const { data, isLoading } = useQueryAction(action, [], {
    placeholderData: { greeting: "initial data" },
    refetchOnMount: ({ options }) => !options.initialData,
    select: ({ greeting }) => greeting,
  });

  const { setData } = useQueryAction(action);

  const onClick = useCallback(() => {
    setData(data => ({ greeting: data.greeting + " new data" }));
    //perform()
  }, [setData]);

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
  console.log("request initiated!");

  return new Promise<{ greeting: string }>(resolve =>
    setTimeout(() => {
      resolve({ greeting: "fetched data" });
    }, 1000),
  );
};
