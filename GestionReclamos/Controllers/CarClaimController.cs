using GestionReclamos.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GestionReclamos.Controllers
{
    [ApiController]
    [Route("Claim/Car")]
    public class CarClaimController : ControllerBase
    {
        public CarClaimController()
        {

        }

        [HttpPost("New")]
        public async Task<IActionResult> NewClaim([FromBody] RequestCarClaim reclamo) // Nuevo reclamo
        {
            return null;
        }

        [HttpPost("Modify")]
        public async Task<IActionResult> ModifyClaim([FromBody] string temp) // Modificar reclamo
        {
            return null;
        }

        [HttpPost("Create")]
        public async Task<IActionResult> CreateClaim([FromBody] RequestCarClaim reclamo) // Crear reclamo - EXTERNO
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
