/** Minimal interface for the individual Chapter data. */
export interface Chapter {
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
      published: string;
      /**
       * Total words based on https://wordcounter.net/. Without the title,
       * author's notes, artworks, etc.
       */
      totalWords: number | null;
    };
  };
}
