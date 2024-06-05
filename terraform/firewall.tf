resource "aws_wafv2_web_acl" "ip-rate-limiter" {
  description   = null
  name          = "IP-Rate-limit-test"
  scope         = "REGIONAL"
  token_domains = []
  default_action {
    allow {
    }
  }
  rule {
    name     = "Ip-rate-limiter"
    priority = 0
    action {
      block {
      }
    }
    statement {
      rate_based_statement {
        aggregate_key_type = "IP"
        limit              = 100
      }
    }
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "Ip-rate-limiter"
      sampled_requests_enabled   = true
    }
  }
  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "IP-Rate-limit-test"
    sampled_requests_enabled   = true
  }
}