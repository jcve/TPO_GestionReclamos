using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace GestionReclamos.Filters
{
    public class ValidateTokenFilter : IAsyncActionFilter
    {
        private readonly string publicKey = "50E25EC9B0517772A7EA5A4078A69E38AE0B48BDFFE1857D63933885829723C8";
        private readonly string issuer = "SSO";
        public ValidateTokenFilter()
        {
        }

        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var actionName =
                ((ControllerActionDescriptor) context.ActionDescriptor).ActionName;
            var controllerName = ((ControllerActionDescriptor) context.ActionDescriptor).ControllerName;

            if ((actionName == "Login" || actionName == "Signup") && controllerName == "Account") // Salteo este endpoint
            {
                await next();
                return;
            }

            if (context.HttpContext.Request.Headers.ContainsKey("Authorization") &&
                context.HttpContext.Request.Headers["Authorization"].FirstOrDefault()
                    .StartsWith("Bearer ", StringComparison.Ordinal))
            {
                var token = context.HttpContext.Request.Headers["Authorization"].FirstOrDefault()
                    .Substring("Bearer ".Length);

                if (await ValidarToken(token))
                {
                    await next();
                    return;
                }
            }

            context.HttpContext.Response.ContentType = "application/json";
            context.HttpContext.Response.StatusCode = (int) HttpStatusCode.Unauthorized;

            await context.HttpContext.Response.WriteAsync("Token no valido, no estas autorizado.");
        }

        private async Task<bool> ValidarToken(string token) {

            try
            {
                var validationParameters = new TokenValidationParameters
                {
                    // ISSUER
                    ValidateIssuer = true,
                    ValidIssuer = issuer,
                    // AUDENCIE 
                    ValidateAudience = false,
                    ValidAudience = "",
                    // EXP
                    ValidateLifetime = true,
                    RequireExpirationTime = true,
                    // SIGN
                    ValidateIssuerSigningKey = true,
                    RequireSignedTokens = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(publicKey))
                };

                var tokenHandler = new JwtSecurityTokenHandler();
                tokenHandler.ValidateToken(token, validationParameters, out SecurityToken validatedToken);

                return true;
            }
            catch (Exception e)
            {
                return false;
            }
        }

    }
}