
resource "aws_elastic_beanstalk_application" "nodejs_app" {
  name        = "nodejs-app"
  description = "App for NodeJS API"
}

resource "aws_elastic_beanstalk_environment" "nodejs_env" {
  name                = "nodejs-env"
  application         = aws_elastic_beanstalk_application.nodejs_app.name
  solution_stack_name = "64bit Amazon Linux 2023 v6.1.5 running Node.js 20"
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
    value     = "/"
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
    namespace = "aws:ec2:vpc"
    name      = "AssociatePublicIpAddress"
    value     = "true"
    resource  = ""
  }
  setting {
    namespace = "aws:elb:healthcheck"
    name      = "Interval"
    value     = 60
    resource  = ""
  }
  setting {
    namespace = "aws:elb:healthcheck"
    name      = "Timeout"
    value     = 20
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
    namespace = "aws:elbv2:listener:80"
    name      = "ListenerEnabled"
    value     = "true"
    resource  = ""
  }
  setting {
    namespace = "aws:elbv2:listener:80"
    name      = "Protocol"
    value     = "HTTP"
    resource  = ""
  }
  setting {
    namespace = "aws:elasticbeanstalk:managedactions"
    name      = "ManagedActionsEnabled"
    value     = "false"
  }
  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "PORT"
    value     = "5173"
  }
  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "VITE_API_URL"
    value     = "devtodo-api.projects.bbdgrad.com"
  }
}
