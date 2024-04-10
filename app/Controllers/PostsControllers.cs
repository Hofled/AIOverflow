using Microsoft.AspNetCore.Mvc;
using AIOverflow.Models.Posts;
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
        public async Task<ActionResult<List<Post>>> GetPostsAsync()
        {
            return await _postService.GetAllPostsAsync();
        }

        // GET: posts/{id}
        [HttpGet("{id:int}")] // Specify the type of id to reinforce route matching
        public async Task<ActionResult<Post>> GetPostByIdAsync(int id)
        {
            var post = await _postService.GetPostByIdAsync(id);
            if (post == null)
            {
                return NotFound();
            }
            return post;
        }

        // POST: posts
        [HttpPost("")]
        public async Task<ActionResult<Post>> CreatePostAsync([FromBody] PostCreateDto postDto)
        {
            var newPost = await _postService.AddPostAsync(postDto);
            return CreatedAtAction("GetPostById", new { id = newPost.Id }, newPost);
        }

        // PUT: posts/{id}
        [HttpPut("{id:int}")]
        public async Task<ActionResult<Post>> UpdatePostAsync(int id, [FromBody] Post updatedPost)
        {
            try
            {
                await _postService.UpdatePostAsync(id, updatedPost);
            }

            catch (BadHttpRequestException e)
            {
                return BadRequest(e.Message);
            }
            catch (Exception e)
            {
                if (!String.IsNullOrEmpty(e.Message))
                {
                    return NotFound();
                }

                throw;
            }

            return NoContent(); // Consider returning NoContent for PUT as per RESTful conventions
        }

        // DELETE: posts/{id}
        [HttpDelete("{id:int}")] // Specify the type of id to reinforce route matching
        public async Task<IActionResult> DeletePostAsync(int id)
        {
            try
            {
                await _postService.DeletePostAsync(id);
            }
            catch (Exception)
            {
                return NotFound();
            }

            return NoContent(); // Returning NoContent as per RESTful conventions
        }
    }
}
