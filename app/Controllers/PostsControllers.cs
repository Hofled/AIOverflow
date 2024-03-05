using AIOverflow.Database;
using Microsoft.AspNetCore.Mvc;
using AIOverflow.Models.Posts;
using Microsoft.EntityFrameworkCore;
using AIOverflow.DTOs;

namespace AIOverflow.Controllers.Posts
{
    [ApiController]
    [Route("[controller]")] // Ensures the route matches the controller name
    public class PostsController : ControllerBase
    {
        private readonly PostgresDb _db;

        public PostsController(PostgresDb db)
        {
            _db = db;
        }

        // GET: posts
        [HttpGet("")]
        public async Task<ActionResult<List<Post>>> GetPostsAsync()
        {
            var posts = await _db.Posts.Include(p => p.User).ToListAsync();
            return Ok(posts); // Explicitly returning Ok() with the data
        }

        // GET: posts/{id}
        [HttpGet("{id:int}")] // Specify the type of id to reinforce route matching
        public async Task<ActionResult<Post>> GetPostByIdAsync(int id)
        {
            var post = await _db.Posts.Include(p => p.User).FirstOrDefaultAsync(p => p.Id == id);
            if (post == null)
            {
                return NotFound();
            }
            return Ok(post); // Explicitly returning Ok() with the data
        }

        // POST: posts
        [HttpPost("")]
        public async Task<ActionResult<Post>> CreatePostAsync([FromBody] PostCreateDto postDto)
        {
            var post = new Post
            {
                Title = postDto.Title,
                Content = postDto.Content,
                UserId = postDto.UserId,
                CreatedAt = DateTime.UtcNow,
                EditedAt = DateTime.UtcNow
            };

            await _db.Posts.AddAsync(post);
            await _db.SaveChangesAsync();

            // Using nameof to ensure the correct action method is referenced
            // and providing a route value that matches the parameter name and type of the action method intended for redirection.
            return CreatedAtAction(nameof(GetPostByIdAsync), new { id = post.Id }, post);
        }

        // PUT: posts/{id}
        [HttpPut("{id:int}")] 
        public async Task<ActionResult<Post>> UpdatePostAsync(int id, [FromBody] Post updatedPost)
        {
            if (id != updatedPost.Id)
            {
                return BadRequest();
            }

            _db.Entry(updatedPost).State = EntityState.Modified;

            try
            {
                await _db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PostExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent(); // Consider returning NoContent for PUT as per RESTful conventions
        }

        // DELETE: posts/{id}
        [HttpDelete("{id:int}")] // Specify the type of id to reinforce route matching
        public async Task<IActionResult> DeletePostAsync(int id)
        {
            var post = await _db.Posts.FindAsync(id);
            if (post == null)
            {
                return NotFound();
            }

            _db.Posts.Remove(post);
            await _db.SaveChangesAsync();

            return NoContent(); // Returning NoContent as per RESTful conventions
        }

        private bool PostExists(int id)
        {
            return _db.Posts.Any(e => e.Id == id);
        }
    }
}
