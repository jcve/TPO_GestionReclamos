import React, { useState, useEffect } from 'react';
import './CreateClaimTicket.css';
import { withRouter } from "react-router-dom";
import axios from 'axios';
import { ACCESS_TOKEN_NAME } from '../../constants/apiContants';

function CreateClaimTicket(props) {
    const [state, setState] = useState({
        client: '',
        description: '',
        flightDate: new Date(),
        airline: '',
        time: ''
    })

    const handleChange = (e) => {
        const { id, value } = e.target
        setState(prevState => ({
            ...prevState,
            [id]: value
        }))
    }

    const redirectToHome = () => {
        props.updateTitle('Gestion de Reclamos - Inicio')
        props.history.push('/home');
    }

    const CreateClaim_Ticket = () => {
        if (state.client.length && state.time.length && state.airline.length) {
            props.showError(null);
            const fecha = new Date(state.flightDate + " " + state.time);
            const payload = {
                "client": state.client,
                "description": state.description,
                "flightDate": fecha,
                "airline": state.airline
            }
            console.log(payload);
            axios.post('/api/Claim/Ticket/New', payload, { headers: { 'Authorization': localStorage.getItem(ACCESS_TOKEN_NAME) } })
                .then(function (response) {
                    if (response.status == 200) {
                        console.log(response.data)
                        if (response.data.message == "OK") {
                            window.alert(`Reclamo creado con el identificador ${response.data.idClaim}`);
                        }
                        if (response.data.message != "OK")
                            props.showError("Ocurrio un error general.");
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

    const handleSubmitClick = (e) => {
        e.preventDefault();
        CreateClaim_Ticket()
    }

    const handleSubmitClick2 = (e) => {
        e.preventDefault();
        redirectToHome()
    }

    return (
        <div className="card col-12 col-lg-4 login-card mt-2 hv-center">
            <form>
                <div className="form-group text-left">
                    <label htmlFor="exampleInputCorreo">Correo asociado al reclamo: </label>
                    <input type="text"
                        className="form-control"
                        id="client"
                        placeholder="correo@casilla.com"
                        value={state.client}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group text-left">
                    <label htmlFor="exampleInputDescription">Descripcion del reclamo: </label>
                    <input type="text"
                        className="form-control input-lg"
                        id="description"
                        placeholder="..."
                        value={state.description}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group text-left">
                    <label htmlFor="exampleInputFlightDate">Fecha de vuelo: </label>
                    <input type="date"
                        className="form-control"
                        id="flightDate"
                        placeholder=""
                        value={state.flightDate}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group text-left">
                    <label htmlFor="exampleInputTime">Horario de vuelo:</label>
                    <input type="time"
                        className="form-control"
                        id="time"
                        placeholder=""
                        value={state.time}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group text-left">
                    <label htmlFor="exampleInputAirline">Aerolinea: </label>
                    <input type="text"
                        className="form-control"
                        id="airline"
                        placeholder="Aerolineas Argentinas"
                        value={state.airline}
                        onChange={handleChange}
                    />
                </div>
                <br />
                <div>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        onClick={handleSubmitClick}>
                        Crear Reclamo
                </button>
                    <br /><br />
                    <button
                        type="submit"
                        className="btn btn-info"
                        onClick={handleSubmitClick2}>
                        Regresar a Inicio
                </button>
                </div>
                <br />
            </form>
        </div>
    )
}

export default withRouter(CreateClaimTicket)