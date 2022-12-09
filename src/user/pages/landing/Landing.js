import { useAuth0 } from '@auth0/auth0-react';
import {useHttpClient} from '../../../shared/hooks/http-hook';
import Loading from '../../../shared/components/pages/Loading';
import { CarouselDisplay, dummyData } from '../../../shared/components/UIElements/carousel/CarouselDisplay';
import SignupButton from '../../../shared/components/FormElements/authButton/SignupButton';
import { Button } from 'primereact/button';
import './Landing.css';

export default function Landing() {
    const { isAuthenticated } = useAuth0();
    const { isLoading } = useHttpClient();

    if (isLoading) {
        return <Loading />
    }

    return (
        !isAuthenticated && (
            <div className='container'>

                <div className="text-700 text-center border-round mb-5 py-8 w-full" style={{backgroundColor: '#1d1e2e', backgroundImage: 'linear-gradient(180deg, #00DBDE 0%, #FC00FF 100%)'}}>
                    <div className="py-8">

                    <div className="text-blue-800 font-bold mb-6"><i className="pi pi-discord"></i>&nbsp;POWERED BY DISCORD</div>
                    
                    <div className="text-900 font-bold text-5xl mb-2">League Life</div>
                    
                    <div className="text-blue-900 text-2xl mb-5">Take your league to the next level.</div>
                    
                    <SignupButton />

                    </div>
                </div>

                <div className="surface-0 text-center border-round mt-5">

                    <div className="mb-4 font-bold text-2xl mb-8">
                        <span className="text-900">Coming</span>
                        <span className="text-blue-600"> Soon</span>
                    </div>

                    <div className="grid">

                        <div className="col-12 md:col-4 mb-4 px-5">
                            <span className="p-3 shadow-2 mb-3 inline-block" style={{ borderRadius: '10px' }}>
                                <i className="pi pi-desktop text-4xl text-blue-500"></i>
                            </span>
                            <div className="text-900 mb-3 font-medium">Expanded League Customization</div>
                            <span className="text-700 text-sm line-height-3">...</span>
                        </div>

                        <div className="col-12 md:col-4 mb-4 px-5">
                            <span className="p-3 shadow-2 mb-3 inline-block" style={{ borderRadius: '10px' }}>
                                <i className="pi pi-check-circle text-4xl text-blue-500"></i>
                            </span>
                            <div className="text-900 mb-3 font-medium">League Driver Involvement</div>
                            <span className="text-700 text-sm line-height-3">...</span>
                        </div>

                        <div className="col-12 md:col-4 mb-4 px-5">
                            <span className="p-3 shadow-2 mb-3 inline-block" style={{ borderRadius: '10px' }}>
                                <i className="pi pi-lock text-4xl text-blue-500"></i>
                            </span>
                            <div className="text-900 mb-3 font-medium">Privacy Tools</div>
                            <span className="text-700 text-sm line-height-3">...</span>
                        </div>

                        <div className="col-12 md:col-4 mb-4 px-5">
                            <span className="p-3 shadow-2 mb-3 inline-block" style={{ borderRadius: '10px' }}>
                                <i className="pi pi-globe text-4xl text-blue-500"></i>
                            </span>
                            <div className="text-900 mb-3 font-medium">Advanced Analytics</div>
                            <span className="text-700 text-sm line-height-3">...</span>
                        </div>

                        <div className="col-12 md:col-4 mb-4 px-5">
                            <span className="p-3 shadow-2 mb-3 inline-block" style={{ borderRadius: '10px' }}>
                                <i className="pi pi-discord text-4xl text-blue-500"></i>
                            </span>
                            <div className="text-900 mb-3 font-medium">Discord Messaging & More!</div>
                            <span className="text-700 text-sm line-height-3">...</span>
                        </div>

                        <div className="col-12 md:col-4 mb-4 px-5">
                            <span className="p-3 shadow-2 mb-3 inline-block" style={{ borderRadius: '10px' }}>
                                <i className="pi pi-shield text-4xl text-blue-500"></i>
                            </span>
                            <div className="text-900 mb-3 font-medium">Trusted Securitty</div>
                            <span className="text-700 text-sm line-height-3">...</span>
                        </div>

                    </div>

                </div>
                {/*<CarouselDisplay />*/}
            </div>
        )
    );
};