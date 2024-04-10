using System.ComponentModel.DataAnnotations.Schema;
using AIOverflow.Identity;

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
        public User Author { get; set; }
    }
}
