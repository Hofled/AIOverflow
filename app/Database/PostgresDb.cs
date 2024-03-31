using Microsoft.EntityFrameworkCore;
using AIOverflow.Identity;
using AIOverflow.Models.Posts;

namespace AIOverflow.Database;

public class PostgresDb : DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<Post> Posts { get; set; }
    public PostgresDb(DbContextOptions<PostgresDb> options) : base(options)
    {
        Database.Migrate();
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>().Property(u => u.Name).IsRequired();
        modelBuilder.Entity<User>().HasIndex(u => u.Name).IsUnique();

        //Posts
        modelBuilder.Entity<Post>().Property(p => p.Title).IsRequired();
        modelBuilder.Entity<Post>().Property(p => p.Content).IsRequired();


    }

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
        Entry(updatedUser).CurrentValues.SetValues(updatedUser);
        return await SaveChangesAsync();
    }

    public void DeleteUser(int id)
    {
        var User = Users.Find(id);
        if (User != null)
        {
            Users.Remove(User);
            SaveChanges();
        }
    }


    //Posts Methods
    public async Task<int> AddPostAsync(Post post)
    {
        await Posts.AddAsync(post);
        return await SaveChangesAsync();
    }

    public async Task<List<Post>> GetAllPostsAsync()
    {
        return await Posts.Include(p => p.Author).ToListAsync();
    }

    public async Task<Post?> GetPostByIdAsync(int id)
    {
        return await Posts.Include(p => p.Author).FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<int> UpdatePostAsync(Post updatedPost)
    {
        var existingPost = await Posts.FirstOrDefaultAsync(p => p.Id == updatedPost.Id);
        if (existingPost != null)
        {
            // Assuming you want to update all properties. Adjust as necessary.
            Entry(existingPost).CurrentValues.SetValues(updatedPost);
            return await SaveChangesAsync();
        }
        return 0; // Or handle this scenario as you see fit
    }

    public async Task<int> DeletePostAsync(int id)
    {
        var post = await Posts.FindAsync(id);
        if (post != null)
        {
            Posts.Remove(post);
            return await SaveChangesAsync();
        }
        return 0; // Or handle this scenario as you see fit
    }

}
