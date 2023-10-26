using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authentication;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

ConfigureServices(builder);

var app = builder.Build();

ConfigureApp(app);

app.MapFallbackToFile("index.html");

app.Run();

void ConfigureServices(WebApplicationBuilder builder)
{
    builder.Services.AddControllers();

    string? DbConnectionString = Environment.GetEnvironmentVariable("ConnectionString");

    if (DbConnectionString == null)
    {
        throw new Exception("ConnectionString is null");
    }

    builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseNpgsql(DbConnectionString));

    builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

    builder.Services.AddIdentityServer().AddApiAuthorization<ApplicationUser, ApplicationDbContext>();

    builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddIdentityServerJwt();
}

void ConfigureApp(WebApplication app)
{
    // Configure the HTTP request pipeline.
    if (!app.Environment.IsDevelopment())
    {
        // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
        app.UseHsts();
    }

    app.UseHttpLogging();
    app.UseHttpsRedirection();
    app.UseStaticFiles();
    app.UseAuthentication();
    app.UseIdentityServer();
    app.UseAuthorization();
    app.MapControllers();
}
