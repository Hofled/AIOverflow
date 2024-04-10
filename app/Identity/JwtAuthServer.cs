using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AIOverflow.Identity;
using AIOverflow.Services.Users;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace JwtAuthenticationServer
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly string _secretKey;
        private readonly IUserService _userService;

        public UserController(JwtSecretKeyDependency secretKey, IUserService userService)
        {
            _userService = userService;
            _secretKey = secretKey.SecretKey;
        }

        [HttpPost]
        [Route("register")]
        public async Task<ActionResult<TokenResponse>> RegisterAsync([FromBody] RegisterRequest request)
        {
            try
            {
                var user = await _userService.RegisterAsync(request.Username, request.Password);
                var token = GenerateUserToken(user, _secretKey);
                return new TokenResponse { Token = token };
            }
            catch (UserConflictException e)
            {
                return Conflict(e.Message);
            }
        }

        [HttpPost]
        [Route("login")]
        public async Task<ActionResult<TokenResponse>> LoginAsync([FromBody] LoginRequest request)
        {
            try
            {
                var user = await _userService.LoginAsync(request.Username, request.Password);
                var token = GenerateUserToken(user, _secretKey);
                return new TokenResponse { Token = token };

            }
            catch (UnauthorizedException e)
            {
                return Unauthorized(e.Message);
            }
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


            var user = await _userService.GetUserByNameAsync(userClaim.Value);
            if (user == null)
            {
                return NotFound("User not found");
            }

            return new InfoResponse { Name = user.Name };
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
