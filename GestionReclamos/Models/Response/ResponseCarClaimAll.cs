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
            CarClaims = new List<ReclamoAuto>();
        }
        public List<ReclamoAuto> CarClaims { get; set; }
    }
}
