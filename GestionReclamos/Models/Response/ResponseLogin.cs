using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GestionReclamos.Models.Response
{
    public class ResponseLogin
    {
        public int StatusCode { get; set; }
        public string Description { get; set; }
        public string Token { get; set; }
    }
}
