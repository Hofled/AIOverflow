using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using AIOverflow.Database;

namespace AIOverflow.Identity;

public static class Endpoints
{
    public static void ConfigureIdentity(WebApplication app)
    {
        var group = app.MapGroup("identity");

        group.MapGet("/register", async (
            string username,
            string password,
            IPasswordHasher<User> passwordHasher,
            PostgresDb db,
            HttpContext ctx
        ) =>
        {
            var user = new User() { Name = username };
            user.PasswordHash = passwordHasher.HashPassword(user, password);
            try
            {
                await db.AddUserAsync(user);
            }
            catch (Exception e)
            {
                ctx.Response.StatusCode = StatusCodes.Status409Conflict;
                return "Username already taken";
            }

            var scheme = CookieAuthenticationDefaults.AuthenticationScheme;
            await ctx.SignInAsync(scheme, user.ToClaimsPrincipal(scheme));
            return "Successfully registered & logged in";
        });

        group.MapGet("/login", async (
            string username,
            string password,
            IPasswordHasher<User> passwordHasher,
            PostgresDb db,
            HttpContext ctx
        ) =>
        {
            var user = await db.GetUserByNameAsync(username);
            if (user == null)
            {
                ctx.Response.StatusCode = StatusCodes.Status404NotFound;
                return "Invalid credentials";
            }

            var result = passwordHasher.VerifyHashedPassword(user, user.PasswordHash, password);
            if (result == PasswordVerificationResult.Failed)
            {
                ctx.Response.StatusCode = StatusCodes.Status404NotFound;
                return "Invalid credentials";
            }

            var scheme = CookieAuthenticationDefaults.AuthenticationScheme;
            await ctx.SignInAsync(scheme, user.ToClaimsPrincipal(scheme));

            return "Login successful";
        });

        group.MapGet("/isAuthenticated", (
                    SignInManager<User> signInManager,
                    HttpContext ctx
                ) =>
                {
                    var userIdentity = ctx.User.Identity;
                    if (userIdentity == null)
                    {
                        ctx.Response.StatusCode = StatusCodes.Status404NotFound;
                        return false;
                    }
                    return userIdentity?.IsAuthenticated;
                });

        group.MapGet("/assignAdmin", async (
            string username,
            PostgresDb db,
            HttpContext ctx
        ) =>
        {
            var user = await db.GetUserByNameAsync(username);
            if (user == null)
            {
                ctx.Response.StatusCode = StatusCodes.Status404NotFound;
                return;
            }

            var adminClaimExists = user.Claims.Any(c => c.Type == "role" && c.Value == "admin");
            if (adminClaimExists)
            {
                return;
            }

            user.Claims.Add(new UserClaim { Type = "role", Value = "admin" });

            await db.UpdateUserAsync(user);
        }).RequireAuthorization("admin");
    }
}
