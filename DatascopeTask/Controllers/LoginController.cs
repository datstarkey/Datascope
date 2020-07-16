using DatascopeTask.Models;
using DatascopeTask.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatascopeTask.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class LoginController : ControllerBase
    {
        private UserService userService;

        public LoginController(UserService userService) => this.userService = userService;

        [HttpPost]
        public IActionResult Login([FromBody] LoginDetails user)
        {
            if (!userService.ValidateLogin(user))
                return BadRequest("Username or password wrong");

            var dbUser = userService.GetUser(user.Username);
            var token = userService.GenerateJWT(dbUser);
            return Ok(token);
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] LoginDetails user)
        {
            if (userService.CreateNewUser(user))
                return Ok("Account created");
            return BadRequest("Account already exists");
        }

        [Authorize]
        [HttpPost("refresh")]
        public IActionResult Refresh()
        {
            var username = User.FindFirst("name")?.Value;
            var dbUser = userService.GetUser(username);
            var token = userService.GenerateJWT(dbUser);
            return Ok(token);
        }
    }
}