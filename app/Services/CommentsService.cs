using AIOverflow.Database;
using AIOverflow.DTOs;
using AIOverflow.Models.Comments;

namespace AIOverflow.Services.Comments
{
    public interface ICommentService
    {
        Task<CommentDisplayDto> AddCommentAsync(CommentCreateDto commentDto, int authorID);
        Task<CommentDisplayDto?> GetCommentByIdAsync(int id);
        Task<List<CommentDisplayDto>> GetAllCommentsByPostIdAsync(int postId);
        Task UpdateCommentAsync(int id, CommentUpdateDto commentDto);
        Task DeleteCommentAsync(int id);
        Task<int> SetCommentLikeAsync(int commentId, int userId, int score);
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

            return comments.Select(_ToCommentDisplayDto).ToList();
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

        public async Task<int> SetCommentLikeAsync(int commentId, int userId, int score)
        {
            return await _db.SetCommentLikeAsync(commentId, userId, score);
        }

        private CommentDisplayDto _ToCommentDisplayDto(Comment comment)
        {
            var likesDict = comment.Likes.ToDictionary(l => l.UserId, l => new LikeDisplayDto
            {
                Id = l.Id,
                CreatedAt = l.CreatedAt,
                Score = l.Score,
                User = new UserDto { Id = l.User.Id, Name = l.User.Name }
            });

            return new CommentDisplayDto
            {
                Id = comment.Id,
                Content = comment.Content,
                CreatedAt = comment.CreatedAt,
                Author = new UserDto { Id = comment.Author.Id, Name = comment.Author.Name },
                Likes = likesDict
            };
        }
    }
}
