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
        public async Task<bool> EnviarMail(string asunto, string destinatario, string mensaje)
        {
            try
            {
                string user = "1a052d711d-9b63ab@inbox.mailtrap.io";
                string password = "passwordGestionReclamos2020";
                string server = "smtp.mailtrap.io";

                using (var client = new MailKit.Net.Smtp.SmtpClient())
                {
                    await client.ConnectAsync(server, 2525, SecureSocketOptions.Auto);
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
