
using System.ComponentModel.DataAnnotations.Schema;
using AIOverflow.Identity;

namespace AIOverflow.Models.Likes
{
    public abstract class Like
    {
        public int Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public int Score { get; set; }

        // Foreign key
        public int UserId { get; set; }

        // Navigation properties
        [ForeignKey("UserId")]
        public virtual User User { get; set; }
    }
}