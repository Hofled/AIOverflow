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
        return Claims.Select(c => new Claim(c.Type, c.Value)).ToArray();
    }
}

public class UserClaim
{
    public int Id { get; set; }
    public string Type { get; set; }
    public string Value { get; set; }
}

public class Post
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Content { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public int UserId { get; set; } // Assuming each post is linked to a user

    // Navigation properties
    public User User { get; set; }
}