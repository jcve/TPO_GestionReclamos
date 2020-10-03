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
            TicketClaims = new List<ReclamoPasajeVM>();
        }
        //public List<ReclamoPasaje> TicketClaims { get; set; }
        public List<ReclamoPasajeVM> TicketClaims { get; set; }
    }
    public class ReclamoPasajeVM : ReclamoPasaje
    {
        public string Cliente { get; set; }
        public string Estado { get; set; }
    }
}
