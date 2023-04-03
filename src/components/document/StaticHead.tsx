import Head from "next/head";

const StaticHead: React.FC = () => {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta
          property="keywords"
          content="the wandering inn, 3d, data-visualization"
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

        <meta
          property="og:image"
          content="https://titan.inndex.omg.lol/ogp.png"
        />
        <meta
          property="og:image:secure_url"
          content="https://titan.inndex.omg.lol/ogp.png"
        />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1080" />
        <meta property="og:image:height" content="500" />
        <meta
          property="og:image:alt"
          content="Screenshot for the daily word count of The Wandering Inn, a short story by pirateaba."
        />
      </Head>
    </>
  );
};

export default StaticHead;
