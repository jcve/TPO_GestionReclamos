using GestionReclamos.Application.Common.Interfaces;
using GestionReclamos.Domain.Entities;
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
    [Route("api/State")]
    public class StateController : ControllerBase
    {
        private readonly ILogger<StateController> _logger;
        private readonly IGestionReclamosDbContext _context;

        public StateController(ILogger<StateController> logger, IGestionReclamosDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAllClaims() // Obtener reclamos
        {
            //var CarClaims =
            var StatesVM = await _context.Set<Estado>().Select(e=> e.Descripcion).ToListAsync();

            return Ok(StatesVM);
        }


    }
}
