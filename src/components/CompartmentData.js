import ResourceData from './ResourceData';

const CompartmentData = ({compartments}) => {
    return (
        <div>
            {compartments.map((compartment,i) => (
                <div key={i}>
                    {"{"} <br/>
                      {"id:"} {compartment.id} <br/>
                      {"name:"} {compartment.name} <br/>
                      {"resources:["}
                        <ResourceData resources={compartments.resources} /> <br/>
                      {"]"} <br/>
                      {"children:["} <br/>
                        <CompartmentData compartments={compartment.children} /> <br/>
                      {"]"} <br/>
                    {"},"} <br/>
                </div>
            ))}
        </div>
    );

}

export default CompartmentData