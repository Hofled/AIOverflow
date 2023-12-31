using AIOverflow.Database;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Logging.AddConsole();
AIOverflow.Identity.Services.ConfigureServices(builder);
AddDbContext(builder);

var app = builder.Build();

AIOverflow.Identity.Endpoints.ConfigureIdentity(app);
UseAppMiddlewares(app);

app.Logger.LogInformation("Starting web server");
app.Run();

static void AddDbContext(WebApplicationBuilder builder)
{
    string? DbConnectionString = Environment.GetEnvironmentVariable("ConnectionString");

    if (DbConnectionString == null)
    {
        throw new Exception("ConnectionString is null");
    }

    builder.Services.AddDbContext<PostgresDb>(options => options.UseNpgsql(DbConnectionString));
}

static void UseAppMiddlewares(WebApplication app)
{
    app.UseHttpLogging();
    app.UseAuthentication();
    app.UseAuthorization();
}