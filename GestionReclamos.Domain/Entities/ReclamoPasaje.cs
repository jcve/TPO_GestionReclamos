using GestionReclamos.Domain.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace GestionReclamos.Domain.Entities
{
    public class ReclamoPasaje //: AuditableEntity
    {
        public ReclamoPasaje()
        {
            //HistorialEstados = new List<HistorialReclamoPasaje>();
        }
        public int Id { get; set; }
        public DateTime FechaCreacion { get; set; }
        public int IdCliente { get; set; }
        public string Descripcion { get; set; }
        public DateTime FechaVuelo { get; set; }
        public string Aerolinea { get; set; }
        public int IdEstado { get; set; }
        public DateTime UltimaModificacion { get; set; }
        //public IList<HistorialReclamoPasaje> HistorialEstados { get; private set; }
    }
}
