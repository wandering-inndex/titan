import Link from "next/link";

import StaticSiteLogoLine from "../images/StaticSiteLogoLine";

const SiteHeader: React.FC = () => {
  return (
    <>
      <nav className="fixed left-1/2 z-10 my-4 -translate-x-1/2">
        <Link
          href="https://inndex.omg.lol/"
          title="The Wandering Inndex - A fan-made index for The Wandering Inn, a universe by pirateaba."
          className="mx-auto block w-[15rem]"
        >
          <StaticSiteLogoLine data-testid="static-site-logo-line" />
        </Link>
      </nav>
    </>
  );
};

export default SiteHeader;
