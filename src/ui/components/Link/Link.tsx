import { Route, createPath } from "@/ui/router/Router";
import { FC, ReactNode } from "react";
import { NavLink } from "react-router-dom";

import classes from "./Link.module.css";

interface Props {
  route: Route;
  children: ReactNode;
  highlightWhenActive?: boolean;
}

export const Link: FC<Props> = ({
  route,
  children,
  highlightWhenActive = false,
}) => {
  const to = createPath(route);

  return (
    <NavLink
      to={to}
      className={({ isActive }) => {
        return highlightWhenActive && isActive ? classes.isActive : "";
      }}
    >
      {children}
    </NavLink>
  );
};
