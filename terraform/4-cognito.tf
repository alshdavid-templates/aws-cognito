resource "aws_cognito_user_pool" "user_pool" {
  name = "oauth-user-pool"

  username_attributes = ["email"]
  auto_verified_attributes = ["email"]

  password_policy {
    minimum_length = 6
  }

  verification_message_template {
    default_email_option = "CONFIRM_WITH_CODE"
    email_subject = "Account Confirmation"
    email_message = "Your confirmation code is {####}"
  }

  schema {
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = true
    name                     = "email"
    required                 = true

    string_attribute_constraints {
      min_length = 1
      max_length = 256
    }
  }
}

resource "aws_cognito_user_pool_client" "client" {
  name = "cognito-client"

  user_pool_id = aws_cognito_user_pool.user_pool.id
  generate_secret = true
  refresh_token_validity = 90
  prevent_user_existence_errors = "ENABLED"
  explicit_auth_flows = [
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_SRP_AUTH"
  ]
  
  supported_identity_providers = [
    "COGNITO",
  ]
  callback_urls                        = ["${aws_apigatewayv2_stage.prod.invoke_url}api/auth/login/callback"]
  logout_urls                          = ["${aws_apigatewayv2_stage.prod.invoke_url}api/auth/logout/callback"]
  allowed_oauth_flows                  = ["code"]
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_scopes = [
    "email",
    "openid",
  ]
}

resource "aws_cognito_user_pool_domain" "cognito-domain" {
  domain       = "alshdavid"
  user_pool_id = aws_cognito_user_pool.user_pool.id
}
