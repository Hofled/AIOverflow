using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace JwtAuthenticationServer
{
    public class UserController : Controller
    {
        private readonly string _secretKey;

        // Constructor with secretKey parameter
        public UserController(string secretKey)
        {
            _secretKey = secretKey;
        }

        [HttpPost]
        [Route("register")]
        public IActionResult Register([FromBody] RegisterRequest request)
        {
            // Implementation for user registration
            var token = GenerateToken(request.Username, _secretKey);
            return Ok(new TokenResponse { Token = token });
        }

        [HttpPost]
        [Route("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            if (IsValidUser(request.Username, request.Password))
            {
                var token = GenerateToken(request.Username, _secretKey);
                return Ok(new TokenResponse { Token = token });
            }

            return Unauthorized();
        }

        [HttpPost]
        [Route("logout")]
        public IActionResult Logout()
        {
            // Implementation for user logout
            return Ok("User logged out successfully");
        }

        private bool IsValidUser(string username, string password) // TODO
        {
            // Simple validation. In a real-world application, this would involve database queries.
            // return username == UserName && password == Password;
            return true;
        }

        private string GenerateToken(string username, string secretKey)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(secretKey);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, username)
                }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }

    public class RegisterRequest
    {
        public required string Username { get; set; }
        public required string Password { get; set; }
    }

    public class LoginRequest
    {
        public required string Username { get; set; }
        public required string Password { get; set; }
    }

    public class TokenResponse
    {
        public required string Token { get; set; }
    }
}
