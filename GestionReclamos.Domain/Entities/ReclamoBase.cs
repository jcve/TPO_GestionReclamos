using System;
using System.Collections.Generic;
using System.Text;

namespace GestionReclamos.Domain.Entities
{
    public class ReclamoBase
    {
        public int Id { get; set; }
        public string Estado { get; set; }
        public DateTime UltimaModificacion { get; set; }
    }
}
