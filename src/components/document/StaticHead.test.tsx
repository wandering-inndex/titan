import React, { type FC } from "react";
import ReactDOM from "react-dom";
import { expect, test, describe, vi } from "vitest";
import { render } from "@testing-library/react";

import StaticHead from "./StaticHead";

interface HeadMockProps {
  children: React.ReactNode;
}

const HeadMock: FC<HeadMockProps> = ({ children }) => {
  return (
    // eslint-disable-next-line @next/next/no-head-element
    <head data-testid="mock-head">
      {ReactDOM.createPortal(children, document.head)}
    </head>
  );
};

/**
 * Mock the next/head component.
 *
 * @see {@link https://github.com/vercel/next.js/discussions/11060}
 */
vi.mock("next/head", () => {
  const head = ({ children }: HeadMockProps) => <HeadMock>{children}</HeadMock>;
  return { Head: head, default: head };
});

describe("StaticHead", () => {
  test("should render a subset of the correct meta tags and links", () => {
    render(<StaticHead />);

    const metaKeywords =
      document
        .querySelector("meta[property='keywords']")
        ?.getAttribute("content") ?? "";
    expect(metaKeywords).toBe("the wandering inn, 3d, data visualization");

    const metaAuthor =
      document
        .querySelector("meta[property='author']")
        ?.getAttribute("content") ?? "";
    expect(metaAuthor).toBe("The Wandering Inndex contributors");

    const ogSiteName =
      document
        .querySelector("meta[property='og:site_name']")
        ?.getAttribute("content") ?? "";
    expect(ogSiteName).toBe("The Wandering Inndex");

    const ogUrl =
      document
        .querySelector("meta[property='og:url']")
        ?.getAttribute("content") ?? "";
    expect(ogUrl).toBe("https://titan.inndex.omg.lol/");

    const ogType =
      document
        .querySelector("meta[property='og:type']")
        ?.getAttribute("content") ?? "";
    expect(ogType).toBe("website");
  });
});
