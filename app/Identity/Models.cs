using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.Cookies;

namespace Identity;

public class User
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string PasswordHash { get; set; }
    public List<UserClaim> Claims { get; set; } = new List<UserClaim>();

    public ClaimsPrincipal ToClaimsPrincipal()
    {
        var claims = new List<Claim>() { new Claim("username", Name) };
        claims.AddRange(Claims.Select(c => new Claim(c.Type, c.Value)));

        var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
        return new ClaimsPrincipal(identity);
    }
}

public class UserClaim
{
    public int Id { get; set; }
    public string Type { get; set; }
    public string Value { get; set; }
}