variable "cognito_user_pool_id" {
    description = "The ID of the Cognito User Pool"
    type        = string
}

variable "cognito_user_pool_client_id" {
    description = "The ID of the Cognito User Pool Client"
    type        = string
}

variable "cognito_access_token" {
    description = "The ID Token of the Cognito User Pool"
    type        = string
}

variable "cognito_secret_access_key" {
    description = "The Access Token of the Cognito User Pool"
    type        = string
}