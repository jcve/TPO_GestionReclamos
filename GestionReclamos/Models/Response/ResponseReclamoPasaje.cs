using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GestionReclamos.Models.Response
{
    public class ResponseReclamoPasaje
    {
        public int Id { get; set; }
        public int Ticket { get; set; }
        public DateTime FechaCreacion { get; set; }
        public int IdCliente { get; set; }
        public string Descripcion { get; set; }
        public DateTime FechaVuelo { get; set; }
        public string Aerolinea { get; set; }
        public int IdEstado { get; set; }
        public DateTime UltimaModificacion { get; set; }
        public string Cliente { get; set; }
        public string Estado { get; set; }
    }
}
