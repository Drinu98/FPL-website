"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faInstagram,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import Image from "next/image";

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
      <div style={{ marginTop: "auto", display:'flex', justifyContent:'space-between' }}>
        <div className="trademark" style={{display:'flex', alignItems:'flex-end'}}>
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
        {/* <div style={{display:'flex', justifyContent:'end'}}>
        <a
            href="https://www.fantasyfootballscout.co.uk/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image src={'/images/scout.png'} alt="FFS Scout" width={55} height={75} className="scout-photo"/>
          </a>
        </div>  */}
      </div>
    </footer>
  );
}

export default Footer;
