# TodoZen
## Running the Docker Image
- Clone the repo.
- Ensure that docker is installed. Rancher is a free to use option that installs the docker commands.
- Run `terraform init`, `terraform plan`, and `terraform apply` in the '/terraform' directory to create the Cognito Userpool and Client.
- Using the AWS Console, create a new User and assign the CognitoPowerUser policy to it. Create an access key for this user. Note the Access ID and Secret.

- Edit the Dockerfile in '/frontend' by adding values for the following ENV variables:
  - `VITE_API_URL`
    - http://localhost:5215
  - `VITE_USERPOOL_ID`
    - Unique ID of Userpool created with Terraform.
  - `VITE_COGNITO_CLIENTID`
    - Unique ID of Userpool Client created with Terraform.

- Edit the Dockerfile in '/backend' by adding values for the following ENV variables:
  - `DB_CONNECTION_STRING`
    - Server=todo-list-database-1,1433;Database=devtodolistdb;User Id=SA;Password=Password123;Trust Server Certificate=True
  - `USERPOOL_ID`
    - Unique ID of Userpool created with Terraform.
  - `COGNITO_CLIENTID`
    - Unique ID of Userpool Client created with Terraform.
  - `AWS_ACCESS_ID`
    - AWS access ID of Cognito Power User created on console.
  - `AWS_ACCESS_SECRET`
    - AWS access secret of Cognito Power User created on console.
- Change the line endings in '/database/entry.sh' and '/database/config.sh' to LF.
- Run `docker-compose up --build` in the root directory.

## Creating an account
- Navigate to the signUp page.
- Enter and submit your details.
- A confirmation code is sent via email that must be checked before the account is confirmed and available to use.
- On first signIn, a QR code will be displayed that must be scanned to add MFA.
- Google's Authenticator app can be used.
- After adding the app to your authenticator, input the OTP into the input and submit.
- All future signIn attempts will require the OTP from the Authenticator app.
