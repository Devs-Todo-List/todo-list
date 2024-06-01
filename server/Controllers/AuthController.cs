﻿using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using server.Jwt;
using server.Models;
using server.Models.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Swashbuckle.AspNetCore.Annotations;

namespace server.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class AuthController(JwtOptions jwtOptions) : ControllerBase
    {
        [HttpPost]
        [SwaggerResponse(StatusCodes.Status200OK, Type = typeof(JwtDto))]
        [SwaggerResponse(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> Authenticate()
        {
            var auth = Request.Headers.Authorization;
            if (auth.IsNullOrEmpty())
            {
                return BadRequest("No Authorization Provided");
            }
            if (auth[0] is null)
            {
                return BadRequest("Incorrect Authorization Provided");
            }
            var authToken = auth[0];
            if (authToken is null)
            {
                return BadRequest();
            }
            if (authToken.Contains("Bearer") == false)
            {
                return BadRequest("No Bearer Token Provided");
            }

            var gitHubToken = authToken[7..];
            if (gitHubToken is null)
            {
                return BadRequest("No Bearer Token Provided");
            }
            var client = new HttpClient();
            var request = new HttpRequestMessage(HttpMethod.Get, "https://api.github.com/user");
            request.Headers.Add("Authorization", "Bearer " + gitHubToken);
            request.Headers.Add("User-Agent", "request");
            var response = await client.SendAsync(request);
            if (response.StatusCode != HttpStatusCode.OK)
            {
                return BadRequest("Invalid Credentials");
            }
            var responseString = await response.Content.ReadAsStringAsync();
            var githubUser = JsonSerializer.Deserialize<GithubUser>(responseString)!;
            // var role = await authService.AuthenticateUser(githubUser);
            // var tokenExpiration = TimeSpan.FromSeconds(jwtOptions.ExpirationSeconds);
            // var accessToken = CreateAccessToken(
            //     jwtOptions,
            //     githubUser.login,
            //     TimeSpan.FromMinutes(1440),
            //     new[] { role });
            //
            // //returns a json response with the access token
            // return Ok(new JwtDto
            // {
            //     access_token = accessToken,
            //     expiration = (int)tokenExpiration.TotalSeconds,
            //     type = "bearer"
            // });
            return BadRequest();
        }

        private string CreateAccessToken(
          JwtOptions jwtOptions,
          string username,
          TimeSpan expiration,
          string[] permissions)
        {
            var keyBytes = Encoding.UTF8.GetBytes(jwtOptions.SigningKey);
            var symmetricKey = new SymmetricSecurityKey(keyBytes);

            var signingCredentials = new SigningCredentials(
                symmetricKey,
                // 👇 one of the most popular. 
                SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>()
            {
                new Claim("username", username),
            };

            var roleClaims = permissions.Select(x => new Claim("role", x));
            claims.AddRange(roleClaims);

            var token = new JwtSecurityToken(
                issuer: jwtOptions.Issuer,
                audience: jwtOptions.Audience,
                claims: claims,
                expires: DateTime.Now.Add(expiration),
                signingCredentials: signingCredentials);

            var rawToken = new JwtSecurityTokenHandler().WriteToken(token);
            return rawToken;
        }
    }
}
