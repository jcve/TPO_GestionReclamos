using MailKit.Security;
using MimeKit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace GestionReclamos.Services
{
    public class MailService
    {
        public static async Task<bool> EnviarMail(string asunto, string destinatario, string mensaje)
        {
            try
            {
                string user = "gestionreclamos.uade@gmail.com";
                string password = "passwordGestionReclamos2020";
                string server = "smtp.gmail.com";

                using (var client = new MailKit.Net.Smtp.SmtpClient())
                {
                    await client.ConnectAsync(server, 587, SecureSocketOptions.Auto);
                    await client.AuthenticateAsync(user, password); // autentificacion

                    var message = new MimeMessage();

                    message.To.Add(new MailboxAddress(destinatario, destinatario)); // Destinatario

                    if (message.To.Count == 0) // Lista destinatario vacia
                    {
                        return false;
                    }

                    message.From.Add(new MailboxAddress("Gestion de Reclamos - NoReply", user)); // Origen
                    message.Subject = asunto; // Asunto

                    string body = mensaje; // Mensaje
                    message.Body = new TextPart("html") { Text = body }; // Agrego cuerpo del correo

                    var cancelSource = new CancellationTokenSource(10000);

                    await client.SendAsync(message, cancelSource.Token);
                    await client.DisconnectAsync(true);

                    return true;
                }
            }
            catch (Exception e)
            {
                // TODO: Hacer algo en caso de error
                return false;
            }
        }
    }
}
