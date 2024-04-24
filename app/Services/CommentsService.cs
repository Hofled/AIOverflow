using AIOverflow.Database;
using AIOverflow.DTOs;
using AIOverflow.Models.Comments;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AIOverflow.Services.Comments
{
    public interface ICommentService
    {
        Task<CommentDisplayDto> AddCommentAsync(CommentCreateDto commentDto);
        Task<CommentDisplayDto?> GetCommentByIdAsync(int id);
        Task<List<CommentDisplayDto>> GetAllCommentsByPostIdAsync(int postId);
        Task UpdateCommentAsync(int id, CommentUpdateDto commentDto);
        Task DeleteCommentAsync(int id);
    }

    public class CommentsService : ICommentService
    {
        private readonly PostgresDb _db;

        public CommentsService(PostgresDb db)
        {
            _db = db;
        }
public async Task<CommentDisplayDto> AddCommentAsync(CommentCreateDto commentDto)
{
    if (!await _db.Posts.AnyAsync(p => p.Id == commentDto.PostId))
        throw new ArgumentException("Post with the provided ID does not exist");

    if (!await _db.Users.AnyAsync(u => u.Id == commentDto.UserId))
        throw new ArgumentException("User with the provided ID does not exist.");

    var newComment = new Comment
    {
        Content = commentDto.Content,
        UserId = commentDto.UserId,
        PostId = commentDto.PostId,
        CreatedAt = DateTime.UtcNow,
        EditedAt = DateTime.UtcNow
    };

    _db.Comments.Add(newComment);
    await _db.SaveChangesAsync();

    // Load the Author explicitly if needed
    await _db.Entry(newComment).Reference(c => c.Author).LoadAsync();

    return new CommentDisplayDto
    {
        Id = newComment.Id,  // This should now reflect the actual ID assigned by the database
        Content = newComment.Content,
        CreatedAt = newComment.CreatedAt,
        Author = new UserDto { Id = newComment.Author.Id, Name = newComment.Author.Name }
    };
}



    public async Task<CommentDisplayDto?> GetCommentByIdAsync(int id)
    {
        var comment = await _db.Comments
                            .Include(c => c.Author)
                            .FirstOrDefaultAsync(c => c.Id == id);

        if (comment == null) return null;

        return new CommentDisplayDto
        {
            Id = comment.Id,
            Content = comment.Content,
            CreatedAt = comment.CreatedAt,
            Author = new UserDto { Id = comment.Author.Id, Name = comment.Author.Name }
        };
    }


        public async Task<List<CommentDisplayDto>> GetAllCommentsByPostIdAsync(int postId)
        {
            var comments = await _db.Comments
                                    .Where(c => c.PostId == postId)
                                    .Include(c => c.Author)
                                    .ToListAsync();

            return comments.Select(c => new CommentDisplayDto
            {
                Id = c.Id,  // Ensure this mapping is correctly assigned
                Content = c.Content,
                CreatedAt = c.CreatedAt,
                Author = new UserDto { Id = c.Author.Id, Name = c.Author.Name }
            }).ToList();
        }

        public async Task UpdateCommentAsync(int id, CommentUpdateDto commentDto)
        {
            var comment = await _db.Comments.FindAsync(id);
            if (comment == null)
                throw new Exception($"Comment with id {id} not found");

            comment.Content = commentDto.Content;  // Update only the content or other updatable fields
            comment.EditedAt = DateTime.UtcNow;
            _db.Comments.Update(comment);
            await _db.SaveChangesAsync();
        }



        public async Task DeleteCommentAsync(int id)
        {
            var comment = await _db.Comments.FindAsync(id);
            if (comment != null)
            {
                _db.Comments.Remove(comment);
                await _db.SaveChangesAsync();
            }
        }
    }
}
