import { useCallback } from "react";

import { useQueryAction } from "../src";

export const App = () => {
  const { data: greeting, isLoading } = useQueryAction(action, [5], {
    placeholderData: { greeting: "initial data" },
    refetchOnMount: ({ options }) => !options.initialData,
    select: ({ greeting }) => greeting,
  });

  const { perform } = useQueryAction(action, {
    onPerform() {
      return Date.now();
    },
    onSuccess(data, args, ctx) {
      console.log(data, args, ctx);
    },
  });

  const { setData } = useQueryAction(action);

  const injectData = useCallback(() => {
    setData(data => ({ greeting: data.greeting + " new data" }), 5);
  }, [setData]);

  const patchData = useCallback(() => {
    perform(3);
  }, [perform]);

  return (
    <>
      <button onClick={injectData} disabled={isLoading}>
        Inject data
      </button>

      <button onClick={patchData} disabled={isLoading}>
        Patch data
      </button>

      {!greeting && isLoading && <div>loading...</div>}

      {greeting && (
        <div style={{ opacity: isLoading ? 0.5 : 1 }}>{greeting}</div>
      )}
    </>
  );
};

const action = async (id: number) => {
  return new Promise<{ greeting: string }>(resolve =>
    setTimeout(() => {
      resolve({ greeting: `fetched ${id} data` });
    }, 1000),
  );
};
