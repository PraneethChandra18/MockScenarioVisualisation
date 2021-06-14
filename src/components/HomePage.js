import React, { Component } from 'react';
import {Link} from 'react-router-dom';

class HomePage extends Component {

    render() {
        return (
            <ul>
                <li> <Link to="/helloWorld"> HelloWorld </Link> </li>
                <li> <Link to="/MockScenarioList"> Mock Scenarios </Link> </li>
            </ul>
        );
      }
}

export default HomePage;