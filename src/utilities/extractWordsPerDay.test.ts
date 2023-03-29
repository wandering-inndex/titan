import { expect, test, describe } from "vitest";

import { extractWordsPerDay } from "./extractWordsPerDay";
import type { Chapter } from "~/types";

describe("extractWordsPerDay", () => {
  test("correctly extracts data from chapters", () => {
    const chapters: Chapter[] = [
      {
        id: "ch-001",
        meta: { show: true },
        partOf: {
          webNovel: {
            ref: 1,
            published: "2022-01-01T00:00:00+00:00Z",
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
            published: "2022-01-02T00:00:00+00:00Z",
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
            published: "2022-01-03T00:00:00+00:00Z",
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
            published: "2022-01-04T00:00:00+00:00Z",
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
            published: "2022-01-05T00:00:00+00:00Z",
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
            published: "2022-01-10T00:00:00+00:00Z",
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
            published: "2022-01-11T00:00:00+00:00Z",
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
            published: "2022-01-12-00:00:00+00:00Z",
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
            published: "2022-01-14T00:00:00+00:00Z",
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
            published: "2022-01-14T00:00:00+00:00Z",
            totalWords: 15000,
          },
        },
      },
    ];

    const expectedResult = {
      data: [
        [
          [0, 0, 0, 0, 0, 0, 1000], // First week of 2022
          [2000, 0, 4000, 0, 0, 0, 0], // Second week of 2022
          [0, 0, 0, 0, 0, 29000, 0], // Third week of 2022
          // Fill the rest of the weeks with 0s.
          ...Array.from({ length: 50 }, () => Array<number>(7).fill(0)),
        ],
      ],
      minYear: 2022,
      maxYear: 2022,
      minValue: 1000,
      maxValue: 29000,
    };

    const result = extractWordsPerDay(chapters);
    expect(result).toEqual(expectedResult);
  });
});
