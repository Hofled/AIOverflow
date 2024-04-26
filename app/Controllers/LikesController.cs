using Microsoft.AspNetCore.Mvc;
using AIOverflow.DTOs;
using AIOverflow.Services.Likes;


namespace AIOverflow.Controllers.Likes
{
    [ApiController]
    [Route("[controller]")]
    public class LikesController : ControllerBase
    {
        private readonly ILikeService _likeService;

        public LikesController(ILikeService likeService)
        {
            _likeService = likeService;
        }

     [HttpPost("")]
    public async Task<ActionResult<LikeDisplayDto>> CreateLike([FromBody] LikeCreateDto dto)
    {
        var like = await _likeService.AddLikeAsync(dto);
        if (like == null)
        {
            return BadRequest("Failed to create like");
        }
        return CreatedAtAction(nameof(GetLikeById), new { id = like.Id }, like);
    }


        // GET: likes/{id}
        [HttpGet("{id:int}")]
        public async Task<ActionResult<LikeDisplayDto>> GetLikeById(int id)
        {
            var like = await _likeService.GetLikeByIdAsync(id);
            if (like == null)
            {
                return NotFound();
            }
            return Ok(like);
        }

        // GET: likes/comment/{id}
        [HttpGet("comment/{id:int}")]
        public async Task<ActionResult<List<LikeDisplayDto>>> GetLikesByCommentId(int commentId)
        {
            var likes = await _likeService.GetAllLikesByCommentIdAsync(commentId);
            return Ok(likes);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLike(int id)
        {
            try
            {
                await _likeService.DeleteLikeAsync(id);
                return NoContent(); // Indicates successful deletion without returning data
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}