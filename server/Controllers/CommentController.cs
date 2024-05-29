using server.Jwt;
using server.Models.Dtos;
using server.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace server.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class CommentController(CommentRepository commentRepository) : ControllerBase
    {
        [HttpGet("task/{taskId:int}")]
        [SwaggerResponse(StatusCodes.Status200OK, Type = typeof(IEnumerable<CommentDto>))]
        [SwaggerResponse(StatusCodes.Status401Unauthorized)]
        [SwaggerResponse(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<IEnumerable<CommentDto>>> GetCommentsForTask([FromHeader(Name = "Authorization")] string authToken, [FromRoute] int taskId)
        { 
            var username = JwtUtils.GetClaim(authToken, "username");

            var comments = await commentRepository.FindAll(c => c.TaskId == taskId);
            var firstComment = comments.FirstOrDefault();
            if (firstComment is not null && firstComment.Task!.User!.Username != username)
            {
                return Unauthorized();
            }

            if (firstComment is null)
            {
                return NotFound();
            }
            
            return comments.Select(comment => new CommentDto(comment)).ToList();
        }
        
        [HttpGet("{id:int}")]
        [SwaggerResponse(StatusCodes.Status200OK, Type = typeof(CommentDto))]
        [SwaggerResponse(StatusCodes.Status401Unauthorized)]
        [SwaggerResponse(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<CommentDto>> GetComment([FromHeader(Name = "Authorization")] string authToken, [FromRoute] int id)
        {
            var username = JwtUtils.GetClaim(authToken, "username");
            var comment = await commentRepository.GetById(id);

            if (comment is null)
            {
                return NotFound("Comment not found");
            }

            if (comment.Task!.User!.Username != username)
            {
                return Unauthorized();
            }

            return new CommentDto(comment);
        }

        [HttpPut("{id:int}")]
        [SwaggerResponse(StatusCodes.Status204NoContent)]
        [SwaggerResponse(StatusCodes.Status401Unauthorized)]
        [SwaggerResponse(StatusCodes.Status404NotFound)]
        [SwaggerResponse(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> PutComment([FromHeader(Name = "Authorization")] string authToken,
            [FromRoute] int id, [FromBody] CommentDto commentDto)
        {
            if (id != commentDto.CommentId)
            {
                return BadRequest();
            }
            
            var username = JwtUtils.GetClaim(authToken, "username");
            var originalComment = await commentRepository.GetById(id);

            if (originalComment is null)
            {
                return NotFound("Comment not found");
            }
            
            if (originalComment.Task!.User!.Username != username)
            {
                return Unauthorized();
            }

            if (originalComment.TaskId != commentDto.TaskId)
            {
                return BadRequest("Task ID cannot be changed");
            }

            await commentRepository.Update(commentDto.ToComment());
            
            return NoContent();
        }
        
        [HttpPost]
        [SwaggerResponse(StatusCodes.Status200OK, Type = typeof(CommentDto))]
        public async Task<ActionResult<CommentDto>> PostComment([FromBody] CommentCreateDto commentCreateDto)
        {
            var createdComment = await commentRepository.Create(commentCreateDto.ToComment());
            var commentDto = new CommentDto(createdComment);
            return CreatedAtAction("GetComment", new { id = commentDto.CommentId }, commentDto);
        }
        
        [HttpDelete("{id:int}")]
        [SwaggerResponse(StatusCodes.Status204NoContent)]
        [SwaggerResponse(StatusCodes.Status401Unauthorized)]
        [SwaggerResponse(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteComment([FromHeader(Name = "Authorization")] string authToken, [FromRoute] int id)
        {
            var comment = await commentRepository.GetById(id);
            var username = JwtUtils.GetClaim(authToken, "username");
            
            if (comment is null)
            {
                return NotFound("Comment not found");
            }
            
            if (comment.Task!.User!.Username != username)
            {
                return Unauthorized();
            }

            await commentRepository.Delete(comment);

            return NoContent();
        }
    }
}
