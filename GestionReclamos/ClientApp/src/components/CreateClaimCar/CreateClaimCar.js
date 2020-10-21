import React, { useState, useEffect } from 'react';
import './CreateClaimCar.css';
import { withRouter } from "react-router-dom";
import axios from 'axios';
import { ACCESS_TOKEN_NAME } from '../../constants/apiContants';

function CreateClaimCar(props) {
    const [state, setState] = useState({
        client: '',
        description: '',
        plate: '',
        model: '',
        brand: '',
        airport: ''
    })

    const handleChange = (e) => {
        const { id, value } = e.target
        setState(prevState => ({
            ...prevState,
            [id]: value
        }))
    }

    const redirectToHome = () => {
        props.updateTitle('Gestion de Reclamos - Reclamos de Autos')
        props.history.push('/claims/car');
    }

    const CreateClaim_Car = () => {
        if (state.client.length && state.plate.length && state.plate.length && state.model.length && state.brand.length && state.airport.length) {
            props.showError(null);
            const payload = {
                "client": state.client,
                "description": state.description,
                "plate": state.plate,
                "model": state.model,
                "brand": state.brand,
                "airport": state.airport
            }

            axios.post('/api/Claim/Car/New', payload, { headers: { 'Authorization': localStorage.getItem(ACCESS_TOKEN_NAME) } })
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
        CreateClaim_Car()
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
                        value={state.Client}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group text-left">
                    <label htmlFor="exampleInputPlate">Patente: </label>
                    <input type="text"
                        className="form-control"
                        id="plate"
                        placeholder="AA2020BB"
                        value={state.plate}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group text-left">
                    <label htmlFor="exampleInputModel">Modelo del auto: </label>
                    <input type="text"
                        className="form-control"
                        id="model"
                        placeholder="Hilux"
                        value={state.model}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group text-left">
                    <label htmlFor="exampleInputBrand">Marca del auto: </label>
                    <input type="text"
                        className="form-control"
                        id="brand"
                        placeholder="Toyota"
                        value={state.brand}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group text-left">
                    <label htmlFor="exampleInputAirport">Aeropuerto asociado: </label>
                    <input type="text"
                        className="form-control"
                        id="airport"
                        placeholder="Aeropuerto Ezeiza"
                        value={state.airport}
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
                        Regresar
                </button>
                </div>
                <br />
            </form>
        </div>
    )
}

export default withRouter(CreateClaimCar)