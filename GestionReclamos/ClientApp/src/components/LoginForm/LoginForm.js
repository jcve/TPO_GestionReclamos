import React, { useState } from 'react';
import axios from 'axios';
import './LoginForm.css';
import { ACCESS_TOKEN_NAME } from '../../constants/apiContants';
import { withRouter } from "react-router-dom";

function LoginForm(props) {
    const [state, setState] = useState({
        username: "",
        password: "",
        successMessage: null
    })
    const handleChange = (e) => {
        const { id, value } = e.target
        setState(prevState => ({
            ...prevState,
            [id]: value
        }))
    }

    const handleSubmitClick = (e) => {
        e.preventDefault();
        const payload = {
            "username": state.username,
            "password": state.password,
        }
        axios.post('api/Account/Login', payload)
            .then(function (response) {
                if (response.status === 200) {
                    if (response.data.token != null) {
                        setState(prevState => ({
                            ...prevState,
                            'successMessage': 'Login exitoso. Redirigiendo al sistema..'
                        }));
                        localStorage.setItem(ACCESS_TOKEN_NAME, response.data.token);
                        redirectToHome();
                    }
                    if (response.data.token === "")
                        props.showError(response.data.statusCode + " - " + response.data.description);
                }
                else {
                    props.showError("Ocurrio un error en la comunicacion, intente nuevamente.");
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    const redirectToHome = () => {
        props.updateTitle('Gestion de Reclamos - Inicio')
        props.history.push('/home');
    }
    const redirectToRegister = () => {
        props.history.push('/register');
        props.updateTitle('Registro');
    }
    return (
        <div className="card col-12 col-lg-4 login-card mt-2 hv-center">
            <form>
                <div className="form-group text-left">
                    <label htmlFor="exampleInputEmail1">Usuario: </label>
                    <input type="text"
                        className="form-control"
                        id="username"
                        aria-describedby="emailHelp"
                        placeholder="Ingresar usuario"
                        value={state.username}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group text-left">
                    <label htmlFor="exampleInputPassword1">Contraseña: </label>
                    <input type="password"
                        className="form-control"
                        id="password"
                        placeholder="Ingresar contraseña"
                        value={state.password}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-check">
                </div>
                <small id="help" className="form-text text-muted">Nunca comparta sus datos con nadie.</small><br />
                <button
                    type="submit"
                    className="btn btn-primary"
                    onClick={handleSubmitClick}
                >Ingresar</button>
            </form>
            <div className="registerMessage">
                <span>¿No tiene una cuenta como operador? </span><br />
                <span className="loginText" onClick={() => redirectToRegister()}>Registrate aqui!</span>
            </div>
            {/* <div className="alert alert-success mt-2" style={{ display: state.successMessage ? 'block' : 'none' }} role="alert">
                {state.successMessage}
            </div> */}
        </div>
    )
}

export default withRouter(LoginForm);