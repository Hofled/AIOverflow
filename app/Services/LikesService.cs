using AIOverflow.Database;
using AIOverflow.DTOs;
using AIOverflow.Models.Likes;

namespace AIOverflow.Services.Likes
{
    public interface ILikeService
    {
        Task<LikeDisplayDto> AddLikeAsync(LikeCreateDto likeDto);
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
    public async Task<LikeDisplayDto> AddLikeAsync(LikeCreateDto likeDto)
    {
        Console.WriteLine("Adding a like to a comment");
        Console.WriteLine($"Comment ID: {likeDto.CommentId}, User ID: {likeDto.UserId}");

        var newLike = new Like
        {
            CommentId = likeDto.CommentId,
            UserId = likeDto.UserId,
            CreatedAt = DateTime.UtcNow,
        };

        await _db.AddLikeAsync(newLike);
        await _db.SaveChangesAsync(); // Ensure changes are committed to the database.

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
    private LikeDisplayDto _ToLikeDisplayDto(Like like)
    {
        var userDto = like.User != null ? new UserDto
        {
            Id = like.User.Id,
            Name = like.User.Name
        } : null;  // Handle null User properly

        return new LikeDisplayDto
        {
            Id = like.Id,
            CreatedAt = like.CreatedAt,
            User = userDto,
            UserId = like.UserId,      // Set the UserId
            CommentId = like.CommentId // Set the CommentId
        };
    }




    }
}

       