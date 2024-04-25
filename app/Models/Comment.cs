using System.ComponentModel.DataAnnotations.Schema;
using AIOverflow.Identity;
using AIOverflow.Models.Posts;
using AIOverflow.Models.Likes;

namespace AIOverflow.Models.Comments
{
    public class Comment
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime EditedAt { get; set; }

        //navigation properties for likes on the comment
        public virtual ICollection<Like> Likes { get; set; } = new List<Like>();




        // Foreign key
        public int UserId { get; set; }
        public int PostId { get; set; }

        // Navigation properties
        [ForeignKey("UserId")]
        public virtual User Author { get; set; }

        [ForeignKey("PostId")]
        public virtual Post Post { get; set; }
    }
}
