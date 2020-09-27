using GestionReclamos.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GestionReclamos.Models.Response
{
    public class ResponseTicketClaimAll
    {
        public ResponseTicketClaimAll()
        {
            TicketClaims = new List<ReclamoPasaje>();
        }
        public List<ReclamoPasaje> TicketClaims { get; set; }
    }
}
