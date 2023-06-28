import React from 'react'
import {BrowserRouter as Router, Route} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import SignUpUser from "./components/sign-up-user.component";

function App() {
    return (
            <Router>
            <Route path='/signup' component={SignUpUser} />

            </Router>
    );
}