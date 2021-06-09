import React, { Component } from 'react';

class HelloWorld extends Component {

    render() {
        return (
            <div>
                <center><h1>{this.state.helloWorldText}</h1></center>
            </div>
        );
      }

    constructor()
    {
        super()
        this.state = {
                helloWorldText : "helloWorld"
            };
    }

    componentDidMount() {
        console.log("Fetching data...");
            fetch('http://127.0.0.1:8080/helloWorld')
              .then(res => res.text())
              .then((data) => {
                    this.setState({ helloWorldText: data });
                    console.log(data);
              })
              .catch(console.log)
    }
}

export default HelloWorld