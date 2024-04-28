
using System.ComponentModel.DataAnnotations.Schema;
using AIOverflow.Models.Posts;

namespace AIOverflow.Models.Likes
{
    public class PostLike : Like
    {
        // Foreign key
        public int PostId { get; set; }

        // Navigation properties
        [ForeignKey("PostId")]
        public virtual Post Post { get; set; }
    }
}