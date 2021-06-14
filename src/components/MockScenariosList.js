import React, { Component } from 'react';
import {Link} from 'react-router-dom';

class MockScenarioList extends Component {
      render() {
          return (
              <ul>
                  {Array(parseInt(this.state.countScenarios)).fill(null).map((value, index) => (
                        <li key={index}> <Link to={"/MockScenario/" + index} target="_blank"> Mock Scenario {index} </Link> </li>
                  ))}
              </ul>
          );
      }

      constructor(props) {
          super(props)
          this.state = { countScenarios : "0" };
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