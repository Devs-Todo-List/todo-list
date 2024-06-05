--changeset luke:ddl:createTable:test
CREATE TABLE test(
	id INT IDENTITY(1,1) PRIMARY KEY,
);
--rollback DROP TABLE "test";

