import React, { Component } from 'react';
import {BrowserRouter, Switch, Route, Link} from 'react-router-dom';
import HelloWorld from './HelloWorld';
import MockScenarioList from './MockScenariosList';

class HomePage extends Component {

    render() {
        return (
            <BrowserRouter>
                <div>
                <nav>
                    <ul>
                        <li> <Link to="/helloWorld"> HelloWorld </Link> </li>
                        <li> <Link to="/MockScenarioList"> Mock Scenarios </Link> </li>
                    </ul>
                </nav>
                </div>

                <Switch>
                    <Route path = "/helloWorld" exact> <HelloWorld /> </Route>
                    <Route path = "/MockScenarioList" exact> <MockScenarioList /> </Route>
                </Switch>
            </BrowserRouter>
        );
      }
}

export default HomePage;