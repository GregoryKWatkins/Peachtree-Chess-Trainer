import * as Config from "./AWS/config"
import * as AmazonCognitoIdentity from "amazon-cognito-identity-js"

var userPool = new AmazonCognitoIdentity.CognitoUserPool({
    UserPoolId: Config.userPoolId,
    ClientId: Config.userPoolClientId
});

const Authenticate = {

    /*
     *  Function to be called for a logged in user to change their own attributes (age, rank).
     *  attributeList is to be an JSON object of attributeName-attributeValue pairs.
     */
    changeAttributes(attributeList, onSuccess, onFailure) {
      var token = Authenticate.getCurrentUserAccessToken();
      if (token) {

        var params = {
          AccessToken: token,
          AttributeList: attributeList
        };

        fetch('https://jgmysjlzii.execute-api.us-east-2.amazonaws.com/prod/changeattributes', {
          method: 'POST',
          headers: {
              Authorization: Authenticate.getToken()
          },
          body: JSON.stringify(params),
          contentType: 'application/json'
        }).then(function(response) {
          return response.json();
        }).then(function(data) {
          if (data.Status === "Success") {
            onSuccess(data.Message);
          } else {
            onFailure(data.Error);
          }
        });
      }
    },

    /*
     *  Function to be called for a logged in user to change their own password.
     */
    changePassword(oldPassword, newPassword, onSuccess, onFailure) {
      var token = Authenticate.getCurrentUserAccessToken();
      if (token) {

        var params = {
          AccessToken: token,
          OldPassword: oldPassword,
          NewPassword: newPassword
        };

        fetch('https://jgmysjlzii.execute-api.us-east-2.amazonaws.com/prod/changepassword', {
          method: 'POST',
          headers: {
              Authorization: Authenticate.getToken()
          },
          body: JSON.stringify(params),
          contentType: 'application/json'
        }).then(function(response) {
          return response.json();
        }).then(function(data) {
          if (data.Status === "Success") {
            onSuccess(data.Message);
          } else {
            onFailure(data.Error);
          }
        });
      }
    },

    /*
     *  Retrieves a user object from userPool representing the currently logged in user.
     *  Returns this user object, or null if it does not exist.
     */
    getUserAttributes(onSuccess, onFailure) {
      var token = Authenticate.getCurrentUserAccessToken();
      if (token) {

        var params = {
          AccessToken: token
        };

        fetch('https://jgmysjlzii.execute-api.us-east-2.amazonaws.com/prod/userattributes', {
          method: 'POST',
          headers: {
              Authorization: Authenticate.getToken()
          },
          body: JSON.stringify(params),
          contentType: 'application/json'
        }).then(function(response) {
          return response.json();
        }).then(function(data) {
          if (data.Status === "Success") {
            onSuccess(data.Data);
          } else {
            onFailure(data.Error);
          }
        });
      }
    },

    /*
     *  Returns an access token for the current user session, which is used for
     *  user-specific Cognito database calls.
     */
    getCurrentUserAccessToken() {
      var at = null;
      userPool.getCurrentUser().getSession(function(err, result) {
        if (result) {
          at = result.accessToken.jwtToken;
        }
      });
      return at;
    },

    /*
     *  Retrieves a user object from userPool representing the currently logged in user.
     *  Returns this user object, or null if it does not exist.
     */
    getCurrentUser() {
      var currUser = userPool.getCurrentUser();
      if (currUser) {
        return currUser;
      } else {
        return null;
      }
    },

    /*
     *  Retrieves "token" from localStorage, representing the current user's session.
     *  Returns this token, or null if it does not exist.
     */
    getToken() {
      var token = window.localStorage.getItem('token');
      if (token) {
        return token;
      } else {
        return null;
      }
    },

    /*
     *  Determines "isAuthenticated" status from localStorage.
     *  Returns true if user is authenticated, false otherwise.
     */
    getAuthenticated() {
      var status = window.localStorage.getItem('isAuthenticated')
      if (status == null) {
        return false
      }
      return status === 'true'
    },

    /*
     *  Determines "userType" status from localStorage.
     *  Returns 'Admin', 'Coach', or 'Student' if the user if authenticated, null otherwise.
     */
    getUserType() {
      return window.localStorage.getItem('userType');
    },

    /*
     *  Determines "verified" status from localStorage.
     *  Returns true if the user if verified, false otherwise.
     */
    getEmailVerified() {
      var status = window.localStorage.getItem('verified');
      if (status == null) {
        return false
      }
      return status === 'true'
    },

    /*
     *  First part of forgot password calls. Sends an email containing a password
     *  recovery code to the entered user.
     */
    forgotPasswordPart1(username, onSuccess, onFailure) {
      var params = {
        ClientId: Config.userPoolClientId,
        Username: username
      };

      fetch('https://jgmysjlzii.execute-api.us-east-2.amazonaws.com/prod/forgotpasswordpart1', {
        method: 'POST',
        body: JSON.stringify(params),
        contentType: 'application/json'
      }).then(function(response) {
        return response.json();
      }).then(function(data) {
        if (data.Status === "Success") {
          onSuccess(data.Message);
        } else {
          onFailure(data.Error);
        }
      });
    },

    /*
     *  Second part of forgot password calls. Verifies the entered password
     *  recovery code and, if correct, resets the entered user's password.
     */
    forgotPasswordPart2(username, code, password, onSuccess, onFailure) {
      var params = {
        ClientId: Config.userPoolClientId,
        ConfirmationCode: code,
        Password: password,
        Username: username
      };

      fetch('https://jgmysjlzii.execute-api.us-east-2.amazonaws.com/prod/forgotpasswordpart2', {
        method: 'POST',
        body: JSON.stringify(params),
        contentType: 'application/json'
      }).then(function(response) {
        return response.json();
      }).then(function(data) {
        if (data.Status === "Success") {
          onSuccess(data.Message);
        } else {
          onFailure(data.Error);
        }
      });
    },

    /*
     *  Confirm a new user's account and email.
     */
    verify(username, code, onSuccess, onFailure) {
      var params = {
        ClientId: Config.userPoolClientId,
        ConfirmationCode: code,
        Username: username
      };

      fetch('https://jgmysjlzii.execute-api.us-east-2.amazonaws.com/prod/confirmnewuser', {
        method: 'POST',
        body: JSON.stringify(params),
        contentType: 'application/json'
      }).then(function(response) {
        return response.json();
      }).then(function(data) {
        if (data.Status === "Success") {
          onSuccess(data.Message);
        } else {
          onFailure(data.Error);
        }
      });
    },

    /*
     *  Resend the email containing a verification code for account confirmation.
     */
    resendVerification(username, onSuccess, onFailure) {
      var params = {
        ClientId: Config.userPoolClientId,
        Username: username
      };

      fetch('https://jgmysjlzii.execute-api.us-east-2.amazonaws.com/prod/resendconfirmationemail', {
        method: 'POST',
        body: JSON.stringify(params),
        contentType: 'application/json'
      }).then(function(response) {
        return response.json();
      }).then(function(data) {
        if (data.Status === "Success") {
          onSuccess(data.Message);
        } else {
          onFailure(data.Error);
        }
      });
    },


    /*
     *  Register a new user with the provided information. userPool.signUp creates the
     *  user in the database, then another function is called to add the user to the
     *  appropriate user type group. After the account is created, a verifcation code
     *  will be sent to the provided email.
     *
     */
    register(username, password, email, userType, age, rank, name, onSuccess, onFailure) {
      var dataEmail = {
          Name: 'email',
          Value: email
      };
      var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);

      if (userType === "coach") {
        var dataAge = {
          Name: 'custom:age',
          Value: age
        };
        var attributeAge = new AmazonCognitoIdentity.CognitoUserAttribute(dataAge);

        var dataRank = {
            Name: 'custom:rank',
            Value: rank
        };
        var attributeRank = new AmazonCognitoIdentity.CognitoUserAttribute(dataRank);

        var dataName = {
            Name: 'name',
            Value: name
        };
        var attributeName = new AmazonCognitoIdentity.CognitoUserAttribute(dataName);

        userPool.signUp(username, password, [attributeEmail, attributeAge, attributeRank, attributeName], null,
            function signUpCallback(err, result) {
                if (!err) {
                  fetch('https://jgmysjlzii.execute-api.us-east-2.amazonaws.com/prod/groupnewuser', {
                    method: 'POST',
                    body: JSON.stringify({
                      UserPoolId: userPool.userPoolId,
                      Username: username,
                      Group: userType
                    }),
                    contentType: 'application/json'
                  }).then(function(response) {
                    return response.json();
                  }).then(function(data) {
                    if (data.Status === "Success") {
                      onSuccess(result);
                    } else {
                      onFailure(data.Error)
                    }
                  });
                } else {
                    onFailure(err);
                }
            }
        );
      } else {
        userPool.signUp(username, password, [attributeEmail], null,
            function signUpCallback(err, result) {
                if (!err) {
                  fetch('https://jgmysjlzii.execute-api.us-east-2.amazonaws.com/prod/groupnewuser', {
                    method: 'POST',
                    body: JSON.stringify({
                      UserPoolId: userPool.userPoolId,
                      Username: username,
                      Group: userType
                    }),
                    contentType: 'application/json'
                  }).then(function(response) {
                    return response.json();
                  }).then(function(data) {
                    if (data.Status === "Success") {
                      onSuccess(result);
                    } else {
                      onFailure(data.Error)
                    }
                  });
                } else {
                    onFailure(err);
                }
            }
        );
      }
    },

    /*
     *  Retrieve user data, including user type and email verification status, of the currently
     *  logged in user. Returns a JSON data object, or null if an error occurs.
     */
    async getUserData() {
      if (userPool.getCurrentUser()) {
        var returnObject = null;
        await fetch('https://jgmysjlzii.execute-api.us-east-2.amazonaws.com/prod/userdata', {
          method: 'GET',
          headers: {
              Authorization: Authenticate.getToken()
          },
          contentType: 'application/json'
        }).then(function(response) {
          return response.json();
        }).then(function(data) {
          returnObject = data;
        });
        return returnObject;
      } else {
        console.log("Cannot get user data: no user is signed in.");
        return null;
      }
    },

    /*
     *  Authenticate the current user.
     *
     *  Returns current user's authorization token, or null if such a token cannot be found.
     */
    async authenticate() {
      var returnVal = null;
      var prom = new Promise(function fetchCurrentAuthToken(resolve, reject) {
          var cognitoUser = userPool.getCurrentUser();

          if (cognitoUser) {
            cognitoUser.getSession(function sessionCallback(err, session) {
              if (err) {
                reject(err);
              } else if (!session.isValid()) {
                resolve(null);
              } else {
                resolve(session.getIdToken().getJwtToken());
              }
            });
          } else {
            resolve(null);
          }
      }).then(function setAuthToken(token) {
          if (token) {
            returnVal = token;
            window.localStorage.setItem('token', token);
          } else {
            console.log("invalid token");
          }
      }).catch(function handleTokenError(error) {
          alert(error);
          console.log("token error: " + error);
          window.localStorage.removeItem('token');
          window.localStorage.removeItem('isAuthenticated');
      });

      await prom;

      if (returnVal) {
        window.localStorage.setItem('isAuthenticated', true);
        var dataCall = await Authenticate.getUserData();
        if (dataCall) {
          window.localStorage.setItem('userType', dataCall.Group);
          window.localStorage.setItem('verified', true);
        } else {
          window.localStorage.removeItem('userType');
          window.localStorage.removeItem('verified');
        }
      } else {
        window.localStorage.removeItem('isAuthenticated');
      }

      return returnVal;
    },

    /*
     *  Sign in a user. Must provide a main entry (username or email) and password to look up in userbase.
     *  After successful sign in, the logged in user can be found in userPool.getCurrentUser().
     *  This user will persist across page changes and refreshes, and will disappear upon calling signout() or clearing cookies.
     *  After logging in, immediately runs authenticate() to retrieve token.
     *
     *  Returns session token upon successful log in, otherwise false.
     */
    async signin(entry, password) {
      var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
          Email: entry,
          Username: entry,
          Password: password
      });
      var cognitoUser = new AmazonCognitoIdentity.CognitoUser({
          Username: entry,
          Pool: userPool
      });

      var prom = new Promise(function attemptLogin(resolve, reject) {
          cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: async function(userAttributes) {
              var auth = await Authenticate.authenticate();
              if (auth != null) {
                resolve(true);
              }
            },
            onFailure: function(err) {
              alert(err.message);
              reject(err.name);
            },
            newPasswordRequired: function(userAttributes, requiredAttributes) {
              var newPassword = prompt('Enter a new password to replace the temporary password ', '');
              if (newPassword) {
                delete userAttributes.email_verified;
                cognitoUser.completeNewPasswordChallenge(newPassword, userAttributes, {
                  onSuccess: (result) => {
                    alert("Password successfully changed. Log in again using the new password.");
                    reject(false);
                  },
                  onFailure: (err) => {
                    alert(err.message);
                    reject(false);
                  }
                });
              }
            }
        });
      });

      prom.catch(function(error) {
          return error;
      });

      return await prom;
    },

    /*
     *  Sign out the current user, if there is one.
     *
     *  Returns true upon successful sign out. Returns false if there was no current user to begin with.
     */
    signout() {
      var cognitoUser = userPool.getCurrentUser();
      if (cognitoUser) {
        cognitoUser.signOut();
        window.localStorage.removeItem('token');
        window.localStorage.removeItem('isAuthenticated');
        window.localStorage.removeItem('userType');
        window.localStorage.removeItem('verified');
        return true;
      }
      return false;
    },
  };

  export default Authenticate;