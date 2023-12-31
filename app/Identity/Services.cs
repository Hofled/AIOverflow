using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;

namespace AIOverflow.Identity;

public static class Services
{
    public static void ConfigureServices(WebApplicationBuilder builder)
    {
        builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
                        .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme);
        builder.Services.AddAuthorization(builder =>
        {
            builder.AddPolicy("admin", policy => policy
            .RequireAuthenticatedUser()
            .AddAuthenticationSchemes(CookieAuthenticationDefaults.AuthenticationScheme)
            .RequireClaim("role", "admin"));
        });

        builder.Services.AddSingleton<IPasswordHasher<User>, PasswordHasher<User>>();
    }
}