using AIOverflow.Database;
using AIOverflow.DTOs;
using AIOverflow.Models.Comments;
using Microsoft.EntityFrameworkCore;

namespace AIOverflow.Services.Comments
{
    public interface ICommentService
    {
        Task<CommentDisplayDto> AddCommentAsync(CommentCreateDto commentDto, int authorID);
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
        public async Task<CommentDisplayDto> AddCommentAsync(CommentCreateDto commentDto, int authorID)
        {
            // if (!await _db.Posts.AnyAsync(p => p.Id == commentDto.PostId))
            //     throw new ArgumentException("Post with the provided ID does not exist");

            // if (!await _db.Users.AnyAsync(u => u.Id == commentDto.UserId))
            //     throw new ArgumentException("User with the provided ID does not exist.");

            var now = DateTime.UtcNow;

            var newComment = new Comment
            {
                Content = commentDto.Content,
                PostId = commentDto.PostId,
                UserId = authorID,
                CreatedAt = now,
                EditedAt = now,
            };

            await _db.AddCommentAsync(newComment);

            return _ToCommentDisplayDto(newComment);
        }



        public async Task<CommentDisplayDto?> GetCommentByIdAsync(int id)
        {
            var comment = await _db.GetCommentByIdAsync(id);

            if (comment == null) return null;

            return _ToCommentDisplayDto(comment);
        }


        public async Task<List<CommentDisplayDto>> GetAllCommentsByPostIdAsync(int postId)
        {
            var comments = await _db.GetAllCommentsByPostIdAsync(postId);

            return comments.Select(c => _ToCommentDisplayDto(c)).ToList();
        }

        public async Task UpdateCommentAsync(int id, CommentUpdateDto commentDto)
        {
            var comment = await _db.GetCommentByIdAsync(id);
            if (comment == null)
            {
                throw new BadHttpRequestException($"Comment with id {id} not found");
            }

            comment.Content = commentDto.Content;  // Update only the content or other updatable fields
            comment.EditedAt = DateTime.UtcNow;
            await _db.UpdateCommentAsync(comment);
        }

        public async Task DeleteCommentAsync(int id)
        {
            await _db.DeleteCommentAsync(id);
        }

        private CommentDisplayDto _ToCommentDisplayDto(Comment comment)
        {
            return new CommentDisplayDto
            {
                Id = comment.Id,
                Content = comment.Content,
                CreatedAt = comment.CreatedAt,
                Author = new UserDto { Id = comment.Author.Id, Name = comment.Author.Name }
            };
        }
    }
}