terraform {
  backend "s3" {
    bucket         = "958933916692-state"
    key            = "backend/terraform.tfstate"
    region         = "eu-west-1"
    dynamodb_table = "958933916692-state"
  }
}
