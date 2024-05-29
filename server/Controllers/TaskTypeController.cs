using server.Models;
using server.Models.Dtos;
using server.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Swashbuckle.AspNetCore.Annotations;

namespace server.Controllers;

[Route("api/v1/[controller]")]
[ApiController]
[AllowAnonymous]
public class TaskTypeController(TaskTypeRepository taskTypeRepository) : ControllerBase
{
    [HttpGet]
    [SwaggerResponse(StatusCodes.Status200OK, Type = typeof(IEnumerable<TaskTypeDto>))]
    [SwaggerResponse(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<IEnumerable<TaskTypeDto>>> GetTaskTypes()
    {
        var taskTypes = await taskTypeRepository.GetAll();
        var dtos = taskTypes.Select(taskType => new TaskTypeDto(taskType)).ToList();
        return Ok(dtos);
    }
    
    [HttpGet("{id:int}")]
    [SwaggerResponse(StatusCodes.Status200OK, Type = typeof(TaskTypeDto))]
    [SwaggerResponse(StatusCodes.Status401Unauthorized)]
    [SwaggerResponse(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<TaskTypeDto>> GetTaskType([FromRoute] int id)
    {
        var taskType = await taskTypeRepository.GetById(id);

        if (taskType is null)
        {
            return NotFound("Task type not found");
        }

        return Ok(new TaskTypeDto(taskType));
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = RoleType.Admin)]
    [SwaggerResponse(StatusCodes.Status204NoContent)]
    [SwaggerResponse(StatusCodes.Status401Unauthorized)]
    [SwaggerResponse(StatusCodes.Status404NotFound)]
    [SwaggerResponse(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> PutTaskType([FromRoute] int id, [FromBody] TaskTypeDto taskType)
    {
        if (id != taskType.TaskTypeId)
        {
            return BadRequest();
        }

            
        try
        {
            await taskTypeRepository.Update(taskType.ToTaskType());
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await taskTypeRepository.Exists(e => e.TaskTypeId == id))
            {
                return NotFound("Task type not found");
            }
            else
            {
                throw;
            }
        }

        return NoContent();
    }

    [HttpPost]
    [Authorize(Roles = RoleType.Admin)]
    [SwaggerResponse(StatusCodes.Status200OK, Type = typeof(TaskTypeDto))]
    public async Task<ActionResult<TaskTypeDto>> PostTaskType([FromBody] TaskTypeCreateDto taskType)
    {
        var createdTaskType = await taskTypeRepository.Create(taskType.ToTaskType());
        var taskTypeDto = new TaskTypeDto(createdTaskType);
        return CreatedAtAction("GetTaskType", new { id = taskTypeDto.TaskTypeId }, taskTypeDto);
    }
    
    [HttpDelete("{id:int}")]
    [Authorize(Roles = RoleType.Admin)]
    [SwaggerResponse(StatusCodes.Status204NoContent)]
    [SwaggerResponse(StatusCodes.Status401Unauthorized)]
    [SwaggerResponse(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteTaskType([FromRoute] int id)
    {
        var taskType = await taskTypeRepository.GetById(id);

        if (taskType is null)
        {
            return NotFound("Task Type not found");
        }

        await taskTypeRepository.Delete(taskType);

        return NoContent();
    }
}
