using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GestionReclamos.Controllers
{
    [ApiController]
    [Route("Reclamos/Autos")]
    public class ReclamosAutosController : ControllerBase
    {
        public ReclamosAutosController()
        {

        }

        [HttpPost("Nuevo")]
        public async Task<IActionResult> NuevoReclamo([FromBody] string temp) // Nuevo reclamo
        {
            return null;
        }

        [HttpPost("Modificar")]
        public async Task<IActionResult> ModificarReclamo([FromBody] string temp) // Modificar reclamo
        {
            return null;
        }

        [HttpPost("Crear")]
        public async Task<IActionResult> CrearReclamo([FromBody] string temp) // Crear reclamo - EXTERNO
        {
            return null;
        }

        [HttpGet("Obtener")]
        public async Task<IActionResult> ObtenerReclamos([FromBody] string temp) // Obtener reclamos
        {
            return null;
        }

        [HttpGet("Obtener/{id}")]
        public async Task<IActionResult> ObtenerReclamo() // Obtener reclamo - INTERNO/EXTERNO
        {
            return null;
        }
    }
}
