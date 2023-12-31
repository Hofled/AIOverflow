using System.Security.Claims;

namespace AIOverflow.Identity;

public class User
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string PasswordHash { get; set; }
    public HashSet<UserClaim> Claims { get; set; } = new HashSet<UserClaim>();

    public ClaimsPrincipal ToClaimsPrincipal(string? authenticationType)
    {
        var claims = new HashSet<Claim>() { new Claim("username", Name) };
        claims.UnionWith(Claims.Select(c => new Claim(c.Type, c.Value)));
        return new ClaimsPrincipal(new ClaimsIdentity(claims, authenticationType));
    }
}

public class UserClaim
{
    public int Id { get; set; }
    public string Type { get; set; }
    public string Value { get; set; }
}