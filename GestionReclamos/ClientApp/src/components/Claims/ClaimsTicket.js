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
import Controls from "../controls/Controls";
import useTable from "../Claims/UseTable";


const cabeceras = [
    { id: 'id', label: 'Reclamo', width: '80px' },
    { id: 'ticket', label: 'Ticket', width: '80px' },
    { id: 'fechaCreacion', label: 'Fecha Creación', width: '180px' , disableSorting: 'true' },
    { id: 'correo', label: 'Correo Asociado', width: '180px' , disableSorting: 'true' },
    { id: 'descripcion', label: 'Descripción', width: '180px' , disableSorting: 'true' },
    { id: 'fechaVuel', label: 'Fecha Vuelo', width: '180px' , disableSorting: 'true' },
    { id: 'aerolinea', label: 'Aerolínea', width: '100px' } ,
    { id: 'ultimaModificacion', label: 'Última Modificación', width: '150px', disableSorting: 'true' },
    { id: 'estado', label: 'Estado', width: '80px' } ,
    { id: 'acciones', label: 'Acciones', disableSorting: 'true', width: '130px' } ,

]


function ClaimsTicket(props) {
    const [state, setState] = useState({
        claims: [],
        estados: []
    })


    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(5);

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [severityAlert, setSeverityAlert] = useState('');
    const [messageAlert, setMessageAlert] = useState('');

    const [Airline, setAirline] = useState('');
    const [FlightDate, setFlightDate] = useState('');

    const [filterFunct, setFilterFunct] = useState({ fn: items => { return items; } })

    const {
        TblContainer,
        TblHeader,
        TblPagination,
        reclamosFiltrados,
    } = useTable(state.claims, cabeceras, filterFunct);

/*    const useStyles = makeStyles({
        table: {
            minWidth: 650,
        },

    });*/
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
            borderRadius: '25px',
            border: '2px outset lightGray',
            fontSize: 'x-small',
            width: 'inherit',
            margin: '3px auto',
            padding:'3px',

        },
        buscadores: {
            border:'7px',
        }
    }));
    /*const classes = useStyles();*/
    const classesOne = useStylesOne();

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
        let options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };

        return (
            <TableRow key={row.value.id}>
                <TableCell style={{ fontWeight: 'bold' }} >{row.value.id}</TableCell>
                <TableCell style={{ fontWeight: 'bold' }} >{row.value.ticket}</TableCell>
                <TableCell>{new Date(row.value.fechaCreacion).toLocaleDateString('es-AR', options)}</TableCell>
                <TableCell>{row.value.cliente}</TableCell>
                <TableCell>{row.value.descripcion}</TableCell>
                <TableCell>{new Date(row.value.fechaVuelo).toLocaleDateString('es-AR', options)}</TableCell>
                <TableCell>{row.value.aerolinea}</TableCell>
                <TableCell>{new Date(row.value.ultimaModificacion).toLocaleDateString('es-AR', options)}</TableCell>
                <TableCell style={{ fontWeight: 'bold' }} >{row.value.estado}</TableCell>
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
                if (response.status == 200 && response.data.idClaim !== "" && response.data.idClaim != undefined && response.data.idClaim != 0) {
                    setOpen(true)
                    setSeverityAlert('success')
                    setMessageAlert(`Reclamo creado con el identificador ${response.data.idClaim}`)   
                    
                    refreshPage()                   
                }               
                else {
                    setOpen(true)
                    setSeverityAlert('warning')
                    setMessageAlert(`${response.data.message}`)

                    setAirline('')
                    setFlightDate('')
                }
            })
            .catch(function (error) {
                setOpen(true)
                setSeverityAlert('error')
                setMessageAlert(`Ocurrio un error general. ${error}`)

                setAirline('')
                setFlightDate('')
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
                        setMessageAlert(`Ocurrio un error. ${response.data.message}`)
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

    const handleSearch = e => {
        let target = e.target;
        setFilterFunct({
            fn: items => {
                if (target.value == "")
                    return items;
                else
                    return items.filter(x => x.cliente.toLowerCase().includes(target.value))
            }
        })
    }
    const handleSearchID = e => {
        let target = e.target;
        setFilterFunct({
            fn: items => {
                if (target.value == "") return items;
                else
                    return items.filter(y => (y.id.toString().includes(target.value.toString()) || y.ticket.toString().includes(target.value.toString())))
            }
        })
    }


    return (
        <div>
            <Collapse in={open}>
                <Alert severity={severityAlert}
                    onClose={() => { setOpen(false) }}>
                    {messageAlert}
                </Alert>
            </Collapse>



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

                    onClick={GetClaimsTicket}>
                    Recargar esta Lista
                        </button>

                <br></br>
                <br></br>
                <div>

                <FormDialogCreateClaimTicket
                        type="submit"
                        className="btn btn-primary float-right"
                        title={`Crear un nuevo reclamo de Pasaje`}
                        buttontext='Crear Reclamo Pasaje'
                        content='Cargue los siguientes datos'
                        apicall={(client, description, ticketId) => {
                            APICall(client, description, ticketId);
                        }}
                        apicallgetticket={(ticketId) => {
                            if (ticketId !== 0) {
                                console.log('claimticket' + ticketId)
                                APICallGetTicket(ticketId);
                            }
                        }}
                        callCancelar={() => {
                            setAirline('')
                            setFlightDate('')
                        }}

                        airline={Airline}
                        flightDate={FlightDate}
                    />
                </div>
               
            </div>
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

            {/*          <TableContainer component={Paper} >
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">ID</TableCell>
                            <TableCell align="center">Ticket</TableCell>
                            <TableCell align="center">Fecha Creación</TableCell>
                            <TableCell align="left">Correo asociado</TableCell>
                            <TableCell align="left">Descripción</TableCell>
                            <TableCell align="center">Fecha Vuelo</TableCell>
                            <TableCell align="center">Aerolinea</TableCell>
                            <TableCell align="center">Ultima modificación</TableCell>
                            <TableCell align="left">Estado</TableCell>
                            <TableCell align="center">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <ClaimList />
                </Table>
            </TableContainer>*/}
            <div></div>
            <div >
                
                <TblContainer  >
 
                    <TblHeader />
                    <TableBody>
                        {
                            reclamosFiltrados().map(item =>
                                (
                                    <TableRow key={item.id}>
                                        <TableCell style={{ width: '80px', fontWeight: 'bold' }}>{item.id}</TableCell>
                                        <TableCell style={{ width: '80px', fontWeight: 'bold'  }}>{item.ticket}</TableCell>
                                        <TableCell style={{ width: '180px' }}>{item.fechaCreacion}</TableCell>
                                        <TableCell style={{width: '180px' }}>{item.cliente}</TableCell>
                                        <TableCell style={{ width: '180px' }}>{item.descripcion}</TableCell>
                                        <TableCell style={{ width: '180px' }}>{item.fechaVuelo}</TableCell>
                                        <TableCell style={{ width: '100px' }}>{item.aerolinea}</TableCell>
                                        <TableCell style={{ width: '150px' }}>{item.ultimaModificacion}</TableCell>
                                         <TableCell style={{ width: '80px', fontWeight: 'bold'  }}>{item.estado}</TableCell>
                                        <TableCell style={{ width: '130px' }}>
                                            <FormDialogTicket claim={item}
                                                estados={state.estados}
                                                title={`Reclamo con identificador: ${item.id}`}
                                                buttontext='Modificar'
                                                content='Modifique los campos necesarios'
                                                apicallstate={(id, client, description, flightDate, airline, nuevoEstado) => {
                                                    APICallState(id, client, description, flightDate, airline, nuevoEstado)
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
                ? <LinearProgress color="primary" />
                :  <br />
            }
            <br /> 

        </div>



    )
}

export default withRouter(ClaimsTicket)