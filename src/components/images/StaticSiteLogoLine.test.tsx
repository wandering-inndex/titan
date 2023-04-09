import { expect, test, describe } from "vitest";
import { render, screen } from "@testing-library/react";

import StaticSiteLogoLine from "./StaticSiteLogoLine";

describe("StaticSiteLogoLine", () => {
  test("should render the StaticSiteLogoLine component correctly", async () => {
    render(<StaticSiteLogoLine />);

    const svgElement = await screen.findByRole("img", {}, { timeout: 1000 });

    expect(svgElement).toBeDefined();
    expect(svgElement.getAttribute("aria-label")).toBe(
      "The Wandering Inndex Logo"
    );
    expect(svgElement.getAttribute("fill")).toBe("none");
    expect(svgElement.getAttribute("xmlns")).toBe("http://www.w3.org/2000/svg");
  });
});
