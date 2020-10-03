using GestionReclamos.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GestionReclamos.Models.Response
{
    public class ResponseCarClaimAll
    {
        public ResponseCarClaimAll()
        {
            CarClaims = new List<ReclamoAutoVM>();
        }
        public List<ReclamoAutoVM> CarClaims { get; set; }
    }
    public class ReclamoAutoVM : ReclamoAuto
    {
        public string Cliente { get; set; }
        public string Estado { get; set; }
    }
}
