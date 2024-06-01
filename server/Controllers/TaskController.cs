using server.Jwt;
using server.Models.Dtos;
using server.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Swashbuckle.AspNetCore.Annotations;

namespace server.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class TaskController(TaskRepository taskRepository, UserRepository userRepository, StatusRepository statusRepository) : ControllerBase
    {
        [HttpGet]
        [SwaggerResponse(StatusCodes.Status200OK, Type = typeof(IEnumerable<TaskResponseDto>))]
        [SwaggerResponse(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<TaskResponseDto>> GetTasks([FromHeader(Name = "Authorization")] string authToken)
        {
            var email = JwtUtils.GetClaim(authToken, "username");
            var tasks = await taskRepository.FindAll(task => task.User!.Email == email);
            var userTasks = tasks.Select(t => new TaskResponseDto(t));
            var statuses = await statusRepository.GetAll();
            var ans = statuses.Select(s => new
            {
                id = $"section-{s.StatusId.ToString()}" ,
                title = s.StatusType,
                tasks = userTasks.Where(ut => ut.StatusId == s.StatusId).ToList()
            });
            return Ok(ans);
        }
        
        [HttpGet("{id:int}")]
        [SwaggerResponse(StatusCodes.Status200OK, Type = typeof(TaskResponseDto))]
        [SwaggerResponse(StatusCodes.Status401Unauthorized)]
        [SwaggerResponse(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<TaskResponseDto>> GetTask([FromHeader(Name = "Authorization")] string authToken, [FromRoute] int id)
        {
            var email = JwtUtils.GetClaim(authToken, "username");
            var task = await taskRepository.GetById(id);
            
            if (task is null)
            {
                return NotFound("Task not found");
            }

            if (task.User!.Email != email)
            {
                return Unauthorized();
            }

            return Ok(new TaskResponseDto(task));
        }
        
        [HttpPut("{id:int}")]
        [SwaggerResponse(StatusCodes.Status204NoContent)]
        [SwaggerResponse(StatusCodes.Status401Unauthorized)]
        [SwaggerResponse(StatusCodes.Status404NotFound)]
        [SwaggerResponse(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> PutTask([FromHeader(Name = "Authorization")] string authToken,
            [FromRoute] int id, [FromBody] TaskUpdateDTO taskUpdateDto)
        {
            var email = JwtUtils.GetClaim(authToken, "username");

            if (id != taskUpdateDto.TaskId)
            {
                return BadRequest();
            }

            var task = await taskRepository.GetById(taskUpdateDto.TaskId);
            
            
            if (task is null)
            {
                return NotFound("Task not found");
            }

            if (task!.User!.Email != email)
            {
                return Unauthorized();
            }

            if (taskUpdateDto.UserId != task.UserId)
            {
                return BadRequest("User ID cannot be changed");
            }
            
            await taskRepository.Update(taskUpdateDto.ToTask());
            

            return NoContent();
        }

        [HttpPost]
        [SwaggerResponse(StatusCodes.Status200OK, Type = typeof(TaskResponseDto))]
        public async Task<ActionResult<TaskResponseDto>> PostTask([FromHeader(Name = "Authorization")] string authToken, [FromBody] TaskCreateDto taskCreateDto)
        {
            var email = JwtUtils.GetClaim(authToken, "username");
            var user = await userRepository.FindByEmail(email);
            taskCreateDto.UserId = user!.UserId;
            var createdTask = await taskRepository.Create(taskCreateDto.ToTask());
            var taskDto = new TaskResponseDto(createdTask);
            return CreatedAtAction("GetTask", new { id = taskDto.UserId }, taskDto);
        }

        [HttpDelete("{id:int}")]
        [SwaggerResponse(StatusCodes.Status204NoContent)]
        [SwaggerResponse(StatusCodes.Status401Unauthorized)]
        [SwaggerResponse(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteTask([FromHeader(Name = "Authorization")] string authToken, int id)
        {
            var email = JwtUtils.GetClaim(authToken, "username");

            var task = await taskRepository.GetById(id);

            if (task is null)
            {
                return NotFound("Task not found");
            }

            if (task!.User!.Email != email)
            {
                return Unauthorized();
            }

            await taskRepository.Delete(task);

            return NoContent();
        }
    }
}
