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
            var posts = await _db.Posts.Include(p => p.Author).ToListAsync();
            return posts;
        }

        // GET: posts/{id}
        [HttpGet("{id:int}")] // Specify the type of id to reinforce route matching
        public async Task<ActionResult<Post>> GetPostByIdAsync(int id)
        {
            var post = await _db.Posts.Include(p => p.Author).FirstOrDefaultAsync(p => p.Id == id);
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
            var now = DateTime.UtcNow;
            var newPost = new Post
            {
                Title = postDto.Title,
                Content = postDto.Content,
                UserId = postDto.UserId,
                CreatedAt = now,
                EditedAt = now
            };

            await _db.Posts.AddAsync(newPost);
            await _db.SaveChangesAsync();

            return CreatedAtAction("GetPostById", new { id = newPost.Id }, newPost);
        }

        // PUT: posts/{id}
        [HttpPut("{id:int}")]
        public async Task<ActionResult<Post>> UpdatePostAsync(int id, [FromBody] Post updatedPost)
        {
            if (id != updatedPost.Id)
            {
                return BadRequest();
            }

            await _db.UpdatePostAsync(updatedPost);
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
