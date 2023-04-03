import type { NextPage, GetServerSideProps } from "next";
import Head from "next/head";
import { parse as parseYaml } from "yaml";

import type { CalendarYearsData, Chapter } from "~/types";
import StaticHead from "~/components/document/StaticHead";
import SiteHeader from "~/components/ui/SiteHeader";
import TitanicGrids from "~/components/charts/TitanicGrids";
import { convertChaptersToCalendarYearData } from "~/utils";
import {
  DEFAULT_CHAPTER_DATA_YAML_URL,
  DEFAULT_PAGE_TITLE,
  DEFAULT_SITE_DESCRIPTION,
  DEFAULT_SITE_NAME,
} from "~/constants";

interface HomeProps {
  /** The list of word counts per calendar year. */
  data: CalendarYearsData;
  /** The minimum year in the dataset. */
  minYear: number;
  /** The maximum value in the dataset. */
  maxValue: number;
}

const Home: NextPage<HomeProps> = ({ data, minYear, maxValue }) => {
  const pageTitle = DEFAULT_PAGE_TITLE;
  const pageDescription = DEFAULT_SITE_DESCRIPTION;
  const windowTitle = `${pageTitle} | ${DEFAULT_SITE_NAME}`;

  return (
    <>
      <StaticHead />

      <Head>
        <title>{windowTitle}</title>
        <meta name="description" content={pageDescription} />

        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
      </Head>

      <SiteHeader />

      <main className="h-screen w-screen cursor-move">
        <TitanicGrids data={data} startYear={minYear} maxValue={maxValue} />
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  const res = await fetch(DEFAULT_CHAPTER_DATA_YAML_URL);
  const text = await res.text();
  const chapters: Chapter[] = parseYaml(text) as Chapter[];

  const { data, minYear, maxValue } =
    convertChaptersToCalendarYearData(chapters);

  return {
    props: {
      data,
      minYear,
      maxValue,
    },
  };
};

export default Home;
