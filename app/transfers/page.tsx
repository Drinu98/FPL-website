import { FC } from "react"
import HamburgerMenu from '../components/HamburgerMenu'
import Image from 'next/image'
import Transfers from '../components/transfers'

interface Props {
    
}
 
const page: FC<Props> = () => {
    return (
        <main>
        <HamburgerMenu />
         <div className='container' style={{position: 'relative'}}>
            <div className='container-header'>
            <a href='/'>
                <Image
                    src="/images/whitelogo.png"
                    alt="FPL Focal Logo"
                    width={75}
                    height={80}
                    className='app-logo'
                />
            </a>
            </div>
        </div>
        <section className='widget-box min-vh-95'>
            <div className='container'>
                <div className="row row-cols-1 row-cols-sm-1 row-cols-md-1 row-cols-lg-3" style={{marginBottom: '40px', justifyContent:'center'}}>
                    <div className='col-lg-5'>
                    <   div className='widget' style={{height: '100%'}}>
                            {/* @ts-ignore */}
                            <Transfers />    
                        </div>
                    </div>
                </div>
            </div>
        </section>   
    </main>
    );
}
 
export default page;