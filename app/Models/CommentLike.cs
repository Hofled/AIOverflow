
using System.ComponentModel.DataAnnotations.Schema;
using AIOverflow.Models.Comments;

namespace AIOverflow.Models.Likes
{
    public class CommentLike : Like
    {
        // Foreign key
        public int CommentId { get; set; }

        // Navigation properties
        [ForeignKey("CommentId")]
        public virtual Comment Comment { get; set; }
    }
}