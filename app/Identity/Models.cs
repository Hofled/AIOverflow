using System.Security.Claims;
using AIOverflow.Models.Comments;
using AIOverflow.Models.Posts;
using AIOverflow.Models.Likes;

namespace AIOverflow.Identity;

public class User
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string PasswordHash { get; set; }
    public HashSet<UserClaim> Claims { get; set; } = new HashSet<UserClaim>();
    public virtual ICollection<Post> Posts { get; set; }
    public virtual ICollection<Comment> Comments { get; set; }
    public virtual ICollection<PostLike> PostLikes { get; set; }
    public virtual ICollection<CommentLike> CommentLikes { get; set; }


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

