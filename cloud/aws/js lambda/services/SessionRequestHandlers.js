const AWS = require('aws-sdk');
AWS.config.update({ region: 'eu-west-2' });
const jwtDecode = require('jwt-decode');

var self;

class SessionRequestHandlers {

  constructor(db, requestValidationServices, completionServices, cognitoServices) {
    console.log("SessionRequestHandlers constructor");
    this.db = db;
    this.validation = requestValidationServices;
    this.completionServices = completionServices;
    this.cognitoServices = cognitoServices;
    self = this;
  }

  //NOT USED IN V3
  /**
 * method for refreshing the players id and access tokens
 * @param request
 * @param response
 */
  async refreshTokens(request, response) {
    console.log('entered refreshTokens');

    var playerToken = request.body.playerToken;
    var playerDeviceToken = request.body.playerDeviceToken;
    var playerRefreshToken = request.body.playerRefreshToken;

    var errorMsg = self.validation.validatePlayerToken(playerToken)
      || self.validation.validateDeviceToken(playerDeviceToken)
      || self.validation.validateJwtToken(playerRefreshToken, "refresh");

    if (errorMsg) {
      throw errorMsg;
    }

    var data = await self.cognitoServices.promisifyInitiateAuth(playerRefreshToken);
    var playerIdToken = data.AuthenticationResult.IdToken;
    var playerAccessToken = data.AuthenticationResult.AccessToken;

    await self.cognitoServices.validateJwtToken(playerToken, playerIdToken, "id");
    await self.cognitoServices.validateJwtToken(playerToken, playerAccessToken, "access");

    var newExpiry = await self.cognitoServices.getTokenExpiry(playerIdToken) * 1000;
    var playerIdTokenDuration = newExpiry - (new Date().getTime());
    console.log("playerIdTokenDuration: " + playerIdTokenDuration);
    var additionalProperties = {
      playerIdToken: playerIdToken,
      playerAccessToken: playerAccessToken,
      playerIdTokenDuration: playerIdTokenDuration
    }

    await self.completionServices.sendOkResponse(request, response, additionalProperties);
    console.log('successfully refreshed tokens');
  }


  /*****************************************************************************
   *
   * V3 Methods for React Native
   *
   ***********************************************************************/

  /**
 * method for refreshing the players id and access tokens
 * @param request
 * @param response
 */
  async refreshTokensV3(request, response) {
    console.log("==>refreshTokensV3");

    const playerToken = request.body.playerToken;
    const playerDeviceToken = request.body.playerDeviceToken;
    const playerRefreshToken = request.body.playerRefreshToken;

    const errorMsg = self.validation.validatePlayerToken(playerToken)
      || self.validation.validateDeviceToken(playerDeviceToken)
      || self.validation.validateJwtToken(playerRefreshToken, "refresh");

    if (errorMsg) {
      throw errorMsg;
    }

    const data = await self.cognitoServices.promisifyInitiateAuth(playerRefreshToken);
    const playerIdToken = data.AuthenticationResult.IdToken;
    const playerAccessToken = data.AuthenticationResult.AccessToken;

    await self.cognitoServices.validateJwtToken(playerToken, playerIdToken, "id");
    await self.cognitoServices.validateJwtToken(playerToken, playerAccessToken, "access");

    const newExpiry = await self.cognitoServices.getTokenExpiry(playerIdToken) * 1000;
    const playerIdTokenDuration = newExpiry - (new Date().getTime());
    console.log("playerIdTokenDuration: " + playerIdTokenDuration);
    const additionalProperties = {
      playerIdToken: playerIdToken,
      playerAccessToken: playerAccessToken,
      playerIdTokenDuration: playerIdTokenDuration
    }

    await self.completionServices.sendOkResponse(request, response, additionalProperties);
    console.log('successfully refreshed tokens');
  }
}

module.exports = SessionRequestHandlers;
