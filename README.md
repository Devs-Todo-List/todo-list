# TodoZen
## Running the Docker Image
- Clone the repo.
- Ensure that docker is installed. Rancher is a free to use option that installs the docker commands.

- Edit the Dockerfile in '/frontend' by adding values for the following ENV variables:
  - `VITE_API_URL`
    - http://localhost:5215
  - `VITE_USERPOOL_ID`
    - Unique ID of Userpool.
  - `VITE_COGNITO_CLIENTID`
    - Unique ID of Userpool Client.

- Edit the Dockerfile in '/backend' by adding values for the following ENV variables:
  - `DB_CONNECTION_STRING`
    - Server=todo-list-database-1,1433;Database=devtodolistdb;User Id=SA;Password=Password123;Trust Server Certificate=True
  - `USERPOOL_ID`
    - Unique ID of Userpool.
  - `COGNITO_CLIENTID`
    - Unique ID of Userpool Client.
  - `AWS_ACCESS_ID`
    - AWS access ID of Cognito Power User.
  - `AWS_ACCESS_SECRET`
    - AWS access secret of Cognito Power User.
- Change the line endings in '/database/entry.sh' and '/database/config.sh' to LF.
- Run `docker-compose up --build` in the root directory.

## Creating an account
- Navigate to the signUp page.
- Enter and submit your details.
- A confirmation code is sent via email that must be checked before the account is confirmed and available to use.
- On first signIn, a QR code will be displayed that must be scanned to add MFA.
- Google's Authenticator app can be used.
- Open the Authenticator app and click the plus icon to scan the QR code.
- After adding the app to your authenticator, input the OTP into the input and submit.
- All future signIn attempts will require the OTP from the Authenticator app.
