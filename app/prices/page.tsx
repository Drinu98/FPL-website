import { FC } from "react"
import HamburgerMenu from '../components/HamburgerMenu'
import Image from 'next/image'
import PriceChange from '../components/pricechanges'

interface Props {
    
}
 
const page: FC<Props> = () => {
    return (
        <main>
        <HamburgerMenu />
         <div className='container' style={{position: 'relative'}}>
            <div className='container-header'>
            <Image
                src="/images/whitelogo.png"
                alt="FPL Focal Logo"
                width={75}
                height={80}
                className='app-logo'
            />
            </div>
        </div>
        <section className='widget-box min-vh-95'>
            <div className='container'>
                <div className="row row-cols-1 row-cols-sm-1 row-cols-md-1 row-cols-lg-3" style={{marginTop: '100px', marginBottom: '300px', justifyContent:'center'}}>
                    <div className='col-lg-5'>
                    <   div className='widget6'>
                            {/* @ts-ignore */}
                            <PriceChange />    
                        </div>
                    </div>
                </div>
            </div>
        </section>   
    </main>
    );
}
 
export default page;