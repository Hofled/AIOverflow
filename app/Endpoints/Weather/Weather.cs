using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("weather")]
[Authorize]
public class WeatherController : ControllerBase
{
    private readonly ILogger<WeatherController> _logger;

    public WeatherController(ILogger<WeatherController> logger)
    {
        _logger = logger;
    }

    [HttpGet]
    public string Weather() => "Weather Endpoint";

    [HttpGet("{city}")]
    public string City(string city) => $"The weather for {city} is sunny";
}