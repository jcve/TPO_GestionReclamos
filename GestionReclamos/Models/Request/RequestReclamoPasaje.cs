using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GestionReclamos.Models
{
    public class RequestReclamoPasaje
    {
        public string Cliente { get; set; }
        public string Descripcion { get; set; }
        public DateTime FechaVuelo { get; set; }
        public string Aerolinea { get; set; }
    }
}
