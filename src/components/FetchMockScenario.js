import React, { Component } from 'react';
import MockScenarioData from './MockScenarioData';

class FetchMockScenario extends Component {

    render() {
        return (
            <MockScenarioData number={this.props.number} data={this.state.mockScenarioData} />
        );
      }

    constructor(props)
    {
        super(props)
        this.state = {
                mockScenarioData : "mockScenarioData"
            };
    }

    fetchData() {
        const id = this.props.number;
          console.log("Fetching data...");
              fetch('http://127.0.0.1:8080/MockScenario/' + id)
                .then(res => res.json())
                .then((data) => {
                      this.setState({ mockScenarioData: JSON.stringify(data) });
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

export default FetchMockScenario