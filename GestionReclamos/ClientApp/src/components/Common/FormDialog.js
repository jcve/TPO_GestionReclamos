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

export default function FormDialog(props) {
  const [open, setOpen] = useState(false);
  const [estados, setEstados] = useState([]);
  const [estado, setEstado] = useState('');

  const [id, setId] = useState('')
  const [client, setClient] = useState('')
  const [description, setDescription] = useState('')
  
  const [plate,setPlate] = useState('')
  const [model,setModel] = useState('')
  const [brand,setBrand] = useState('')
  const [airport,setAirport] = useState('')


  const handleClickOpen = () => {   
    if(estados != undefined){
        setEstados(props.estados)
        setEstado(props.claim.estado)
        
        setId(props.claim.id)
        setClient(props.claim.cliente)
        setDescription(props.claim.descripcion)
        setPlate(props.claim.patente)
        setModel(props.claim.modelo)
        setBrand(props.claim.marca)
        setAirport(props.claim.aeropuerto)
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

    props.apicallstate(id,client,description,plate,model,brand,airport,nuevoEstado)

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
                <InputLabel>Estado</InputLabel>
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
                    disabled={true}
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
                  id="plate"
                  label="Patente"
                  type="text"
                  fullWidth
                 value={plate}
                 disabled={true}
                  onChange={(e)=> setPlate(e.target.value)}
                />
                 <TextField
                  autoFocus
                  margin="dense"
                  id="model"
                  label="Modelo"
                  type="text"
                  fullWidth
                  value={model}
                  onChange={(e)=> setModel(e.target.value)}
                />
                 <TextField
                  autoFocus
                  margin="dense"
                  id="brand"
                  label="Marca"
                  type="text"
                  fullWidth
                  value={brand}
                  onChange={(e)=> setBrand(e.target.value)}
                />
                 <TextField
                  autoFocus
                  margin="dense"
                  id="airport"
                  label="Aeropuerto"
                  type="text"
                  fullWidth
                  value={airport}
                  disabled={true}
                  onChange={(e)=> setAirport(e.target.value)}
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
