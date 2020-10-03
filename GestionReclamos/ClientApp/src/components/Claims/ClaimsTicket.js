﻿import React, { useState, useEffect } from 'react';
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

import FormDialog from "../Common/FormDialogTicket";

function ClaimsTicket(props) {
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
                <TableCell>{row.value.fechaCreacion}</TableCell>
                <TableCell>{row.value.Cliente}</TableCell>
                <TableCell>{row.value.descripcion}</TableCell>
                <TableCell>{row.value.fechaVuelo}</TableCell>
                <TableCell>{row.value.aerolinea}</TableCell>
                <TableCell>{row.value.ultimaModificacion}</TableCell>
                <TableCell>{row.value.estado}</TableCell>
                <TableCell>
                    <FormDialog claim={row.value} estados={state.estados} title ='Modificar estado' buttontext='Modificar' content ='A que estado desea cambiar el reclamo?'/>
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
                    { }
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
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="right">id</TableCell>
                            <TableCell align="right">fechaCreacion</TableCell>
                            <TableCell align="right">Cliente</TableCell>
                            <TableCell align="right">descripcion</TableCell>
                            <TableCell align="right">fechaVuelo</TableCell>
                            <TableCell align="right">aerolinea</TableCell>
                            <TableCell align="right">ultimaModificacion</TableCell>
                            <TableCell align="right">Estado</TableCell>
                            <TableCell align="right">acciones posibles</TableCell>
                        </TableRow>
                    </TableHead>
                    <ClaimList />
                </Table>
            </TableContainer>            
        </div>



    )
}

export default withRouter(ClaimsTicket)