"use client"
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faArrowsRotate } from '@fortawesome/free-solid-svg-icons'

function Error() {
    
    const handleReloadClick = () => {
        // Reload the page
        window.location.reload();
    };

    return<>
     <div className='error-container'>
          <Image
              src="/images/whitelogo.png"
              alt="FPL Focal Logo"
              width={105}
              height={120}
              className='app-logo'
          />
        <div className='error-text-box'>
            <p className='errorPage-text'>The game is updating</p>
            <a onClick={handleReloadClick} className='arrows-rotate'>
                <FontAwesomeIcon icon={faArrowsRotate} />
            </a>
        </div>
          
    </div>
        

    </>
}

export default Error