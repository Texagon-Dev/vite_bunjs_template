import { Outlet } from "@tanstack/react-router";

import { Header } from "./header";

export const Layout = () => (
  <div className="h-screen w-screen flex flex-col bg-white">
    {/* Header takes fixed height */}
    <div className="h-16 bg-green-300">
      <Header />
    </div>

    {/* Body takes remaining height with Scrolling */}
    <div className="flex-1  overflow-auto">
      <Outlet />
    </div>
  </div>
);

/*
    {
        Head [Takes Space from height] h-16
        Body [Takes Space from height] h-[remaining will be here]
    }
*/
