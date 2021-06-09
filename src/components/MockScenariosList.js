import React, { Component } from 'react';
import {BrowserRouter, Switch, Route, Link} from 'react-router-dom';
import FetchMockScenario from './FetchMockScenario';

class MockScenarioList extends Component {

    render() {
        return (
            <BrowserRouter>
                <div>
                    <nav>
                        <ul>
                            {Array(parseInt(this.state.countScenarios)).fill(null).map((value, index) => (
                                <li key={index}> <Link to={"/MockScenario/" + index}> Mock Scenario {index} </Link> </li>
                            ))}
                        </ul>
                    </nav>
                </div>

                <Switch>
                    {Array(parseInt(this.state.countScenarios)).fill(null).map((value, index) => (
                        <Route path = {"/MockScenario/" + index} exact key={index}> <FetchMockScenario number={index} /> </Route>
                    ))}
                </Switch>
            </BrowserRouter>
        );
      }

      constructor(props)
          {
              super(props)
              this.state = {
                      countScenarios : "0"
                  };
          }

          fetchData() {
            console.log("Fetching data...");
                fetch('http://127.0.0.1:8080/MockScenario/countFiles')
                  .then(res => res.text())
                  .then((data) => {
                        this.setState({ countScenarios: data });
                  })
                  .catch(console.log)
          }


          componentDidUpdate(prevProps, prevState) {
              if (prevProps.number !== this.props.number) {
                  this.fetchData();
              }
            }

          componentDidMount() {
              this.fetchData();
          }
}

export default MockScenarioList;