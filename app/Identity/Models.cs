using System.Security.Claims;
using System.Collections.Generic;
using AIOverflow.Models.Comments;

namespace AIOverflow.Identity;

public class User
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string PasswordHash { get; set; }
    public HashSet<UserClaim> Claims { get; set; } = new HashSet<UserClaim>();

    public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();


    public Claim[] ToClaimsArray()
    {
        return Claims.Select(c => new Claim(c.Type, c.Value)).ToArray();
    }
}

public class UserClaim
{
    public int Id { get; set; }
    public string Type { get; set; }
    public string Value { get; set; }
}

