using System.ComponentModel.DataAnnotations;

namespace server.Models.Dtos;

public class AuthConfirmSignUpDto
{
    [Required]
    [EmailAddress]
    public string username { get; set; }
    [Required]
    public string code { get; set; }
}