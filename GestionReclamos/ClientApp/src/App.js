import React, { useState } from 'react';
import './App.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from "react-router-dom";
import PrivateRoute from './utils/PrivateRoute';
import Header from './components/Header/Header';
import LoginForm from './components/LoginForm/LoginForm';
import RegistrationForm from './components/RegistrationForm/RegistrationForm';
import Home from './components/Home/Home';
import AlertComponent from './components/AlertComponent/AlertComponent';
import CreateClaimTicket from './components/CreateClaimTicket/CreateClaimTicket';
import CreateClaimCar from './components/CreateClaimCar/CreateClaimCar';
import ClaimsCar from './components/Claims/ClaimsCar';
import ClaimsTicket from './components/Claims/ClaimsTicket';

function App() {
    const [title, updateTitle] = useState(null);
    const [errorMessage, updateErrorMessage] = useState(null);
    return (
        <Router>
            <div className="App">
                <Header title={title} />
                <div className="container d-flex align-items-center flex-column">
                    <Switch>
                        <Route path="/" exact={true}>
                            <Redirect to="/login"></Redirect>
                        </Route>
                        <Route path="/register">
                            <RegistrationForm showError={updateErrorMessage} updateTitle={updateTitle} />
                        </Route>
                        <Route path="/login">
                            <LoginForm showError={updateErrorMessage} updateTitle={updateTitle} />
                        </Route>
                        <PrivateRoute path="/home">
                            <Home showError={updateErrorMessage} updateTitle={updateTitle} />
                        </PrivateRoute>
                        <PrivateRoute path="/claims/create/car">
                            <CreateClaimCar showError={updateErrorMessage} updateTitle={updateTitle} />
                        </PrivateRoute>
                        <PrivateRoute path="/claims/create/ticket">
                            <CreateClaimTicket showError={updateErrorMessage} updateTitle={updateTitle} />
                        </PrivateRoute>
                        <PrivateRoute path="/claims/car">
                            <ClaimsCar showError={updateErrorMessage} updateTitle={updateTitle} />
                        </PrivateRoute>
                        <PrivateRoute path="/claims/ticket">
                            <ClaimsTicket showError={updateErrorMessage} updateTitle={updateTitle} />
                        </PrivateRoute>
                    </Switch>
                    <AlertComponent errorMessage={errorMessage} hideError={updateErrorMessage} />
                </div>
            </div>
        </Router>
    );
}

export default App;
