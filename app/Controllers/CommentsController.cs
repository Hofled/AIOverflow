using Microsoft.AspNetCore.Mvc;
using AIOverflow.DTOs;
using AIOverflow.Services.Comments;

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

        // POST: Comments
        [HttpPost("")]
        public async Task<ActionResult<CommentDisplayDto>> CreateComment([FromBody] CommentCreateDto dto)
        {
            var idClaim = User.Claims.FirstOrDefault(c => c.Type == "ID");
            if (idClaim == null)
            {
                return Unauthorized();
            }

            var comment = await _commentService.AddCommentAsync(dto, int.Parse(idClaim.Value));
            return CreatedAtAction(nameof(GetCommentById), new { id = comment.Id }, comment);
        }

        // GET: comments/{id}
        [HttpGet("{id:int}")]
        public async Task<ActionResult<CommentDisplayDto>> GetCommentById(int id)
        {
            var comment = await _commentService.GetCommentByIdAsync(id);
            if (comment == null)
            {
                return NotFound();
            }
            return Ok(comment);
        }

        // GET: comments/post/{id}
        [HttpGet("post/{id:int}")]
        public async Task<ActionResult<List<CommentDisplayDto>>> GetCommentsByPostId(int postId)
        {
            var comments = await _commentService.GetAllCommentsByPostIdAsync(postId);
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
            catch (BadHttpRequestException e)
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
            catch (System.Exception)
            {
                return NotFound();
            }
        }
    }
}
