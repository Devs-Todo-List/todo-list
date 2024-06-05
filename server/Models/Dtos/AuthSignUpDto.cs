using System.ComponentModel.DataAnnotations;

namespace server.Models.Dtos;

public class AuthSignUpDto
{
    [Required]
    [EmailAddress]
    public string username { get; set; }
    [Required]
    public string password { get; set; }
}