using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GestionReclamos.Models.Request
{
    public class User
    {
        [JsonProperty("idUsuario")]
        public int Identity { get; set; }

        [JsonProperty("nombre")]
        public string Name { get; set; }

        [JsonProperty("apellido")]
        public string Surname { get; set; }

        [JsonProperty("mail")]
        public string Mail { get; set; }

        [JsonProperty("fecha_nacimiento")]
        public string Birthday { get; set; }

        [JsonProperty("telefono")]
        public string Phone { get; set; }

        [JsonProperty("usuario")]
        public string Username { get; set; }

        [JsonProperty("password")]
        public string Password { get; set; }

        [JsonProperty("enable")]
        public bool Status { get; set; }

        [JsonProperty("fechaAlta")]
        public string AddDate { get; set; }

        [JsonProperty("fechaBaja")]
        public string DeleteDate { get; set; }

        [JsonProperty("propiedades")]
        public string Propieties { get; set; }
    }
}
