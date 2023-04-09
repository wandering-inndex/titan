import { test, describe, expect } from "vitest";
import {
  DEFAULT_SITE_NAME,
  DEFAULT_PAGE_TITLE,
  DEFAULT_SITE_DESCRIPTION,
  DEFAULT_CHAPTER_DATA_YAML_URL,
} from "./constants";

describe("constants", () => {
  test("should be the same", () => {
    expect(DEFAULT_SITE_NAME).toBe("The Wandering Inndex");
    expect(DEFAULT_PAGE_TITLE).toBe("3D Word Count Visualizer");
    expect(DEFAULT_SITE_DESCRIPTION).toBe(
      "Visualizing the Word Count of The Wandering Inn, a short story by pirateaba."
    );
    expect(DEFAULT_CHAPTER_DATA_YAML_URL).toBe(
      "https://raw.githubusercontent.com/wandering-inndex/seed-data/main/data/media/twi-webnovel-chapters.yaml"
    );
  });
});
