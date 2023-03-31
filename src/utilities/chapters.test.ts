import { expect, test, describe } from "vitest";

import type { Chapter, CalendarYearData } from "~/types";

import {
  shouldIncludeChapter,
  convertChaptersToMapping,
  convertChaptersToCalendarYearData,
  type ConvertChaptersToMapOutput,
  type ConvertChaptersToCalendarYearDataOutput,
} from "./chapters";

const TEST_CHAPTERS: Chapter[] = [
  {
    id: "ch-001",
    meta: { show: true },
    partOf: {
      webNovel: {
        ref: 1,
        published: "2022-01-01T00:00:00+00:00",
        totalWords: 1000,
      },
    },
  },
  {
    id: "ch-002",
    meta: { show: true },
    partOf: {
      webNovel: {
        ref: 2,
        published: "2022-01-02T00:00:00+00:00",
        totalWords: 2000,
      },
    },
  },
  {
    id: "ch-003-hidden",
    meta: { show: false },
    partOf: {
      webNovel: {
        ref: 3,
        published: "2022-01-03T00:00:00+00:00",
        totalWords: 3000,
      },
    },
  },
  {
    id: "ch-004",
    meta: { show: true },
    partOf: {
      webNovel: {
        ref: 4,
        published: "2022-01-04T00:00:00+00:00",
        totalWords: 4000,
      },
    },
  },
  {
    id: "ch-005-invalid-ref",
    meta: { show: true },
    partOf: {
      webNovel: {
        ref: -1,
        published: "2022-01-05T00:00:00+00:00",
        totalWords: 5000,
      },
    },
  },
  {
    id: "ch-006-empty-published",
    meta: { show: true },
    partOf: {
      webNovel: {
        ref: -1,
        published: "",
        totalWords: 6000,
      },
    },
  },
  {
    id: "ch-007-null-webNovel",
    meta: { show: true },
    partOf: {
      webNovel: undefined,
    },
  },
  {
    id: "ch-008-no-webNovel",
    meta: { show: true },
    partOf: {},
  },
  {
    id: "ch-009-null-published",
    meta: { show: true },
    partOf: {
      webNovel: {
        ref: 9,
        published: null,
        totalWords: 9000,
      },
    },
  },
  {
    id: "ch-010-null-totalWords",
    meta: { show: true },
    partOf: {
      webNovel: {
        ref: 10,
        published: "2022-01-10T00:00:00+00:00",
        totalWords: null,
      },
    },
  },
  {
    id: "ch-011-no-totalWords",
    meta: { show: true },
    partOf: {
      webNovel: {
        ref: 11,
        published: "2022-01-11T00:00:00+00:00",
        totalWords: null,
      },
    },
  },
  {
    id: "ch-012-invalid-published-date-format",
    meta: { show: true },
    partOf: {
      webNovel: {
        ref: 12,
        published: "2022-01-12-00:00:00+00:00",
        totalWords: 12000,
      },
    },
  },
  {
    id: "ch-013-empty-published-date",
    meta: { show: true },
    partOf: {
      webNovel: {
        ref: 13,
        published: "",
        totalWords: 13000,
      },
    },
  },
  {
    id: "ch-014-same-date-1",
    meta: { show: true },
    partOf: {
      webNovel: {
        ref: 14,
        published: "2022-01-14T00:00:00+00:00",
        totalWords: 14000,
      },
    },
  },
  {
    id: "ch-015-same-date-2",
    meta: { show: true },
    partOf: {
      webNovel: {
        ref: 15,
        published: "2022-01-14T00:00:00+00:00",
        totalWords: 15000,
      },
    },
  },
  {
    id: "ch-016-old-year",
    meta: { show: true },
    partOf: {
      webNovel: {
        ref: 15,
        published: "2021-12-10T00:00:00+00:00",
        totalWords: 3500,
      },
    },
  },
];

describe("(shouldIncludeChapter)", () => {
  test("should return true for regular chapters", () => {
    const chapter: Chapter = {
      id: "ch-001",
      meta: { show: true },
      partOf: {
        webNovel: {
          ref: 1,
          published: "2022-01-01T00:00:00+00:00",
          totalWords: 1000,
        },
      },
    };
    const got = shouldIncludeChapter(chapter);
    const want = true;
    expect(got).toBe(want);
  });

  test("should return false for invalid webNovel", () => {
    const chapter: Chapter = {
      id: "ch-007-null-webNovel",
      meta: { show: true },
      partOf: {
        webNovel: undefined,
      },
    };
    const got = shouldIncludeChapter(chapter);
    const want = false;
    expect(got).toBe(want);
  });

  test("should return false for invalid published date", () => {
    const chapter: Chapter = {
      id: "ch-009-null-published",
      meta: { show: true },
      partOf: {
        webNovel: {
          ref: 9,
          published: null,
          totalWords: 9000,
        },
      },
    };
    const got = shouldIncludeChapter(chapter);
    const want = false;
    expect(got).toBe(want);
  });

  test("should return false for invalid webNovel ref", () => {
    const chapter: Chapter = {
      id: "ch-020-null-ref",
      meta: { show: true },
      partOf: {
        webNovel: {
          ref: null,
          published: "2022-01-01T00:00:00+00:00",
          totalWords: 9000,
        },
      },
    };
    const got = shouldIncludeChapter(chapter);
    const want = false;
    expect(got).toBe(want);
  });
});

describe("(convertChaptersToMapping)", () => {
  test("should convert list to map", () => {
    const got = convertChaptersToMapping(TEST_CHAPTERS);
    const want: ConvertChaptersToMapOutput = {
      mapping: new Map([
        ["2021-12-10", 3500],
        ["2022-01-01", 1000],
        ["2022-01-02", 2000],
        ["2022-01-04", 4000],
        ["2022-01-10", 0],
        ["2022-01-11", 0],
        ["2022-01-14", 29000],
      ]),
      minYear: 2021,
      maxYear: 2022,
      minValue: 0,
      maxValue: 29000,
    };

    expect(got).toStrictEqual(want);
  });
});

describe("(convertChaptersToCalendarYearData)", () => {
  test("should convert list to map", () => {
    const got = convertChaptersToCalendarYearData(TEST_CHAPTERS);
    const want: ConvertChaptersToCalendarYearDataOutput = {
      data: [
        [
          [-1, -1, -1, -1, 0, 0, 0],
          ...(Array.from({ length: 48 }, () =>
            Array<number>(7).fill(0)
          ) as CalendarYearData),
          [0, 0, 0, 0, 3500, 0, 0], // Week 49
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, -1, -1],
          [-1, -1, -1, -1, -1, -1, -1],
        ],
        [
          [-1, -1, -1, -1, -1, 1000, 2000],
          [0, 4000, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 29000, 0, 0],
          ...(Array.from({ length: 49 }, () =>
            Array<number>(7).fill(0)
          ) as CalendarYearData),
          [0, 0, 0, 0, 0, 0, -1],
          [-1, -1, -1, -1, -1, -1, -1],
        ],
      ],
      minYear: 2021,
      maxYear: 2022,
      minValue: 0,
      maxValue: 29000,
    };

    expect(got).toStrictEqual(want);
  });
});
