using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MyApp.Core.Models;
using MyApp.Persistence;
using MyApp.ViewModels;

namespace MyApp.Controllers
{
    public class AccountController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IOptions<IdentityOptions> _identityOptions;
        private readonly ApplicationDbContext _applicationDbContext;
        private static bool _databaseChecked;

        public AccountController(
            UserManager<ApplicationUser> userManager,
            IOptions<IdentityOptions> identityOptions,
            SignInManager<ApplicationUser> signInManager,
            ApplicationDbContext applicationDbContext
            )
        {
            _userManager = userManager;
            _identityOptions = identityOptions;
            _signInManager = signInManager;
            _applicationDbContext = applicationDbContext;
        }

        [AllowAnonymous]
        //[ValidateAntiForgeryToken]
        [HttpPost("~/api/auth/register")]
        public async Task<IActionResult> Register([FromBody] RegisterViewModel model)
        {
            EnsureDatabaseCreated(_applicationDbContext);

            if (ModelState.IsValid)
            {
                if(model.Password != model.ConfirmPassword) 
                {
                    return BadRequest(new { general = new[] {"Password and Confirm Password not match"} });
                }

                var user = new ApplicationUser
                { 
                    UserName = model.Email, 
                    Email = model.Email 
                };

                var result = await _userManager.CreateAsync(user, model.Password);

                if (result.Succeeded)
                {
                    // we may need to send confirmation email after resigter succeed 
                    // Send an email with this link
                    //var code = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                    //var callbackUrl = Url.Action("ConfirmEmail", "Account", new { userId = user.Id, code = code }, protocol: Context.Request.Scheme);
                    //await _emailSender.SendEmailAsync(model.Email, "Confirm your account",
                    //    "Please confirm your account by clicking this link: <a href=\"" + callbackUrl + "\">link</a>");
                    //===========================================================================
                    //but we do nothing now just return ok          
                    return Ok();
                }
                else
                {
                    return BadRequest(new { general = result.Errors.Select(x => x.Description).ToArray() });
                }
            }  
            else
            {
                return BadRequest(new { general = ModelState.SelectMany(x => x.Value.Errors)
                    .Select(x => x.ErrorMessage).ToArray() });
            }

            // If we got this far, something failed, redisplay form
             //return BadRequest(new { errors = "Bad Request".ToArray() });
        }


       // The following code creates the database and schema if they don't exist.
        // This is a temporary workaround since deploying database through EF migrations is
        // not yet supported in this release.
        // Please see this http://go.microsoft.com/fwlink/?LinkID=615859 for more information on how to do deploy the database
        // when publishing your application.
        private static void EnsureDatabaseCreated(ApplicationDbContext context)
        {
            if (!_databaseChecked)
            {
                _databaseChecked = true;
                context.Database.EnsureCreated();
            }
        }
    }
}