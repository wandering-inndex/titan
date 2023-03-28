import { type NextPage } from "next";
import Head from "next/head";
import { parse as parseYaml } from "yaml";

import type { CalendarYearData, Chapter } from "~/types";
import DailyContributionChart from "~/components/DailyContributionChart";
import { extractWordsPerDay } from "~/utilities/extractWordsPerDay";

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

        <title>Project Titan | The Wandering Inndex</title>
        <meta
          name="description"
          content="Visualizing the Word Count of The Wandering Inn, a universe by pirateaba."
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

export const getServerSideProps = async () => {
  const url = `https://raw.githubusercontent.com/wandering-inndex/seed-data/main/data/media/twi-webnovel-chapters.yaml`;
  const res = await fetch(url);
  const data = await res.text();
  const chapters: Chapter[] = parseYaml(data) as Chapter[];

  const { allYearData, minYear, maxYear, minValue, maxValue } =
    extractWordsPerDay(chapters);

  return {
    props: {
      allYearData,
      minYear,
      maxYear,
      minValue,
      maxValue,
    },
  };
};

export default Home;
