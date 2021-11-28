import React from 'react'
import ContactME from "../ContactME/ContactME";

import Projects from '../Projects/Projects';
import {Switch , Route } from "react-router-dom"
import { useSelector } from "react-redux";
import Auth from '../Authenticate/Auth';
import Aboutme from '../About/Aboutme';


function Routes() {
    const loggedIn = useSelector((state) => state.App.loggedIn);

    return (
        <div>
             {  !loggedIn ?
              <Switch>
             
            <Route path="/" component={Auth} />
       
                
                </Switch> :
    <Switch >
         <Route path="/projects" component={Projects} />
      <Route exact path="/" component={ContactME} />
      <Route path="/Aboutme" component={Aboutme} />

     


    </Switch>}
        </div>
    )
}

export default Routes
