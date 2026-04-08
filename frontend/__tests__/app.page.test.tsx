import React from "react";
import { render, screen } from "@testing-library/react";
import Home from "../app/page";

vi.mock("next/link", () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("Home page", () => {
  test("renders title and buttons", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", { name: /Dziennik Szkolny/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Zaloguj/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Złóż wniosek/i }),
    ).toBeInTheDocument();
  });
});
