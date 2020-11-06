using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GestionReclamos.Models
{
    public class RequestTicketClaim
    {
        public string Client { get; set; }
        public string Description { get; set; }
        public int Ticket { get; set; }

    }
}
