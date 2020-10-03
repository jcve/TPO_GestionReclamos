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

  const handleClickOpen = () => {   
    if(estados != undefined){
        setEstados(props.estados)
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
        "Id": props.claim.id,
        "Client":props.claim.cliente,
        "Description":props.claim.descripcion,
        "FlightDate":props.claim.fechaCreacion,
        "Airline":props.claim.aerolinea,
        "State": nuevoEstado
    }

    axios.post('/api/Claim/Ticket/Modify', payload, { headers: { 'Authorization': localStorage.getItem(ACCESS_TOKEN_NAME) } })
        .then(function (response) {
            if (response.status == 200) {
                console.log(response.data)
                if (response.data.message == "OK") {
                    window.alert(`Reclamo modificado ${response.data.idClaim}`);
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
            <FormControl style={{width:'200px'}}>
                <InputLabel>Estado posibles</InputLabel>
                <Select
                labelId="demo-mutiple-name-label"
                id="demo-mutiple-name"
                value= {props.estado}
                onChange={handleChange}                
                >
                {estados.map((estado) => (
                    <MenuItem key={estado} value={estado}>
                    {estado}
                    </MenuItem>
                ))}
                </Select>
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
