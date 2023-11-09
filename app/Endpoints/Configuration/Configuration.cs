using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("_configuration")]
public class OidcConfigurationController : ControllerBase
{
    private readonly ILogger<OidcConfigurationController> _logger;
    public IClientRequestParametersProvider ClientRequestParametersProvider { get; }

    public OidcConfigurationController(
        IClientRequestParametersProvider clientRequestParametersProvider,
        ILogger<OidcConfigurationController> logger)
    {
        ClientRequestParametersProvider = clientRequestParametersProvider;
        _logger = logger;
    }

    [HttpGet("{clientId}")]
    public IActionResult GetClientRequestParameters([FromRoute] string clientId)
    {
        var parameters = ClientRequestParametersProvider.GetClientParameters(HttpContext, clientId);
        return Ok(parameters);
    }
}
