'use client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';

function Footer() {
  return (
    <footer className='footer'>
      <div className="social-media-icons">
        <a className='icons' href="https://twitter.com/FPLFocal" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faTwitter} />
        </a>
        <a className='icons' href="https://www.instagram.com/FPLFocal/" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faInstagram} />
        </a>
        <a className='icons' href="https://www.youtube.com/@FPLFocal" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faYoutube} />
        </a>
      </div>
      <div className="trademark">
        <span>Copyright &copy; 2023 <p style={{color: '#F2055C'}}>Andre Galea</p></span>
      </div>
    </footer>
  );
}

export default Footer;
