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


export default function FormDialogCreateClaimCar(props) {
  const [open, setOpen] = useState(false);

  const [client,setClient] = useState('');
  const [description,setDescription] = useState('');
  const [plate,setPlate] = useState('');
  const [model,setModel] = useState('');
  const [brand,setBrand] = useState('');
  const [airport,setAirport] = useState('');

  const [errorInputClient,setErrorInputClient] = useState(false);
  const [errorInputDescription,setErrorInputDescription] = useState(false);
  const [errorInputPlate,setErrorInputPlate] = useState(false);
  const [errorInputModel,setErrorInputModel] = useState(false);
  const [errorInputBrand,setErrorInputBrand] = useState(false);
  const [errorInputAirport,setErrorInputAirport] = useState(false);


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
    console.log(props.aeropuertos[0])
    setAirport(props.aeropuertos[0])
    console.log('no se')
  }, [props.aeropuertos])

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

    if(plate == "" || plate == undefined){
      setErrorInputPlate(true);
      otraarr.push(false)
    }
    else{
      setErrorInputPlate(false);
      otraarr.push(true)
    }

    if(model == "" || model == undefined){
      setErrorInputModel(true);
      otraarr.push(false)
    }
    else{
      setErrorInputModel(false);
      otraarr.push(true)
    }

    if(brand == "" || brand == undefined){
      setErrorInputBrand(true);
      otraarr.push(false)
    }
    else{
      setErrorInputBrand(false);
      otraarr.push(true)
    }

    if(airport == "" || airport == undefined){
      setErrorInputAirport(true);
      otraarr.push(false)
    }
    else{
      setErrorInputAirport(false);
      otraarr.push(true)
    }

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
        props.apicall(client,description,plate,model,brand,airport)
        
        //limpiar los datos
        limpiarCampos()       

        //cerrar el dialogo
        handleClose()
      }
      else{
        console.log('no estan todos los datos')
      }
  }

  const limpiarCampos = () =>{
    setClient('')
    setDescription('')
    setPlate('')
    setModel('')
    setBrand('')
    //setAirport('')

    setErrorInputClient(false);
    setErrorInputDescription(false);
    setErrorInputPlate(false);
    setErrorInputModel(false);
    setErrorInputBrand(false);
    setErrorInputAirport(false);

  }

  const handleChange = (event) => {
    // console.log(`algo -------- ${event}`)
    // setEstado(event.target.value);
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
            <FormControl style={{width:'500px'}}>                             
              <TextField
                autoFocus
                margin="dense"
                id="client"
                label="Correo asociado al reclamo"
                placeholder="c@algo.com"
                type="email"
                required={true}
                error={errorInputClient}
                fullWidth
                value={client}
                onChange={(e)=> setClient(e.target.value)}
              />
              <TextField
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
              <TextField
                margin="dense"
                id="plate"
                label="Patente"
                placeholder="AA2020BB"
                required={true}
                error={errorInputPlate}
                type="text"
                fullWidth
                value={plate}
                onChange={(e)=> setPlate(e.target.value)}
              />
              <TextField
                margin="dense"
                id="model"
                label="Modelo del auto"
                placeholder="Hilux"
                required={true}
                error={errorInputModel}
                type="text"
                fullWidth
                value={model}
                onChange={(e)=> setModel(e.target.value)}
              />
              <TextField
                margin="dense"
                id="brand"
                label="Marca del auto"
                placeholder="Toyota"
                required={true}
                error={errorInputBrand}
                type="text"
                fullWidth
                value={brand}
                onChange={(e)=> setBrand(e.target.value)}
              />
                      <Select
                          style={{ margin: '20px 0px 0px 0px', padding:'0px' }}
                margin="dense"
                id="airport"
                label="Aeropuerto asociado"
                placeholder="Aeropuerto Ezeiza"
                required={true}
                error={errorInputAirport}
                type="text"
                fullWidth
                value={airport}
                onChange={(e)=> setAirport(e.target.value)}                
                >
                {props.aeropuertos.map((aeropuerto) => (
                    <MenuItem key={aeropuerto} value={aeropuerto}>
                    {aeropuerto}
                    </MenuItem>
                ))}
              </Select>                                       
            </FormControl>            
        </DialogContent>
        <DialogActions>
          <Button onClick={() =>{
            handleClose(); 
            limpiarCampos();
          }} color="primary">
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
