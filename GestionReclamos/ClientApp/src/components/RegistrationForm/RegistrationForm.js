import React, { useState } from 'react';
import axios from 'axios';
import './RegistrationForm.css';
import { withRouter } from "react-router-dom";

function RegistrationForm(props) {
    const [state, setState] = useState({
        name: "",
        surname: "",
        mail: "",
        birthday: "",
        phone: "",
        username: "",
        password: "",
        confirmPassword: "",
        successMessage: null,
    })
    const handleChange = (e) => {
        const { id, value } = e.target
        setState(prevState => ({
            ...prevState,
            [id]: value
        }))
    }
    const sendDetailsToServer = () => {
        if (state.name.length && state.surname.length && state.mail.length && state.birthday.length && state.phone.length && state.username.length && state.password.length && state.confirmPassword.length) {
            props.showError(null);
            const payload = {
                "name": state.name,
                "surname": state.surname,
                "mail": state.mail,
                "birthday": state.birthday,
                "phone": state.phone,
                "username": state.username,
                "password": state.password
            }
            axios.post('api/Account/Signup', payload)
                .then(function (response) {
                    if (response.status === 200) {
                        if (response.data.statusCode == 200) {
                            setState(prevState => ({
                                ...prevState,
                                'successMessage': 'Usuario creado correctamente...'
                            }));
                            window.alert(`El usuario con correo ${response.data.mail} fue creado!`)
                            redirectToLogin();
                        }
                        if (response.data.statusCode != 200)
                            props.showError(response.data.statusCode + " - " + response.data.description);
                    } else {
                        props.showError("Ocurrio un error en la comunicacion, intente nuevamente.");
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        } else {
            props.showError('Ingrese todos los datos solicitados.')
        }

    }
    const redirectToHome = () => {
        props.updateTitle('Gestion de Reclamos - Inicio')
        props.history.push('/home');
    }
    const redirectToLogin = () => {
        props.updateTitle('Gestion de Reclamos - Login')
        props.history.push('/login');
    }
    const handleSubmitClick = (e) => {
        e.preventDefault();
        if (state.password === state.confirmPassword) {
            sendDetailsToServer()
        } else {
            props.showError('Las contraseñas no coinciden');
        }
    }
    return (
        <div className="card col-12 col-lg-4 login-card mt-2 hv-center">
            <form>
                <div className="form-group text-left">
                    <label htmlFor="exampleInputUsername1">Usuario: </label>
                    <input type="text"
                        className="form-control"
                        id="username"
                        placeholder="Ingresa tu nuevo usuario"
                        value={state.username}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group text-left">
                    <label htmlFor="exampleInputEmail1">Correo: </label>
                    <input type="email"
                        className="form-control"
                        id="mail"
                        placeholder="micasilla@correo.com"
                        value={state.mail}
                        onChange={handleChange}
                    />
                </div>
                <div class="form-row">
                    <div class="col">
                        <div className="form-group text-left">
                            <label htmlFor="exampleInputName1">Nombre: </label>
                            <input type="text"
                                className="form-control"
                                id="name"
                                placeholder="Ingresa tu nombre"
                                value={state.name}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group text-left">
                            <label htmlFor="exampleInputEmail1">Fecha de nacimiento: </label>
                            <input type="text"
                                className="form-control"
                                id="birthday"
                                aria-describedby="emailHelp"
                                placeholder="YYYYMMDD"
                                value={state.birthday}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div class="col">
                        <div className="form-group text-left">
                            <label htmlFor="exampleInputEmail1">Apellido: </label>
                            <input type="text"
                                className="form-control"
                                id="surname"
                                placeholder="Ingresa tu apellido"
                                value={state.surname}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group text-left">
                            <label htmlFor="exampleInputEmail1">Telefono: </label>
                            <input type="text"
                                className="form-control"
                                id="phone"
                                aria-describedby="emailHelp"
                                placeholder="Ingresa tu telefono"
                                value={state.phone}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>
                <div className="form-group text-left">
                    <label htmlFor="exampleInputPassword1">Contraseña: </label>
                    <input type="password"
                        className="form-control"
                        id="password"
                        placeholder="Ingresa la contraseña"
                        value={state.password}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group text-left">
                    <label htmlFor="exampleInputPassword1">Confirmar Contraseña: </label>
                    <input type="password"
                        className="form-control"
                        id="confirmPassword"
                        placeholder="Confirme la contraseña"
                        value={state.confirmPassword}
                        onChange={handleChange}
                    />
                </div>
                <button
                    type="submit"
                    className="btn btn-primary"
                    onClick={handleSubmitClick}
                >
                    Registrarme
                </button>
            </form>
            <div className="alert alert-success mt-2" style={{ display: state.successMessage ? 'block' : 'none' }} role="alert">
                {state.successMessage}
            </div>
            <br />
            <div className="mt-2">
                <span>¿Ya tienes una cuenta? </span><br />
                <span className="loginText" onClick={() => redirectToLogin()}>Ingresa!</span>
            </div>

        </div>
    )
}

export default withRouter(RegistrationForm);