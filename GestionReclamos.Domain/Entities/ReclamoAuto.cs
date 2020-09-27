using GestionReclamos.Domain.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace GestionReclamos.Domain.Entities
{
    public class ReclamoAuto //: AuditableEntity
    {
        //public ReclamoAuto()
        //{
        //    HistorialEstados = new List<HistorialReclamoAuto>();
        //}
        public int Id { get; set; }
        public DateTime FechaCreacion { get; set; }
        public int IdCliente { get; set; }
        public string Descripcion { get; set; }
        public string Patente { get; set; }
        public string Modelo { get; set; }
        public string Marca { get; set; }
        public string Aeropuerto { get; set; }
        public int IdEstado { get; set; }
        public DateTime UltimaModificacion { get; set; }
        //public IList<HistorialReclamoAuto> HistorialEstados { get; private set; }
    }
}
