import { type NextPage } from "next";
import Head from "next/head";
import { parse as parseYaml } from "yaml";

import type { CalendarYearData, Chapter } from "~/types";
import StaticHead from "~/components/StaticHead";
import WordCountsChart from "~/components/WordCountsChart";
import { extractWordsPerDay } from "~/utilities/extractWordsPerDay";
import {
  DEFAULT_CHAPTER_DATA_YAML_URL,
  DEFAULT_PAGE_TITLE,
  DEFAULT_SITE_DESCRIPTION,
  DEFAULT_SITE_NAME,
} from "~/constants";

interface HomeProps {
  /** The list of word counts per calendar year. */
  data: Array<CalendarYearData>;
  /** The minimum year in the dataset. */
  minYear: number;
  /** The maximum year in the dataset. */
  maxYear: number;
  /** The minimum value in the dataset. */
  minValue: number;
  /** The maximum value in the dataset. */
  maxValue: number;
}

const Home: NextPage<HomeProps> = ({
  data,
  minYear,
  maxYear,
  minValue,
  maxValue,
}) => {
  return (
    <>
      <StaticHead />

      <Head>
        <title>
          {DEFAULT_PAGE_TITLE} | {DEFAULT_SITE_NAME}
        </title>
        <meta name="description" content={DEFAULT_SITE_DESCRIPTION} />
      </Head>

      <div className="h-screen w-screen cursor-grab">
        <WordCountsChart
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
  const res = await fetch(DEFAULT_CHAPTER_DATA_YAML_URL);
  const text = await res.text();
  const chapters: Chapter[] = parseYaml(text) as Chapter[];

  const { data, minYear, maxYear, minValue, maxValue } =
    extractWordsPerDay(chapters);

  return {
    props: {
      data,
      minYear,
      maxYear,
      minValue,
      maxValue,
    },
  };
};

export default Home;
