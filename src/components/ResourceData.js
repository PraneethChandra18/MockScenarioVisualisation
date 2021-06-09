const ResourceData = ({resources}) => {
    return (
        <div>
            {resources.map((resource,i) => (
                <div key={i}>
                      {"resourceType:"} {resource.resourceType} <br/>
                      {"items:["} <br/>

                      {"]"} <br/>
                    {"},"} <br/>
                </div>
            ))}
        </div>
    );

}

export default ResourceData