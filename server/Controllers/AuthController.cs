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

        [HttpPost("signIn")]
        public async Task<IActionResult> SignIn([FromBody] AuthSignInDto authSignIn)
        {
            try
            {
                var authRequest = new InitiateAuthRequest
                {
                    AuthFlow = AuthFlowType.USER_PASSWORD_AUTH,
                    ClientId = ClientId,
                    AuthParameters = new Dictionary<string, string>
                    {
                        { "USERNAME", authSignIn.username },
                        { "PASSWORD", authSignIn.password }
                    }
                };
                var authResponse = await _provider.InitiateAuthAsync(authRequest);
                if (authResponse.AuthenticationResult == null) return Unauthorized("Invalid username or password");
                Console.WriteLine("Sign in successful");
                return Ok(authResponse);

            }
            catch (Exception e)
            {
                return Unauthorized("Invalid username or password");
            }
        }

        [HttpPost("signUp")]
        public async Task<IActionResult> SignUp([FromBody] AuthSignUpDto authSignUpDto)
        {
            var signUpRequest = new SignUpRequest
            {
                ClientId = ClientId,
                Username = authSignUpDto.username,
                Password = authSignUpDto.password,
                UserAttributes =
                [
                    new AttributeType
                    {
                        Name = "email",
                        Value = authSignUpDto.username
                    }
                ]
            };
 
            try
            {
                var signUpResponse = await _provider.SignUpAsync(signUpRequest);
                await AddUserToGroup(authSignUpDto.username, "user");
                Console.WriteLine("Sign up successful");
                return Ok("User signed up successfully");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error signing up: {ex.Message}");
                return BadRequest("Failed to Create User");
            }
        }

        [HttpPost("confirmSignup")]
        public async Task<IActionResult> ConfirmSignUp([FromBody] AuthConfirmSignUpDto authConfirmSignUpDto)
        {
            var confirmSignUpRequest = new ConfirmSignUpRequest
            {
                ClientId = ClientId,
                Username = authConfirmSignUpDto.username,
                ConfirmationCode = authConfirmSignUpDto.code
            };
 
            try
            {
                await _provider.ConfirmSignUpAsync(confirmSignUpRequest);
                Console.WriteLine("User confirmed successfully");
                var user = new User()
                {
                    Email = authConfirmSignUpDto.username
                };
                await userRepository.Create(user);
                return Ok("User has been confirmed");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error confirming sign up: {ex.Message}");
                return BadRequest("Could not confirm user");
            }
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
