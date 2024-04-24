using Microsoft.AspNetCore.Mvc;
using AIOverflow.DTOs;
using AIOverflow.Services.Comments;
using System.Threading.Tasks;

namespace AIOverflow.Controllers.Comments
{
    [ApiController]
    [Route("[controller]")]
    public class CommentsController : ControllerBase
    {
        private readonly ICommentService _commentService;

        public CommentsController(ICommentService commentService)
        {
            _commentService = commentService;
        }

        [HttpPost]
        public async Task<ActionResult<CommentDisplayDto>> CreateComment([FromBody] CommentCreateDto dto)
        {
            try
            {
                var comment = await _commentService.AddCommentAsync(dto);
                return CreatedAtAction(nameof(GetComment), new { id = comment.Id }, comment);
            }
            catch (System.Exception e)
            {
                return BadRequest(e.Message); // Handle exceptions according to the nature of the error
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CommentDisplayDto>> GetComment(int id)
        {
            var comment = await _commentService.GetCommentByIdAsync(id);
            if (comment == null)
            {
                return NotFound();
            }
            return Ok(comment);
        }

        [HttpGet("ByPost/{postId}")]
        public async Task<ActionResult<List<CommentDisplayDto>>> GetCommentsByPostId(int postId)
        {
            var comments = await _commentService.GetAllCommentsByPostIdAsync(postId);
            if (comments == null || !comments.Any())
            {
                return NotFound($"No comments found for post with ID {postId}.");
            }
            return Ok(comments);
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateComment(int id, [FromBody] CommentUpdateDto commentDto)
        {
            try
            {
                await _commentService.UpdateCommentAsync(id, commentDto);
                return NoContent(); // Indicates successful update without returning data
            }
            catch (System.Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteComment(int id)
        {
            try
            {
                await _commentService.DeleteCommentAsync(id);
                return NoContent(); // Indicates successful deletion without returning data
            }
            catch (System.Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}
