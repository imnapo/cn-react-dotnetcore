using System.IO;
using System.Threading.Tasks;

namespace cn_react_dotnetcore.Core.Services
{
    public class FileEmailSender : IEmailSender
    {
        public Task SendEmailAsync(string email, string subject, string message)
        {
             var emailMessage = $"To: {email}\nSubject: {subject}\nMessage: {message}\n\n";

            File.AppendAllText("emails.html", emailMessage);                          

            return Task.FromResult(0);
        }
  }
}