/**
 * Minimal interface that represents the individual Chapter data.
 * Check out {@link https://github.com/wandering-inndex/seed-data/blob/main/types/media.ts}
 * for the full interface.
 */
export interface Chapter {
  /** Unique ID for the chapter. */
  id: string;
  /** Flags for the chapter. */
  meta: {
    /** If true, then it will be shown in the table of contents. */
    show: boolean;
  };
  /** Specifies that a chapter is part of a bigger collection. */
  partOf: {
    /** Part of a Web Novel Volume. */
    webNovel?: {
      /** The volume this is collected under. */
      ref: number | null;
      /**
       * The timestamp when this chapter is originally published. This can be
       * found via the `meta[property='article:published_time']` selector.
       */
      published: string | null;
      /**
       * Total words based on https://wordcounter.net/. Without the title,
       * author's notes, artworks, etc.
       */
      totalWords: number | null;
    };
  };
}
