using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GestionReclamos.Models
{
    public class Flight
    {
        public string Client { get; set; }
        public string Description { get; set; }
        [JsonProperty("fecha")]
        public DateTime? FlightDate { get; set; }
        [JsonProperty("aerolinea")]
        public string Airline { get; set; }
        [JsonProperty("ticket")]
        public int? Ticket { get; set; }

    }
}
