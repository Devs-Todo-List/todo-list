module "rds" {
  source  = "terraform-aws-modules/rds/aws"
  version = "6.5.2"

  identifier = "devtodolistdb"

  engine               = "sqlserver-ex"
  engine_version       = "15.00.4345.5.v1"
  family               = "sqlserver-ex-15.0" # DB parameter group
  major_engine_version = "15.00"             # DB option group



  instance_class      = "db.t3.micro"
  create_db_instance  = true
  allocated_storage   = 20
  deletion_protection = false
  skip_final_snapshot = true

  max_allocated_storage = 20

  storage_encrypted = false

  db_subnet_group_name   = module.vpc.database_subnet_group_name
  vpc_security_group_ids = [aws_security_group.rds.id]
  publicly_accessible    = true

  # db_name                                                = local.db-name
  username                                               = "dbadmin"
  port                                                   = "1433"
  manage_master_user_password                            = true
  manage_master_user_password_rotation                   = true
  master_user_password_rotation_automatically_after_days = 30

  create_db_parameter_group = false

}

