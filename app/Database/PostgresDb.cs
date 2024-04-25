using Microsoft.EntityFrameworkCore;
using AIOverflow.Identity;
using AIOverflow.Models.Posts;
using AIOverflow.Models.Comments;
using System;
using AIOverflow.DTOs;

namespace AIOverflow.Database;

public class PostgresDb : DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<Post> Posts { get; set; }
    public DbSet<Comment> Comments { get; set; }

    public PostgresDb(DbContextOptions<PostgresDb> options) : base(options)
    {
        // Removed automatic migration call. Best to handle migrations manually or through a controlled deployment process.
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // User Configuration
        modelBuilder.Entity<User>()
            .Property(u => u.Name).IsRequired().HasMaxLength(100);
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Name).IsUnique();

        // Post Configuration
        modelBuilder.Entity<Post>()
            .Property(p => p.Title).IsRequired().HasMaxLength(255);
        modelBuilder.Entity<Post>()
            .Property(p => p.Content).IsRequired();
        modelBuilder.Entity<Post>()
            .HasOne(p => p.Author)
            .WithMany(u => u.Posts)
            .HasForeignKey(p => p.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // Comment Configuration
        modelBuilder.Entity<Comment>()
            .Property(c => c.Content).IsRequired();
        modelBuilder.Entity<Comment>()
            .HasOne(c => c.Author)
            .WithMany(u => u.Comments)
            .HasForeignKey(c => c.UserId)
            .OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<Comment>()
            .HasOne(c => c.Post)
            .WithMany(p => p.Comments)
            .HasForeignKey(c => c.PostId)
            .OnDelete(DeleteBehavior.Cascade);
    }

    // User CRUD methods
    public async Task<int> AddUserAsync(User user)
    {
        await Users.AddAsync(user);
        return await SaveChangesAsync();
    }

    public bool UserExists(string name)
    {
        return Users.Any(u => u.Name == name);
    }

    public List<User> GetUsers()
    {
        return Users.ToList();
    }

    public User? GetUserById(int id)
    {
        return Users.Find(id);
    }

    public async Task<User?> GetUserByNameAsync(string name)
    {
        return await Users.Include(u => u.Claims).SingleOrDefaultAsync(u => u.Name == name);
    }

    public async Task<int> UpdateUserAsync(User updatedUser)
    {
        Users.Update(updatedUser);
        return await SaveChangesAsync();
    }

    public void DeleteUser(int id)
    {
        var user = Users.Find(id);
        if (user != null)
        {
            Users.Remove(user);
            SaveChanges();
        }
    }

    // Post CRUD methods
    public async Task<int> AddPostAsync(Post post)
    {
        await Posts.AddAsync(post);
        return await SaveChangesAsync();
    }

    public async Task<List<Post>> GetAllPostsAsync()
    {
        return await Posts
        .Include(p => p.Comments)
        .ThenInclude(c => c.Author)
        .Include(p => p.Author)
        .ToListAsync();

    }

    public async Task<Post?> GetPostByIdAsync(int id)
    {
        return await Posts
        .Include(p => p.Comments)
        .ThenInclude(c => c.Author)
        .Include(p => p.Author)
        .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<int> UpdatePostAsync(Post updatedPost)
    {
        Posts.Update(updatedPost);
        return await SaveChangesAsync();
    }

    public async Task DeletePostAsync(int id)
    {
        var post = Posts.Find(id);
        if (post == null)
        {
            throw new Exception("Post not found, unable to delete");
        }

        Posts.Remove(post);
        await SaveChangesAsync();
    }

    public async Task<int> AddCommentAsync(Comment comment)
    {
        await Comments.AddAsync(comment);
        await Entry(comment).Reference(c => c.Author).LoadAsync();
        return await SaveChangesAsync();
    }

    public async Task<Comment?> GetCommentByIdAsync(int id)
    {
        return await Comments
        .Include(c => c.Author)
        .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<List<Comment>> GetAllCommentsByPostIdAsync(int id)
    {
        return await Comments
        .Where(c => c.PostId == id)
        .Include(c => c.Author)
        .ToListAsync();
    }

    public async Task<int> UpdateCommentAsync(Comment updatedComment)
    {
        Comments.Update(updatedComment);
        return await SaveChangesAsync();
    }

    public async Task<int> DeleteCommentAsync(int id)
    {
        var comment = Comments.Find(id);
        if (comment == null)
        {
            throw new Exception("Comment not found, unable to delete");
        }

        Comments.Remove(comment);
        return await SaveChangesAsync();
    }
}
