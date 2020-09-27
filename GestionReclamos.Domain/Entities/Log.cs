using System;
using System.Collections.Generic;
using System.Text;

namespace GestionReclamos.Domain.Entities
{
    public class Log
    {
        public int Id { get; set; }
        public DateTime Fecha { get; set; }
        public string Descripcion { get; set; }
    }
}
