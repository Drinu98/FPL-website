"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faInstagram,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";

function Footer() {
  return (
    <footer className="footer">
      <div className="social-media-icons">
        <a
          className="icons"
          href="https://twitter.com/FPLFocal"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FontAwesomeIcon icon={faTwitter} />
        </a>
        <a
          className="icons"
          href="https://www.instagram.com/FPLFocal/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FontAwesomeIcon icon={faInstagram} />
        </a>
        <a
          className="icons"
          href="https://www.youtube.com/@FPLFocal"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FontAwesomeIcon icon={faYoutube} />
        </a>
      </div>
      <div className="container" style={{ marginBottom: "3rem" }}>
        <span style={{ color: "#F2055C", fontSize: "12px" }}>
          This website is not officially affiliated with Fantasy Premier League
          in any way.
        </span>
      </div>
      <div className="trademark">
        <span>
          Copyright &copy; 2023{" "}
          <p>
            <a
              target="_blank"
              href="https://andregalea.com"
              rel="noopener noreferrer"
              className="andre-link"
            >
              Andre Galea
            </a>
          </p>
        </span>
      </div>
    </footer>
  );
}

export default Footer;
