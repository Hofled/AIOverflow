using Microsoft.EntityFrameworkCore;
using AIOverflow.Identity;

namespace AIOverflow.Database;

public class PostgresDb : DbContext
{
    public DbSet<User> Users { get; set; }
    public PostgresDb(DbContextOptions<PostgresDb> options) : base(options)
    {
        Database.Migrate();
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>().Property(u => u.Name).IsRequired();
        modelBuilder.Entity<User>().HasIndex(u => u.Name).IsUnique();
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
}
