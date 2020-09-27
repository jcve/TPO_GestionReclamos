FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS build
WORKDIR /app

# Prevent 'Warning: apt-key output should not be parsed (stdout is not a terminal)'
ENV APT_KEY_DONT_WARN_ON_DANGEROUS_USAGE=1

# install NodeJS 12.x
# see https://github.com/nodesource/distributions/blob/master/README.md#deb
RUN apt-get update -yq 
RUN apt-get install curl gnupg -yq 
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
RUN apt-get install -y nodejs

# copy csproj and restore as distinct layers
COPY *.sln .
COPY GestionReclamos/*.csproj ./GestionReclamos/
COPY GestionReclamos.Application/*.csproj ./GestionReclamos.Application/
COPY GestionReclamos.Domain/*.csproj ./GestionReclamos.Domain/
COPY GestionReclamos.Infrastructure/*.csproj ./GestionReclamos.Infrastructure/
RUN dotnet restore

# copy everything else and build app
COPY GestionReclamos/. ./GestionReclamos/
COPY GestionReclamos.Application/. ./GestionReclamos.Application/
COPY GestionReclamos.Domain/. ./GestionReclamos.Domain/
COPY GestionReclamos.Infrastructure/. ./GestionReclamos.Infrastructure/
WORKDIR /app/GestionReclamos
RUN dotnet publish -c Release -o out

FROM mcr.microsoft.com/dotnet/core/aspnet:3.1 AS runtime
WORKDIR /app
COPY --from=build /app/GestionReclamos/out ./
ENTRYPOINT ["dotnet", "GestionReclamos.dll"]
