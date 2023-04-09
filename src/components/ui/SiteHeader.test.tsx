import { expect, test, describe } from "vitest";
import { render, screen } from "@testing-library/react";

import SiteHeader from "./SiteHeader";

describe("SiteHeader", () => {
  test("should render the SiteHeader component correctly", () => {
    render(<SiteHeader />);

    const logo = screen.queryByTestId("static-site-logo-line");
    expect(logo).toBeDefined();

    const link = screen.getByRole("link");
    expect(link.getAttribute("href")).toBe("https://inndex.omg.lol/");
    expect(link.getAttribute("title")).toBe(
      "The Wandering Inndex - A fan-made index for The Wandering Inn, a universe by pirateaba."
    );
  });
});
