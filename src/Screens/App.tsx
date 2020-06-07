import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Analytics from 'react-router-ga';
import Header from './Header & Footer/header';
import Footer from './Header & Footer/footer';
import mapRouter from './Router/router';
import { menu } from './Misc/menuConfig';
import './App.less';

export default function App(): JSX.Element {
    return (
        <Router>
            <Analytics
                id={process.env.REACT_APP_GOOGLE_ANALYTICS_TRACKING_ID || ''}
            >
                <Header />
                {mapRouter(menu)}
                <Footer />
            </Analytics>
        </Router>
    );
}
