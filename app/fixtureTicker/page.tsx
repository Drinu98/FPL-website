import { FC } from "react";
import HamburgerMenu from "../components/HamburgerMenu";
import Image from "next/image";
import FDR from "../components/fdr";

interface Props {}

export default function page() {
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
          <div
            className="row row-cols-1 row-cols-sm-1 row-cols-md-1 row-cols-lg-12"
            style={{ marginBottom: "40px", justifyContent: "center" }}
          >
            <div className="col-lg-8">
              <div className="widgetFDR" style={{ height: "400px" }}>
                {/* @ts-ignore */}
                {/* <FDR /> */}
                <div className="transfers-container">
          <div className="graphic-container">
            <h2 className="transfers-title">Fixture Ticker</h2>
          </div>
          <p className="error-message">
            <Image
              src="/images/errorlogo.png"
              alt="FPL Focal Logo"
              width={50}
              height={50}
              className="error-logo"
            ></Image>
            The Game is Updating...
          </p>
        </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export const revalidate = 20;
