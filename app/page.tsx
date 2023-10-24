import Image from "next/image";
import React from "react";
import HamburgerMenu from "./components/HamburgerMenu";
import Transfers from "./components/transfers";
import Injuries from "./components/Injuries";
import Fixtures from "./components/fixtures";
import GameweekInfo from "./components/gameweek";
import UpcomingFixtures from "./components/upcomingfixtures";
import TwatAPI from "./components/twat";
import SetAndForget from "./components/setAndForget";
import RealPlayers from "./components/realplayers";
import PriceChange from "./components/pricechanges";
import Captaincy from "./components/captaincy";
import Expected from "./components/expected";
import Statistics from "./components/statistics";
import FDR from "./components/fdr";


export default async function Home() {
  return (
    <main>
      <HamburgerMenu />
      <div className="container" style={{ position: "relative" }}>
        <div className="container-header">
          <a href="/">
            <Image
              src="/images/whitelogo.png"
              alt="FPL Focal Logo"
              width={75}
              height={80}
              className="app-logo"
            />
          </a>
        </div>
      </div>
      <section className="widget-box min-vh-95">
        <div className="container">
          <div className="row row-cols-1 row-cols-sm-1 row-cols-md-1 row-cols-lg-3">
            <div className="col-lg-4">
              <div className="widget2">
                {/* @ts-ignore */}
                <GameweekInfo />
              </div>
              <div className="widget5">
                {/* @ts-ignore */}
                <UpcomingFixtures />
              </div>
            </div>
            <div className="col-lg-5">
              <div className="widget3">
                {/* @ts-ignore */}
                <Fixtures />
              </div>
            </div>
            <div className="col-lg-3">
              <div className="widget4">
                {/* @ts-ignore */}
                <Captaincy />
              </div>
              <div className="widget6">
                {/* @ts-ignore */}
                <PriceChange />
              </div>
            </div>
          </div>
          <div className="row row-cols-1 row-cols-sm-1 row-cols-md-1 row-cols-lg-3">
            <div className="col-lg-4">
              <div className="widget10">
                {/* @ts-ignore */}
                <Expected />
                {/* <Injuries /> */}
              </div>
              <div className="widget11">
                {/* @ts-ignore */}
                <Statistics />
              </div>
            </div>
            <div className="col-lg-5">
              <div className="widgetFDR">
                {/* @ts-ignore */}
                <FDR />
              </div>
              {/* <div className="widget"> */}
                {/* @ts-ignore */}
                {/* <Transfers /> */}
              {/* </div> */}
              {/* <div className="widget10"> */}
                {/* @ts-ignore */}
                {/* <Expected /> */}
              {/* </div> */}
               <div className="widget">
                {/* @ts-ignore */}
                <Transfers />
              </div>
              <div className="widget">
                {/* @ts-ignore */}
                <Injuries />
              </div>
            </div>
            <div className="col-lg-3">
              <div className="widget8">
                {/* @ts-ignore */}
                <RealPlayers />
              </div>
              <div className="widget7">
                {/* @ts-ignore */}
                <TwatAPI />
              </div>
              <div className="widget7">
                {/* @ts-ignore */}
                <SetAndForget />
              </div>
              <div className="widget9">
                <div className="graphic-container">
                  <h2 className="transfers-title">Custom Kits</h2>
                  <div className="outer-container">
                    <div className="inner-container">
                      <a
                        target="_blank"
                        href="https://fplfocal.com/"
                        rel="noopener noreferrer"
                      >
                        <div className="image-container"></div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="widget12">
                <div className="graphic-container">
                  <h2 className="transfers-title">Youtube</h2>
                </div>
                <div className="outer-container-youtube">
                  <div className="inner-container">
                    <a
                      target="_blank"
                      href="https://www.youtube.com/@FPLFocal"
                      rel="noopener noreferrer"
                    >
                      <div className="image-container-youtube"></div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export const revalidate = 40;