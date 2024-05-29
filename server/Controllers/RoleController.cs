﻿using server.Models;
using server.Models.Dtos;
using server.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Swashbuckle.AspNetCore.Annotations;

namespace server.Controllers;

[Route("api/v1/[controller]")]
[ApiController]
public class RoleController(RoleRepository roleRepository) : ControllerBase
{
    [HttpGet]
    [SwaggerResponse(StatusCodes.Status200OK, Type = typeof(IEnumerable<RoleResponseDto>))]
    [SwaggerResponse(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<IEnumerable<RoleResponseDto>>> GetRoles()
    {
        var roles = await roleRepository.GetAll();
        var roleDtos = roles.Select(role => new RoleResponseDto(role));
        return Ok(roleDtos);
    }

    [HttpGet("{id:int}")]
    [SwaggerResponse(StatusCodes.Status200OK, Type = typeof(CommentDto))]
    [SwaggerResponse(StatusCodes.Status401Unauthorized)]
    [SwaggerResponse(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<RoleResponseDto>> GetRole([FromRoute] int id)
    {
        var role = await roleRepository.GetById(id);

        if (role is null) return NotFound("Role not found");

        return new RoleResponseDto(role);
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = RoleType.Admin)]
    [SwaggerResponse(StatusCodes.Status204NoContent)]
    [SwaggerResponse(StatusCodes.Status401Unauthorized)]
    [SwaggerResponse(StatusCodes.Status404NotFound)]
    [SwaggerResponse(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> PutRole([FromRoute] int id, [FromBody] RoleUpdateDto roleUpdateDto)
    {
        if (id != roleUpdateDto.RoleId) return BadRequest();

        try
        {
            await roleRepository.Update(roleUpdateDto.ToRole());
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await roleRepository.Exists(e => e.RoleId == id))
                return NotFound("Role not found");
            throw;
        }

        return NoContent();
    }

    [HttpPost]
    [Authorize(Roles = RoleType.Admin)]
    [SwaggerResponse(StatusCodes.Status200OK, Type = typeof(RoleResponseDto))]
    public async Task<ActionResult<RoleResponseDto>> PostRole([FromBody] RoleCreateDto roleCreateDto)
    {
        var createdRole = await roleRepository.Create(roleCreateDto.ToRole());
        var roleDto = new RoleResponseDto(createdRole);
        return CreatedAtAction("GetRole", new { id = roleDto.RoleId }, roleDto);
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = RoleType.Admin)]
    [SwaggerResponse(StatusCodes.Status204NoContent)]
    [SwaggerResponse(StatusCodes.Status401Unauthorized)]
    [SwaggerResponse(StatusCodes.Status404NotFound)]
    [SwaggerResponse(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> DeleteStatus([FromRoute] int id)
    {
        var role = await roleRepository.GetById(id);
        if (role is null) return NotFound("Role not found");

        await roleRepository.Delete(role);

        return NoContent();
    }
}
