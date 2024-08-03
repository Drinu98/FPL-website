// "use client";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faTwitter,
//   faInstagram,
//   faYoutube,
// } from "@fortawesome/free-brands-svg-icons";
// import Image from "next/image";

// function Footer() {
//   return (
//     <footer className="footer">
//       <div className="social-media-icons">
//         <a
//           className="icons"
//           href="https://twitter.com/FPLFocal"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <FontAwesomeIcon icon={faTwitter} />
//         </a>
//         <a
//           className="icons"
//           href="https://www.instagram.com/FPLFocal/"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <FontAwesomeIcon icon={faInstagram} />
//         </a>
//         <a
//           className="icons"
//           href="https://www.youtube.com/@FPLFocal"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <FontAwesomeIcon icon={faYoutube} />
//         </a>
//       </div>
//       <div className="container" style={{ marginBottom: "3rem" }}>
//         <span style={{ color: "#F2055C", fontSize: "12px" }}>
//           This website is not officially affiliated with Fantasy Premier League
//           in any way.
//         </span>
//       </div>
//       <div style={{ marginTop: "auto", display:'flex', justifyContent:'space-between' }}>
//         <div className="trademark" style={{display:'flex', alignItems:'flex-end'}}>
//           <span>
//             Copyright &copy; 2023{" "}
//             <p>
//               <a
//                 target="_blank"
//                 href="https://andregalea.com"
//                 rel="noopener noreferrer"
//                 className="andre-link"
//               >
//                 Andre Galea
//               </a>
//             </p>
//           </span>
//         </div>
//       </div>
//     </footer>
//   );
// }

// export default Footer;

"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faInstagram,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-branding">
          <h2 className="footer-title">FPL Focal</h2>
          <p className="footer-subtitle">The FPL dashboard with everything you need in one place.</p>
        </div>
        <div className="social-icons">
          <a href="https://twitter.com/FPLFocal" target="_blank" rel="noopener noreferrer" className="social-icon">
            <FontAwesomeIcon icon={faTwitter} />
          </a>
          <a href="https://www.instagram.com/FPLFocal/" target="_blank" rel="noopener noreferrer" className="social-icon">
            <FontAwesomeIcon icon={faInstagram} />
          </a>
          <a href="https://www.youtube.com/@FPLFocal" target="_blank" rel="noopener noreferrer" className="social-icon">
            <FontAwesomeIcon icon={faYoutube} />
          </a>
        </div>
      </div>
      <div className="footer-divider"></div>
      <div className="footer-bottom">
        <p className="footer-disclaimer">This website is not officially affiliated with Fantasy Premier League.</p>
        <p className="footer-copyright">&copy; 2023 FPL Focal. All rights reserved.</p>
        <p className="footer-credit">Developed by <a href="https://andregalea.com" target="_blank" rel="noopener noreferrer" className="developer-link">Andre Galea</a></p>
      </div>
    </footer>
  );
}

export default Footer;