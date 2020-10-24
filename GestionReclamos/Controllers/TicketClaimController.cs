using GestionReclamos.Application.Common.Interfaces;
using GestionReclamos.Domain.Entities;
using GestionReclamos.Models;
using GestionReclamos.Models.Request;
using GestionReclamos.Models.Response;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace GestionReclamos.Controllers
{

    [ApiController]
    [Route("/api/Claim/Ticket")]
    public class TicketClaimController : ControllerBase
    {
        private readonly ILogger<TicketClaimController> _logger;
        private readonly IGestionReclamosDbContext _context;

        private readonly string ventas_url = "https://uade-integracion-de-aplicaciones.us-e2.cloudhub.io";
        private readonly string client_id = "396e7d8045b142e18fe0623550f52ca8";
        private readonly string client_secret = "872D4cE41D14414Fbb7f7D8816a66339";
        private readonly HttpClient httpClient = new HttpClient();

        public TicketClaimController(ILogger<TicketClaimController> logger, IGestionReclamosDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        [ProducesResponseType(typeof(ResponseClaimCreated), 200)]
        [ProducesResponseType(typeof(string), 401)]
        [HttpPost("New")]
        public async Task<IActionResult> NewClaim([FromBody] RequestTicketClaim reclamo) // Nuevo reclamo
        {
            try
            {               
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
                }
                else
                {
                    idCliente = usr.Id;
                }

                var dbSetTicketClaims = _context.Set<ReclamoPasaje>();
                var nuevoReclamo = new ReclamoPasaje
                {
                    FechaCreacion = DateTime.Now,
                    IdCliente = idCliente,
                    Descripcion = reclamo.Description,
                    Aerolinea = reclamo.Airline,
                    FechaVuelo = reclamo.FlightDate,                    
                    IdEstado = _context.Set<Estado>().Where(e => e.Descripcion == "Nuevo").FirstOrDefault().Id,
                    UltimaModificacion = DateTime.Now                    
                };

                dbSetTicketClaims.Add(nuevoReclamo);

                var cantRegistrosInsertados = await _context.SaveChangesAsync<ReclamoPasaje>();

                if (cantRegistrosInsertados.Equals(1))
                {

                    return Ok(new ResponseClaimCreated() { IdClaim = nuevoReclamo.Id, Message = "OK" });
                }

                return Ok(new ResponseClaimCreated() { Message = "ERROR" });

            }
            catch (Exception ex)
            {
                var t = ex;
                throw;
            }
        }

        [ProducesResponseType(typeof(ResponseClaimModify), 200)]
        [ProducesResponseType(typeof(string), 401)]
        [HttpPost("Modify")]
        public async Task<IActionResult> ModifyClaim([FromBody] RequestModifyTicketClaim reclamo) // Modificar reclamo
        {
            //verificar que exista el reclamo
            var dbSetTicketClaims = _context.Set<ReclamoPasaje>();
            var claim = await dbSetTicketClaims.FindAsync(reclamo.Id);
            //modificar reclamo
            if (claim != null)
            {
                var usuario = await _context.Set<Usuario>().Where(u => u.Correo == reclamo.Client).FirstOrDefaultAsync();
                if (usuario != null)
                {
                    claim.FechaVuelo = reclamo.FlightDate;
                    claim.IdCliente = usuario.Id;
                    claim.Aerolinea = reclamo.Airline;
                    claim.Descripcion = reclamo.Description;
                    claim.IdEstado = _context.Set<Estado>().Where(e => e.Descripcion == reclamo.State).FirstOrDefault().Id;
                    claim.UltimaModificacion = DateTime.Now;

                    dbSetTicketClaims.Update(claim);

                    var cantRegistrosInsertados = await _context.SaveChangesAsync<ReclamoPasaje>();

                    if (cantRegistrosInsertados.Equals(1))
                    {

                        return Ok(new ResponseClaimModify() { IdClaim = reclamo.Id, Message = "OK" });
                    }
                }
                //crear el usuarios y dsp agregar
                else 
                {
                    var nuevoUsr = new Usuario { Correo = reclamo.Client };
                    _context.Set<Usuario>().Add(nuevoUsr);
                    await _context.SaveChangesAsync<Usuario>();
                    var idCliente = nuevoUsr.Id;


                    claim.FechaVuelo = reclamo.FlightDate;
                    claim.IdCliente = idCliente;
                    claim.Aerolinea = reclamo.Airline;
                    claim.Descripcion = reclamo.Description;
                    claim.IdEstado = _context.Set<Estado>().Where(e => e.Descripcion == reclamo.State).FirstOrDefault().Id;
                    claim.UltimaModificacion = DateTime.Now;

                    dbSetTicketClaims.Update(claim);

                    var cantRegistrosInsertados = await _context.SaveChangesAsync<ReclamoPasaje>();

                    if (cantRegistrosInsertados.Equals(1))
                    {

                        return Ok(new ResponseClaimModify() { IdClaim = reclamo.Id, Message = "OK" });
                    }

                }
            }

            return Ok(new ResponseClaimModify() { Message = "ERROR" });
        }

        [ProducesResponseType(typeof(ResponseClaimCreated), 200)]
        [ProducesResponseType(typeof(ResponseClaimCreated), 400)]
        [ProducesResponseType(typeof(string), 401)]
        [ProducesResponseType(typeof(ResponseClaimCreated), 500)]
        [HttpPost("Create")]
        public async Task<IActionResult> CreateClaim([FromBody] RequestTicketClaimCreate claim, [FromHeader] string Authorization) // Crear reclamo - EXTERNO
        {
            try
            {
                if (claim.Ticket != 0 && !String.IsNullOrEmpty(claim.Client))
                {
                    // TODO: Verificar si existe el reclamo
                    var ticket = _context.Set<ReclamoPasaje>().Where(u => u.Ticket == claim.Ticket).FirstOrDefault();
                    if(ticket == null)
                    {
                        //Si no existe lo obtengo
                        httpClient.DefaultRequestHeaders.Add("Authorization", Authorization);
                        httpClient.DefaultRequestHeaders.Add("client_id", client_id);
                        httpClient.DefaultRequestHeaders.Add("client_secret", client_secret);
                        var dataTicket = await httpClient.GetAsync(ventas_url + $"/api/verTickets/{claim.Ticket}");

                        if ((int)dataTicket.StatusCode == 200)
                        {
                            var flight = JsonConvert.DeserializeObject<Flight>(await dataTicket.Content.ReadAsStringAsync());

                            //verificar que exista el cliente
                            var usr = _context.Set<Usuario>().Where(u => u.Correo == claim.Client).FirstOrDefault();
                            int clientId = 0;
                            //si no existe, crearlo
                            if (usr == null)
                            {
                                var newUser = new Usuario { Correo = claim.Client };
                                _context.Set<Usuario>().Add(newUser);
                                await _context.SaveChangesAsync<Usuario>();
                                clientId = newUser.Id;
                            }
                            else
                            {
                                clientId = usr.Id;
                            }

                            var dbSetTicketClaims = _context.Set<ReclamoPasaje>();
                            var nuevoReclamo = new ReclamoPasaje
                            {
                                FechaCreacion = DateTime.Now,
                                Ticket = flight.Ticket,
                                IdCliente = clientId,
                                Descripcion = claim.Description,
                                Aerolinea = flight.Airline,
                                FechaVuelo = flight.FlightDate,
                                IdEstado = _context.Set<Estado>().Where(e => e.Descripcion == "Nuevo").FirstOrDefault().Id,
                                UltimaModificacion = DateTime.Now
                            };

                            dbSetTicketClaims.Add(nuevoReclamo);

                            var cantRegistrosInsertados = await _context.SaveChangesAsync<ReclamoPasaje>();

                            if (cantRegistrosInsertados.Equals(1)) // Se pudo insertar el registro
                            {

                                return Ok(new ResponseClaimCreated() { IdClaim = nuevoReclamo.Id, Message = $"Se creo correctamente el reclamo para el ticket {flight.Ticket}" });
                            }

                            // No se pudo insertar el registro
                            return StatusCode(500, new ResponseClaimCreated() { Message = $"No se pudo crear correctamente el reclamo para el ticket {flight.Ticket}." });

                        }
                        else if ((int)dataTicket.StatusCode == 401) // 401 sistema de ventas
                        {
                            return BadRequest(new ResponseClaimCreated() { Message = $"El sistema de ventas respondio 401 para el ticket {claim.Ticket}." });
                        }
                        else // 500 sistema de ventas
                        {
                            return StatusCode(500, new ResponseClaimCreated() { Message = $"Ocurrio un error en el sistema de ventas al tratar de obtener el ticket {claim.Ticket}." });
                        }
                    }
                    else // Ya existe el reclamo
                    {
                        return BadRequest(new ResponseClaimCreated() { Message = $"El reclamo para el ticket {claim.Ticket} ya existe." });
                    }
                }
                else // Ticket con cero / Correo vacio o null
                {
                    return BadRequest(new ResponseClaimCreated() { Message = "El correo no puede ser vacio o null. El numero de ticket del reclamo no puede ser cero." });
                }
            }
            catch(Exception ex)
            {
                var t = ex;
                return StatusCode(500, new ResponseClaimCreated() { Message = "Ocurrio un error general." });
            }
        }

        [ProducesResponseType(typeof(ResponseTicketClaimAll), 200)]
        [ProducesResponseType(typeof(string), 401)]
        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAllClaims() // Obtener reclamos
        {
            var TicketClaims = await _context.Set<ReclamoPasaje>()
              .Join(
                    _context.Set<Estado>(),
                    reclamoPasaje => reclamoPasaje.IdEstado,
                    estado => estado.Id,
                    (reclamoPasaje, estado) => new ReclamoPasajeVM
                    {
                        Estado = estado.Descripcion,
                        Id = reclamoPasaje.Id,
                        FechaCreacion = reclamoPasaje.FechaCreacion,
                        IdCliente = reclamoPasaje.IdCliente,
                        Descripcion = reclamoPasaje.Descripcion,
                        Aerolinea = reclamoPasaje.Aerolinea,
                        FechaVuelo = reclamoPasaje.FechaVuelo,
                        IdEstado = reclamoPasaje.IdEstado,
                        UltimaModificacion = reclamoPasaje.UltimaModificacion
                    }
                )
               .Join
                (
                    _context.Set<Usuario>(),
                    reclamoPasaje => reclamoPasaje.IdCliente,
                    usuario => usuario.Id,
                    (reclamoPasaje, usuario) => new ReclamoPasajeVM
                    {
                        Cliente = usuario.Correo,
                        Estado = reclamoPasaje.Estado,
                        Id = reclamoPasaje.Id,
                        FechaCreacion = reclamoPasaje.FechaCreacion,
                        IdCliente = reclamoPasaje.IdCliente,
                        Descripcion = reclamoPasaje.Descripcion,
                        Aerolinea = reclamoPasaje.Aerolinea,
                        FechaVuelo = reclamoPasaje.FechaVuelo,
                        IdEstado = reclamoPasaje.IdEstado,
                        UltimaModificacion = reclamoPasaje.UltimaModificacion
                    }
                ).ToListAsync();

            return Ok(new ResponseTicketClaimAll() { TicketClaims = TicketClaims });
        }

        [ProducesResponseType(typeof(ResponseTicketClaimAll), 200)]
        [ProducesResponseType(typeof(string), 401)]
        [HttpGet("Get/{id}")]
        public async Task<IActionResult> GetClaim(int id) // Obtener reclamo - INTERNO/EXTERNO
        {
            try
            {
                var claim = await _context.Set<ReclamoPasaje>().FindAsync(id);
                var res = new ResponseTicketClaimAll();
                if (claim != null)
                {
                    res.TicketClaims.Add(new ReclamoPasajeVM()
                    {
                        //TODO corregir
                        Estado = claim.IdEstado.ToString()
                    });
                }
                return Ok(res);
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
}
