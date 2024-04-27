
using System.ComponentModel.DataAnnotations.Schema;
using AIOverflow.Identity;
using AIOverflow.Models.Posts;
using AIOverflow.Models.Comments;

namespace AIOverflow.Models.Likes
{
    public class Like
    {
        public int Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public int Score { get; set; }

        // Foreign key
        public int UserId { get; set; }
        public int? CommentId { get; set; }
        public int? PostId { get; set; }

        // Navigation properties
        [ForeignKey("UserId")]
        public virtual User User { get; set; }
        [ForeignKey("CommentId")]
        public virtual Comment Comment { get; set; }
        [ForeignKey("PostId")]
        public virtual Post Post { get; set; }
    }
}