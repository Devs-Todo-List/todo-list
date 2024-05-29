# Click and drop to do list backend

## Getting Started

1. **Prerequisites**: 
   1. [dotnet](https://dotnet.microsoft.com/en-us/download)
   2. Any C# IDE
   3. [SQL Server Management Studio](https://learn.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms?view=sql-server-ver16)
   4. System variables that need to be set:
      1. `JWT_SECRET`=`<your own secret string>`
      2. `DB_CONNECTION_STRING`=`Data Source=<YOUR SERVER NAME>;Initial Catalog=devtodolistdb;Encrypt=false;Integrated Security=True;`

2. **Installation**:
    - Clone this repository: `git clone https://github.com/Devs-Todo-List/todo-list.git`
    - Navigate to the project folder: `cd todo-list/server`
    - Restore dependencies: `dotnet restore`
3. **Running the Application**:
    - Build the project: `dotnet build`
    - Run the application: `dotnet run`
    - Or click the Play button in your C# IDE

## Usage

Explain how to use your backend API. Provide examples of endpoints, request formats, and expected responses.
