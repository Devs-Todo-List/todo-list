using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace server.Controllers
{
    [ApiExplorerSettings(IgnoreApi = true)]
    [Route("error")]
    [ApiController]
    [AllowAnonymous]
    public class ErrorController : ControllerBase
    {
        public IActionResult HandleError()
        {
            var exceptionHandlerFeature = HttpContext.Features.Get<IExceptionHandlerFeature>()!;
            return Problem(title: "An error occured. Please try again.");
        }
    }
}
