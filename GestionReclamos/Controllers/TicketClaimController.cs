using GestionReclamos.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GestionReclamos.Controllers
{

    [ApiController]
    [Route("Claim/Ticket")]
    public class TicketClaimController : ControllerBase
    {
        public TicketClaimController()
        {

        }

        [HttpPost("New")]
        public async Task<IActionResult> NewClaim([FromBody] RequestTicketClaim reclamo) // Nuevo reclamo
        {
            return null;
        }

        [HttpPost("Modify")]
        public async Task<IActionResult> ModifyClaim([FromBody] string temp) // Modificar reclamo
        {
            return null;
        }

        [HttpPost("Create")]
        public async Task<IActionResult> CreateClaim([FromBody] RequestTicketClaim reclamo) // Crear reclamo - EXTERNO
        {
            return null;
        }

        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAllClaims([FromBody] string temp) // Obtener reclamos
        {
            return null;
        }

        [HttpGet("Get/{id}")]
        public async Task<IActionResult> GetClaim() // Obtener reclamo - INTERNO/EXTERNO
        {
            return null;
        }
    }
}
