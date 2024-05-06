resource "aws_apigatewayv2_api" "main" {
  name = "oauth_client"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_stage" "prod" {
  api_id  = aws_apigatewayv2_api.main.id
  name    = "$default"
  auto_deploy = true
}

resource "aws_apigatewayv2_integration" "lambda_main" {
  api_id            = aws_apigatewayv2_api.main.id

  payload_format_version = "2.0"
  integration_uri = aws_lambda_function.main.invoke_arn
  integration_type = "AWS_PROXY"
  integration_method = "POST"
}

resource "aws_apigatewayv2_route" "api_default" {
  api_id            = aws_apigatewayv2_api.main.id

  route_key = "$default"
  target = "integrations/${aws_apigatewayv2_integration.lambda_main.id}"
}

output "api_url" {
  value = aws_apigatewayv2_stage.prod.invoke_url
}