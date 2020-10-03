import React,{ useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { ACCESS_TOKEN_NAME } from '../../constants/apiContants';

function Home(props) {
    useEffect(() => {
        // axios.get('api/claim/car/GetAll', { headers: { 'Authorization': localStorage.getItem(ACCESS_TOKEN_NAME) }})
        // .then(function (response) {
        //     if(response.status !== 200){
        //       redirectToLogin()
        //     }
        //     redirectToCreateClaimCar();
        // })
        // .catch(function (error) {
        //   redirectToLogin()
        // });
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
    }
    return(
        <div className="mt-2">
            Test
        </div>
    )
}

export default withRouter(Home);