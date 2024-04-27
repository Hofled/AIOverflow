using System.ComponentModel.DataAnnotations.Schema;
using AIOverflow.Identity;
using AIOverflow.Models.Comments;
using AIOverflow.Models.Likes;

namespace AIOverflow.Models.Posts
{
    public class Post
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime EditedAt { get; set; }

        // Foreign key
        public int UserId { get; set; }

        // Navigation property
        [ForeignKey("UserId")]
        public virtual User Author { get; set; }

        // Navigation property for comments on the post
        public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();
        // Navigation property for likes on the post
        public virtual ICollection<Like> Likes { get; set; } = new List<Like>();
    }
}
