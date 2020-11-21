using GestionReclamos.Application.Common.Interfaces;
using GestionReclamos.Domain.Entities;
using GestionReclamos.Models;
using GestionReclamos.Models.Response;
using GestionReclamos.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

namespace GestionReclamos.Controllers
{
    [ApiController]
    [Route("api/Claim/Car")]
    public class CarClaimController : ControllerBase
    {
        private readonly ILogger<CarClaimController> _logger;
        private readonly IGestionReclamosDbContext _context;
        private readonly string itinerarios_url = "http://itinerarios-back.herokuapp.com";
        private readonly HttpClient httpClient = new HttpClient();

        public CarClaimController(ILogger<CarClaimController> logger, IGestionReclamosDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        [ProducesResponseType(typeof(ResponseClaimCreated), 200)]
        [ProducesResponseType(typeof(string), 401)]
        [HttpPost("New")]
        public async Task<IActionResult> NewClaim([FromBody] RequestCarClaim reclamo) // Nuevo reclamo
        {
            try
            {
                if (String.IsNullOrEmpty(reclamo.Client) || String.IsNullOrEmpty(reclamo.Client) || String.IsNullOrEmpty(reclamo.Plate)
                || String.IsNullOrEmpty(reclamo.Airport))
                {
                    return Ok(new ResponseClaimModify() { Message = "No pueden existir campos obligatorios como vacios o null." });
                }

                //verificar que exista el cliente
                var usr = _context.Set<Usuario>().Where(u => u.Correo == reclamo.Client).FirstOrDefault();
                int idCliente = 0;

                //si no existe, crearlo
                if (usr == null)
                {
                    var nuevoUsr = new Usuario { Correo = reclamo.Client };
                    _context.Set<Usuario>().Add(nuevoUsr);
                    await _context.SaveChangesAsync<Usuario>();
                    idCliente = nuevoUsr.Id;
                    //idCliente = _context.Set<Usuario>().Where(u => u.Correo == reclamo.Client).FirstOrDefault().Id;
                }
                else 
                {
                    idCliente = usr.Id;
                }

                var dbSetCarClaims = _context.Set<ReclamoAuto>();
                var nuevoReclamo = new ReclamoAuto
                {
                    FechaCreacion = DateTime.Now,
                    IdCliente = idCliente,
                    Descripcion = reclamo.Description,
                    Patente = reclamo.Plate,
                    Modelo = reclamo.Model,
                    Marca = reclamo.Brand,
                    Aeropuerto = reclamo.Airport,
                    IdEstado = _context.Set<Estado>().Where(e => e.Descripcion == "Nuevo").FirstOrDefault().Id,
                    UltimaModificacion = DateTime.Now
                };

                dbSetCarClaims.Add(nuevoReclamo);
            
                var cantRegistrosInsertados = await _context.SaveChangesAsync<ReclamoAuto>();

                if (cantRegistrosInsertados.Equals(1)) 
                {
                    await MailService.EnviarMail("Gestión de Reclamos - Creamos tu reclamo", reclamo.Client, $"Un operador creo un reclamo asociado a tu correo.<br> - N° Reclamo: {nuevoReclamo.Id}<br>- Descripción: {nuevoReclamo.Descripcion}<br>- Patente: {nuevoReclamo.Patente}<br>- Aeropuerto: {nuevoReclamo.Aeropuerto}<br>Ante cualquier consulta comunicate con nuestro centro de operadores las 24Hs los 365 días.<br>Atención al cliente (Callcenter): 0800-555-3569");
                    return Ok(new ResponseClaimCreated() { IdClaim = nuevoReclamo.Id, Message = "OK" });
                }

                return Ok(new ResponseClaimCreated() { Message = "ERROR" });

            }
            catch (Exception ex )
            {
                var t = ex;
                throw;
            }
        }

        [ProducesResponseType(typeof(string), 200)]
        [ProducesResponseType(typeof(string), 401)]
        [HttpGet("Airports")]
        public async Task<IActionResult> GetAllAirports()
        {
            try
            {
                var response = await httpClient.GetAsync(itinerarios_url + "/itinerarios/aeropuertos");

                if ((int)response.StatusCode == 200) {

                    var airports = JsonConvert.DeserializeObject<List<Airports>>(await response.Content.ReadAsStringAsync());

                    if(airports != null)
                    {
                        return Ok(airports.Select(c => c.Nombre).ToList());
                    }
                }

                return null;
            }

            catch (Exception e)
            {
                return null;
            }
        }

        [ProducesResponseType(typeof(ResponseClaimModify), 200)]
        [ProducesResponseType(typeof(string), 401)]
        [HttpPost("Modify")]
        public async Task<IActionResult> ModifyClaim([FromBody] RequestModifyCarClaim reclamo) // Modificar reclamo
        {
            if(String.IsNullOrEmpty(reclamo.Client) || String.IsNullOrEmpty(reclamo.Client) || String.IsNullOrEmpty(reclamo.Plate)
               ||  String.IsNullOrEmpty(reclamo.Airport))
            {
                return Ok(new ResponseClaimModify() { Message = "No pueden existir campos obligatorios como vacios o null." });
            }

            //verificar que exista el reclamo
            var dbSetCarClaims = _context.Set<ReclamoAuto>();
            var claim = await dbSetCarClaims.FindAsync(reclamo.Id);
            //modificar reclamo
            if (claim != null)
            {

                var usuario = await _context.Set<Usuario>().Where(u => u.Correo == reclamo.Client).FirstOrDefaultAsync();
                if (usuario != null)
                {
                    int idestadoAnterior = _context.Set<ReclamoAuto>().Where(e => e.Id == reclamo.Id).FirstOrDefault().IdEstado;
                    int estadoAnterior = _context.Set<Estado>().Where(e => e.Id == idestadoAnterior).FirstOrDefault().Id;
                    int estadoNuevo = _context.Set<Estado>().Where(e => e.Descripcion == reclamo.State).FirstOrDefault().Id;
                    if (estadoNuevo >= estadoAnterior)
                    {
                        claim.Descripcion = reclamo.Description;
                        claim.Patente = reclamo.Plate;
                        claim.Modelo = reclamo.Model;
                        claim.Marca = reclamo.Brand;
                        claim.Aeropuerto = reclamo.Airport;
                        claim.IdEstado = _context.Set<Estado>().Where(e => e.Descripcion == reclamo.State).FirstOrDefault().Id;
                        claim.UltimaModificacion = DateTime.Now;

                        dbSetCarClaims.Update(claim);

                        var cantRegistrosInsertados = await _context.SaveChangesAsync<ReclamoAuto>();

                        if (cantRegistrosInsertados.Equals(1))
                        {
                            string estadoNuevoDescripcion = _context.Set<Estado>().Where(e => e.Descripcion == reclamo.State).FirstOrDefault().Descripcion;

                            if (estadoNuevoDescripcion == "Cerrado")
                            {
                                await MailService.EnviarMail("Gestión de Reclamos - Tu reclamo fue cerrado", reclamo.Client, $"El reclamo asociado a tu correo fue cerrado!<br>- N° Reclamo: {claim.Id}<br> - Descripción: {claim.Descripcion}<br>- Patente: {claim.Patente}<br>- Aeropuerto: {claim.Aeropuerto}<br>Ante cualquier consulta comunicate con nuestro centro de operadores las 24Hs los 365 días.<br>Atención al cliente (Callcenter): 0800-555-3569");
                            }
                            else if (estadoNuevoDescripcion == "Resuelto")
                            {
                                await MailService.EnviarMail("Gestión de Reclamos - Tu reclamo fue resuelto", reclamo.Client, $"El reclamo asociado a tu correo fue resuelto!<br>- N° Reclamo: {claim.Id}<br> - Descripción: {claim.Descripcion}<br>- Patente: {claim.Patente}<br>- Aeropuerto: {claim.Aeropuerto}<br>Ante cualquier consulta comunicate con nuestro centro de operadores las 24Hs los 365 días.<br>Atención al cliente (Callcenter): 0800-555-3569");
                            }

                            return Ok(new ResponseClaimModify() { IdClaim = reclamo.Id, Message = "OK" });
                        }
                    }
                    else
                    {
                        return Ok(new ResponseClaimModify() { Message = "No se puede cambiar a un estado inferior." });
                    }
                }
                return Ok(new ResponseClaimModify() { Message = "ERROR" });
            }
            return Ok(new ResponseClaimModify() { Message = "ERROR" });
        }

        [ProducesResponseType(typeof(ResponseCarClaimAll), 200)]
        [ProducesResponseType(typeof(string), 401)]
        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAllClaims() // Obtener reclamos
        {
            //var CarClaims =
            var CarClaimsVM = await _context.Set<ReclamoAuto>()
                .Join(
                    _context.Set<Estado>(),
                    reclamoAuto => reclamoAuto.IdEstado,
                    estado => estado.Id,
                    (reclamoAuto, estado) => new ReclamoAutoVM
                    {                        
                        Estado = estado.Descripcion,
                        Id = reclamoAuto.Id,
                        FechaCreacion = reclamoAuto.FechaCreacion,
                        IdCliente = reclamoAuto.IdCliente,
                        Descripcion = reclamoAuto.Descripcion,
                        Patente = reclamoAuto.Patente,
                        Modelo = reclamoAuto.Modelo,
                        Marca = reclamoAuto.Marca,
                        Aeropuerto = reclamoAuto.Aeropuerto,
                        IdEstado = reclamoAuto.IdEstado,
                        UltimaModificacion = reclamoAuto.UltimaModificacion
                    }
                )
                .Join
                (
                    _context.Set<Usuario>(),
                    reclamoAuto => reclamoAuto.IdCliente,
                    usuario => usuario.Id,
                    (reclamoAuto, usuario) => new ReclamoAutoVM
                    {
                        Cliente = usuario.Correo,
                        Estado = reclamoAuto.Estado,
                        Id = reclamoAuto.Id,
                        FechaCreacion = reclamoAuto.FechaCreacion,
                        IdCliente = reclamoAuto.IdCliente,
                        Descripcion = reclamoAuto.Descripcion,
                        Patente = reclamoAuto.Patente,
                        Modelo = reclamoAuto.Modelo,
                        Marca = reclamoAuto.Marca,
                        Aeropuerto = reclamoAuto.Aeropuerto,
                        IdEstado = reclamoAuto.IdEstado,
                        UltimaModificacion = reclamoAuto.UltimaModificacion


                    }
                )
                
                .ToListAsync();

            CarClaimsVM = (from c in CarClaimsVM
                           select c).OrderBy(c => c.IdEstado).ToList();

            return Ok(new ResponseCarClaimAll() { CarClaims = CarClaimsVM });
        }

        //[ProducesResponseType(typeof(ResponseCarClaimAll), 200)]
        //[ProducesResponseType(typeof(string), 401)]
        //[HttpGet("Get/{id}")]
        //public async Task<IActionResult> GetClaim(int id) // Obtener reclamo
        //{
        //    try
        //    {
        //        var claim = await _context.Set<ReclamoAuto>().FindAsync(id);
        //        var res = new ResponseCarClaimAll();
        //        if (claim != null)
        //        {
        //            res.CarClaims.Add(new ReclamoAutoVM()
        //            {
        //                //TODO corregir
        //                Estado = claim.IdEstado.ToString()
        //            });
        //        }
        //        return Ok(res);
        //    }
        //    catch (Exception ex)
        //    {
        //        throw;
        //    }
        //}
    }
}
