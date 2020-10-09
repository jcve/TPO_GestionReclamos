import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { ACCESS_TOKEN_NAME } from '../../constants/apiContants';

function Home(props) {
    // useEffect(() => {
    //     if(localStorage.getItem(ACCESS_TOKEN_NAME) != null){
    //       redirectToCreateClaimCar();
    //       console.log("estoy")
    //     }
    //     else{
    //       redirectToLogin()
    //     }
    //   })
    function redirectToLogin() {
        props.history.push('/login');
        props.updateTitle('Login')
    }
    function redirectToCreateClaimCar() {
        props.history.push('/claims/create/car');
        props.updateTitle('Gestion de Reclamos - Crear Reclamo Auto')
    }
    function redirectToClaimsCar() {
        props.history.push('/claims/car');
        props.updateTitle('Gestion de Reclamos - Reclamos de Autos')
    }
    function redirectToClaimsTicket() {
        props.history.push('/claims/ticket');
        props.updateTitle('Gestion de Reclamos - Reclamos de Pasajes')
    }

    function redirectToCreateClaimTicket() {
        props.history.push('/claims/create/ticket');
        props.updateTitle('Gestion de Reclamos - Crear Reclamo Ticket')
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
                            <h5 class="card-title">Modulo creación de reclamos</h5>
                            <p class="card-text">Creación de reclamos para autos</p>
                            <button
                                type="submit"
                                className="btn btn-primary btn-lg btn-block"
                                onClick={redirectToCreateClaimCar}
                            >Crear Reclamo Auto</button>
                        </div>
                    </div>
                </div>
                <div class="col-sm-6">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Modulo creación de reclamos</h5>
                            <p class="card-text">Creación de reclamos para pasajes</p>
                            <button
                                type="submit"
                                className="btn btn-primary btn-lg btn-block"
                                onClick={redirectToCreateClaimTicket}
                            >Crear Reclamo Pasaje</button>
                        </div>
                    </div>
                </div>
            </div>
            <br />
            <div class="row">
                <div class="col-sm-6">
                    <div class="card">
                        <div class="card-body">
                        <h5 class="card-title">Modulo modificación de reclamos</h5>
                        <p class="card-text">Modificación de reclamos para autos</p>
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
                        <h5 class="card-title">Modulo modificación de reclamos</h5>
                        <p class="card-text">Modificación de reclamos para pasajes</p>
                            <button
                                type="submit"
                                className="btn btn-primary btn-lg btn-block"
                                onClick={redirectToClaimsTicket}
                            >Ver Reclamos Pasajes</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default withRouter(Home);