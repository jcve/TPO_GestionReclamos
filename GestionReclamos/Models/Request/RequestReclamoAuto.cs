using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GestionReclamos.Models
{
    public class RequestReclamoAuto
    {
        public string Cliente { get; set; }
        public string Descripcion { get; set; }
        public string Patente { get; set; }
        public string Modelo { get; set; }
        public string Marca { get; set; }
        public string Aeropuerto { get; set; }
    }
}
