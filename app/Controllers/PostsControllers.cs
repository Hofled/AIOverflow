using Microsoft.AspNetCore.Mvc;
using AIOverflow.DTOs;
using AIOverflow.Services.Posts;

namespace AIOverflow.Controllers.Posts
{
    [ApiController]
    [Route("[controller]")] // Ensures the route matches the controller name
    public class PostsController : ControllerBase
    {
        private readonly IPostService _postService;

        public PostsController(IPostService postService)
        {
            _postService = postService;
        }

        // GET: posts
        [HttpGet("")]
        public async Task<ActionResult<List<PostDisplayDto>>> GetPostsAsync()
        {
            var posts = await _postService.GetAllPostsAsync();
            return Ok(posts);
        }

        // GET: posts/{id}
        [HttpGet("{id:int}")]
        public async Task<ActionResult<PostDisplayDto>> GetPostByIdAsync(int id)
        {
            var post = await _postService.GetPostByIdAsync(id);
            if (post == null)
            {
                return NotFound();
            }
            return Ok(post);
        }

        // POST: posts
        [HttpPost("")]
        public async Task<ActionResult<PostDisplayDto>> CreatePostAsync([FromBody] PostCreateDto postDto)
        {
            var idClaim = User.Claims.FirstOrDefault(c => c.Type == "ID");
            if (idClaim == null)
            {
                return Unauthorized();
            }

            var newPost = await _postService.AddPostAsync(postDto, int.Parse(idClaim.Value));
            return CreatedAtAction("GetPostById", new { id = newPost.Id }, newPost);
        }

        // PUT: posts/{id}
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdatePostAsync(int id, [FromBody] PostUpdateDto postDto)
        {
            try
            {
                await _postService.UpdatePostAsync(id, postDto);
                return NoContent(); // Indicating successful update without returning data
            }
            catch (BadHttpRequestException e)
            {
                return BadRequest(e.Message);
            }
            catch (System.Exception e)
            {
                if (!string.IsNullOrEmpty(e.Message))
                {
                    return NotFound();
                }
                throw;
            }
        }

        // DELETE: posts/{id}
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeletePostAsync(int id)
        {
            try
            {
                await _postService.DeletePostAsync(id);
                return NoContent(); // Indicates successful deletion without returning data
            }
            catch (System.Exception)
            {
                return NotFound();
            }
        }

        // POST: posts/{id}/setLikeScore
        [HttpPost("{id:int}/setLikeScore")]
        public async Task<ActionResult<int>> SetPostLikeScore(int id, [FromBody] LikeSetDto likeSetDto)
        {
            try
            {
                var idClaim = User.Claims.FirstOrDefault(c => c.Type == "ID");
                if (idClaim == null)
                {
                    return Unauthorized();
                }

                var newScore = await _postService.SetPostLikeAsync(id, int.Parse(idClaim.Value), likeSetDto.Score);
                return Ok(newScore);
            }
            catch (System.Exception)
            {
                return NotFound();
            }
        }
    }
}
