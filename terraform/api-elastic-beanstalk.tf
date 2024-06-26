data "aws_secretsmanager_secret_version" "db-details" {
  secret_id = module.rds.db_instance_master_user_secret_arn
}

data "aws_acm_certificate" "api-issued" {
  domain   = "devtodo-api.projects.bbdgrad.com"
  statuses = ["ISSUED"]
}


resource "aws_iam_role" "beanstalk_ec2" {
  assume_role_policy    = "{\"Statement\":[{\"Action\":\"sts:AssumeRole\",\"Effect\":\"Allow\",\"Principal\":{\"Service\":\"ec2.amazonaws.com\"}}],\"Version\":\"2012-10-17\"}"
  description           = "Allows EC2 instances to call AWS services on your behalf."
  force_detach_policies = false
  managed_policy_arns   = ["arn:aws:iam::aws:policy/AWSElasticBeanstalkMulticontainerDocker", "arn:aws:iam::aws:policy/AWSElasticBeanstalkWebTier", "arn:aws:iam::aws:policy/AWSElasticBeanstalkWorkerTier"]
  max_session_duration  = 3600
  name                  = "aws-elasticbeanstalk-ec2"
  path                  = "/"
}

resource "aws_iam_instance_profile" "beanstalk_ec2" {
  name = "aws-elasticbeanstalk-ec2-profile"
  role = aws_iam_role.beanstalk_ec2.name
}

resource "aws_s3_bucket" "beanstalk_bucket" {
  bucket        = "${local.account-id}-deploy-bucket"
  force_destroy = true
}

resource "aws_elastic_beanstalk_application" "api_app" {
  name        = "api-app"
  description = "App for C# API"
}

resource "aws_elastic_beanstalk_environment" "api_env" {
  name                = "api-env"
  application         = aws_elastic_beanstalk_application.api_app.name
  solution_stack_name = "64bit Amazon Linux 2023 v3.0.5 running .NET 6"
  tier                = "WebServer"

  setting {
    namespace = "aws:ec2:vpc"
    name      = "VPCId"
    value     = module.vpc.vpc_id
  }
  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "IamInstanceProfile"
    value     = aws_iam_instance_profile.beanstalk_ec2.name
  }
  setting {
    namespace = "aws:ec2:vpc"
    name      = "Subnets"
    value     = join(",", module.vpc.public_subnets)
  }
  setting {
    namespace = "aws:ec2:instances"
    name      = "InstanceTypes"
    value     = "t3.micro"
  }
  setting {
    namespace = "aws:elasticbeanstalk:healthreporting:system"
    name      = "SystemType"
    value     = "basic"
  }
  setting {
    namespace = "aws:elasticbeanstalk:application"
    name      = "Application Healthcheck URL"
    value     = "/api/v1/AppStatus"
  }
  setting {
    namespace = "aws:elasticbeanstalk:command"
    name      = "Timeout"
    value     = "60"
  }
  setting {
    namespace = "aws:elasticbeanstalk:command"
    name      = "IgnoreHealthCheck"
    value     = "true"
  }
  setting {
    namespace = "aws:elasticbeanstalk:managedactions"
    name      = "ManagedActionsEnabled"
    value     = "false"
  }
  setting {
    namespace = "aws:elasticbeanstalk:environment"
    name      = "EnvironmentType"
    value     = "LoadBalanced"
    resource  = ""
  }
  setting {
    namespace = "aws:elasticbeanstalk:environment"
    name      = "LoadBalancerType"
    value     = "application"
    resource  = ""
  }
  setting {
    namespace = "aws:elbv2:listener:443"
    name      = "ListenerEnabled"
    value     = "true"
    resource  = ""
  }
  setting {
    namespace = "aws:elbv2:listener:443"
    name      = "Protocol"
    value     = "HTTPS"
    resource  = ""
  }
  setting {
    namespace = "aws:elbv2:listener:443"
    name      = "SSLCertificateArns"
    value     = data.aws_acm_certificate.api-issued.arn
    resource  = ""
  }
  setting {
    namespace = "aws:ec2:vpc"
    name      = "AssociatePublicIpAddress"
    value     = "true"
    resource  = ""
  }
  setting {
    namespace = "aws:elb:healthcheck"
    name      = "Interval"
    value     = 30
    resource  = ""
  }
  setting {
    namespace = "aws:elb:healthcheck"
    name      = "Timeout"
    value     = 15
    resource  = ""
  }
  setting {
    namespace = "aws:autoscaling:asg"
    name      = "MinSize"
    value     = 1
    resource  = ""
  }
  setting {
    namespace = "aws:autoscaling:asg"
    name      = "MaxSize"
    value     = 1
    resource  = ""
  }
  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "SERVER_PORT"
    value     = "5000"
  }
  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "DB_CONNECTION_STRING"
    value     = "Data Source=${module.rds.db_instance_address};Initial Catalog=devtodolistdb;Encrypt=false;User Id=${module.rds.db_instance_username};Password=${jsondecode(data.aws_secretsmanager_secret_version.db-details.secret_string)["password"]};"
  }
  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "USERPOOL_ID"
    value     = aws_cognito_user_pool.TodoUserPool.id
  }
  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "COGNITO_CLIENTID"
    value     = aws_cognito_user_pool_client.TodoList.id
  }
  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "AWS_ACCESS_ID"
    value     = var.cognito_access_token
  }
  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "AWS_ACCESS_SECRET"
    value     = var.cognito_secret_access_key
  }
}
resource "aws_wafv2_web_acl_association" "api-waf-association" {
  resource_arn = aws_elastic_beanstalk_environment.api_env.load_balancers[0]
  web_acl_arn  = aws_wafv2_web_acl.ip-rate-limiter.arn
}