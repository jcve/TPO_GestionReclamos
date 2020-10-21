import React, { useState, useEffect } from 'react';
import { withRouter } from "react-router-dom";
import axios from 'axios';
import { ACCESS_TOKEN_NAME } from '../../constants/apiContants';


import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Button } from '@material-ui/core';

import FormDialog from "../Common/FormDialog";

function ClaimsCar(props) {
    const [state, setState] = useState({
        claims: [],
        estados: []
    })

    const useStyles = makeStyles({
        table: {
            minWidth: 650,
        },

    });

    const classes = useStyles();

    useEffect(() => {
        GetStates()
        GetClaimsCar()
    }, [])

    useEffect(() => {
        // console.log(`state.claims ${state.claims}`)
        console.log(`state.estados ${state.estados}`)
    }, [state.claims])

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

    const handleSubmitClick2 = (e) => {
        e.preventDefault();
        redirectToHome()
    }

    function redirectToCreateClaimCar() {
        props.history.push('/claims/car/create');
        props.updateTitle('Gestion de Reclamos - Crear Reclamo Auto')
    }

    const GetClaimsCar = () => {
        axios.get('/api/Claim/Car/GetAll', { headers: { 'Authorization': localStorage.getItem(ACCESS_TOKEN_NAME) } })
            .then(function (response) {
                if (response.status == 200) {
                    // console.log(response.data)
                    if (response.data.carClaims.length > 0) {
                        setState((prevState => ({
                            ...prevState,
                            claims: response.data.carClaims
                        })))
                        // window.alert(`Reclamo creado con el identificador ${response.data.idClaim}`);
                    }
                    if (response.data.carClaims.length == 0)
                        props.showError("No existen reclamos de autos");
                } else {
                    props.showError("Ocurrio un error en la comunicacion, intente nuevamente.");
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const GetStates = () => {
        axios.get('/api/State/GetAll', { headers: { 'Authorization': localStorage.getItem(ACCESS_TOKEN_NAME) } })
            .then(function (response) {
                if (response.status == 200) {
                    console.log(response.data)
                    if (response.data.length > 0) {
                        setState((prevState => ({
                            ...prevState,
                            estados: response.data
                        })))
                        // window.alert(`Reclamo creado con el identificador ${response.data.idClaim}`);
                    }
                    if (response.data.length == 0)
                        props.showError("No existen estados");
                } else {
                    props.showError("Ocurrio un error en la comunicacion, intente nuevamente.");
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }


    function ClaimItem(row) {
        return (
            <TableRow key={row.value.id}>
                <TableCell>{row.value.id}</TableCell>
                <TableCell>{row.value.aeropuerto}</TableCell>
                <TableCell>{row.value.descripcion}</TableCell>
                <TableCell>{row.value.fechaCreacion}</TableCell>
                <TableCell>{row.value.cliente}</TableCell>
                <TableCell>{row.value.marca}</TableCell>
                <TableCell>{row.value.modelo}</TableCell>
                <TableCell>{row.value.patente}</TableCell>
                <TableCell>{row.value.ultimaModificacion}</TableCell>
                <TableCell>{row.value.estado}</TableCell>
                <TableCell>
                    <FormDialog claim={row.value} estados={state.estados} title={`Reclamo con identificador: ${row.value.id}`} buttontext='Modificar' content='Modifique los campos necesarios' />
                    {/* <Button style={{backgroundColor: 'black', color: 'white'}} 
                        onClick={(e) => handleClick(e.target.value = row.value)}
                    >Eliminar</Button> */}
                </TableCell>
            </TableRow>
        )
    }

    function ClaimList() {
        const claims = state.claims;
        // console.log(`claims != undefined ${claims != undefined}`)
        if (claims != undefined) {
            const listclaims = claims.map((claim) =>
                <ClaimItem key={claim.id} value={claim} />
            );
            return (
                <TableBody>
                    {listclaims}
                </TableBody>
            );
        }
        else {
            return (
                <TableBody>
                    {}
                </TableBody>
            );
        }
    }


    // function ModifyClaimDialog(row){
    //     // console.log(`acaa  modify   ${row}`)
    //     return <FormDialog props={{title: row.estado}} />
    // }

    // const handleClick = (row) => {
    //     // console.log(`acaa  sdfkjsdkjfnsdf   ${row}`)
    //     return <FormDialog props={{title: row.estado}} />
    // }

    return (
        <div>
            <br />
            <button
                type="submit"
                className="btn btn-primary float-right"
                onClick={redirectToCreateClaimCar}
            >Crear Reclamo Auto</button>
            <br />
            <button
                type="submit"
                className="btn btn-info"
                onClick={handleSubmitClick2}>
                Regresar a Inicio
                </button>
            <button
                type="submit"
                className="btn btn-primary ml-1"
                onClick={GetClaimsCar}>
                Recargar esta Lista
                </button>
            <br />
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="right">ID</TableCell>
                            <TableCell align="right">Aeropuerto</TableCell>
                            <TableCell align="right">Descripción</TableCell>
                            <TableCell align="right">Fecha creación</TableCell>
                            <TableCell align="right">Correo asociado</TableCell>
                            <TableCell align="right">Marca</TableCell>
                            <TableCell align="right">Modelo</TableCell>
                            <TableCell align="right">Patente</TableCell>
                            <TableCell align="right">Ultima modificación</TableCell>
                            <TableCell align="right">Estado</TableCell>
                            <TableCell align="right">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <ClaimList />
                </Table>
            </TableContainer>
        </div>



    )
}

export default withRouter(ClaimsCar)