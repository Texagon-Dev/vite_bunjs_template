import { createFileRoute } from "@tanstack/react-router";

import { env } from "@/services";

export const Route = createFileRoute("/env/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <h1>Env</h1>
      <pre>{JSON.stringify(env().all(), null, 2)}</pre>
    </div>
  );
}
