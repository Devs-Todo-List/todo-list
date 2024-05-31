FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 5215

ENV ASPNETCORE_URLS=http://+:5215
ENV JWT_SECRET="<your own secret string>"
ENV DB_CONNECTION_STRING="Data Source=<YOUR SERVER NAME>;Initial Catalog=devtodolistdb;Encrypt=false;Integrated Security=True;"

USER app
FROM --platform=$BUILDPLATFORM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG configuration=Release
WORKDIR /src
COPY ["server/server.csproj", "server/"]
RUN dotnet restore "server/server.csproj"
COPY . .
WORKDIR "/src/server"
RUN dotnet build "server.csproj" -c $configuration -o /app/build

FROM build AS publish
ARG configuration=Release
RUN dotnet publish "server.csproj" -c $configuration -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "server.dll"]
