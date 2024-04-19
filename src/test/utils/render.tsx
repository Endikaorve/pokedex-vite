import { render as tlrRender } from "@testing-library/react";
import { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";

export const render = (component: ReactNode) => {
  tlrRender(<MemoryRouter>{component}</MemoryRouter>);
};
