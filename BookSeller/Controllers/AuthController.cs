using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BookSeller.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Security.Claims;
using System;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using System.ComponentModel.DataAnnotations;
//// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BookSeller.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly booksellerContext _context;
        private readonly IConfiguration _config;
        public AuthController(booksellerContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserAuthModel login)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            IActionResult response = Unauthorized();
            var user = _context.Users.Where(u => u.Username == login.username
                                            && u.Admin == true
                                            && u.Password == HashPassword(login.password))
                                            .FirstOrDefault();
            if (user != null)
            {
                var tokenString = GenerateJSONWebToken(user);
                response = Ok(new { user = new
                {
                    username = user.Username,
                    email = user.Email,
                    id = user.Id,
                    fullname = user.Fullname
                }
                , token = tokenString });
            }

            return response;
        }
        // https://www.c-sharpcorner.com/article/jwt-json-web-token-authentication-in-asp-net-core/
        private string GenerateJSONWebToken(User userInfo)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            var claims = new[] {
                new Claim(JwtRegisteredClaimNames.Sub, Convert.ToString(userInfo.Id)),
                new Claim(JwtRegisteredClaimNames.NameId, userInfo.Username),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };
            var token = new JwtSecurityToken(_config["Jwt:Issuer"],
              _config["Jwt:Issuer"],
              claims,
              expires: DateTime.Now.AddSeconds(3600),
              signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        //https://docs.microsoft.com/en-us/aspnet/core/security/data-protection/consumer-apis/password-hashing?view=aspnetcore-5.0
        private string HashPassword(string str)
        {
            byte[] salt = Encoding.ASCII.GetBytes(_config["Salt"]);
            // derive a 256-bit subkey (use HMACSHA1 with 10,000 iterations)
            string hashed = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: str,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA1,
                iterationCount: 10000,
                numBytesRequested: 256 / 8));
            return hashed;
        }
    }
    public class UserAuthModel
    {
        [Required]
        [StringLength(16, MinimumLength = 4)]
        
        public string username { get; set; }

        [Required]
        [StringLength(50, MinimumLength = 4)]
        public string password { get; set; }

    }
    
}
