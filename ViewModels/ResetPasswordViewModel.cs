using System.ComponentModel.DataAnnotations;

namespace cn_react_dotnetcore.ViewModels
{
    public class ResetPasswordViewModel
    {
        public string FullName { get; set; }

        public bool HasError { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }


        [Required]
        [StringLength(4)]
        [RegularExpression(@"\d{4}")]
        public string EmployeeNo { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "The {0} must be at least {2} and at max {1} characters long.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Confirm password")]
        [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; }

        public string Code { get; set; }
    }
}