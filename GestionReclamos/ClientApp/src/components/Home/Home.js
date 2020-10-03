import React,{ useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { ACCESS_TOKEN_NAME } from '../../constants/apiContants';

function Home(props) {
    useEffect(() => {
        if(localStorage.getItem(ACCESS_TOKEN_NAME) != null){
          redirectToCreateClaimCar();
          console.log("estoy")
        }
        else{
          redirectToLogin()
        }
      })
    function redirectToLogin() {
    props.history.push('/login');
    }
    function redirectToCreateClaimCar() {
      props.history.push('/claims/create/ticket');
      props.updateTitle('Gestion de Reclamos - Crear Reclamo Ticket')
    }
    return(
        <div className="mt-2">
            Test
        </div>
    )
}

export default withRouter(Home);