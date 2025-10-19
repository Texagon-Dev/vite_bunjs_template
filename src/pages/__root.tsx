import { env } from "@services";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

import { Layout } from "../components/layout";

const queryClient = new QueryClient();

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout />
      {env().get("APP_ENV") === "development" && <TanStackRouterDevtools />}
    </QueryClientProvider>
  );
}
