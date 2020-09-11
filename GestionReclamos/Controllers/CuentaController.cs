using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GestionReclamos.Controllers
{
    [ApiController]
    [Route("Cuenta")]
    public class CuentaController : ControllerBase
    {
        public CuentaController()
        {

        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] string temp) // Login
        {
            return null;
        }

        [HttpPost("Registrar")]
        public async Task<IActionResult> ModificarReclamo([FromBody] string temp) // Modificar reclamo
        {
            return null;
        }
    }
}
