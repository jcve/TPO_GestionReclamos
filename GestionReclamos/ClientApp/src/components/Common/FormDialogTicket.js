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
import InputLabel from '@material-ui/core/InputLabel';

export default function FormDialogTicket(props) {
  console.log(`adentro del fromdialog -------- ${props.title}`)
  const [open, setOpen] = useState(false);
  const [estados, setEstados] = useState([]);
  const [estado, setEstado] = useState('');
  const [id, setId] = useState('')
  const [client, setClient] = useState('')
  const [description, setDescription] = useState('')
  const [flightDate, setFlightDate] = useState('')
  const [airline, setAirline] = useState('')

  const handleClickOpen = () => {   
    if(estados != undefined){
        setEstados(props.estados)
        setEstado(props.claim.estado)
        setId(props.claim.id)
        setClient(props.claim.cliente)
        setDescription(props.claim.descripcion)
        setFlightDate(props.claim.fechaCreacion)
        setAirline(props.claim.aerolinea)
    }    
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {        

  }, [estados])


  const changeState = (nuevoEstado) => {
    // console.log(`algo2 -------- ${event}`)
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
                  window.alert(`El reclamo con identificador: ${response.data.idClaim} fue modificado correctamente!`);
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

    handleClose()
  }

  const handleChange = (event) => {
    // console.log(`algo -------- ${event}`)
    setEstado(event.target.value);
  };

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
            <FormControl style={{width:'400px'}}>
                <InputLabel>Estado posibles</InputLabel>
                  <Select
                  labelId="demo-mutiple-name-label"
                  id="demo-mutiple-name"
                  value= {estado}
                  onChange={handleChange}                
                  >
                  {estados.map((estado) => (
                      <MenuItem key={estado} value={estado}>
                      {estado}
                      </MenuItem>
                  ))}
                  </Select>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="client"
                    label="Correo"
                    type="email"
                    fullWidth
                    value={client}
                    onChange={(e)=> setClient(e.target.value)}
                  />
                  <TextField
                    autoFocus
                    margin="dense"
                    id="description"
                    label="Descripcion"
                    type="text"
                    fullWidth
                    value={description}
                    onChange={(e)=> setDescription(e.target.value)}
                  />
                  <TextField
                    autoFocus
                    margin="dense"
                    id="airline"
                    label="Aerolinea"
                    type="text"
                    fullWidth
                    value={airline}
                    onChange={(e)=> setAirline(e.target.value)}
                  />

                <TextField
                    id="datetime-local"
                    label="Fecha vuelo"
                    type="datetime-local"
                    defaultValue={flightDate}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={(e)=> setFlightDate(e.target.value)}
                  />
            </FormControl>            
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={() => changeState(estado)} color="primary">
            Modificar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
