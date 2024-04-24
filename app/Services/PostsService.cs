using AIOverflow.Database;
using AIOverflow.DTOs;
using AIOverflow.Models.Posts;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace AIOverflow.Services.Posts
{
    public class PostsService : IPostService
    {
        private readonly PostgresDb _db;

        public PostsService(PostgresDb db)
        {
            _db = db;
        }

        public async Task<PostDisplayDto> AddPostAsync(PostCreateDto postDto)
        {
            var now = DateTime.UtcNow;
            var newPost = new Post
            {
                Title = postDto.Title,
                Content = postDto.Content,
                UserId = postDto.UserId,
                CreatedAt = now,
                EditedAt = now
            };

            await _db.Posts.AddAsync(newPost);
            await _db.SaveChangesAsync();

            // Convert to DTO before returning
            return new PostDisplayDto
            {
                Id = newPost.Id,
                Title = newPost.Title,
                Content = newPost.Content,
                CreatedAt = newPost.CreatedAt,
                EditedAt = newPost.EditedAt,
                Author = new UserDto { Id = newPost.Author.Id, Name = newPost.Author.Name },
                Comments = newPost.Comments.Select(c => new CommentDisplayDto
                {
                    Id = c.Id,
                    Content = c.Content,
                    CreatedAt = c.CreatedAt,
                    Author = new UserDto { Id = c.Author.Id, Name = c.Author.Name }
                }).ToList()
            };
        }

        public async Task<List<PostDisplayDto>> GetAllPostsAsync()
        {
            var posts = await _db.Posts
                                 .Include(p => p.Comments)
                                 .ThenInclude(c => c.Author)
                                 .Include(p => p.Author)
                                 .ToListAsync();

            return posts.Select(p => new PostDisplayDto
            {
                Id = p.Id,
                Title = p.Title,
                Content = p.Content,
                CreatedAt = p.CreatedAt,
                EditedAt = p.EditedAt,
                Author = new UserDto { Id = p.Author.Id, Name = p.Author.Name },
                Comments = p.Comments.Select(c => new CommentDisplayDto
                {
                    Id = c.Id,
                    Content = c.Content,
                    CreatedAt = c.CreatedAt,
                    Author = new UserDto { Id = c.Author.Id, Name = c.Author.Name }
                }).ToList()
            }).ToList();
        }

        public async Task<PostDisplayDto?> GetPostByIdAsync(int id)
        {
            var post = await _db.Posts
                                .Include(p => p.Comments)
                                .ThenInclude(c => c.Author)
                                .Include(p => p.Author)
                                .FirstOrDefaultAsync(p => p.Id == id);

            if (post == null) return null;

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
                }).ToList()
            };
        }

        public async Task UpdatePostAsync(int id, PostUpdateDto postDto)
        {
            var post = await _db.Posts.FindAsync(id);
            if (post == null)
                throw new BadHttpRequestException("Post not found");

            post.Title = postDto.Title;
            post.Content = postDto.Content;
            post.EditedAt = DateTime.UtcNow;
            
            _db.Posts.Update(post);
            await _db.SaveChangesAsync();
        }

        public async Task DeletePostAsync(int id)
        {
            var post = await _db.Posts.FindAsync(id);
            if (post != null)
            {
                _db.Posts.Remove(post);
                await _db.SaveChangesAsync();
            }
        }
    }

    public interface IPostService
    {
        Task<PostDisplayDto> AddPostAsync(PostCreateDto postDto);
        Task<List<PostDisplayDto>> GetAllPostsAsync();
        Task<PostDisplayDto?> GetPostByIdAsync(int id);
        Task UpdatePostAsync(int id, PostUpdateDto postDto);
        Task DeletePostAsync(int id);
    }
}
