using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GestionReclamos.Models.Response
{
    public class ResponseNewUser
    {
        [JsonProperty("status")]
        public int StatusCode { get; set; }
        [JsonProperty("message")]
        public string Description { get; set; }
        public string Mail { get; set; }
        public int Identity { get; set; }
    }
}
