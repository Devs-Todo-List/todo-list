module "rds" {
  source  = "terraform-aws-modules/rds/aws"
  version = "6.5.2"

  identifier = "devtodolistdb"

  major_engine_version = "16"
  engine               = "sqlserver-ex"
  engine_version       = "16"

  instance_class      = "db.t3.micro"
  create_db_instance  = true
  allocated_storage   = 10
  deletion_protection = false
  skip_final_snapshot = true

  db_subnet_group_name   = module.vpc.database_subnet_group_name
  vpc_security_group_ids = [aws_security_group.rds.id]
  publicly_accessible    = true

  db_name                                                = local.db-name
  username                                               = "dbadmin"
  port                                                   = "5432"
  manage_master_user_password                            = true
  manage_master_user_password_rotation                   = true
  master_user_password_rotation_automatically_after_days = 30

  create_db_parameter_group = false

}

