using GestionReclamos.Application.Common.Interfaces;
using GestionReclamos.Domain.Entities;
using GestionReclamos.Models;
using GestionReclamos.Models.Response;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GestionReclamos.Controllers
{

    [ApiController]
    [Route("/api/Claim/Ticket")]
    public class TicketClaimController : ControllerBase
    {
        private readonly ILogger<TicketClaimController> _logger;
        private readonly IGestionReclamosDbContext _context;
        public TicketClaimController(ILogger<TicketClaimController> logger, IGestionReclamosDbContext context)
        {
            _logger = logger;
            _context = context;
        }

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

        [HttpPost("Modify")]
        public async Task<IActionResult> ModifyClaim([FromBody] RequestModifyTicketClaim reclamo) // Modificar reclamo
        {
            //verificar que exista el reclamo
            var dbSetTicketClaims = _context.Set<ReclamoPasaje>();
            var claim = await dbSetTicketClaims.FindAsync(reclamo.Id);
            //modificar reclamo
            if (claim != null)
            {
                claim.FechaVuelo = reclamo.FlightDate;
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

            return Ok(new ResponseClaimModify() { Message = "ERROR" });
        }

        [HttpPost("Create")]
        public async Task<IActionResult> CreateClaim([FromBody] RequestTicketClaim reclamo) // Crear reclamo - EXTERNO
        {
            return null;
        }

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
