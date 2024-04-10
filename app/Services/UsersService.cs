
using System.Security.Claims;
using AIOverflow.Database;
using AIOverflow.Identity;
using Microsoft.AspNetCore.Identity;

namespace AIOverflow.Services.Users;

// An exception for a user conflict
public class UserConflictException : Exception
{
    public UserConflictException(string message) : base(message) { }
}

// An exception for unauthorized access
public class UnauthorizedException : Exception
{
    public UnauthorizedException(string message) : base(message) { }
}

public class UserService : IUserService
{
    private readonly PostgresDb _db;
    private readonly IPasswordHasher<User> _passwordHasher;

    public UserService(PostgresDb db, IPasswordHasher<User> passwordHasher)
    {
        _passwordHasher = passwordHasher;
        _db = db;
    }

    public async Task<User> RegisterAsync(string Username, string Password)
    {
        if (_db.UserExists(Username))
        {
            throw new UserConflictException($"The username {Username} already exists");
        }

        var user = new User { Name = Username, Claims = { new UserClaim { Type = ClaimTypes.NameIdentifier, Value = Username } } };

        var hashedPassword = _passwordHasher.HashPassword(user, Password);
        user.PasswordHash = hashedPassword;

        await _db.AddUserAsync(user);
        return user;
    }

    public async Task<User> LoginAsync(string Username, string Password)
    {
        var user = await _db.GetUserByNameAsync(Username);
        if (user == null || !IsValidUser(user, Password))
        {
            throw new UnauthorizedException("Invalid credentials");
        }

        return user;
    }

    public async Task<User?> GetUserByNameAsync(string Username)
    {
        return await _db.GetUserByNameAsync(Username);
    }

    public bool IsValidUser(User user, string password)
    {
        return _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, password) != PasswordVerificationResult.Failed;
    }
}

public interface IUserService
{
    Task<User> RegisterAsync(string Username, string Password);
    Task<User> LoginAsync(string Username, string Password);
    Task<User?> GetUserByNameAsync(string Username);
    bool IsValidUser(User user, string password);
}