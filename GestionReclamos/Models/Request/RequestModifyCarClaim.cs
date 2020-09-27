using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GestionReclamos.Models
{
    public class RequestModifyCarClaim: RequestCarClaim
    {
        public int Id { get; set; }
        public string State { get; set; }
    }
}
