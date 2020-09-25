using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GestionReclamos.Models.Request
{
    public class RequestNewUser
    {
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Mail { get; set; }
        public string Birthday { get; set; }
        public string Phone { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }

    }
}
