import CompartmentData from './CompartmentData';

const PresentJson = ({number, data}) => {
    return (
        <div>
            <center><h1>Mock Scenario {number}</h1></center>
            <div className="card">
                {"{"} <br/>
                  {"nodes:["} <br/>
                    <CompartmentData compartments={data} /> <br/>
                  {"]"} <br/>
                {"}"}
            </div>
        </div>
    );

}

export default PresentJson