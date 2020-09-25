using GestionReclamos.Models;
using GestionReclamos.Models.Response;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using JsonSerializer = System.Text.Json.JsonSerializer;

namespace GestionReclamos.Controllers
{
    [ApiController]
    [Route("api/Account")]
    public class CuentaController : ControllerBase
    {

        private readonly string auth = "https://ssoia.herokuapp.com/Login";
        private readonly string appKey = "EFC87CE73E81B2DAE0";
        private readonly HttpClient httpClient = new HttpClient();

        public CuentaController()
        {
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] RequestLogin login) // Login
        {
            try
            {
                var responseLogin = new ResponseLogin
                {
                    StatusCode = 500,
                    Description = "Ocurrio un error general",
                    Token = ""
                };

                var stringContent = new StringContent(JsonSerializer.Serialize(login), Encoding.UTF8, "application/json");
                httpClient.DefaultRequestHeaders.Add("x-api-key", appKey);
                var response = await httpClient.PostAsync(auth, stringContent);

                if (response.IsSuccessStatusCode)
                {
                    var jsonString = await response.Content.ReadAsStringAsync();
                    var token = JsonConvert.DeserializeObject<Token>(jsonString);

                    responseLogin.StatusCode = (int)response.StatusCode;
                    responseLogin.Description = "Login exitoso";
                    responseLogin.Token = token.token;

                    return Ok(responseLogin);
                }
                else
                {
                    return Ok(responseLogin);
                }
            }
            catch (Exception e)
            {
                // TODO: Logear
                return null;
            }
        }

        [HttpPost("Signup")]
        public async Task<IActionResult> Signup([FromBody] string temp) // Registrarse
        {
            return null;
        }
    }
}
