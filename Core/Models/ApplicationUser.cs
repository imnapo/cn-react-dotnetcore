using Microsoft.AspNetCore.Identity;

namespace MyApp.Core.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string FullName { get; set; }
    }
}