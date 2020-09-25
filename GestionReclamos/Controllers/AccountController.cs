using GestionReclamos.Models;
using GestionReclamos.Models.Request;
using GestionReclamos.Models.Response;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using JsonSerializer = System.Text.Json.JsonSerializer;

namespace GestionReclamos.Controllers
{
    [ApiController]
    [Route("api/Account")]
    public class AccountController : ControllerBase
    {

        private readonly string sso = "https://ssoia.herokuapp.com";
        private readonly string appKey = "EFC87CE73E81B2DAE0";
        private readonly HttpClient httpClient = new HttpClient();

        public AccountController()
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

                var stringContent = new StringContent(JsonConvert.SerializeObject(login), Encoding.UTF8, "application/json");
                httpClient.DefaultRequestHeaders.Add("x-api-key", appKey);
                var response = await httpClient.PostAsync(sso+"/Login", stringContent);

                if (response.IsSuccessStatusCode)
                {
                    var jsonString = await response.Content.ReadAsStringAsync();
                    var token = JsonConvert.DeserializeObject<Token>(jsonString);

                    responseLogin.StatusCode = (int)response.StatusCode;
                    responseLogin.Description = "Login exitoso";
                    responseLogin.Token = token.token;
                }
                else if((int)response.StatusCode == 401)
                {
                    responseLogin.StatusCode = (int)response.StatusCode;
                    responseLogin.Description = "Usuario y/o contraseña incorrectos";
                }

                return Ok(responseLogin);
            }
            catch (Exception e)
            {
                // TODO: Logear
                return null;
            }
        }

        [HttpPost("Signup")]
        public async Task<IActionResult> Signup([FromBody] RequestNewUser newUser) // Registrarse
        {
            try
            {
                var responseNewLogin = new ResponseNewUser
                {
                    StatusCode = 500,
                    Description = "Ocurrio un error general",
                    Mail = "",
                    Identity = 0
                };

                var user = new User
                {
                    Name = newUser.Name,
                    Surname = newUser.Surname,
                    Mail = newUser.Mail,
                    Birthday = newUser.Birthday,
                    Phone = newUser.Phone,
                    Username = newUser.Username,
                    Password = newUser.Password,
                    Status = true,
                    AddDate = DateTime.Now.ToString("yyyyMMdd"),
                    DeleteDate = null,
                    Propieties = null
                };

                var stringContent = new StringContent(JsonConvert.SerializeObject(user), Encoding.UTF8, "application/json");
                httpClient.DefaultRequestHeaders.Add("x-api-key", appKey);
                var response = await httpClient.PostAsync(sso + "/Usuarios", stringContent);

                if (response.IsSuccessStatusCode)
                {
                    var jsonString = await response.Content.ReadAsStringAsync();
                    var userCreated = JsonConvert.DeserializeObject<User>(jsonString);

                    responseNewLogin.StatusCode = (int)response.StatusCode;
                    responseNewLogin.Description = "Usuario creado correctamente";
                    responseNewLogin.Mail = userCreated.Mail;
                    responseNewLogin.Identity = userCreated.Identity;

                    // TODO: Guardar usuario en nuestra base de datos
                }
                else if ((int)response.StatusCode == 500)
                {
                    var jsonString = await response.Content.ReadAsStringAsync();
                    var error = JsonConvert.DeserializeObject<ResponseNewUser>(jsonString);

                    responseNewLogin.StatusCode = (int)response.StatusCode;
                    responseNewLogin.Description = "SSO: " + error.Description;
                }
                else if ((int)response.StatusCode == 401)
                {
                    responseNewLogin.StatusCode = (int)response.StatusCode;
                    responseNewLogin.Description = "No esta autorizado para crear un usuario";
                }

                return Ok(responseNewLogin);
            }
            catch(Exception e)
            {
                // TODO: Logear
                return null;
            }
        }
    }
}
