using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GestionReclamos.Models
{
    public class RequestCarClaim
    {
        public string Client { get; set; }
        public string Description { get; set; }
        public string Plate { get; set; }
        public string Model { get; set; }
        public string Brand { get; set; }
        public string Airport { get; set; }
    }
}
