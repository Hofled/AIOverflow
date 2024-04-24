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
    public int Id { get; set; }
    public string Content { get; set; }
    public DateTime CreatedAt { get; set; }
    public UserDto Author { get; set; }
    // Remove PostDto or any reference that might lead back to PostDto
}

    public class CommentUpdateDto
    {
        public string Content { get; set; }
    }


    public class UserDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }

    public class PostCreateDto
    {
        public string Title { get; set; }
        public string Content { get; set; }
        public int UserId { get; set; }
    }

 public class PostDisplayDto
{
    public int Id { get; set; }  // It's good to include the ID for reference
    public string Title { get; set; }
    public string Content { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime EditedAt { get; set; }
    public UserDto Author { get; set; }
    public List<CommentDisplayDto> Comments { get; set; } = new List<CommentDisplayDto>();
}


    public class PostUpdateDto
    {
        public string Title { get; set; }
        public string Content { get; set; }
    }


}
