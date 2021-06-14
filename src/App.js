import React, { Component } from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';

import HomePage from './components/HomePage';
import HelloWorld from './components/HelloWorld';
import MockScenarioList from './components/MockScenariosList';
import FetchMockScenario from './components/FetchMockScenario';


class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route path = {"/"} exact> <HomePage /> </Route>
                    <Route path = "/helloWorld" exact> <HelloWorld /> </Route>
                    <Route path = "/MockScenarioList" exact> <MockScenarioList /> </Route>
                    <Route path = {"/MockScenario/:id"} exact render = {(props) => <FetchMockScenario {...props} />} />
                </Switch>
            </BrowserRouter>
        );
      }
}

export default App;