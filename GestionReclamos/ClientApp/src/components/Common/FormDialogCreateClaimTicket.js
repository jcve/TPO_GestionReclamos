import React, { useState, useEffect }  from 'react';
import axios from 'axios';
import { ACCESS_TOKEN_NAME } from '../../constants/apiContants';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';


export default function FormDialogCreateClaimTicket(props) {
  const [open, setOpen] = useState(false);

  const [client,setClient] = useState('');
  const [description,setDescription] = useState('');
  const [ticketId,setTicketId] = useState();
  const [flightDate,setFlightDate] = useState('');
  const [airline,setAirline] = useState('');
//   const [time,setTime] = useState('');

  const [errorInputClient,setErrorInputClient]  = useState(false);
  const [errorInputDescription,setErrorInputDescription]  = useState(false);
  const [errorInputTicketId,setErrorInputTicketId]  = useState(false);
//   const [errorInputFlightDate,setErrorInputFlightDate]  = useState(false);
//   const [errorInputTime,setErrorInputTime]  = useState(false);
//   const [errorInputAirline,setErrorInputAirline]  = useState(false);


  const handleClickOpen = () => {   
    // if(estados != undefined){
    //     setEstados(props.estados)
    //     setEstado(props.claim.estado)
    //     setId(props.claim.id)
    //     setClient(props.claim.cliente)
    //     setDescription(props.claim.descripcion)
    //     setFlightDate(props.claim.fechaCreacion)
    //     setAirline(props.claim.aerolinea)

    // }    
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {   
      setFlightDate(props.flightDate)
  }, [props.flightDate])

  useEffect(() => {        
    setAirline(props.airline)
  }, [props.airline])

  function cadaCampoTieneDatos(){
    // let arr = [client,description,plate,model,brand,airport]
    let otraarr = []

    if(client == "" || client == undefined){
      setErrorInputClient(true);
      otraarr.push(false)
    }
    else{
      setErrorInputClient(false);
      otraarr.push(true)
    }

    if(description == "" || description == undefined){
      setErrorInputDescription(true);
      otraarr.push(false)
    }
    else{
      setErrorInputDescription(false);
      otraarr.push(true)
    }

    if(ticketId == "" || ticketId == undefined){
        setErrorInputTicketId(true);
        otraarr.push(false)
      }
      else{
        setErrorInputTicketId(false);
        otraarr.push(true)
      }


    // if(flightDate == "" || flightDate == undefined){
    //   setErrorInputFlightDate(true);
    //   otraarr.push(false)
    // }
    // else{
    //   setErrorInputFlightDate(false);
    //   otraarr.push(true)
    // }

    // if(time == "" || time == undefined){
    //   setErrorInputTime(true);
    //   otraarr.push(false)
    // }
    // else{
    //   setErrorInputTime(false);
    //   otraarr.push(true)
    // }

    // if(airline == "" || airline == undefined){
    //   setErrorInputAirline(true);
    //   otraarr.push(false)
    // }
    // else{
    //     setErrorInputAirline(false);
    //   otraarr.push(true)
    // }    

    if(otraarr.includes(false)){
      return false;    
    }
    else{
      return true;
    }

  }

  const crearReclamo = () => {
      console.log(`algo2 -------- `)
      //validar los campos
      if(cadaCampoTieneDatos()){
        console.log('estan todos los datos')
        //llamar a crear reclamo
        props.apicall(client,description,ticketId)
        
        //limpiar los datos
        setClient('')
        setDescription('')
        setTicketId()
        // setFlightDate('')
        // setTime('')
        // setAirline('')

        //cerrar el dialogo
        handleClose()
      }
      else{
        console.log('no estan todos los datos')
      }
  }

  const handleChange = (event) => {
    // console.log(`algo -------- ${event}`)
    // setEstado(event.target.value);
  };

  const getDatosTicket = (event) => {
    if(ticketId > 0){
      console.log('form ... claimticket' + ticketId)
      console.log(event)
      props.apicallgetticket(ticketId)    
    }
  }



  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        {props.buttontext}
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{props.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {props.content}
          </DialogContentText>
            <FormControl style={{width:'500px'}}>
              
            <TextField
                autoFocus
                margin="dense"
                id="ticketId"
                label="Ticket Id"
                placeholder="10008"
                required={true}
                error={errorInputTicketId}
                type="number"
                fullWidth
                value={ticketId}
                onChange={(e)=> setTicketId(parseInt(e.target.value))}
              />
            <Button onClick={(e)=> getDatosTicket(e.target.value)} color="primary">
              Buscar Ticket
            </Button>
            
              <TextField
                autoFocus
                margin="dense"
                id="client"
                label="Correo asociado al reclamo"
                placeholder="correo@casilla.com"
                type="email"
                required={true}
                error={errorInputClient}
                fullWidth
                value={client}
                onChange={(e)=> setClient(e.target.value)}
              />
              <TextField
                autoFocus
                margin="dense"
                id="description"
                label="Descripcion del reclamo"
                placeholder="..."
                required={true}
                error={errorInputDescription}
                type="text"
                fullWidth
                value={description}
                onChange={(e)=> setDescription(e.target.value)}
              />


              {flightDate !==""
                ? <TextField
                    autoFocus
                    margin="dense"
                    id="flightDate"
                    label="Fecha de vuelo"
                    placeholder="dd/mm/aaaa"
                    disabled={true}
                    type="text"
                    fullWidth
                    value={flightDate}                
                  />
                : <div></div>
              }

              {airline !==""
                ? <TextField
                    autoFocus
                    margin="dense"
                    id="airline"
                    label="Aerolinea"
                    placeholder="Aerolineas Argentinas"
                    disabled={true}
                    type="text"
                    fullWidth
                    value={airline}
                    
                  />                
                : <div></div>
              }

            </FormControl>            
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={() => crearReclamo()} color="primary">
            Crear
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
