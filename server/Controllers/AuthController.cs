using Amazon;
using Amazon.CognitoIdentityProvider;
using Amazon.CognitoIdentityProvider.Model;
using Amazon.Runtime;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Models;
using server.Models.Dtos;
using server.Repositories;
using Task = System.Threading.Tasks.Task;

namespace server.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class AuthController(UserRepository userRepository) : ControllerBase
    {
        private static readonly string? UserPoolId = Environment.GetEnvironmentVariable("USERPOOL_ID");
        
        private static readonly string? ClientId = Environment.GetEnvironmentVariable("COGNITO_CLIENTID");
        private static readonly BasicAWSCredentials Credentials = new(Environment.GetEnvironmentVariable("AWS_ACCESS_ID"), Environment.GetEnvironmentVariable("AWS_ACCESS_SECRET"));
        private readonly AmazonCognitoIdentityProviderClient _provider = new(Credentials, RegionEndpoint.EUWest1);

        [HttpPost("signUp")]
        public async Task<IActionResult> SignUp([FromBody] AuthSignUpDto authSignUpDto)
        {
            try
            {
                await AddUserToGroup(authSignUpDto.username, "user");
                await AddUser(authSignUpDto.username);
                Console.WriteLine("Sign up successful");
                return Ok("User signed up successfully");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error signing up: {ex.Message}");
                return BadRequest("Failed to Create User");
            }
        }

        private async Task AddUser(string email)
        {
            var userExist = await userRepository.Exists(u => u.Email == email);
            if(userExist) return;
            var user = new User()
            {
                Email = email
            };
            await userRepository.Create(user);
        }
        

        private async Task AddUserToGroup(string email, string role)
        {
            var addUserToGroupRequest = new AdminAddUserToGroupRequest
            {
                GroupName = role,
                UserPoolId = UserPoolId,
                Username = email
            };
 
            try
            {
                await _provider.AdminAddUserToGroupAsync(addUserToGroupRequest);
                Console.WriteLine($"User added to group {role}");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                throw;
            }
        }
    }
}
