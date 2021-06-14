const MockScenarioData = ({number, data}) => {
    return (
        <div>
            <center><h1>Mock Scenario {number}</h1></center>
            <div className="card">
                {data}
            </div>
        </div>
    );
}



export default MockScenarioData