using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AIOverflow.Database;
using AIOverflow.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace JwtAuthenticationServer
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly string _secretKey;
        private readonly PostgresDb _db;
        private readonly IPasswordHasher<User> _passwordHasher;

        public UserController(JwtSecretKeyDependency secretKey, PostgresDb db, IPasswordHasher<User> passwordHasher)
        {
            _secretKey = secretKey.SecretKey;
            _db = db;
            _passwordHasher = passwordHasher;
        }

        [HttpPost]
        [Route("register")]
        public async Task<ActionResult<TokenResponse>> RegisterAsync([FromBody] RegisterRequest request)
        {
            if (_db.UserExists(request.Username))
            {
                return Conflict($"The username {request.Username} already exists");
            }

            var user = new User { Name = request.Username, Claims = { new UserClaim { Type = ClaimTypes.NameIdentifier, Value = request.Username } } };

            var hashedPassword = _passwordHasher.HashPassword(user, request.Password);
            user.PasswordHash = hashedPassword;

            await _db.AddUserAsync(user);

            var token = GenerateUserToken(user, _secretKey);
            return new TokenResponse { Token = token };
        }

        [HttpPost]
        [Route("login")]
        public async Task<ActionResult<TokenResponse>> LoginAsync([FromBody] LoginRequest request)
        {
            var user = await _db.GetUserByNameAsync(request.Username);
            if (user == null)
            {
                return Unauthorized("Invalid credentials");
            }

            if (IsValidUser(user, request.Password, _passwordHasher))
            {
                var token = GenerateUserToken(user, _secretKey);
                return new TokenResponse { Token = token };
            }

            return Unauthorized();
        }


        [HttpGet]
        [Route("info")]
        public async Task<ActionResult<InfoResponse>> InfoAsync()
        {
            var userClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if (userClaim == null)
            {
                return Unauthorized();
            }


            var user = await _db.GetUserByNameAsync(userClaim.Value);
            if (user == null)
            {
                return NotFound("User not found");
            }

            return new InfoResponse { Name = user.Name };
        }

        private bool IsValidUser(User user, string password, IPasswordHasher<User> passwordHasher)
        {
            return passwordHasher.VerifyHashedPassword(user, user.PasswordHash, password) != PasswordVerificationResult.Failed;
        }

        private string GenerateUserToken(User user, string secretKey)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(secretKey);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(user.ToClaimsArray()),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }

    public class RegisterRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }

    public class LoginRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }

    public class InfoResponse
    {
        public string Name { get; set; }
    }

    public class TokenResponse
    {
        public string Token { get; set; }
    }
}
