using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace GestionReclamos
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
                   Host.CreateDefaultBuilder(args)
                       .ConfigureWebHostDefaults(webBuilder =>
                       {
                           var port = Environment.GetEnvironmentVariable("PORT");

                           //para que funcione corriendo como app y no desde iis
                           //webBuilder.UseStartup<Startup>();
                           ////.UseUrls("http://*:" + port);

                           webBuilder.UseStartup<Startup>()
                           .UseUrls("http://*:" + port);
                       });
    }
}
