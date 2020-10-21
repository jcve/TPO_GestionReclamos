import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { ACCESS_TOKEN_NAME } from '../../constants/apiContants';

function Home(props) {
    function redirectToLogin() {
        props.history.push('/login');
        props.updateTitle('Login')
    }
    function redirectToClaimsCar() {
        props.history.push('/claims/car');
        props.updateTitle('Gestion de Reclamos - Reclamos de Autos')
    }
    function redirectToClaimsTicket() {
        props.history.push('/claims/ticket');
        props.updateTitle('Gestion de Reclamos - Reclamos de Pasajes')
    }

    function redirectToSwagger() {
        window.location.href = '/swagger/index.html';
    }
    return (
        <div>
            <br />
            <div class="jumbotron jumbotron-fluid">
                <div class="container">
                    <h1 class="display-4">¡Bienvenido al sistema de reclamos!</h1>
                    <p class="lead">Desde este menu podras como operador realizar la creación y modificación de reclamos recibidos por clientes.</p>
                </div>
            </div>
            <br />
            <div class="row">
                <div class="col-sm-6">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Reclamos Autos</h5>
                            <p class="card-text">Creación y modificación de reclamos para autos</p>
                            <button
                                type="submit"
                                className="btn btn-primary btn-lg btn-block"
                                onClick={redirectToClaimsCar}
                            >Ver Reclamos Autos</button>
                        </div>
                    </div>
                </div>
                <div class="col-sm-6">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Reclamos Pasajes</h5>
                            <p class="card-text">Creación y modificación de reclamos para pasajes</p>
                            <button
                                type="submit"
                                className="btn btn-primary btn-lg btn-block"
                                onClick={redirectToClaimsTicket}
                            >Ver Reclamos Pasajes</button>
                        </div>
                    </div>
                </div>
            </div>
            {/* <br /><br />
            <div class="card align-middle">
                <div class="card-body">
                    <h5 class="card-title">Developers</h5>
                    <p class="card-text">Acceso a las APIs del Sistema de Reclamos</p>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        onClick={redirectToSwagger}
                    >Ver Swagger</button>
                </div>
            </div> */}
        </div>
    )
}

export default withRouter(Home);