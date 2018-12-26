using System.Threading.Tasks;

namespace cn_react_dotnetcore.Core.Services
{
    public interface IEmailSender
    {
      Task SendEmailAsync(string email, string subject, string message);

    }
}