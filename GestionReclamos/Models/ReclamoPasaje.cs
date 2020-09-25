using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GestionReclamos.Models
{
    public class ReclamoPasaje
    {
        public int IdReclamoPasaje { get; set; }
        public DateTime FechaCreacion { get; set; }
        public DateTime UltimaModificacion { get; set; }
        public string IdCliente { get; set; }
        public string Descripcion { get; set; }
        public DateTime FechaVuelo { get; set; }
        public string Aerolinea { get; set; }
        public string Estado { get; set; }
    }
}
