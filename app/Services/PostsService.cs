using AIOverflow.Database;
using AIOverflow.DTOs;
using AIOverflow.Models.Posts;

namespace AIOverflow.Services.Posts
{
    public interface IPostService
    {
        Task<PostDisplayDto> AddPostAsync(PostCreateDto postDto, int userID);
        Task<List<PostDisplayDto>> GetAllPostsAsync();
        Task<PostDisplayDto?> GetPostByIdAsync(int id);
        Task UpdatePostAsync(int id, PostUpdateDto postDto);
        Task DeletePostAsync(int id);
        Task<int> SetPostVoteAsync(int id, SetVoteDto setVoteDto);
    }

    public class PostsService : IPostService
    {
        private readonly PostgresDb _db;

        public PostsService(PostgresDb db)
        {
            _db = db;
        }

        public async Task<PostDisplayDto> AddPostAsync(PostCreateDto postDto, int userID)
        {
            var now = DateTime.UtcNow;
            var newPost = new Post
            {
                Title = postDto.Title,
                Content = postDto.Content,
                UserId = userID,
                CreatedAt = now,
                EditedAt = now
            };

            await _db.AddPostAsync(newPost);
            // Convert to DTO before returning
            return _ToPostDisplayDto(newPost);
        }

        public async Task<List<PostDisplayDto>> GetAllPostsAsync()
        {
            var posts = await _db.GetAllPostsAsync();
            return posts.Select(p => _ToPostDisplayDto(p)).ToList();
        }

        public async Task<PostDisplayDto?> GetPostByIdAsync(int id)
        {
            var post = await _db.GetPostByIdAsync(id);

            if (post == null)
            {
                return null;
            };

            return _ToPostDisplayDto(post);
        }

        public async Task UpdatePostAsync(int id, PostUpdateDto postDto)
        {
            var post = await _db.GetPostByIdAsync(id);
            if (post == null)
            {
                throw new BadHttpRequestException("Post not found");
            }

            post.Title = postDto.Title;
            post.Content = postDto.Content;
            post.EditedAt = DateTime.UtcNow;

            await _db.UpdatePostAsync(post);
        }

        public async Task DeletePostAsync(int id)
        {
            await _db.DeletePostAsync(id);
        }

        public async Task<int> SetPostVoteAsync(int id, SetVoteDto setVoteDto)
        {
            return await _db.SetPostVoteAsync(id, setVoteDto.UserId, setVoteDto.Score);
        }

        private PostDisplayDto _ToPostDisplayDto(Post post)
        {
            return new PostDisplayDto
            {
                Id = post.Id,
                Title = post.Title,
                Content = post.Content,
                CreatedAt = post.CreatedAt,
                EditedAt = post.EditedAt,
                Author = new UserDto { Id = post.Author.Id, Name = post.Author.Name },
                Comments = post.Comments.Select(c => new CommentDisplayDto
                {
                    Id = c.Id,
                    Content = c.Content,
                    CreatedAt = c.CreatedAt,
                    Author = new UserDto { Id = c.Author.Id, Name = c.Author.Name }
                }).ToList(),
                Likes = post.Likes.Select(l => new LikeDisplayDto
                {
                    Id = l.Id,
                    CreatedAt = l.CreatedAt,
                    User = new UserDto { Id = l.User.Id, Name = l.User.Name },
                    Score = l.Score
                }).ToList()
            };
        }
    }
}
