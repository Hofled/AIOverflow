
using System.ComponentModel.DataAnnotations.Schema;
using AIOverflow.Identity;
using AIOverflow.Models.Posts;
using AIOverflow.Models.Comments;

namespace AIOverflow.Models.Likes
{
    public class Like
    {
        public int Id { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Foreign key
        public int UserId { get; set; }
        public int CommentId { get; set; }

        // Navigation properties
        [ForeignKey("UserId")]
        public virtual User User { get; set; }

        [ForeignKey("PostId")]
        
        public virtual Comment Comment { get; set; }
    }
}