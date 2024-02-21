using System.Security.Claims;

namespace AIOverflow.Identity;

public class User
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string PasswordHash { get; set; }
    public HashSet<UserClaim> Claims { get; set; } = new HashSet<UserClaim>();

    public Claim[] ToClaimsArray()
    {
        var claims = new HashSet<Claim>() { new Claim("username", Name) };
        claims.UnionWith(Claims.Select(c => new Claim(c.Type, c.Value)));
        return claims.ToArray();
    }
}

public class UserClaim
{
    public int Id { get; set; }
    public string Type { get; set; }
    public string Value { get; set; }
}