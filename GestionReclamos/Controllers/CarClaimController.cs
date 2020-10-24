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

        [ProducesResponseType(typeof(ResponseClaimModify), 200)]
        [ProducesResponseType(typeof(string), 401)]
        [HttpPost("Modify")]
        public async Task<IActionResult> ModifyClaim([FromBody] RequestModifyCarClaim reclamo) // Modificar reclamo
        {
            //verificar que exista el reclamo
            var dbSetCarClaims = _context.Set<ReclamoAuto>();
            var claim = await dbSetCarClaims.FindAsync(reclamo.Id);
            //modificar reclamo
            if (claim != null) 
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

                    return Ok(new ResponseClaimModify() { IdClaim = reclamo.Id, Message = "OK" });
                }
            }

            return Ok(new ResponseClaimModify() { Message = "ERROR" });

        }

        //[HttpPost("Create")]
        //public async Task<IActionResult> CreateClaim([FromBody] RequestCarClaim reclamo) // Crear reclamo - EXTERNO
        //{
        //    return null;
        //}

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

            return Ok(new ResponseCarClaimAll() { CarClaims = CarClaimsVM });
        }

        [ProducesResponseType(typeof(ResponseCarClaimAll), 200)]
        [ProducesResponseType(typeof(string), 401)]
        [HttpGet("Get/{id}")]
        public async Task<IActionResult> GetClaim(int id) // Obtener reclamo - INTERNO/EXTERNO
        {
            try
            {
                var claim = await _context.Set<ReclamoAuto>().FindAsync(id);
                var res = new ResponseCarClaimAll();
                if (claim != null)
                {
                    res.CarClaims.Add(new ReclamoAutoVM()
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
