using AIOverflow.Database;
using AIOverflow.DTOs;
using AIOverflow.Models.Comments;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AIOverflow.Services.Comments
{
    public interface ICommentService
    {
        Task<Comment> AddCommentAsync(CommentCreateDto commentDto);
        Task<Comment?> GetCommentByIdAsync(int id);
        Task<List<Comment>> GetAllCommentsByPostIdAsync(int postId);
        Task UpdateCommentAsync(int id, Comment updatedComment);
        Task DeleteCommentAsync(int id);
    }

    public class CommentsService : ICommentService
    {
        private readonly PostgresDb _db;

        public CommentsService(PostgresDb db)
        {
            _db = db;
        }

        public async Task<Comment> AddCommentAsync(CommentCreateDto commentDto)
        {
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
            return newComment;
        }

        public async Task<Comment?> GetCommentByIdAsync(int id)
        {
            return await _db.Comments
                .Include(c => c.Author)
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<List<Comment>> GetAllCommentsByPostIdAsync(int postId)
        {
            return await _db.Comments
                .Where(c => c.PostId == postId)
                .Include(c => c.Author)
                .ToListAsync();
        }

        public async Task UpdateCommentAsync(int id, Comment updatedComment)
        {
            if (id != updatedComment.Id)
            {
                throw new BadHttpRequestException("Provided ID and Comment ID do not match.");
            }

            updatedComment.EditedAt = DateTime.UtcNow;
            _db.Comments.Update(updatedComment);
            await _db.SaveChangesAsync();
        }

        public async Task DeleteCommentAsync(int id)
        {
            var comment = await _db.Comments.FindAsync(id);
            if (comment == null)
            {
                throw new Exception($"Comment with id {id} not found");
            }
            _db.Comments.Remove(comment);
            await _db.SaveChangesAsync();
        }
    }
}
