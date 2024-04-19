using System.ComponentModel.DataAnnotations.Schema;
using AIOverflow.Identity;
using AIOverflow.Models.Posts;

namespace AIOverflow.Models.Comments
{
    public class Comment
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime EditedAt { get; set; }

        // Foreign key
        public int UserId { get; set; }
        public int PostId { get; set; }

        // Navigation properties
        [ForeignKey("UserId")]
        public User Author { get; set; }

        [ForeignKey("PostId")]
        public Post Post { get; set; }
    }
}
