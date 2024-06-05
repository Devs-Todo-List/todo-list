FROM mcr.microsoft.com/mssql/server:2017-latest

ENV ACCEPT_EULA=Y
ENV SA_PASSWORD=Password123
ENV MSSQL_PID="Express edition"
ENV MSSQL_TCP_PORT=1433
WORKDIR /src
COPY . .

ENTRYPOINT [ "/src/entry.sh" ]


