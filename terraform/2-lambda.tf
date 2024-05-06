resource "aws_iam_role" "main_lambda_exec" {
  name = "main_lambda"

  assume_role_policy = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
POLICY
}

resource "aws_iam_role_policy_attachment" "main_lambda_policy" {
  role = aws_iam_role.main_lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_lambda_function" "main" {
  function_name = "oauth_client"
  
  s3_bucket = aws_s3_bucket.lambda_bucket.id
  s3_key = aws_s3_object.lambda_main.key

  runtime = "nodejs20.x"
  handler = "function.handler"

  environment {
    variables = {
      COGNITO_USER_POOL_ID = aws_cognito_user_pool.user_pool.id
      COGNITO_ORIGIN = "https://${aws_cognito_user_pool.user_pool.domain}.auth.${data.aws_region.current.name}.amazoncognito.com"
      COGNITO_CLIENT_ID = aws_cognito_user_pool_client.client.id 
      COGNITO_CLIENT_SECRET = aws_cognito_user_pool_client.client.client_secret
      LOCAL_ORIGIN = aws_apigatewayv2_stage.prod.invoke_url
    }
  }

  source_code_hash = data.archive_file.lambda_main.output_base64sha256

  role = aws_iam_role.main_lambda_exec.arn
}

resource "aws_cloudwatch_log_group" "main_logs" {
  #name = "/aws/lambda/${aws_lambda_function.main.function_name}"
  retention_in_days = 14
}

data "archive_file" "lambda_main" {
  type = "zip"

  source_dir = "../${path.module}/dist"
  output_path = "../${path.module}/dist.zip"
}

resource "aws_s3_object" "lambda_main" {
  bucket = aws_s3_bucket.lambda_bucket.id

  key = "dist.zip"
  source = data.archive_file.lambda_main.output_path

  etag = filemd5(data.archive_file.lambda_main.output_path)
}