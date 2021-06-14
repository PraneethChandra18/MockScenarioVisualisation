import React from 'react';
import PresentJson from './PresentJson';
import * as d3 from 'd3';

const FetchMockScenario = (props) => {
    const [mockScenarioData, setMockScenarioData] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const id = props.match.params.id;
        d3.json('http://127.0.0.1:8080/MockScenario/'+id).then((d) => {
            setMockScenarioData(d.nodes);
            setLoading(false);
        })
        .catch((error) => {
            console.log(error);
        });

        return () => undefined;
        }, [props.match.params.id]);

        return (
            <div>
                {loading && <div> Loading... </div>}
                {!loading && <PresentJson number={props.match.params.id} data={mockScenarioData} />}
            </div>
        );
}

export default FetchMockScenario