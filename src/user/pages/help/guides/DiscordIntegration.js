import { useAuth0 } from '@auth0/auth0-react';
import LoadingSpinner from '../../../shared/components/UIElements/loadingSpinner/LoadingSpinner';
import './Landing.css';

export default function DiscordIntegration() {
    const { isAuthenticated, isLoading } = useAuth0();
    if (isLoading) {
        return (
            <div className='container'>
                <div className='spinner-container'>
                    <LoadingSpinner />
                </div>
            </div>
        )
    } else {
        return (
            !isAuthenticated && (
                <div className='container'>
                 <p>Download dTools *URL*</p>
                </div>
            )
        );
    };
};