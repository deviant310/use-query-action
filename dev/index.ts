import { createElement } from "react";
import { createRoot } from "react-dom/client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { App } from "./app";

const queryClient = new QueryClient();
const root = document.getElementById("root") as HTMLElement;

createRoot(root).render(
  createElement(
    QueryClientProvider,
    { client: queryClient },
    createElement(ReactQueryDevtools),
    createElement(App),
  ),
);
