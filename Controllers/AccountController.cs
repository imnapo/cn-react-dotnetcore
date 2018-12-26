using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using cn_react_dotnetcore.Core.Services;
using cn_react_dotnetcore.ViewModels;
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

        private readonly IEmailSender _emailSender;
        private static bool _databaseChecked;

        public AccountController(
            UserManager<ApplicationUser> userManager,
            IOptions<IdentityOptions> identityOptions,
            SignInManager<ApplicationUser> signInManager,
            IEmailSender emailSender,
            ApplicationDbContext applicationDbContext
            )
        {
            _userManager = userManager;
            _identityOptions = identityOptions;
            _signInManager = signInManager;
            _emailSender = emailSender;
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


        [AllowAnonymous]
        [HttpPost("~/api/auth/forgetPassword")]
        public async Task<IActionResult> ForgetPassword(string username) 
        {

          if(username == null)
          {
            return null;
          }

          var user = await _userManager.FindByEmailAsync(username);
          if(user == null) 
          {
            user = await _userManager.FindByNameAsync(username);
            if (user == null)
            {
              throw new System.ApplicationException($"Unable to load user with ID '{username}'.");

            }
          }
         
          // For more information on how to enable account confirmation and password reset please visit http://go.microsoft.com/fwlink/?LinkID=532713
          // Send an email with this link
          var code = await _userManager.GeneratePasswordResetTokenAsync(user);
        
          var firstTimeLoginUrl = "http://localhost:5000/resetPassword/username/" + user.Id + "/code/" + code;
          
          // await _emailSender.SendEmailAsync(model.Email, model.EmployeeNo, "Welcome to Intranet",
          //     "Please complete your registration by clicking this link: <a href=\"" + firstTimeLoginUrl + "\">link</a>"
          //     , firstTimeLoginUrl);

              await _emailSender.SendEmailAsync(user.Email, "Reset Password",
              "Please clicking view button to reset your password."
              );
        
          return Ok();

        }


        [HttpPost("~/api/auth/resetPassword")]
        [AllowAnonymous]
        // [ValidateAntiForgeryToken]
        public async Task<IActionResult> ResetPassword(ResetPasswordViewModel model)
        {
           
            ApplicationUser user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                user = await _userManager.FindByNameAsync(model.EmployeeNo);

                 if (user == null)
                {
                    // Don't reveal that the user does not exist
                    return BadRequest("the user does not exist");
                }
            }

            var code = model.Code.Replace(" ", "+");
          
            var resetResult = await _userManager.ResetPasswordAsync(user, code, model.Password);
            if (resetResult.Succeeded)
            {
                
                return Ok();
            }

            return BadRequest(resetResult);
        }

        [HttpPost("~/api/auth/changePassword")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        // [ValidateAntiForgeryToken]
        public async Task<IActionResult> ChangePassword(ChangePasswordViewModel model)
        {
            var claimsIdentity = User.Identity as ClaimsIdentity;           
            string username = claimsIdentity.Name;

            ApplicationUser user = await _userManager.FindByNameAsync(username);

                if (user == null)
                {
                    // Don't reveal that the user does not exist
                    return BadRequest("the user does not exist");
                }
                if(model.NewPassword != model.ConfirmPassword) 
                {
                    return BadRequest("the password and confirm password not match.");
                }
            
          
            var resetResult = await  _userManager.ChangePasswordAsync(user, model.OldPassword, model.NewPassword);
            if (resetResult.Succeeded)
            {
                
                return Ok();
            }

            return BadRequest(resetResult);
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