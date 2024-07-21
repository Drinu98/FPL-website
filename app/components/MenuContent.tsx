import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faArrowRight,
  faBullseye,
  faCalendarDays,
  faChair,
  faChartLine,
  faCrown,
  faCrutch,
  faHome,
  faList,
  faMoneyBillTransfer,
  faPerson,
  faPersonCircleXmark,
  faPersonWalkingArrowRight,
  faPlus,
  faRankingStar,
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
        <a href="/rank">
          Live Rank <FontAwesomeIcon icon={faRankingStar} />
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
        <a href="/fixtureTicker">
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
        <a href="/twat">
          Disaster of the Week <FontAwesomeIcon icon={faArrowDown} />
        </a>
        <a href="/bench">
          Bench Disaster <FontAwesomeIcon icon={faChair} />
        </a>
        <a href="/stats">
          Statistics <FontAwesomeIcon icon={faChartLine} />
        </a>
        <a href="/fixtures">
          Fixtures <FontAwesomeIcon icon={faList} />
        </a>
        <a href="/setpieces">
          Set Pieces <FontAwesomeIcon icon={faPersonWalkingArrowRight} />
        </a>
      </ul>
    </div>
  );
}
