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
    }
    function redirectToCreateClaimCar() {
        props.history.push('/claims/create/car');
        props.updateTitle('Gestion de Reclamos - Crear Reclamo Auto')
    }
    function redirectToClaimsCar() {
        props.history.push('/claims/car');
    }

    function redirectToCreateClaimTicket() {
        props.history.push('/claims/create/ticket');
        props.updateTitle('Gestion de Reclamos - Crear Reclamo Ticket')
    }
    return (
        <div className="mt-2">
            Test
            <button
                type="submit"
                className="btn btn-primary"
                onClick={redirectToCreateClaimCar}
            >Crear Reclamos Auto</button>
            <button
                type="submit"
                className="btn btn-primary"
                onClick={redirectToCreateClaimTicket}
            >Crear Reclamos Pasaje</button>
            <button
                type="submit"
                className="btn btn-primary"
                onClick={redirectToClaimsCar}
            >Ver Reclamos Auto</button>
        </div>
    )
}

export default withRouter(Home);