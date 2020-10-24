using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GestionReclamos.Models.Request
{
    public class RequestTicketClaimCreate
    {
        public string Client { get; set; }
        public string Description { get; set; }
        public int Ticket { get; set; }
    }
}
