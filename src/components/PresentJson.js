import Tree from './Tree';

const PresentJson = ({number, data}) => {
    return (
        <div>
            <center><h1>Mock Scenario {number}</h1></center>
            <Tree data={data} /> <br/>
        </div>
    );

}

export default PresentJson