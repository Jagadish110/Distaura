import {
  createRootRoute,
  Outlet,
} from "@tanstack/react-router";
import { site } from "@/lib/site";

export const Route = createRootRoute({
  component: RootDocument,
});

function RootDocument() {
  return <Outlet />;
}
