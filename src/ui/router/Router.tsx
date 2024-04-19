import { FC, ReactNode } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from "../views/Home";
import { Details } from "../views/Details";
import { Favorites } from "../views/Favorites";
import { Layout } from "../layout";

export interface RouteObject {
  path: string;
  element: ReactNode;
}

const routes = {
  home: {
    path: "/",
    element: <Home />,
  },
  details: {
    path: "/:id",
    element: <Details />,
  },
  favorites: {
    path: "/favorites",
    element: <Favorites />,
  },
};

type Path = keyof typeof routes;
type Params = Record<string, string>;
export interface Route {
  path: Path;
  params?: Params;
}

export const createPath = ({ path, params }: Route): string => {
  let realPath = routes[path].path;

  for (const key in params) {
    realPath = realPath.replace(`:${key}`, params[key]);
  }

  return realPath;
};

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: Object.values(routes).map((route) => route),
  },
]);

export const Router: FC = () => {
  return <RouterProvider router={router} />;
};
