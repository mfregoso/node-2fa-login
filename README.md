  # Node 2FA Login
A Node-Express back end for Two Factor user registration and login authentication with SMS verification using Twilio, persistent storage with SQL Server and JSON Web Tokens.

**Extra Endpoint:** POST /test for "string to cut" feature

## Getting Started
/test endpoint will work straight out of the box, but the user flow endpoints will require a Twilio account and an instance of SQL Server with authentication mode enabled.

### Prerequisites for User Flow
````
SQL Server (local, but can be configured with external)

SQL Server: Username + Password

Twilio: API Key + SID
````

### Setup and Installation
**SQL Server** (for User Flow)
````
1. Create a database called People
2. Open db_create_script.sql as a query and then execute
3. Confirm presence of account table and stored procedures
4. Confirm SQL Server Authentication Mode is enabled
5. If necessary, create a [login account](https://docs.microsoft.com/en-us/sql/relational-databases/security/authentication-access/create-a-login?view=sql-server-2017)
````

**.env** (for User Flow)
````
DB_USER, DB_PW, TW_SID, TW_KEY
````
npm install

node server.js

## User Flow Outline

 1. Registration will create an unconfirmed account and send an SMS code
 2. User provides the SMS code which is then passed to and checked by Twilio
 3. If successful response from Twilio, account is set as confirmed. Now user can log in
 4. Login will confirm user's credentials and send another SMS code
 5. User provides SMS code to verify the login via Twilio
 6. If successful, the server will return a JWT storing user's email and expiring in 1 day

## API Endpoints and Schema
- **Server will be listening on port 3000**
- **Use POST for all endpoints**

### /test
- **string_to_cut**: string

### /api/user/register
- **name**: string (min 3 char, required)
- **email**: string (email, required)
- **password**: string (min 6 char, required)
- **phone**: string (10-11 digits, required)

### /api/user/register/verify
- **email**: string (email, required)
- **code**: string (4-6 digits, required)
- **phone**: string (10-11 digits, required)

### /api/user/login
- **email**: string (email, required)
- **password**: (min 6 char, required)

### /api/user/login/verify
- **email**: string (email, required)
- **code**: string (4-6 digits, required)
- **phone**: string (10-11 digits, required)