# Shift Management Tool

- [Live server](https://calm-pear-crab-fez.cyclic.app/)

## Server structure

### Database folder

This is used for working with firebase database. Each file is a list of functions that are used to work with a specific collection in the database. The collection name is the same as the file name.

### Routes folder

Used to define the routes of the server.

#### API

##### user folder

- Prior Route: **/user**
- Route: **/**, Method: **GET**: return user information after authentication
- Route: **/login**, Method: **POST**, Body: {email:string, password: string}: login user, return user token
- Route: **/register**, Method: **POST**, Body: {email:string, password: string}: register user, return user token, user must sign in again after registration for security reason
- Route: **/**, Method: **PUT**, Body: {firstName?:string, lastName?:string, active?: number, accessLevel?: number}: update user information, return user information

## Note

### Firebase

#### Authentication

- Since we're using a server and our application requires authentication and the ability to create user accounts, we need to use the firebase admin sdk to authenticate the user.
- Firebase client sdk will not work since it focuses on commercial applications which users can freely create accounts and login.
- Firestore database rules are not usable as well since firebase-admin will provide full privileges to the server. As the result, we need to implement our own rules in the server.
