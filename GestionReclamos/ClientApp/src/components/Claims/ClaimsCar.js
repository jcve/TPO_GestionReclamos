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
import FormDialogCreateClaimCar from "../Common/FormDialogCreateClaimCar";


import Alert from '@material-ui/lab/Alert';
import Collapse from '@material-ui/core/Collapse';

import LinearProgress from '@material-ui/core/LinearProgress';

function ClaimsCar(props) {
    const [state, setState] = useState({
        claims: [],
        estados: []
    })
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const [severityAlert, setSeverityAlert] = useState('');
    const [messageAlert, setMessageAlert] = useState('');

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
                <TableCell>{new Date(row.value.ultimaModificacion).toUTCString()}</TableCell>
                <TableCell>{row.value.estado}</TableCell>
                <TableCell>
                    <FormDialog claim={row.value} 
                                estados={state.estados} 
                                title={`Reclamo con identificador: ${row.value.id}`} 
                                buttontext='Modificar' 
                                content='Modifique los campos necesarios' 
                                apicallstate={(id,client,description,plate,model,brand,airport,nuevoEstado)=>{
                                    APICallState(id,client,description,plate,model,brand,airport,nuevoEstado)
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

    const CreateClaimCarDialog = () => {
        console.log('entra')
        return (
            <FormDialog estados={state.estados}
                title={`Reclamo con identificador: asdfasdf`} 
                buttontext='Modificarasdf' content='Modifique asdfasdflos campos necesarios' />
        )
    }

    const APICall = (client,description,plate,model,brand,airport) => {    
        const payload = {
          "client": client,
          "description": description,
          "plate": plate,
          "model": model,
          "brand": brand,
          "airport": airport
        }
  
        axios.post('/api/Claim/Car/New', payload, { headers: { 'Authorization': localStorage.getItem(ACCESS_TOKEN_NAME) } })
          .then(function (response) {
              if (response.status == 200) {
                  console.log(response.data)
                  if (response.data.message == "OK") {
                      setOpen(true)
                      setSeverityAlert('success')
                      setMessageAlert(`Reclamo creado con el identificador ${response.data.idClaim}`)
                      //window.alert(`Reclamo creado con el identificador ${response.data.idClaim}`);
                      refreshPage()                      
                  }
                  if (response.data.message != "OK"){   
                    setOpen(true)
                    setSeverityAlert('error')
                    setMessageAlert("Ocurrio un error general.")               
                    // window.alert("Ocurrio un error general.");
                  }
              } else {     
                setOpen(true)
                setSeverityAlert('warning')
                setMessageAlert("Ocurrio un error en la comunicacion, intente nuevamente.")               
                //   window.alert("Ocurrio un error en la comunicacion, intente nuevamente.");
              }
          })
          .catch(function (error) {
            setOpen(true)
            setSeverityAlert('error')
            setMessageAlert(`Ocurrio un error general. ${error}`)
          });
    }

    const APICallState = (id,client,description,plate,model,brand,airport,nuevoEstado) => {
        const payload = {
            "Id": id,
            "Client":client,
            "Description":description,
            "Plate":plate,
            "Model":model,
            "Brand":brand,
            "Airport":airport,
            "State": nuevoEstado
        }
    
        axios.post('/api/Claim/Car/Modify', payload, { headers: { 'Authorization': localStorage.getItem(ACCESS_TOKEN_NAME) } })
            .then(function (response) {
                if (response.status == 200) {
                    console.log(response.data)
                    if (response.data.message == "OK") {
                        setOpen(true)
                        setSeverityAlert('success')
                        setMessageAlert(`El reclamo con identificador: ${response.data.idClaim} fue modificado correctamente!`)
                        // window.alert(`El reclamo con identificador: ${response.data.idClaim} fue modificado correctamente!`);
                        refreshPage()
                    }
                    if (response.data.message != "OK"){
                        setOpen(true)
                        setSeverityAlert('error')
                        setMessageAlert("Ocurrio un error general.")
                        // props.showError("Ocurrio un error general.");
                    }
                } else {
                    setOpen(true)
                    setSeverityAlert('warning')
                    setMessageAlert("Ocurrio un error en la comunicacion, intente nuevamente.")
                    // props.showError("Ocurrio un error en la comunicacion, intente nuevamente.");
                }
            })
            .catch(function (error) {
                console.log(error);
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

            <FormDialogCreateClaimCar 
                type="submit"
                className="btn btn-primary float-right"
                title={`Crear un nuevo reclamo de auto`} 
                buttontext='Crear Reclamo Auto' 
                content='Cargue los siguientes datos'
                apicall = {(client,description,plate,model,brand,airport) => {
                    APICall(client,description,plate,model,brand,airport);
                }}
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

            {loading
                ? <LinearProgress color="secondary" />
                :  <br />
            }

            <br />                        
        </div>



    )
}

export default withRouter(ClaimsCar)