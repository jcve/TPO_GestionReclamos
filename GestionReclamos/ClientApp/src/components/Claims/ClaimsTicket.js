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

import FormDialogCreateClaimTicket from "../Common/FormDialogCreateClaimTicket";

import Alert from '@material-ui/lab/Alert';
import Collapse from '@material-ui/core/Collapse';
import FormDialogTicket from '../Common/FormDialogTicket';

import LinearProgress from '@material-ui/core/LinearProgress';

function ClaimsTicket(props) {
    const [state, setState] = useState({
        claims: [],
        estados: []
    })

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const [severityAlert, setSeverityAlert] = useState('');
    const [messageAlert, setMessageAlert] = useState('');

    const [Airline, setAirline] = useState('');
    const [FlightDate, setFlightDate] = useState('');

    const useStyles = makeStyles({
        table: {
            minWidth: 650,
        },

    });

    const classes = useStyles();

    useEffect(() => {
        GetStates()
        GetClaimsTicket()
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

    function redirectToCreateClaimTicket() {
        props.history.push('/claims/ticket/create');
        props.updateTitle('Gestion de Reclamos - Crear Reclamo Ticket')
    }

    const GetClaimsTicket = () => {
        axios.get('/api/Claim/Ticket/GetAll', { headers: { 'Authorization': localStorage.getItem(ACCESS_TOKEN_NAME) } })
            .then(function (response) {
                if (response.status == 200) {
                    // console.log(response.data)
                    if (response.data.ticketClaims.length > 0) {
                        setState((prevState => ({
                            ...prevState,
                            claims: response.data.ticketClaims
                        })))
                        // window.alert(`Reclamo creado con el identificador ${response.data.idClaim}`);
                    }
                    if (response.data.ticketClaims.length == 0)
                        props.showError("No existen reclamos de pasajes");
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
                <TableCell>{row.value.ticket}</TableCell>
                <TableCell>{row.value.fechaCreacion}</TableCell>
                <TableCell>{row.value.cliente}</TableCell>
                <TableCell>{row.value.descripcion}</TableCell>
                <TableCell>{row.value.fechaVuelo}</TableCell>
                <TableCell>{row.value.aerolinea}</TableCell>
                <TableCell>{row.value.ultimaModificacion}</TableCell>
                <TableCell>{row.value.estado}</TableCell>
                <TableCell>
                    <FormDialogTicket claim={row.value} 
                                estados={state.estados} 
                                title={`Reclamo con identificador: ${row.value.id}`} 
                                buttontext='Modificar' 
                                content='Modifique los campos necesarios' 
                                apicallstate={(id,client,description,flightDate,airline,nuevoEstado)=>{
                                    APICallState(id,client,description,flightDate,airline,nuevoEstado)
                                }}
                                />
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
            setLoading(false)
            return (
                <TableBody>
                    {listclaims}
                </TableBody>
            );
        }
        else {
            setLoading(false)
            return (
                <TableBody>
                    {}
                </TableBody>
            );
        }
    }

    const APICall = (client,description,ticketId) => {    
        // const fecha = new Date(flightDate + " " + time);
        const payload = {
            "client": client,
            "description": description,
            "ticket": ticketId
        }
        console.log(payload);
        axios.post('/api/Claim/Ticket/New', payload, { headers: { 'Authorization': localStorage.getItem(ACCESS_TOKEN_NAME) } })
            .then(function (response) {
                if (response.status == 200 && response.data.idclaim !== "" && response.data.idclaim != undefined ) {
                    setOpen(true)
                    setSeverityAlert('success')
                    setMessageAlert(`Reclamo creado con el identificador ${response.data.idclaim}`)   
                    
                    refreshPage()                   
                }               
                else {
                    setOpen(true)
                    setSeverityAlert('warning')
                    setMessageAlert(`${response.data.message}`)
                }
            })
            .catch(function (error) {
                setOpen(true)
                setSeverityAlert('error')
                setMessageAlert(`Ocurrio un error general. ${error}`)
            });
    }

    const APICallState = (id,client,description,flightDate,airline,nuevoEstado) => {
        const payload = {
            "Id": id,
            "Client":client,
            "Description":description,
            "FlightDate":flightDate,
            "Airline":airline,
            "State": nuevoEstado
        }
    
        axios.post('/api/Claim/Ticket/Modify', payload, { headers: { 'Authorization': localStorage.getItem(ACCESS_TOKEN_NAME) } })
            .then(function (response) {
                if (response.status == 200) {
                    console.log(response.data)
                    if (response.data.message == "OK") {
                        setOpen(true)
                        setSeverityAlert('success')
                        setMessageAlert(`El reclamo con identificador: ${response.data.idClaim} fue modificado correctamente!`)

                        refreshPage()
                    }
                    if (response.data.message != "OK"){
                        setOpen(true)
                        setSeverityAlert('error')
                        setMessageAlert("Ocurrio un error general.")
                    }
                } else {
                    setOpen(true)
                    setSeverityAlert('warning')
                    setMessageAlert("Ocurrio un error en la comunicacion, intente nuevamente.")
                }
            })
            .catch(function (error) {
                setOpen(true)
                setSeverityAlert('error')
                setMessageAlert(`Ocurrio un error general. ${error}`)
                // console.log(error);
            });
    }


    const APICallGetTicket = (ticketId) =>{

        const payload = {
            "ticket": ticketId
        }
        console.log(payload)
        axios.post('/api/Claim/Ticket/GetTicket', payload, { headers: { 'Authorization': localStorage.getItem(ACCESS_TOKEN_NAME) } })
            .then(function (response) {
                console.log(response)

                
                setAirline(response.data.aerolinea)
                setFlightDate(response.data.fechaVuelo)

                if (response.status != 200) {
                    setOpen(true)
                    setSeverityAlert('warning')
                    setMessageAlert(`${response.data.message}`)
                }
            })
            .catch(function (error) {
                setOpen(true)
                setSeverityAlert('error')
                setMessageAlert(`Ocurrio un error general. ${error}`)
            });

    }

    function refreshPage() {
        window.location.reload(false);
    }

    return (
        <div>
            <br />
            <Collapse in={open}>
                <Alert severity={severityAlert}
                       onClose={() => {setOpen(false)}}>
                    {messageAlert}                
                </Alert>
            </Collapse>

            <FormDialogCreateClaimTicket 
                type="submit"
                className="btn btn-primary float-right"
                title={`Crear un nuevo reclamo de Pasaje`} 
                buttontext='Crear Reclamo Pasaje' 
                content='Cargue los siguientes datos'
                apicall = {(client,description,ticketId) => {
                    APICall(client,description,ticketId);
                }}
                apicallgetticket = {(ticketId) => {
                    if(ticketId!==0){
                        console.log('claimticket' + ticketId)
                        APICallGetTicket(ticketId);
                    }
                }}
                airline = {Airline}
                flightDate = {FlightDate}
            />
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
                onClick={GetClaimsTicket}>
                Recargar esta Lista
                </button>
            <br />
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="right">ID</TableCell>
                            <TableCell align="right">Ticket ID</TableCell>
                            <TableCell align="right">Fecha Creación</TableCell>
                            <TableCell align="right">Correo asociado</TableCell>
                            <TableCell align="right">Descripción</TableCell>
                            <TableCell align="right">Fecha Vuelo</TableCell>
                            <TableCell align="right">Aerolinea</TableCell>
                            <TableCell align="right">Ultima modificación</TableCell>
                            <TableCell align="right">Estado</TableCell>
                            <TableCell align="right">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <ClaimList />
                </Table>
            </TableContainer>

            {loading
                ? <LinearProgress color="secondary" />
                :  <br />
            }
            <br /> 

        </div>



    )
}

export default withRouter(ClaimsTicket)