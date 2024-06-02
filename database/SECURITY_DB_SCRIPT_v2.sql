CREATE DATABASE devtodolistdb;
GO

USE devtodolistdb;
GO

CREATE TABLE [Comment] (
  [CommentID] int NOT NULL IDENTITY(1, 1) PRIMARY KEY,
  [TaskId] int,
  [Comment] varchar(100) NOT NULL,
  [DateCommented] datetime2(7) NOT NULL
)
GO

CREATE TABLE [User] (
  [UserID] int NOT NULL IDENTITY(1, 1) PRIMARY KEY,
  [Email] varchar(75),
  [Username] varchar(50),
  [UserPicUrl] varchar(100)
)
GO

CREATE TABLE [Status] (
  [StatusID] int NOT NULL IDENTITY(1, 1) PRIMARY KEY,
  [StatusType] varchar(50) NOT NULL
)
GO

CREATE TABLE [Task] (
  [TaskID] int NOT NULL IDENTITY(1, 1) PRIMARY KEY,
  [Title] varchar(50) NOT NULL,
  [Description] varchar(100),
  [DateCreated] datetime2(7) NOT NULL,
  [DueDate] datetime2(7),
  [UserID] int,
  [StatusID] int,
  [TaskTypeID] int
)
GO

CREATE TABLE [TaskType] (
  [TaskTypeID] int NOT NULL IDENTITY(1, 1) PRIMARY KEY,
  [TaskTypeDescription] varchar(50) NOT NULL
)
GO

ALTER TABLE [Comment] ADD FOREIGN KEY ([TaskId]) REFERENCES [Task] ([TaskID])
GO

ALTER TABLE [Task] ADD FOREIGN KEY ([UserID]) REFERENCES [User] ([UserID])
GO

ALTER TABLE [Task] ADD FOREIGN KEY ([StatusID]) REFERENCES [Status] ([StatusID])
GO

ALTER TABLE [Task] ADD FOREIGN KEY ([TaskTypeID]) REFERENCES [TaskType] ([TaskTypeID])
GO