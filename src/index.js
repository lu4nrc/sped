import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/root";
import { TooltipProvider } from "./components/ui/tooltip";
import SpedPage from "./pages/SpedPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <TooltipProvider>
        <Root />
      </TooltipProvider>
    ),
    children: [
      {
        path: "/sped",
        element: <SpedPage />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
