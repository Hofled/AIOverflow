using AIOverflow.Database;
using AIOverflow.Identity;
using AIOverflow.Services.Posts;
using AIOverflow.Services.Users;
using AIOverflow.Services.Comments;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;


string? secretKey = Environment.GetEnvironmentVariable("SECRET_KEY");
if (string.IsNullOrEmpty(secretKey))
{
    throw new Exception("SECRET_KEY is null");
}

var builder = WebApplication.CreateBuilder(args);

builder.Logging.AddConsole();

builder.Services.AddSingleton(_ => new JwtSecretKeyDependency(secretKey));
builder.Services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();


Services.ConfigureServices(builder, secretKey);
AddDbContext(builder);
AddScopedServices(builder);

builder.Services.AddControllers();

var app = builder.Build();
app.MapFallbackToFile("index.html");

UseAppMiddlewares(app);

app.Logger.LogInformation("Starting web server");
app.Run();

static void AddDbContext(WebApplicationBuilder builder)
{
    string? DbConnectionString = Environment.GetEnvironmentVariable("CONNECTION_STRING");

    if (string.IsNullOrEmpty(DbConnectionString))
    {
        throw new Exception("CONNECTION_STRING is null");
    }

    builder.Services.AddDbContext<PostgresDb>(options => options.UseNpgsql(DbConnectionString));
}

static void AddScopedServices(WebApplicationBuilder builder)
{
    builder.Services.AddScoped<IPostService, PostsService>();
    builder.Services.AddScoped<IUserService, UserService>();
    builder.Services.AddScoped<ICommentService, CommentsService>();

}

static void UseAppMiddlewares(WebApplication app)
{
    // Configure the HTTP request pipeline.
    if (!app.Environment.IsDevelopment())
    {
        // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
        app.UseHsts();
    }

    app.UseHttpsRedirection();
    app.UseStaticFiles();
    app.UseHttpLogging();

    app.UseRouting();

    app.UseAuthentication();
    app.UseAuthorization();

    // implicitly configures the REST API endpoints from the controllers
    app.MapControllers();
}