using Microsoft.AspNetCore.Authorization;
using System.Linq;
using System.Threading.Tasks;

namespace server
{
  public class CognitoGroupRequirement(string group) : IAuthorizationRequirement
  {
        public string Group { get; } = group;
    }

  public class CognitoGroupHandler : AuthorizationHandler<CognitoGroupRequirement>
  {
      protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, CognitoGroupRequirement requirement)
      {
          var hasGroup = context.User.Claims.Any(c => c.Type == "cognito:groups" && c.Value.Split(',').Contains(requirement.Group));
          if (hasGroup)
          {
              context.Succeed(requirement);
          }
          return Task.CompletedTask;
      }
  }
}
