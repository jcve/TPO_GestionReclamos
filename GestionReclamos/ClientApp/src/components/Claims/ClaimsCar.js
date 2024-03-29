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

import FormDialog from "../Common/FormDialog";
import FormDialogCreateClaimCar from "../Common/FormDialogCreateClaimCar";


import Alert from '@material-ui/lab/Alert';
import Collapse from '@material-ui/core/Collapse';


import LinearProgress from '@material-ui/core/LinearProgress';
import Controls from "../controls/Controls";
import useTable from "../Claims/UseTable";

const cabeceras = [
    { id: 'id', label: 'Id', width: '50px' },
    { id: 'airport', label: 'Aeropuerto', width: '80px', disableSorting: 'true' },
    { id: 'description', label: 'Descripción', width: '100px', disableSorting: 'true' },
    { id: 'fechaModificacion', label: 'Modificación', width: '120px', disableSorting: 'true' },
    { id: 'client', label: 'Correo Asociado', width: '120px', disableSorting: 'true' },
    { id: 'brand', label: 'Marca', width: '60px', disableSorting: 'true' },
    { id: 'model', label: 'Modelo', width: '60px', disableSorting: 'true' },
    { id: 'plate', label: 'Patente', width: '60px', disableSorting: 'true'},
    { id: 'state', label: 'Estado', width: '80px', disableSorting: 'false' },
    { id: 'accion', label: 'Acciones', disableSorting: 'true', width: '100px' },

]

function ClaimsCar(props) {
    const [state, setState] = useState({
        claims: [],
        estados: [],
        aeropuertos:[],
        informacion:{}
    })

    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(5);

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [severityAlert, setSeverityAlert] = useState('');
    const [messageAlert, setMessageAlert] = useState('');

    const [filterFunct, setFilterFunct] = useState({ fn: items => { return items; } })

    const {
        TblContainer,
        TblHeader,
        TblPagination,
        reclamosFiltrados,
    } = useTable(state.claims, cabeceras, filterFunct);


    const useStyles = makeStyles({
  

    });
    const useStylesOne = makeStyles(theme => ({
        pageContent: {
            margin: theme.spacing(0),
            padding: theme.spacing(0)
        },
        searchInput: {
            width: '20%',
            float: 'left',
            left: '30px',
            position: 'absolut',
            margin: theme.spacing(1),
        },
        botones: {
            // borderRadius: '25px',
            // border: '2px outset lightGray',
            fontSize: 'x-small',
            width: 'inherit',
            margin: '3px auto',
            padding: '3px',

        },
        buscadores: {
            border: '7px',
        }
    }));
    const classes = useStyles();
    const classesOne = useStylesOne();
    useEffect(() => {
        GetStates()
        GetInfo()
        GetAirports()
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

    const GetAirports = () => {
        axios.get('/api/Claim/Car/Airports', { headers: { 'Authorization': localStorage.getItem(ACCESS_TOKEN_NAME) } })
            .then(function (response) {
                if (response.status == 200) {
                    console.log(response.data)
                    if (response.data.length > 0) {
                        setState((prevState => ({
                            ...prevState,
                            aeropuertos: response.data
                        })))
                        // window.alert(`Reclamo creado con el identificador ${response.data.idClaim}`);
                    }
                    if (response.data.length == 0)
                        props.showError("No existen aeropuertos");
                } else {
                    props.showError("Ocurrio un error en la comunicacion, intente nuevamente.");
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const GetInfo = () => {
        axios.get('/api/Claim/Car/Information', { headers: { 'Authorization': localStorage.getItem(ACCESS_TOKEN_NAME) } })
            .then(function (response) {
                if (response.status == 200) {
                    console.log(response.data)
                    if (!isEmpty(response.data)) {
                        setState((prevState => ({
                            ...prevState,
                            informacion: response.data
                        })))
                        // window.alert(`Reclamo creado con el identificador ${response.data.idClaim}`);
                    }
                    if (response.data.length == 0)
                        props.showError("No existen informacion");
                } else {
                    props.showError("Ocurrio un error en la comunicacion, intente nuevamente.");
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }


    function ClaimItem(row) {

        let options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'};
        return (
            <TableRow key={row.value.id}>
                <TableCell style={{ fontWeight:'bold' }} >{row.value.id}</TableCell>
                <TableCell>{row.value.aeropuerto}</TableCell>
                <TableCell>{row.value.descripcion}</TableCell>
                <TableCell>{new Date(row.value.fechaCreacion).toLocaleDateString('es-AR', options)}</TableCell>
                <TableCell style={{ minWidth: '120px'}}>{row.value.cliente}</TableCell>
                <TableCell>{row.value.marca}</TableCell>
                <TableCell>{row.value.modelo}</TableCell>
                <TableCell>{row.value.patente}</TableCell>
                <TableCell>{new Date(row.value.ultimaModificacion).toLocaleDateString('es-AR', options)}</TableCell>
                <TableCell style={{ fontWeight: 'bold' }} >{row.value.estado}</TableCell>
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

    /**Get current tickets */

    const indexOfLastPost = currentPage * postsPerPage;

    const indexOfFirstPost = indexOfLastPost - postsPerPage;

    /**Porcion a mostrar */

    const currentPosts = state.claims.slice(indexOfFirstPost, indexOfLastPost);



    const paginate = pagenumber => {

        setCurrentPage(pagenumber);

        //currentPosts = state.claims.slice(indexOfFirstPost,indexOfLastPost);
    };



    function Pagination() {

        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(state.claims.length / postsPerPage); i++) {

            pageNumbers.push(i);

        }

        return (
            <div style={{ float: "right" }}>
                <nav>
                    <ul className='pagination'>
                        {pageNumbers.map(number => (
                            <li key={number} className='page-item'>
                                <a onClick={() => paginate(number)} className='page-link'>
                                    {number}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        )
    };


    function ClaimList() {
        //const claims = state.claims;
        const claims = currentPosts;
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


    function isEmpty(obj) {
        for(var prop in obj) {
            if(obj.hasOwnProperty(prop))
                return false;
        }
    
        return true;
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
                        setMessageAlert(`Ocurrio un error.${response.data.message} `)
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
    const handleSearch = e => {
        let target = e.target;
        setFilterFunct({
            fn: items => {
                if (target.value == "")
                    return items;
                else
                    return items.filter(x => x.cliente.toLowerCase().includes((target.value).toLowerCase()))
            }
        })
    }
    const handleSearchID = e => {
        let target = e.target;
        setFilterFunct({
            fn: items => {
                if (target.value == "") return items;
                else
                    return items.filter(y => y.id.toString().includes(target.value.toString()))
            }
        })
    }

    return (
        <div>
            <Collapse in={open}>
                <Alert severity={severityAlert}
                       onClose={() => {setOpen(false)}}>
                    {messageAlert}                
                </Alert>
            </Collapse>

       
            <br></br>
            <div className={classesOne.botones}>
                <button

                    type="submit"
                    className="btn btn-info"
                    onClick={handleSubmitClick2}>
                    Regresar a Inicio
                            </button>
                <button

                    type="submit"
                    className="btn btn-primary ml-2"

                    onClick={GetClaimsCar}>
                    Recargar esta Lista
                        </button>

                <br></br>
                <br></br>
                <div>            

            <FormDialogCreateClaimCar 
                type="submit"
                className="btn btn-primary float-right"
                title={`Crear un nuevo reclamo de auto`} 
                buttontext='Crear Reclamo Auto' 
                content='Cargue los siguientes datos'
                apicall = {(client,description,plate,model,brand,airport) => {
                    APICall(client,description,plate,model,brand,airport);
                }}
                aeropuertos = {state.aeropuertos}

                />
                </div>
            </div>
            <br></br>
            <div className={classesOne.buscadores} >
                <toolbar>
                    <Controls.Input
                        label="Buscar Mail de Cliente"
                        className={classesOne.searchInput}
                        onChange={handleSearch}
                    />
                </toolbar>
                <toolbar>
                    <Controls.Input
                        label="Buscar por ID"
                        className={classesOne.searchInput}
                        onChange={handleSearchID}
                    />
                </toolbar>
                <TblPagination label="Cant.Reclamos" />
            </div>



            {/*
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">ID</TableCell>
                            <TableCell align="left">Aeropuerto</TableCell>
                            <TableCell align="left">Descripción</TableCell>
                            <TableCell align="left" style={{ minWidth: '120px' }}>Fecha creación</TableCell>
                            <TableCell align="left">Correo asociado</TableCell>
                            <TableCell align="left">Marca</TableCell>
                            <TableCell align="left">Modelo</TableCell>
                            <TableCell align="left">Patente</TableCell>
                            <TableCell align="center">Ultima modificación</TableCell>
                            <TableCell align="left">Estado</TableCell>
                            <TableCell align="center">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <ClaimList />
                </Table>
            </TableContainer>*/}
            <div >

                <TblContainer  >

                    <TblHeader />
                    <TableBody>
                        {
                            reclamosFiltrados().map(item =>
                                (
                                    <TableRow key={item.id}>
                                        <TableCell style={{ width: '50px', fontWeight:'bold' }}>{item.id}</TableCell>
                                        <TableCell style={{ width: '80px' }}>{item.aeropuerto}</TableCell>
                                        <TableCell style={{ width: '100px' }}>{item.descripcion}</TableCell>
                                        <TableCell style={{ width: '120px' }}>{item.ultimaModificacion}</TableCell>
                                        <TableCell style={{ width: '120px' }}>{item.cliente}</TableCell>
                                        <TableCell style={{ width: '60px' }}>{item.marca}</TableCell>
                                        <TableCell style={{ width: '60px' }}>{item.modelo}</TableCell>
                                        <TableCell style={{ width: '60px' }}>{item.patente}</TableCell>
                                        <TableCell style={{ width: '80px', fontWeight: 'bold' }}>{item.estado}</TableCell>
                                        <TableCell style={{ width: '100px' }}>
                                            <FormDialog claim={item}
                                                estados={state.estados}
                                                title={`Reclamo con identificador: ${item.id}`}
                                                buttontext='Modificar'
                                                content='Modifique los campos necesarios'
                                                apicallstate={(id, client, description, plate, model, brand, airport, nuevoEstado) => {
                                                    APICallState(id, client, description, plate, model, brand, airport, nuevoEstado)
                                                }}
                                            />
                                            {/* <Button style={{backgroundColor: 'black', color: 'white'}} 
                                        onClick={(e) => handleClick(e.target.value = row.value)}
                                    >Eliminar</Button> */}
                                        </TableCell>
                                    </TableRow>
                                )
                            )
                        }
                    </TableBody>
                </TblContainer>
               
            </div> 
            
            {loading
                ? <LinearProgress color="secondary" />
                :  <br />
            }

            <br />                        
        </div>



    )
}

export default withRouter(ClaimsCar)