import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { Hero } from "@/components/hero";
import { WorksWith } from "@/components/works-with";
import { WhyOpen } from "@/components/why-open";
import { Scenarios } from "@/components/scenarios";
import { Roadmap } from "@/components/roadmap";
import { DownloadSteps } from "@/components/download-steps";
import { BigCTA } from "@/components/big-cta";
import { PlatformGrid } from "@/components/platform-grid";

export default function Home() {
  return (
    <>
      <SiteNav active="home" />
      <main className="ol-page-content">
        <Hero />
        <WorksWith />
        <WhyOpen />
        <Scenarios />
        <Roadmap />
        <DownloadSteps />
        <PlatformGrid />
        <BigCTA />
      </main>
      <SiteFooter />
    </>
  );
}
