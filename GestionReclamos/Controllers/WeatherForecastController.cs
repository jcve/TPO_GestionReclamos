using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GestionReclamos.Application.Common.Interfaces;
using GestionReclamos.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace GestionReclamos.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        private readonly ILogger<WeatherForecastController> _logger;
        private readonly IGestionReclamosDbContext _context;

        public WeatherForecastController(ILogger<WeatherForecastController> logger, IGestionReclamosDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        [HttpGet]
        public IEnumerable<WeatherForecast> Get()
        {
            try
            {
                var a = _context.Set<Estado>().ToList();
                var b = _context.Set<Log>().ToList();
                var c = _context.Set<ReclamoAuto>().ToList();
                var d = _context.Set<ReclamoPasaje>().ToList();
                //var e = _context.Set<Usuario>().ToList();
                //var d = _context.Estado.ToList();
                //var e = _context.Estado.ToList();
            }
            catch (Exception ex)
            {
                var f = ex;
                throw;
            }
            

            var rng = new Random();
            return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                Date = DateTime.Now.AddDays(index),
                TemperatureC = rng.Next(-20, 55),
                Summary = Summaries[rng.Next(Summaries.Length)]
            })
            .ToArray();
        }
    }
}
