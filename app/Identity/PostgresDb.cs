using Microsoft.EntityFrameworkCore;

namespace Identity;

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

    public void AddUser(User user)
    {
        Users.Add(user);
        SaveChanges();
    }

    public List<User> GetUsers()
    {
        return Users.ToList();
    }

    public User? GetUserById(int id)
    {
        return Users.Find(id);
    }

    public User? GetUserByName(string name)
    {
        return Users.FirstOrDefault(u => u.Name == name);
    }

    public void UpdateUser(User updatedUser)
    {
        var existingUser = Users.Find(updatedUser.Id);
        if (existingUser != null)
        {
            Entry(existingUser).CurrentValues.SetValues(updatedUser);
            SaveChanges();
        }
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
