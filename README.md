# AIOverflow

This project is the implementation of the "סדנה בתכנות מונחה עצמים - 20586" workshop.

## Building The Application
### Docker
In order to run the application inside a Docker container, you need to first build the image for the application.
The configuration for building the application image can be found in the [Dockerfile](./Dockerfile), which uses the `mcr.microsoft.com/dotnet/sdk:7.0` builder image for building the ASP.NET & React application and then [publishing](https://learn.microsoft.com/en-us/dotnet/core/tools/dotnet-publish) it.

The result is then hosted inside the `mcr.microsoft.com/dotnet/aspnet:7.0` image, which is used for running and serving the application.

To build the image run the following command from the directory in which the `Dockerfile` resides:
```sh
docker build -t <image name>:<optional tag> .
```
*Please note* that the `.` at the of the command is crucial for setting the build context.

## Running The Application
### Locally
The `dotnet` CLI provides a convenient command for running your application, which is [dotnet run](https://learn.microsoft.com/en-us/dotnet/core/tools/dotnet-run).

If you are using VS Code, there is a configured [task](./.vscode/tasks.json) labelled `dotnet: run` for running the ASP.NET server locally.

### Docker
After the image has been built, you can run the application's container using the following command:
```sh
docker run -dit -p <exposed port>:80 <image name>:<tag>
```
The application serves the web application on port `80` while running in production, hence it is required to expose the `80` port to be able to access it from outside the container.

After the container is running, you can access the web application from `http://localhost:<exposed port>`.

*Please note* that the application is currently served over `HTTP` and not `HTTPS`.

## Debugging The Application
### Locally
In order to debug the application's code, there's a VS Code [launch configuration](./.vscode/launch.json) and a VS Code [task](./.vscode/tasks.json) which allow to debug both the React web application and the ASP.NET server.
### ASP.NET Server
**Important**: There are .NET requirements for running & debugging the ASP.NET server locally, please make sure that everything required is installed properly, VS Code should prompt you automatically for installing all the requirements once the corresponding launch configurations run for the first time.
<hr/>

In order to run the ASP.NET server for debugging, execute the `dotnet: run` task.
This should start the ASP.NET process and run the server in development mode, together with a SPA proxy middleware for rerouting requests that reach the web application port to the ASP.NET endpoints (which are served on a different port).
After the server is running, you need to run the launch configuration named `.NET Core Attach`, which will attach to the corresponding server process, and allow debugging the process and set breakpoints from the VS Code IDE.
The corresponding process which needs to be attached may be filtered and found by typing `run` after launching the configuration, and a process named `<Application Name> run` should be present.

### React Web Application
Once the ASP.NET server is running and serves the web application, you can attach to the Chrome browser in order to debug the React code from within VS Code.
Launch the `Attach to Chrome` configuration, which expects the application to be served locally on port `44442`.

If the application is hosted on a different port, please configure the port accordingly [here](./.vscode/launch.json#L27).