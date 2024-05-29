using server.Models;
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
    [AllowAnonymous]
    public class StatusController(StatusRepository statusRepository) : ControllerBase
    {
        [HttpGet]
        [SwaggerResponse(StatusCodes.Status200OK, Type = typeof(IEnumerable<StatusDto>))]
        [SwaggerResponse(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<IEnumerable<StatusDto>>> GetStatuses()
        {
            var statuses = await statusRepository.GetAll();
            var statusDtos = statuses.Select(status => new StatusDto(status)).ToList();
            return Ok(statusDtos);
        }

        [HttpGet("{id:int}")]
        [SwaggerResponse(StatusCodes.Status200OK, Type = typeof(StatusDto))]
        [SwaggerResponse(StatusCodes.Status401Unauthorized)]
        [SwaggerResponse(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<StatusDto>> GetStatus([FromRoute] int id)
        {
            var status = await statusRepository.GetById(id);

            if (status is null)
            {
                return NotFound("Status not found");
            }

            return new StatusDto(status);
        }

        [HttpPut("{id:int}")]
        [Authorize(Roles = RoleType.Admin)]
        [SwaggerResponse(StatusCodes.Status204NoContent)]
        [SwaggerResponse(StatusCodes.Status401Unauthorized)]
        [SwaggerResponse(StatusCodes.Status404NotFound)]
        [SwaggerResponse(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> PutStatus([FromRoute] int id, [FromBody] StatusDto status)
        {
            if (id != status.StatusId)
            {
                return BadRequest();
            }

            try
            {
                await statusRepository.Update(status.ToStatus());
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await statusRepository.Exists(e => e.StatusId == id))
                {
                    return NotFound("Status not found");
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
        [SwaggerResponse(StatusCodes.Status200OK, Type = typeof(StatusDto))]
        public async Task<ActionResult<StatusDto>> PostStatus([FromBody] StatusCreateDto status)
        {
            var createdStatus = await statusRepository.Create(status.ToStatus());
            var statusDto = new StatusDto(createdStatus);
            return CreatedAtAction("GetStatus", new { id = statusDto.StatusId }, statusDto);
        }
        
        [HttpDelete("{id:int}")]
        [Authorize(Roles = RoleType.Admin)]
        [SwaggerResponse(StatusCodes.Status204NoContent)]
        [SwaggerResponse(StatusCodes.Status401Unauthorized)]
        [SwaggerResponse(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteStatus([FromRoute] int id)
        {
            var status = await statusRepository.GetById(id);
            if (status is null)
            {
                return NotFound("Status not found");
            }

            await statusRepository.Delete(status);

            return NoContent();
        }
    }
}
