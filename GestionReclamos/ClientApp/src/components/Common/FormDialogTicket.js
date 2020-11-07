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
    props.apicallstate(id,client,description,flightDate,airline,nuevoEstado)
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
                    disabled={true}
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
                    disabled={true}
                    type="text"
                    fullWidth
                    value={airline}
                    onChange={(e)=> setAirline(e.target.value)}
                  />

                <TextField
                    id="datetime-local"
                    label="Fecha vuelo"
                    disabled={true}
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
