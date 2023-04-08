import Image from 'next/image'
import Transfers from './components/transfers'
import Fixtures from './components/fixtures'
import GameweekInfo from './components/gameweek'
import UpcomingFixtures from './components/upcomingfixtures'
import TwatAPI from './components/twat'
import RealPlayers from './components/realplayers'
import PriceChange from './components/pricechanges'
import Captaincy from './components/captaincy'
import Footer from './components/footer'
import Link from 'next/link'

export default function Home() {
  return (
    <main>
      <div className='container'>
        <div className='container-header'>
          <Image
              src="/images/logo.png"
              alt="FPL Focal Logo"
              width={80}
              height={80}
              className='app-logo'
          />
        </div>
      </div>
      <section className='widget-box min-vh-95'>
        <div className='container'>
          <div className='row row-cols-1 row-cols-sm-1 row-cols-md-1 row-cols-lg-3'>
            <div className='col-lg-4'>
                <div className='widget2'>
                  {/* @ts-ignore */}
                  <GameweekInfo /> 
                </div>
                <div className='widget5' >
                  {/* @ts-ignore */}
                  <UpcomingFixtures />
                </div>
              </div>
              <div className='col-lg-5'>
                <div className='widget3'>
                  {/* @ts-ignore */}
                  <Fixtures />
                </div> 
              </div>
              <div className='col-lg-3'>
                <div className='widget4'>
                  <div className='graphic-container'>
                    <h2 className='transfers-title'>Top 10K</h2>
                    <Captaincy />
                  </div>
                </div>
                <div className='widget6'>
                  <div className='graphic-container'>
                    <h2 className='transfers-title'>Price Changes</h2>
                      <PriceChange />
                  </div>
                </div>
              </div>
            </div>
            <div className='row row-cols-1 row-cols-sm-1 row-cols-md-1 row-cols-lg-3'>
              <div className='col-lg-7'>
                <div className='widget'>
                  <div className='graphic-container'>
                    <h2 className='transfers-title'>Top 10 Transfers</h2>
                    <Transfers />
                  </div>
                </div>
            </div>
              <div className='col-lg-5'>
                <div className='widget7'>
                  <div className='graphic-container'>
                    <h2 className='transfers-title'>TWAT</h2>
                    {/* @ts-ignore */}
                    <TwatAPI />
                  </div>
                </div>
                <div className='widget8'>
                  <div className='graphic-container'>
                    <h2 className='transfers-title'>Player Transfers</h2>
                  </div>
                  {/* @ts-ignore */}
                    <RealPlayers />
                </div>
                <div>
                    <p className='courtesy-text'>Player FPL teams courtesy of <Link href={'https://fplbot.app/'} className='courtesy-link'>fplbot</Link></p>
                </div>
              </div>
            </div>
          </div>
      </section>
        <Footer />
 
    </main>
  )
}
