namespace AIOverflow.DTOs
{
    public class CommentCreateDto
    {
        public string Content { get; set; }
        public int PostId { get; set; }
        public int UserId { get; set; }
    }

    public class CommentDisplayDto
    {
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; }
        public UserDto Author { get; set; }
    }

    public class UserDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
}
