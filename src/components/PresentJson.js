import Tree from './Tree';
import Tree2 from './Tree2';

const PresentJson = ({number, data}) => {
    return (
        <div>
            <center><h1>Mock Scenario {number}</h1></center>
            <Tree2 data={data} /> <br/>
        </div>
    );

}

export default PresentJson