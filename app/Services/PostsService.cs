using AIOverflow.Database;
using AIOverflow.DTOs;
using AIOverflow.Models.Posts;
using Microsoft.EntityFrameworkCore;

namespace AIOverflow.Services.Posts;
public class PostsService : IPostService
{

    private readonly PostgresDb _db;

    public PostsService(PostgresDb db)
    {
        _db = db;
    }

    public async Task<Post> AddPostAsync(PostCreateDto postDto, int userID)
    {
        var now = DateTime.UtcNow;
        var newPost = new Post
        {
            Title = postDto.Title,
            Content = postDto.Content,
            UserId = userID,
            CreatedAt = now,
            EditedAt = now
        };

        await _db.AddPostAsync(newPost);

        return newPost;
    }

    public async Task<List<Post>> GetAllPostsAsync()
    {
        return await _db.GetAllPostsAsync();
    }

    public async Task<Post?> GetPostByIdAsync(int id)
    {
        return await _db.GetPostByIdAsync(id);
    }

    public async Task UpdatePostAsync(int id, Post updatedPost)
    {
        if (id != updatedPost.Id)
        {
            throw new BadHttpRequestException("provided id and post id do not match");
        }

        updatedPost.EditedAt = DateTime.UtcNow;
        try
        {
            await _db.UpdatePostAsync(updatedPost);
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!PostExists(id))
            {
                throw new Exception($"post with id {id} not found");
            }
            else
            {
                throw;
            }
        }
    }

    private bool PostExists(int id)
    {
        return _db.Posts.Any(e => e.Id == id);
    }

    public async Task DeletePostAsync(int id)
    {
        await _db.DeletePostAsync(id);
    }
}

public interface IPostService
{
    Task<Post> AddPostAsync(PostCreateDto postDto, int userID);
    Task<List<Post>> GetAllPostsAsync();
    Task<Post?> GetPostByIdAsync(int id);
    Task UpdatePostAsync(int id, Post updatedPost);
    Task DeletePostAsync(int id);
}