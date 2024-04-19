using Microsoft.AspNetCore.Mvc;
using AIOverflow.DTOs;
using AIOverflow.Services.Comments; // Ensure this namespace is correct
using System;
using System.Threading.Tasks;
using AIOverflow.Models.Comments;


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
        public async Task<ActionResult<Comment>> CreateComment(CommentCreateDto dto)
        {
            try
            {
                var comment = await _commentService.AddCommentAsync(dto);
                return CreatedAtAction(nameof(GetComment), new { id = comment.Id }, comment);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message); // Handle exceptions according to the nature of the error
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Comment>> GetComment(int id)
        {
            var comment = await _commentService.GetCommentByIdAsync(id);
            if (comment == null)
            {
                return NotFound();
            }
            return comment;
        }

        // Consider adding other methods like Update and Delete if needed
    }
}
