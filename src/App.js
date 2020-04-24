import React from 'react';
import {BrowserRouter, Route} from 'react-router-dom'
import WelcomePage from './pages/WelcomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
//import AboutPage from './pages/AboutPage'
import PricingPage from './pages/PricingPage'
import UserHomePage from './pages/UserHomePage'
import VerificationPage from './pages/VerificationPage'
import PasswordRecoveryPage from './pages/PasswordRecoveryPage'
import AdminPricingPage from './pages/AdminPricingPage'
import AdminSettingsPage from './pages/AdminSettingsPage'
import AdminCurriculumCreatorPage from './pages/AdminCurriculumCreatorPage'
import PrivateRoute from './components/PrivateRoute'
import { createBrowserHistory } from 'history';
import { Helmet } from 'react-helmet'

const TITLE = 'PTChessTrainer'

class App extends React.Component {

    render() {

    	// **** This code is necessary for the server-side routing. Don't worry about it: it just works. ****
    	const history = createBrowserHistory();

		const path = (/#!(\/.*)$/.exec(window.location.hash) || [])[1];
		if (path) {
		    history.replace(path);
		}
		// ****

        return (
            <div>
                <Helmet>
                  <title>{ TITLE }</title>
                </Helmet>
                <BrowserRouter>
                    <Route exact path="/">
                        <WelcomePage />
                    </Route>

                    <Route path="/login">
                        <LoginPage />
                    </Route>

                    <Route path="/register">
                        <RegisterPage />
                    </Route>

                    <Route path="/pricing">
                        <PricingPage />
                    </Route>

                    {/**<Route path="/about">
                        <AboutPage />
                    </Route>**/}

                    <Route path="/verification">
                        <VerificationPage />
                    </Route>

                    <Route path="/password_recovery">
                        <PasswordRecoveryPage />
                    </Route>

                    <PrivateRoute path="/home" component={UserHomePage} requireVerify={true} requireNotAdmin={true}/>

                    <PrivateRoute exact path="/admin" component={AdminCurriculumCreatorPage} requireAdmin={true}/>

                    <PrivateRoute path="/admin/pricing_settings" component={AdminPricingPage} requireAdmin={true}/>

                    <PrivateRoute path="/admin/settings" component={AdminSettingsPage} requireAdmin={true}/>

                </BrowserRouter>
            </div>
        );
    }
}

export default App;