using AIOverflow.Database;
using AIOverflow.DTOs;
using AIOverflow.Models.Likes;

namespace AIOverflow.Services.Likes
{
    public interface ILikeService
    {
        Task<LikeDisplayDto> AddLikeAsync(LikeCreateDto likeDto, int authorID);
        Task<LikeDisplayDto?> GetLikeByIdAsync(int id);
        Task<List<LikeDisplayDto>> GetAllLikesByCommentIdAsync(int commentId);
        Task DeleteLikeAsync(int id);
    }

    public class LikesService : ILikeService
    {
        private readonly PostgresDb _db;

        public LikesService(PostgresDb db)
        {
            _db = db;
        }
        public async Task<LikeDisplayDto> AddLikeAsync(LikeCreateDto likeDto, int authorID)
        {
            
            var now = DateTime.UtcNow;

            var newLike = new Like
            {
                CommentId = likeDto.CommentId,
                UserId = authorID,
                CreatedAt = now,
            };

            await _db.AddLikeAsync(newLike);

            return _ToLikeDisplayDto(newLike);
        }

        public async Task<LikeDisplayDto?> GetLikeByIdAsync(int id)
        {
            var like = await _db.GetLikeByIdAsync(id);

            if (like == null) return null;

            return _ToLikeDisplayDto(like);
        }

        public async Task<List<LikeDisplayDto>> GetAllLikesByCommentIdAsync(int commentId)
        {
            var likes = await _db.GetAllLikesByCommentIdAsync(commentId);

            return likes.Select(_ToLikeDisplayDto).ToList();
        }

        public async Task DeleteLikeAsync(int id)
        {
            await _db.DeleteLikeAsync(id);
        }

        private static LikeDisplayDto _ToLikeDisplayDto(Like like)
        {
            return new LikeDisplayDto
            {
                Id = like.Id,
                CreatedAt = like.CreatedAt,
                
                User = new UserDto
                {
                    Id = like.User.Id,
                    Name = like.User.Name,
              
                },
            };
        }

    }
}

       