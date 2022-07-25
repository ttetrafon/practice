const AWS = require('aws-sdk');
AWS.config.update({ region: 'eu-west-2' });
const jwtDecode = require('jwt-decode');

var self;

class CognitoServices {

  constructor(db, requestValidationServices, completionServices, config) {
    console.log("CognitoServices constructor");
    this.db = db;
    this.validation = requestValidationServices;
    this.completionServices = completionServices;
    this.config = config;
    self = this;
  }

  /**
   * method for validating if the jwt token matches the player token
   * @param request
   * @param name token name
   */
  async validateJwtToken(playerToken, jwtToken, name) {
    console.log('entered validateJwtToken');

    var errorMsg = self.validation.validateJwtToken(jwtToken, name)
      || self.validation.validatePlayerToken(playerToken);

    if (errorMsg) {
      throw errorMsg;
    }

    try {
      //decodes the id token into JSON format
      var decoded = await jwtDecode(jwtToken);
    } catch (err) {
      console.log("ERROR ", err);
      throw "invalid jwt token";
    }

    //checks the username(sub - unique uuid cognito creates) matches the uuid playerToken in the request body
    if (decoded.sub != playerToken) {
      throw "jwtToken username does not match playerToken"
    }

    console.log(name + ' token and player token successfully matched');
  }

  /**
   * Method for extracting expiring dates from the player token
   * Returns a timestamp (js date integer).
   * @param jwtToken
   */
  async getTokenExpiry(jwtToken) {
    var decoded = null;
    try {
      //decodes the id token into JSON format
      decoded = await jwtDecode(jwtToken);
    } catch (err) {
      console.log("ERROR ", err);
      throw "invalid jwt token";
    }
    // just return the remaining time until the tokens expire
    return decoded.exp;
  }

  promisifyInitiateAuth(playerRefreshToken) {
    return new Promise(function (resolve, reject) {
      var cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();

      var params = {
        AuthFlow: "REFRESH_TOKEN",
        ClientId: self.config.cognitoAppClientId(),
        AuthParameters: {
          REFRESH_TOKEN: playerRefreshToken
        }
      }

      cognitoIdentityServiceProvider.initiateAuth(params, function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

}

module.exports = CognitoServices;