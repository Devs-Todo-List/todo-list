using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace server.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class AppStatusController() : ControllerBase
    {
        [HttpGet]
        public IActionResult AppStatus()
        {
            return Ok("App is running");
        }
    }
}
