import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faBullseye,
  faCalendarDays,
  faCrown,
  faCrutch,
  faHome,
  faMoneyBillTransfer,
  faPerson,
  faPersonCircleXmark,
  faPlus,
  faUpRightAndDownLeftFromCenter,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function MenuContent() {
  return (
    <div className="menu-content">
      {/* Your menu items */}
      <ul style={{ listStyle: "none" }}>
        <a href="/">
          Home
          <FontAwesomeIcon icon={faHome} />
        </a>
        <a href="/bonus">
          Bonus Points <FontAwesomeIcon icon={faPlus} />
        </a>
        <a href="/top10k">
          Top 10K <FontAwesomeIcon icon={faCrown} />
        </a>
        <a href="/pricechanges">
          Price Changes
          <FontAwesomeIcon icon={faMoneyBillTransfer} />
        </a>
        <a href="/realplayers">
          Players League
          <FontAwesomeIcon icon={faPerson} />
        </a>
        <a href="/fixtureticker">
          Fixture Ticker <FontAwesomeIcon icon={faCalendarDays} />
        </a>
        <a href="/injuries">
          Injuries <FontAwesomeIcon icon={faPersonCircleXmark} />
        </a>
        <a href="/transfers">
          Top Transfers{" "}
          <FontAwesomeIcon icon={faUpRightAndDownLeftFromCenter} />
        </a>
        <a href="/expected">
          Expected Data <FontAwesomeIcon icon={faBullseye} />
        </a>
      </ul>
    </div>
  );
  
}
