const Tenancies = ({tenancies}) => {
    return (
        <div>
            <center><h1>Tenancy List</h1></center>
            {tenancies.map((tenancy) => (
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">{tenancy.id}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">{tenancy.tenancyName}</h6>
                    </div>
                </div>
            ))}
        </div>
    );

}

export default Tenancies