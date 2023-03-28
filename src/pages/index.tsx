import { type NextPage } from "next";
import Head from "next/head";
import { parse as parseYaml } from "yaml";
import { addDays, formatISO, getDay, getDaysInYear } from "date-fns";

import DailyContributionChart from "~/components/DailyContributionChart";

import type { CalendarYearData, Chapter, TotalWordsPerDay } from "~/types";

interface HomeProps {
  allYearData: Array<CalendarYearData>;
  minYear: number;
  maxYear: number;
  minValue: number;
  maxValue: number;
}

const Home: NextPage<HomeProps> = ({
  allYearData,
  minYear,
  maxYear,
  minValue,
  maxValue,
}) => {
  const data: Array<CalendarYearData> = allYearData ?? [];

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta
          property="keywords"
          content="the wandering inn, encyclopedia, timeline, graph"
        />
        <meta property="author" content="The Wandering Inndex contributors" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#ffffff" />

        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />

        <meta property="og:image" content="https://inndex.omg.lol/ogp.png" />
        <meta
          property="og:image:secure_url"
          content="https://inndex.omg.lol/ogp.png"
        />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1080" />
        <meta property="og:image:height" content="500" />
        <meta
          property="og:image:alt"
          content="The logo of The Wandering Inndex: a fan-made index for The Wandering Inn, a universe by pirateaba."
        />

        <title>High Passes | The Wandering Inndex</title>
        <meta
          name="description"
          content="A fan-made index for The Wandering Inn, a universe by pirateaba."
        />
      </Head>

      <div className="h-screen w-screen">
        <DailyContributionChart
          data={data}
          minYear={minYear}
          maxYear={maxYear}
          minValue={minValue}
          maxValue={maxValue}
        />
      </div>
    </>
  );
};

export async function getServerSideProps() {
  const res = await fetch(
    `https://raw.githubusercontent.com/wandering-inndex/seed-data/main/data/media/twi-webnovel-chapters.yaml`
  );
  const data = await res.text();
  const chapters: Chapter[] = parseYaml(data) as Chapter[];

  let minYear = Number.POSITIVE_INFINITY;
  let maxYear = Number.NEGATIVE_INFINITY;
  let minValue = Number.POSITIVE_INFINITY;
  let maxValue = Number.NEGATIVE_INFINITY;

  const mapTotalWords: TotalWordsPerDay = new Map<string, number>();
  chapters
    .filter((chapter) => chapter.meta.show === true)
    .filter((chapter) => (chapter.partOf.webNovel?.ref || 0) > 0)
    .forEach((chapter) => {
      const date =
        (chapter.partOf.webNovel?.published || "").split("T")[0] || "";
      const year = parseInt(date.split("-")[0] ?? "") ?? 0;
      const wordCount = chapter.partOf.webNovel?.totalWords || 0;

      minYear = Math.min(minYear, year);
      maxYear = Math.max(maxYear, year);
      minValue = Math.min(minValue, wordCount);
      maxValue = Math.max(maxValue, wordCount);

      const currentValue = mapTotalWords.has(date)
        ? mapTotalWords.get(date) ?? 0
        : 0;
      mapTotalWords.set(date, currentValue + wordCount);
    });

  const allYearData: Array<CalendarYearData> = [];
  for (let year = minYear; year <= maxYear; year++) {
    const startDay = new Date(Date.UTC(year, 0, 1, 0, 0, 0, 0));
    const endDay = new Date(Date.UTC(year, 11, 31, 0, 0, 0, 0));
    const totalDays = getDaysInYear(startDay);
    const firstWeekPadding = getDay(startDay);
    const lastWeekPadding = 7 - (getDay(endDay) + 1);
    const flatYearData: Array<number> = new Array<number>(
      firstWeekPadding + totalDays + lastWeekPadding
    ).fill(0);

    for (
      let index = firstWeekPadding, daysToAdd = 0;
      daysToAdd <= totalDays;
      index++, daysToAdd++
    ) {
      const date = formatISO(addDays(startDay, daysToAdd), {
        representation: "date",
      });

      const wordCount = mapTotalWords.has(date)
        ? mapTotalWords.get(date) ?? 0
        : 0;
      flatYearData[index] = wordCount;
    }

    const yearData: CalendarYearData = [];
    // Originally `flatYearData.length` but some years have 54 weeks instead.
    // TODO: Troubleshoot and fix the bug.
    const maxWeeks = 53;
    for (let week = 0; week < maxWeeks; week++) {
      const startIndex = week * 7;
      const endIndex = startIndex + 7;
      yearData.push(flatYearData.slice(startIndex, endIndex));
    }

    allYearData.push(yearData);
  }

  return {
    props: {
      allYearData,
      minYear,
      maxYear,
      minValue,
      maxValue,
    },
  };
}

export default Home;
