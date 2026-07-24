var AmazonCognitoIdentity = require('amazon-cognito-identity-js');
var CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
var AuthenticationDetails = AmazonCognitoIdentity.AuthenticationDetails;
var CognitoUserAttribute = AmazonCognitoIdentity.CognitoUserAttribute;
var CognitoUser = AmazonCognitoIdentity.CognitoUser;
var axios = require('axios');
var phoneUtil = require('google-libphonenumber');
const lookup = require('country-code-lookup')
const aws = require('aws-sdk');
const ses = new aws.SES({ region: 'eu-west-2' });
var self;

class LoginHandler {

  constructor(db, completionServices, cognitoServices, config) {
    self = this;
    this.db = db;
    this.completionServices = completionServices;
    this.cognitoServices = cognitoServices;
    this.config = config;
  }

  //NOT USED IN V3
  getUserPool() {
    var poolData = {
      UserPoolId: self.config.cognitoUserPoolId(),
      ClientId: self.config.cognitoAppClientId()
    };
    return new CognitoUserPool(poolData);
  }

  //NOT USED IN V3
  getUser(username) {
    var userData = {
      Username: username,
      Pool: self.getUserPool()
    };
    return new CognitoUser(userData);
  }

  //NOT USED IN V3
  async registerPlayer(request, response) {
    var username = request.body.playerExternalId.trim().toLowerCase();
    var firstname = request.body.playerFirstName.trim();
    var familyname = request.body.playerFamilyName.trim();
    var birthdate = request.body.playerBirthDate;
    var phonenumber = request.body.playerPhoneNumber;
    var password = request.body.password.trim();
    var deviceToken = request.body.deviceToken;
    var mpaVersion = request.body.versionData;

    // Don't allow the player to register if the mpa version is blacklisted.
    // ... get the appropriate blacklisted list of build versions
    var blacklist = '';
    console.log(mpaVersion);
    if (mpaVersion && mpaVersion.os) {
      if (mpaVersion.os === 'android') {
        blacklist = await self.db.getConfigurationOptions('blacklistAndroid', request);
      }
      else if (mpaVersion.os === 'ios') {
        blacklist = await self.db.getConfigurationOptions('blacklistIos', request);
      }
      else { // TODO: Handle other operating systems than androind and ios.
        await this.completionServices.sendFailResponse(request, response, this.completionServices.completionCodes.CONFIG_OS_NOT_RECOGNISED);
        return;
      }
      blacklist = blacklist.configValue;
      console.log('blacklist: ' + blacklist);
      // ... if the received build version is blacklisted, return a failed response
      if (mpaVersion && mpaVersion.buildNumber && blacklist.indexOf(mpaVersion.buildNumber) >= 0) {
        await this.completionServices.sendFailResponse(request, response, this.completionServices.completionCodes.CONFIG_VERSION_BLACKLISTED);
        return;
      }
    }

    if (deviceToken) {
      var deviceBlacklist = await self.db.getConfigurationOptions('blacklistDevice', request);
      deviceBlacklist = deviceBlacklist.configValue;

      if (deviceToken && deviceBlacklist.indexOf(deviceToken) >= 0) {
        await this.completionServices.sendFailResponse(request, response, this.completionServices.completionCodes.DEVICE_BLACKLISTED);
        return;
      }
    }

    //removing spaces in phone number
    phonenumber = phonenumber.replace(/\s/g, '');

    console.log('Register player: ' + phonenumber);

    var attributeList = [];

    var dataGivenName = {
      Name: 'given_name',
      Value: firstname
    };

    var dataFamilyName = {
      Name: 'family_name',
      Value: familyname
    };

    var dataBirthdate = {
      Name: 'birthdate',
      Value: birthdate
    }

    var dataPhoneNumber = {
      Name: 'phone_number',
      Value: phonenumber
    };

    var dataEmail = {
      Name: 'email',
      Value: username
    };

    var attributeGivenName = new CognitoUserAttribute(dataGivenName);
    var attributeFamilyName = new CognitoUserAttribute(dataFamilyName);
    var attributeBirthdate = new CognitoUserAttribute(dataBirthdate);
    var attributePhoneNumber = new CognitoUserAttribute(dataPhoneNumber);

    attributeList.push(attributeGivenName);
    attributeList.push(attributeFamilyName);
    attributeList.push(attributeBirthdate);
    attributeList.push(attributePhoneNumber);

    var userPool = self.getUserPool();

    var result;
    try {
      result = await self.promisifySignUp(userPool, username, password, attributeList);
    } catch (error) {
      if (error.code === 'UsernameExistsException') {
        console.log('error in catch..' + error);
        let usernameExistsEmailTimestamp = await self.db.getUsernameExistsTimestamp(username, request);
        if (usernameExistsEmailTimestamp == null || usernameExistsEmailTimestamp < (Date.now() - 86400000)) {
          await self.sendUsernameExistsEmail(username, request);
        }
        await self.completionServices.sendFailResponse(request, response, self.completionServices.completionCodes.REGISTER_USER_USERNAME_ALREADY_EXISTS);
        return;
      } else {
        console.log('ERROR in catch..' + error);
        console.log('Problematic password is ' + password);
        throw error;
      }
    }
    var cognitoUser = result.user;
    console.log('Cognito user name is: ' + cognitoUser.getUsername());
    console.log('player token : ' + result.userSub);

    //convert birthdate to millis
    //yyyy-mm-dd is the cognito format
    var dateParts = birthdate.split("-");
    // month is 0-based, that's why we need dataParts[1] - 1
    var dateObject = new Date(+dateParts[0], dateParts[1] - 1, +dateParts[2]);
    var birthdateInMillis = new Date(dateObject).getTime();
    await self.db.createPlayer(result.userSub, username, phonenumber, firstname, familyname, birthdateInMillis);
    var canAgeVerify = await self.getPlayerAge(birthdateInMillis);

    var responseObj = {
      associatedRequestType: "playerRegistration",
      playerToken: result.userSub,
      canAgeVerify: canAgeVerify.toString(),
      completionCode: 0,
      completionMessage: "Ok",
    }
    response.jsonToSend = responseObj;
  }

  //NOt USED IN V3
  promisifySignUp(userPool, username, password, attributeList) {
    return new Promise(function (resolve, reject) {
      userPool.signUp(username, password, attributeList, null, function (error, result) {
        if (error) {
          reject(error);
        }
        else {
          resolve(result);
        }
      })
    });
  }

  //NOT USED IN V3
  async confirmPlayer(request, response) {
    var playerDeviceToken = request.body.playerDeviceToken;
    var playerToken = request.body.playerToken;
    var code = request.body.registrationConfirmationCode.trim();

    console.log('Confirm player: ' + playerToken);

    var userPool = self.getUserPool();
    var userlist = await self.db.getUserEmail(playerToken);
    console.log('Retrieved user  ' + userlist[0].playerExternalId);
    var email = userlist[0].playerExternalId;

    var userData = {
      Username: email,
      Pool: userPool
    };
    var cognitoUser = new CognitoUser(userData);

    if (cognitoUser == null) {
      throw new Error('Cognito user not retrieved!!!');
    }
    try {
      var result = await self.promisifyConfirmPlayer(cognitoUser, code);
    } catch (error) {
      if (error.code === 'CodeMismatchException'
        || error.code === 'InvalidParameterException' || error.code === 'LimitExceededException') {
        // This ensures we don't log an ERROR which causes a support ticket to be raised.
        await self.completionServices.sendFailResponse(request, response, self.completionServices.completionCodes.WRONG_VERIFICAION_CODE);
        return;
      } else if (error.code === 'NotAuthorizedException' && error.message === 'User cannot be confirmed. Current status is CONFIRMED') {
        var accountConfirmed = await self.db.isAccountConfirmed(email);
        if (accountConfirmed) {
          await self.completionServices.sendFailResponse(request, response, self.completionServices.completionCodes.PLAYER_ALREADY_CONFIRMED);
        } else {
          await self.completionServices.sendFailResponse(request, response, self.completionServices.completionCodes.PLAYER_UNABLE_TO_CONFIRM_ACCOUNT);
        }
        return;
      }
      console.log("promisifyConfirmPlayer threw err: ", error);
      throw error;
    }
    console.log('promisifyConfirmPlayer result: ' + result);

    //gets the processor token to assign to a wallet
    var processorToken = await self.db.getLatestProcessorToken(request);

    //calls confirm database method which updates the playerAccount, wallets & safe betting limits
    await self.db.confirmPlayer(playerToken, processorToken, request);
    console.log('...db.confirmPlayer() executed correctly');

    var responseObj = {
      associatedRequestType: "playerRegistrationConfirmation",
      playerToken: playerToken,
      responseActions: [],
      completionCode: 0,
      completionMessage: "Ok",
    }
    response.jsonToSend = responseObj;
    console.log('confirm player successful');
  }

  //NOT USED IN V3
  promisifyConfirmPlayer(cognitoUser, code) {
    return new Promise(function (resolve, reject) {
      cognitoUser.confirmRegistration(code, true, function (error, result) {
        if (error) {
          reject(error);
        }
        else {
          resolve(result);
        }
      })
    });
  }

  //NOT USED IN V3
  async signIn(request, response) {
    console.log('---> signIn()');
    var username = request.body.playerExternalId.trim().toLowerCase();
    var password = request.body.playerPassword;
    var deviceToken = request.body.playerDeviceToken;
    var mpaVersion = request.body.versionData;
    var playerToken = null;
    console.log('Sign in: ' + username);

    // Don't allow the player to sign in if the mpa version is blacklisted.
    // ... get the appropriate blacklisted list of build versions
    var blacklist = '';
    console.log(mpaVersion);
    if (mpaVersion && mpaVersion.os) {
      if (mpaVersion.os === 'android') {
        blacklist = await self.db.getConfigurationOptions('blacklistAndroid', request);
      }
      else if (mpaVersion.os === 'ios') {
        blacklist = await self.db.getConfigurationOptions('blacklistIos', request);
      }
      else { // TODO: Handle other operating systems than androind and ios.
        await this.completionServices.sendFailResponse(request, response, this.completionServices.completionCodes.CONFIG_OS_NOT_RECOGNISED);
        return;
      }
      blacklist = blacklist.configValue;
      console.log('blacklist: ' + blacklist);
      // ... if the received build version is blacklisted, return a failed response
      if (mpaVersion && mpaVersion.buildNumber && blacklist.indexOf(mpaVersion.buildNumber) >= 0) {
        await this.completionServices.sendFailResponse(request, response, this.completionServices.completionCodes.CONFIG_VERSION_BLACKLISTED);
        return;
      }
    }

    if (deviceToken) {
      var deviceBlacklist = await self.db.getConfigurationOptions('blacklistDevice', request);
      deviceBlacklist = deviceBlacklist.configValue;

      if (deviceToken && deviceBlacklist.indexOf(deviceToken) >= 0) {
        await this.completionServices.sendFailResponse(request, response, this.completionServices.completionCodes.DEVICE_BLACKLISTED);
        return;
      }
    }

    // Check if the user exists in the database.
    var query = await self.db.getPlayerTokenVar(username);
    console.log(query);
    if (query.length === 0) {
      await self.completionServices.sendFailResponse(request, response, self.completionServices.completionCodes.SIGN_IN_INCORRECT_CREDENTIALS);
      return;
    }
    else {
      playerToken = query[0].playerToken;
    }

    //Check if the account is confirmed
    var accountConfirmed = await self.db.isAccountConfirmed(username);
    if (accountConfirmed === false) {
      let token = await self.db.getPlayerToken(request.body.playerExternalId);
      if (token !== null && token.length > 0) {
        request.body.playerToken = token[0].playerToken;
      }
      var playerDetails = await self.db.getPlayerPhoneBirthDate(username, request);
      var canAgeVerify = await self.getPlayerAge(playerDetails.playerBirthDate);
      await self.completionServices.sendFailResponse(request, response, self.completionServices.completionCodes.SIGN_IN_USER_NOT_CONFIRMED, {
        phoneNumber: playerDetails.playerPhoneNumber,
        canAgeVerify: canAgeVerify.toString(),
        blockedCountryList: self.config.getBlockedCountryList()
      });
      return;
    }

    // Send a player to the address confirmation page if they have not registered an address yet.
    var addressVerified = await self.db.isAddressVerified(username);
    console.log('addressVerified: ' + addressVerified);
    if (!addressVerified) {
      var playerDetails = await self.db.getPlayerPhoneBirthDate(username, request);
      var canAgeVerify = await self.getPlayerAge(playerDetails.playerBirthDate);
      await self.completionServices.sendFailResponse(request, response, self.completionServices.completionCodes.POSTCODER_ADDRESS_NOT_VERIFIED, {
        playerToken: playerToken,
        phoneNumber: playerDetails.playerPhoneNumber,
        canAgeVerify: canAgeVerify.toString(),
        blockedCountryList: self.config.getBlockedCountryList()
      });
      return;
    }

    var cognitoUser = self.getUser(username);
    var authenticationData = {
      Username: username,
      Password: password,
    };
    var authenticationDetails = new AuthenticationDetails(authenticationData);
    var result;
    try {
      result = await self.promisifySignIn(cognitoUser, authenticationDetails);
    } catch (error) {
      if (error.code == 'NotAuthorizedException' || error.code == 'UserNotFoundException') {
        await self.completionServices.sendFailResponse(request, response, self.completionServices.completionCodes.SIGN_IN_INCORRECT_CREDENTIALS);
      } else {
        throw error;
      }
      return;
    }
    var playerAccessToken = result.getAccessToken().getJwtToken();
    var playerRefreshToken = result.getRefreshToken().getToken();
    var playerToken = result.idToken.payload.sub;
    var playerIdToken = result.idToken.jwtToken;
    var playerIdTokenExpiry = await this.cognitoServices.getTokenExpiry(playerIdToken) * 1000;

    console.log("playerIdTokenExpiry=" + playerIdTokenExpiry);
    var playerIdTokenDuration = playerIdTokenExpiry - (new Date().getTime());
    console.log("playerIdTokenDuration=" + playerIdTokenDuration);
    console.log('login successful: playerToken: ' + playerToken);
    var isEmailVerified = await self.db.isEmailVerified(playerToken);
    var allConfigOptions = await self.db.getAllConfigurationOptions(request);

    var isAgeVerified = await self.db.isAgeVerified(playerToken, request);
    var playerDetails = await self.db.getPlayerPhoneBirthDate(username, request);
    var canAgeVerify = await self.getPlayerAge(playerDetails.playerBirthDate);
    var playerBreakEndDatetime = await self.db.getPlayerBreakDetails(username, request);
    var activeWallet = await self.db.getDefaultWallet(playerToken, request);
    var playerWallets = await self.db.getPlayerActiveWallets(playerToken, request);
    var operatorWallets = await self.db.getAllOperatorWallets(playerToken, request);

    axios.defaults.headers.common["Authorization"] = "Bearer " + playerIdToken;
    await axios.get(allConfigOptions.playerServiceUrl + '/v1/ping');
    console.log('Player Service currently running');
    var responseObj = {
      associatedRequestType: "playerSignIn",
      playerIdToken: playerIdToken,
      playerIdTokenDuration: playerIdTokenDuration,
      playerToken: playerToken,
      playerAccessToken: playerAccessToken,
      playerRefreshToken: playerRefreshToken,
      isEmailVerified: isEmailVerified,
      configData: {
        authenticationServiceUrl: allConfigOptions.authenticationServiceUrl,
        playerServiceUrl: allConfigOptions.playerServiceUrl,
        maxTopUpLimit: allConfigOptions.MAX_TOPUP_AMOUNT,
        minTopUpLimit: allConfigOptions.MIN_TOPUP_AMOUNT,
        minWithdrawLimit: allConfigOptions.PARTIAL_WITHDRAWAL_LIMIT,
        nearbyGamesMaxSignal: allConfigOptions.NEARBY_GAMES_MAX_SIGNAL,
        bluetoothScanTime: allConfigOptions.BLUETOOTH_SCAN_TIME,
        noCcTalkTrafficDisconnectTimer: allConfigOptions.NO_CCTALK_DISCONNECT_TIMEOUT,
        walletBalancePollingInterval: allConfigOptions.WALLET_BALANCE_POLL_INTERVAL,
        walletBalancePollingWaitTimeout: allConfigOptions.WALLET_BALANCE_POLL_WAIT_TIMEOUT,
        sessionSpendAmountCheck: allConfigOptions.SESSION_SPEND_AMOUNT_CHECK,
        sessionLengthCheckMinutes: allConfigOptions.SESSION_LENGTH_CHECK_MINUTES,
        isAgeVerified: isAgeVerified,
        canAgeVerify: canAgeVerify,
        playerBreakEndDatetime: playerBreakEndDatetime.takeABreakEndDatetime,
        activeWallet: activeWallet,
        playerWallets: playerWallets,
        operatorWallets: operatorWallets,
        blockedCountryList: self.config.getBlockedCountryList()
      },
      responseActions: [],
      completionCode: 0,
      completionMessage: "Ok",
    };

    response.jsonToSend = responseObj;
  }

  //NOT USED IN V3
  promisifySignIn(cognitoUser, authenticationDetails) {
    return new Promise(function (resolve, reject) {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
          resolve(result);
        }, onFailure: function (error) {
          reject(error);
        }
      });
    });
  }

  //NOT USED IN V3
  async resendCode(request, response) {
    var username = request.body.playerExternalId.trim().toLowerCase();
    var playerDeviceToken = request.body.playerDeviceToken;

    console.log('Resend code: ' + username);
    var cognitoUser = self.getUser(username);

    try {
      await self.promisifyResendCode(cognitoUser);
    } catch (error) {
      if (error.code === 'InvalidParameterException' && error.message === 'User is already confirmed.') {
        var accountConfirmed = await self.db.isAccountConfirmed(username);
        if (accountConfirmed) {
          await self.completionServices.sendFailResponse(request, response, self.completionServices.completionCodes.PLAYER_ALREADY_CONFIRMED);
        } else {
          await self.completionServices.sendFailResponse(request, response, self.completionServices.completionCodes.PLAYER_UNABLE_TO_CONFIRM_ACCOUNT);
        }
        return;
      }
      console.log("promisifyResendCode: ", error);
      throw error;
    }
    var responseObj = {
      associatedRequestType: "playerResendCode",
      playerToken: cognitoUser.playerToken,
      responseActions: [],
      completionCode: 0,
      completionMessage: "Ok",
    }
    response.jsonToSend = responseObj;
  }

  //NOT USED IN V3
  promisifyResendCode(cognitoUser) {
    return new Promise(function (resolve, reject) {
      cognitoUser.resendConfirmationCode(function (error, result) {
        if (error) {
          reject(error);
        }
        else {
          resolve(result);
        }
      });
    });
  }

  //NOT USED IN V3
  async resetPassword(request, response) {
    var username = request.body.playerExternalId;
    console.log('Reset Password: ' + username);
    var cognitoUser = self.getUser(username);
    var mpaVersion = request.body.versionData;

    var blacklist = '';
    console.log(mpaVersion);
    if (mpaVersion && mpaVersion.os) {
      if (mpaVersion.os === 'android') {
        blacklist = await self.db.getConfigurationOptions('blacklistAndroid', request);
      }
      else if (mpaVersion.os === 'ios') {
        blacklist = await self.db.getConfigurationOptions('blacklistIos', request);
      }
      else { // TODO: Handle other operating systems than androind and ios.
        await this.completionServices.sendFailResponse(request, response, this.completionServices.completionCodes.CONFIG_OS_NOT_RECOGNISED);
        return;
      }
      blacklist = blacklist.configValue;
      console.log('blacklist: ' + blacklist);
      // ... if the received build version is blacklisted, return a failed response
      if (mpaVersion && mpaVersion.buildNumber && blacklist.indexOf(mpaVersion.buildNumber) >= 0) {
        await this.completionServices.sendFailResponse(request, response, this.completionServices.completionCodes.CONFIG_VERSION_BLACKLISTED);
        return;
      }
    }

    try {
      await self.promisifyResetPassword(cognitoUser);
    } catch (error) {
      console.log('reset password failed: username: ' + username);
      console.log('error thrown from reset password ' + error);

      if (error.code == 'LimitExceededException') {
        await self.completionServices.sendFailResponse(request, response, self.completionServices.completionCodes.RESET_PASSWORD_ATTEMPT_LIMIT_EXCEEDED);
      } else if (error.code == 'UserNotFoundException') {
        await self.completionServices.sendFailResponse(request, response, self.completionServices.completionCodes.RESET_PASSWORD_USER_NOT_FOUND);
      } else if (error.code == 'InvalidParameterException') {
        await self.completionServices.sendFailResponse(request, response, self.completionServices.completionCodes.RESET_PASSWORD_FAILED_FOR_UNCONFIRMED_USER);
      } else {
        throw error;
      }
    }

    var responseObj = {
      associatedRequestType: "playerResetPassword",
      playerToken: username,
      responseActions: [],
      completionCode: 0,
      completionMessage: "Ok",
    }
    response.jsonToSend = responseObj;
  }

  //NOT USED IN V3
  promisifyResetPassword(cognitoUser) {
    return new Promise(function (resolve, reject) {
      cognitoUser.forgotPassword({
        onSuccess: function (result) {
          resolve(result);
        }, onFailure: function (error) {
          reject(error);
        }
      });
    });
  }

  //NOT USED IN V3
  async resetPasswordConfirmation(request, response) {
    var username = request.body.playerExternalId;
    var code = request.body.resetPasswordConfirmationCode;
    var newPassword = request.body.newPassword;

    console.log('Reset Password Confirmation: ' + username);
    var cognitoUser = self.getUser(username);

    try {
      await self.promisifyResetPasswordConfirmation(cognitoUser, code, newPassword);
    } catch (error) {
      if (error.code === 'CodeMismatchException'
        || error.code === 'InvalidParameterException' || error.code === 'LimitExceededException') {
        // This ensures we don't log an ERROR which causes a support ticket to be raised.
        await self.completionServices.sendFailResponse(request, response, self.completionServices.completionCodes.WRONG_VERIFICAION_CODE);
        return;
      }
      console.log("promisifyResetPasswordConfirmation threw err: ", error);
      throw error;
    }

    console.log('Password confirmed!');
    var responseObj = {
      associatedRequestType: "playerResetPasswordConfirmation",
      playerToken: username,
      responseActions: [],
      completionCode: 0,
      completionMessage: "Ok",
    }
    response.jsonToSend = responseObj;
  }

  //NOT USED IN V3
  promisifyResetPasswordConfirmation(cognitoUser, code, newPassword) {
    return new Promise(function (resolve, reject) {
      cognitoUser.confirmPassword(code, newPassword, {
        onSuccess: function (result) {
          resolve(result);
        }, onFailure: function (error) {
          reject(error);
        }
      });
    });
  }

  //NOT USED IN V3
  async sendRegistrationEmail(request, response) {
    console.log('entered sendRegistrationEmail for playerToken: ' + request.body.playerToken);

    var playerEmail = await self.db.getRegistrationEmailDetails(request.body.playerToken, request);
    var email = await self.config.getSignUpEmail(playerEmail.playerFirstName);

    try {
      await self.promisifySendEmail(playerEmail, email);
      console.log('email successfully sent');
    } catch (err) {
      console.log('ERROR sending email: ' + err)
    }

    await self.completionServices.sendOkResponse(request, response);
    console.log("sendRegistrationEmail completed for playerToken: " + request.body.playerToken);
  }

  //NOT USED IN V3
  async sendUsernameExistsEmail(username, request) {
    console.log('entered sendUsernameExistsEmail for username: ' + username);

    var playerEmail = await self.db.getUsernameExistsEmailDetails(username, request);
    var email = await self.config.getUsernameExistsEmail(playerEmail.playerFirstName);

    try {
      await self.promisifySendEmail(playerEmail, email);
      console.log('email successfully sent');
    } catch (err) {
      console.log('ERROR sending email: ' + err)
    }
    await self.db.setUsernameExistsTimestamp(username, request);

    console.log("sendUsernameExistsEmail completed");
    return;
  }

  //NOT USED IN V3
  promisifySendEmail(playerEmail, email) {
    return new Promise(function (resolve, reject) {

      var params = {
        Destination: {
          ToAddresses: [playerEmail.playerExternalId]
        },
        Message: {
          Body: {
            Html: {
              Data: email.message
            }
          },
          Subject: {
            Data: email.subject
          }
        },
        Source: email.source
      };

      ses.sendEmail(params, function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  //NOT USED IN V3
  getPlayerAge(playerBirthDate) {
    let today = new Date();
    let birthDate = new Date(playerBirthDate);
    let age = today.getFullYear() - birthDate.getFullYear();
    let m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return (age >= 18 ? true : false);
  }



  /********************************************************************************
   * V3 METHODS
   *
   * Here are methods that are for the new RN app
   ********************************************************************************/

  getUserPoolV3() {
    var poolData = {
      UserPoolId: self.config.cognitoUserPoolId(),
      ClientId: self.config.cognitoAppClientId()
    };
    return new CognitoUserPool(poolData);
  }

  getUserV3(username) {
    var userData = {
      Username: username,
      Pool: self.getUserPoolV3()
    };
    return new CognitoUser(userData);
  }

  async registerPlayerV3(request, response) {
    console.log("==>registerPlayerV3");

    const username = request.body.username.trim().toLowerCase();
    const firstname = request.body.playerFirstName.trim();
    const familyname = request.body.playerFamilyName.trim();
    const birthdate = request.body.playerBirthDate;
    const password = request.body.password.trim();
    const deviceToken = request.body.deviceToken;
    const mpaVersion = request.body.versionData;
    let phoneNumber = request.body.playerPhoneNumber;

    // Don't allow the player to register if the mpa version is blacklisted.
    // ... get the appropriate blacklisted list of build versions
    console.log(mpaVersion);
    if (mpaVersion && mpaVersion.os) {

      if (mpaVersion.os != 'android' && mpaVersion.os != 'ios') {
        await this.completionServices.sendFailResponse(request, response, this.completionServices.completionCodes.CONFIG_OS_NOT_RECOGNISED);
        return;
      }

      const version = mpaVersion.versionNumber.replace(/\./g, '');

      let whitelistVersion = await self.db.getConfigurationOptions('whitelistVersion', request);
      whitelistVersion = whitelistVersion.configValue.replace(/\./g, '');

      console.log('whitelistVersion: ' + whitelistVersion);
      //if the received build version is older than the whitelisted version return a failed response
      if (version < whitelistVersion) {
        await this.completionServices.sendFailResponse(request, response, this.completionServices.completionCodes.CONFIG_VERSION_BLACKLISTED);
        return;
      }
    }

    if (deviceToken) {
      let deviceBlacklist = await self.db.getConfigurationOptions('blacklistDevice', request);
      deviceBlacklist = deviceBlacklist.configValue;

      if (deviceToken && deviceBlacklist.indexOf(deviceToken) >= 0) {
        await this.completionServices.sendFailResponse(request, response, this.completionServices.completionCodes.DEVICE_BLACKLISTED);
        return;
      }
    }

    //removing spaces in phone number and add + if missing
    phoneNumber = phoneNumber.replace(/\s/g, '');
    if (!phoneNumber.startsWith('+')) {
      phoneNumber = '+' + phoneNumber;
    }

    //if this true, default to UK dialling code
    if (phoneNumber.indexOf('+undefined') != -1) {
      phoneNumber = phoneNumber.replace('+undefined', '+44');
    }

    let attributeList = [];

    const dataGivenName = {
      Name: 'given_name',
      Value: firstname
    };

    const dataFamilyName = {
      Name: 'family_name',
      Value: familyname
    };

    const dataBirthdate = {
      Name: 'birthdate',
      Value: birthdate
    }

    const dataPhoneNumber = {
      Name: 'phone_number',
      Value: phoneNumber
    };

    const attributeGivenName = new CognitoUserAttribute(dataGivenName);
    const attributeFamilyName = new CognitoUserAttribute(dataFamilyName);
    const attributeBirthdate = new CognitoUserAttribute(dataBirthdate);
    const attributePhoneNumber = new CognitoUserAttribute(dataPhoneNumber);

    attributeList.push(attributeGivenName);
    attributeList.push(attributeFamilyName);
    attributeList.push(attributeBirthdate);
    attributeList.push(attributePhoneNumber);

    const userPool = self.getUserPoolV3();

    let result;
    try {
      result = await self.promisifySignUpV3(userPool, username, password, attributeList);
    } catch (error) {
      if (error.code === 'UsernameExistsException') {
        console.log('error in catch..' + error);
        const usernameExistsEmailTimestamp = await self.db.getUsernameExistsTimestamp(username, request);
        if (usernameExistsEmailTimestamp == null || usernameExistsEmailTimestamp < (Date.now() - 86400000)) {
          await self.sendUsernameExistsEmailV3(username, request);
        }
        await self.completionServices.sendFailResponse(request, response, self.completionServices.completionCodes.REGISTER_USER_USERNAME_ALREADY_EXISTS);
        return;
      } else {
        console.log('ERROR in catch..' + error);
        console.log('Problematic password is ' + password);
        throw error;
      }
    }
    const cognitoUser = result.user;
    console.log('Cognito user name is: ' + cognitoUser.getUsername());
    console.log('player token : ' + result.userSub);

    //convert birthdate to millis
    //yyyy-mm-dd is the cognito format
    const dateParts = birthdate.split("-");
    // month is 0-based, that's why we need dataParts[1] - 1
    const dateObject = new Date(+dateParts[0], dateParts[1] - 1, +dateParts[2]);
    const birthdateInMillis = new Date(dateObject).getTime();
    await self.db.createPlayer(result.userSub, username, phoneNumber, firstname, familyname, birthdateInMillis);
    const playerCanAgeVerify = await self.playerCanAgeVerifyV3(birthdateInMillis);

    const additionalProperties = {
      playerToken: result.userSub,
      playerCanAgeVerify: playerCanAgeVerify,
      yotiClientSdkId: self.config.YOTI_CLIENT_SDK_ID,
      yotiScenarioId: self.config.YOTI_SCENARIO_ID
    }

    await self.completionServices.sendOkResponse(request, response, additionalProperties)
  }

  promisifySignUpV3(userPool, username, password, attributeList) {
    return new Promise(function (resolve, reject) {
      userPool.signUp(username, password, attributeList, null, function (error, result) {
        if (error) {
          reject(error);
        }
        else {
          resolve(result);
        }
      })
    });
  }

  async signInV3(request, response) {
    console.log("==>signInV3");

    const username = request.body.username.trim().toLowerCase();
    const password = request.body.playerPassword;
    const deviceToken = request.body.playerDeviceToken;
    const mpaVersion = request.body.versionData;
    let playerToken = null;
    console.log('Sign in: ' + username);

    // Don't allow the player to sign in if the mpa version is older than the whitelisted version.
    // ... get the appropriate whitelisted list of build versions
    console.log(mpaVersion);
    if (mpaVersion && mpaVersion.os) {

      if (mpaVersion.os != 'android' && mpaVersion.os != 'ios') {
        await this.completionServices.sendFailResponse(request, response, this.completionServices.completionCodes.CONFIG_OS_NOT_RECOGNISED);
        return;
      }

      const version = mpaVersion.versionNumber.replace(/\./g, '');

      let whitelistVersion = await self.db.getConfigurationOptions('whitelistVersion', request);
      whitelistVersion = whitelistVersion.configValue.replace(/\./g, '');

      console.log('whitelistVersion: ' + whitelistVersion);
      //if the received build version is older than the whitelisted version return a failed response
      if (version < whitelistVersion) {
        await this.completionServices.sendFailResponse(request, response, this.completionServices.completionCodes.CONFIG_VERSION_BLACKLISTED);
        return;
      }
    }

    if (deviceToken) {
      let deviceBlacklist = await self.db.getConfigurationOptions('blacklistDevice', request);
      deviceBlacklist = deviceBlacklist.configValue;

      if (deviceToken && deviceBlacklist.indexOf(deviceToken) >= 0) {
        await this.completionServices.sendFailResponse(request, response, this.completionServices.completionCodes.DEVICE_BLACKLISTED);
        return;
      }
    }

    // Check if the user exists in the database.
    let query = await self.db.getPlayerTokenVar(username);
    console.log(query);
    if (query.length === 0) {
      await self.completionServices.sendFailResponse(request, response, self.completionServices.completionCodes.SIGN_IN_INCORRECT_CREDENTIALS);
      return;
    }
    else {
      playerToken = query[0].playerToken;
    }

    const playerAccount = await self.db.getPlayerAccount(playerToken);
    const playerCanAgeVerify = await self.playerCanAgeVerifyV3(playerAccount.playerBirthDate, playerAccount.playerAddressCountry);

    //Check if the account is confirmed
    const accountConfirmed = await self.db.isAccountConfirmed(username);
    if (accountConfirmed === false) {
      const token = await self.db.getPlayerToken(request.body.username);
      if (token !== null && token.length > 0) {
        request.body.playerToken = token[0].playerToken;
      }

      let countryData;
      try {
        countryData = self.getCountryFromPhoneNumberV3(playerAccount.playerPhoneNumber);
      } catch (err) {
        //if failed to get country from phone number default to UK
        console.log("Failed to get country from phone number as not valid, so using default UK");
        countryData = {
          country: 'United Kingdom',
          iso2: 'GB'
        };
      }

      const additionalProperties = {
        countryInfo: {
          country: countryData.country,
          countryShortcode: countryData.iso2
        },
        playerCanAgeVerify: playerCanAgeVerify,
        yotiClientSdkId: self.config.YOTI_CLIENT_SDK_ID,
        yotiScenarioId: self.config.YOTI_SCENARIO_ID
      }

      await self.completionServices.sendFailResponse(request, response, self.completionServices.completionCodes.SIGN_IN_USER_NOT_CONFIRMED, additionalProperties);
      return;
    }

    // Send a player to the address confirmation page if they have not registered an address yet.
    const addressVerified = await self.db.isAddressVerified(username);
    console.log('addressVerified: ' + addressVerified);
    if (!addressVerified) {

      let countryData;
      try {
        countryData = self.getCountryFromPhoneNumberV3(playerAccount.playerPhoneNumber);
      } catch (err) {
        //if failed to get country from phone number default to UK
        console.log("Failed to get country from phone number as not valid, so using default UK");
        countryData = {
          country: 'United Kingdom',
          iso2: 'GB'
        };
      }

      const additionalProperties = {
        playerToken: playerToken,
        countryInfo: {
          country: countryData.country,
          countryShortcode: countryData.iso2
        },
        playerCanAgeVerify: playerCanAgeVerify,
        yotiClientSdkId: self.config.YOTI_CLIENT_SDK_ID,
        yotiScenarioId: self.config.YOTI_SCENARIO_ID
      }
      await self.completionServices.sendFailResponse(request, response, self.completionServices.completionCodes.POSTCODER_ADDRESS_NOT_VERIFIED, additionalProperties);
      return;
    }

    const cognitoUser = self.getUserV3(username);
    const authenticationData = {
      Username: username,
      Password: password,
    };
    const authenticationDetails = new AuthenticationDetails(authenticationData);
    let result;
    try {
      result = await self.promisifySignInV3(cognitoUser, authenticationDetails);
    } catch (error) {
      if (error.code == 'NotAuthorizedException' || error.code == 'UserNotFoundException') {
        await self.completionServices.sendFailResponse(request, response, self.completionServices.completionCodes.SIGN_IN_INCORRECT_CREDENTIALS);
      } else {
        throw error;
      }
      return;
    }

    const playerAccessToken = result.getAccessToken().getJwtToken();
    const playerRefreshToken = result.getRefreshToken().getToken();
    playerToken = result.idToken.payload.sub;
    const playerIdToken = result.idToken.jwtToken;
    const playerIdTokenExpiry = await this.cognitoServices.getTokenExpiry(playerIdToken) * 1000;

    console.log("playerIdTokenExpiry=" + playerIdTokenExpiry);
    const playerIdTokenDuration = playerIdTokenExpiry - (new Date().getTime());
    console.log("playerIdTokenDuration=" + playerIdTokenDuration);
    console.log('login successful: playerToken: ' + playerToken);

    const allConfigOptions = await self.db.getAllConfigurationOptions(request);

    //check if player confirmed but not email verified, means they have updated their email within the app but not entered the code
    //need to be signed in to update attributes, so putting this check here
    if (playerAccount.playerConfirmedDatetime && !playerAccount.playerEmailVerifiedDatetime) {
      const additionalProperties = {
        playerIdToken: playerIdToken,
        playerIdTokenDuration: playerIdTokenDuration,
        playerToken: playerToken,
        playerAccessToken: playerAccessToken,
        playerRefreshToken: playerRefreshToken,
        playerServiceUrl: allConfigOptions.playerServiceUrl,
      }
      await self.completionServices.sendFailResponse(request, response, self.completionServices.completionCodes.SIGN_IN_EMAIL_NOT_VERIFIED, additionalProperties);
      return
    }

    const operatorWalletToken = self.config.operatorWalletToken();
    const operatorWallet = await self.db.getOperatorWallet(operatorWalletToken);
    const wallet = await self.db.getWalletFromOperatorToken(operatorWallet.operatorWalletToken, playerToken);

    const playerAgeVerifiedStatus = await self.db.isAgeVerified(playerToken, request);

    axios.defaults.headers.common["Authorization"] = "Bearer " + playerIdToken;
    await axios.get(allConfigOptions.playerServiceUrl + '/v1/ping');
    console.log('Player Service currently running');
    const additionalProperties = {
      playerIdToken: playerIdToken,
      playerIdTokenDuration: playerIdTokenDuration,
      playerToken: playerToken,
      playerAccessToken: playerAccessToken,
      playerRefreshToken: playerRefreshToken,
      configData: {
        playerServiceUrl: allConfigOptions.playerServiceUrl,
        maxTopUpLimit: allConfigOptions.MAX_TOPUP_AMOUNT,
        minTopUpLimit: allConfigOptions.MIN_TOPUP_AMOUNT,
        minWithdrawLimit: allConfigOptions.PARTIAL_WITHDRAWAL_LIMIT,
        nearbyMachinesMaxSignal: allConfigOptions.NEARBY_GAMES_MAX_SIGNAL,
        bluetoothScanTime: allConfigOptions.BLUETOOTH_SCAN_TIME,
        noCcTalkTrafficDisconnectTimer: parseInt(allConfigOptions.NO_CCTALK_DISCONNECT_TIMEOUT),
        playerWalletBalancePollingInterval: parseInt(allConfigOptions.WALLET_BALANCE_POLL_INTERVAL),
        playerWalletBalancePollingWaitTimeout: parseInt(allConfigOptions.WALLET_BALANCE_POLL_WAIT_TIMEOUT),
        gamingMachineSessionLengthInterval: playerAccount.gamingMachineSessionLengthInterval ? playerAccount.gamingMachineSessionLengthInterval : operatorWallet.operatorDefaultGamingMachineSessionLengthInterval,
        gamingMachineSessionSpendCheckAmount: playerAccount.gamingMachineSessionSpendCheckAmount ? playerAccount.gamingMachineSessionSpendCheckAmount : operatorWallet.operatorDefaultGamingMachineSessionSpendCheckAmount,
        optInMarketing: playerAccount.optInMarketing,
        playerAgeVerifiedStatus: playerAgeVerifiedStatus,
        playerCanAgeVerify: playerCanAgeVerify,
        playerBreakEndDatetime: (playerAccount.takeABreakEndDatetime && playerAccount.takeABreakEndDatetime > Date.now() ? playerAccount.takeABreakEndDatetime : null),
        possibleTopUpAmounts: [1000, 1500, 2000, 2500],
        possibleTransferAmounts: [100, 500, 1000, 2000],
        yotiClientSdkId: self.config.YOTI_CLIENT_SDK_ID,
        yotiScenarioId: self.config.YOTI_SCENARIO_ID,
        walletToken: wallet.walletToken,
        nearbyMachinesListSize: parseInt(allConfigOptions.NEARBY_MACHINES_LIST_SIZE),
        nearbyMachinesRefreshTime: 5000, //TODO remove
        machineConnectionAttemptCount: parseInt(allConfigOptions.MACHINE_CONNECTION_ATTEMPT_COUNT),
        machineConnectionTimeoutAndroid: parseInt(allConfigOptions.MACHINE_CONNECTION_TIMEOUT_ANDROID),
        machineConnectionTimeoutIos: parseInt(allConfigOptions.MACHINE_CONNECTION_TIMEOUT_IOS),
        walletBalance: wallet.walletBalance,
        bluetoothServiceUuids: ['46c1'],
        bluetoothCharacteristicUuid: '4a0d',
        minGamingSpendLimit: parseInt(allConfigOptions.MIN_GAMING_SPEND_LIMIT),
        walletBalanceCurrencyCode: wallet.walletBalanceCurrencyCode,
        disconnectionTimeout: parseInt(allConfigOptions.DISCONNECTION_TIMEOUT)
      },
      responseActions: []
    };

    await self.completionServices.sendOkResponse(request, response, additionalProperties);
  }

  promisifySignInV3(cognitoUser, authenticationDetails) {
    return new Promise(function (resolve, reject) {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
          resolve(result);
        }, onFailure: function (error) {
          reject(error);
        }
      });
    });
  }

  async confirmPlayerV3(request, response) {
    console.log("==>confirmPlayerV3");

    const playerDeviceToken = request.body.playerDeviceToken;
    const playerToken = request.body.playerToken;
    const code = request.body.registrationConfirmationCode.trim();

    console.log('Confirm player: ' + playerToken);

    const userPool = self.getUserPoolV3();
    const userlist = await self.db.getUserEmail(playerToken);
    console.log('Retrieved user  ' + userlist[0].playerExternalId);
    const playerExternalId = userlist[0].playerExternalId;

    const userData = {
      Username: playerExternalId,
      Pool: userPool
    };
    const cognitoUser = new CognitoUser(userData);

    if (cognitoUser == null) {
      throw new Error('Cognito user not retrieved!!!');
    }
    try {
      await self.promisifyConfirmPlayerV3(cognitoUser, code);
    } catch (error) {
      if (error.code === 'CodeMismatchException'
        || error.code === 'InvalidParameterException' || error.code === 'LimitExceededException' || error.code === 'ExpiredCodeException') {
        // This ensures we don't log an ERROR which causes a support ticket to be raised.
        await self.completionServices.sendFailResponse(request, response, self.completionServices.completionCodes.WRONG_VERIFICAION_CODE);
        return;
      } else if (error.code === 'NotAuthorizedException' && error.message === 'User cannot be confirmed. Current status is CONFIRMED') {
        const accountConfirmed = await self.db.isAccountConfirmed(playerExternalId);
        if (accountConfirmed) {
          await self.completionServices.sendFailResponse(request, response, self.completionServices.completionCodes.PLAYER_ALREADY_CONFIRMED);
        } else {
          await self.completionServices.sendFailResponse(request, response, self.completionServices.completionCodes.PLAYER_UNABLE_TO_CONFIRM_ACCOUNT);
        }
        return;
      }
      console.log("promisifyConfirmPlayerV3 threw err: ", error);
      throw error;
    }

    //gets the processor token to assign to a wallet
    const processorToken = await self.db.getLatestProcessorToken(request);

    //calls confirm database method which updates the playerAccount, wallets & safe betting limits
    await self.db.confirmPlayerV3(playerToken, processorToken, request);
    console.log('...db.confirmPlayer() executed correctly');

    const playerEmail = await self.db.getRegistrationEmailDetails(request.body.playerToken, request);
    const emailBody = await self.config.getSignUpEmail(playerEmail.playerFirstName);

    try {
      await self.promisifySendEmailV3(playerEmail, emailBody);
      console.log('email successfully sent');
    } catch (err) {
      console.log('ERROR sending email: ' + err);
    }

    await self.completionServices.sendOkResponse(request, response);
    console.log('confirm player successful');
  }

  promisifyConfirmPlayerV3(cognitoUser, code) {
    return new Promise(function (resolve, reject) {
      cognitoUser.confirmRegistration(code, true, function (error, result) {
        if (error) {
          reject(error);
        }
        else {
          resolve(result);
        }
      })
    });
  }

  async resendCodeV3(request, response) {
    console.log("==>resendCodeV3");

    var username = request.body.username.trim().toLowerCase();
    var playerDeviceToken = request.body.playerDeviceToken;

    console.log('Resend code: ' + username);
    var cognitoUser = self.getUser(username);

    try {
      await self.promisifyResendCodeV3(cognitoUser);
    } catch (error) {
      if (error.code === 'InvalidParameterException' && error.message === 'User is already confirmed.') {
        var accountConfirmed = await self.db.isAccountConfirmed(username);
        if (accountConfirmed) {
          await self.completionServices.sendFailResponse(request, response, self.completionServices.completionCodes.PLAYER_ALREADY_CONFIRMED);
        } else {
          await self.completionServices.sendFailResponse(request, response, self.completionServices.completionCodes.PLAYER_UNABLE_TO_CONFIRM_ACCOUNT);
        }
        return;
      }
      console.log("promisifyResendCode: ", error);
      throw error;
    }
    var responseObj = {
      associatedRequestType: "playerResendCode",
      playerToken: cognitoUser.playerToken,
      completionCode: 0,
      completionMessage: 'Verification code has been resent, please check your inbox.'
    }
    response.jsonToSend = responseObj;
  }

  promisifyResendCodeV3(cognitoUser) {
    return new Promise(function (resolve, reject) {
      cognitoUser.resendConfirmationCode(function (error, result) {
        if (error) {
          reject(error);
        }
        else {
          resolve(result);
        }
      });
    });
  }

  playerCanAgeVerifyV3(playerBirthDate, playerAddressCountry) {
    const today = new Date();
    const birthDate = new Date(playerBirthDate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 18) {
      return false
    }

    if (playerAddressCountry && !self.config.getAllowedCountryCodeList().includes(playerAddressCountry)) {
      return false;
    }

    return true;
  }

  getCountryFromPhoneNumberV3(playerPhoneNumber) {
    const phoneNumberParser = phoneUtil.PhoneNumberUtil.getInstance();
    const phoneNumberParsed = phoneNumberParser.parse(playerPhoneNumber, "");
    const countryShortcode = phoneNumberParser.getRegionCodeForNumber(phoneNumberParsed);
    const countryData = lookup.byIso(countryShortcode);
    return countryData;
  }

  async resetPasswordV3(request, response) {
    console.log("==>resetPasswordV3");

    const username = request.body.username.trim().toLowerCase();
    console.log('Reset Password: ' + username);
    const cognitoUser = self.getUserV3(username);
    const mpaVersion = request.body.versionData;

    // Don't allow the player to sign in if the mpa version is older than the whitelisted version.
    // ... get the appropriate whitelisted list of build versions
    console.log(mpaVersion);
    if (mpaVersion && mpaVersion.os) {

      if (mpaVersion.os != 'android' && mpaVersion.os != 'ios') {
        await this.completionServices.sendFailResponse(request, response, this.completionServices.completionCodes.CONFIG_OS_NOT_RECOGNISED);
        return;
      }

      const version = mpaVersion.versionNumber.replace(/\./g, '');

      let whitelistVersion = await self.db.getConfigurationOptions('whitelistVersion', request);
      whitelistVersion = whitelistVersion.configValue.replace(/\./g, '');

      console.log('whitelistVersion: ' + whitelistVersion);
      //if the received build version is older than the whitelisted version return a failed response
      if (version < whitelistVersion) {
        await this.completionServices.sendFailResponse(request, response, this.completionServices.completionCodes.CONFIG_VERSION_BLACKLISTED);
        return;
      }
    }

    try {
      await self.promisifyResetPasswordV3(cognitoUser);
    } catch (error) {
      console.log('reset password failed: username: ' + username);
      console.log('error thrown from reset password ' + error);

      if (error.code == 'LimitExceededException') {
        await self.completionServices.sendFailResponse(request, response, self.completionServices.completionCodes.RESET_PASSWORD_ATTEMPT_LIMIT_EXCEEDED);
        return;
      } else if (error.code == 'UserNotFoundException') {
        await self.completionServices.sendFailResponse(request, response, self.completionServices.completionCodes.RESET_PASSWORD_USER_NOT_FOUND);
        return;
      } else if (error.code == 'InvalidParameterException') {
        await self.completionServices.sendFailResponse(request, response, self.completionServices.completionCodes.RESET_PASSWORD_FAILED_FOR_UNCONFIRMED_USER);
        return;
      } else {
        throw error;
      }
    }

    const additionalProperties = {
      playerToken: username
    }

    await self.completionServices.sendOkResponse(request, response, additionalProperties);
  }

  promisifyResetPasswordV3(cognitoUser) {
    return new Promise(function (resolve, reject) {
      cognitoUser.forgotPassword({
        onSuccess: function (result) {
          resolve(result);
        }, onFailure: function (error) {
          reject(error);
        }
      });
    });
  }

  async resetPasswordConfirmationV3(request, response) {
    console.log("==>resetPasswordConfirmationV3");

    var username = request.body.username.trim().toLowerCase();
    var code = request.body.resetPasswordConfirmationCode;
    var newPassword = request.body.newPassword;
    var cognitoUser = self.getUser(username);

    try {
      await self.promisifyResetPasswordConfirmationV3(cognitoUser, code, newPassword);
    } catch (error) {
      if (error.code === 'CodeMismatchException'
        || error.code === 'InvalidParameterException' || error.code === 'LimitExceededException' || error.code === 'ExpiredCodeException') {
        // This ensures we don't log an ERROR which causes a support ticket to be raised.
        await self.completionServices.sendFailResponse(request, response, self.completionServices.completionCodes.WRONG_VERIFICAION_CODE);
        return;
      }
      console.log("promisifyResetPasswordConfirmation threw err: ", error);
      throw error;
    }

    console.log('Password confirmed!');
    var responseObj = {
      associatedRequestType: "playerResetPasswordConfirmation",
      playerToken: username,
      completionCode: 0,
      completionMessage: "Ok",
    }
    response.jsonToSend = responseObj;
  }

  promisifyResetPasswordConfirmationV3(cognitoUser, code, newPassword) {
    return new Promise(function (resolve, reject) {
      cognitoUser.confirmPassword(code, newPassword, {
        onSuccess: function (result) {
          resolve(result);
        }, onFailure: function (error) {
          reject(error);
        }
      });
    });
  }

  promisifySendEmailV3(playerEmail, email) {
    return new Promise(function (resolve, reject) {

      var params = {
        Destination: {
          ToAddresses: [playerEmail.playerExternalId]
        },
        Message: {
          Body: {
            Html: {
              Data: email.message
            }
          },
          Subject: {
            Data: email.subject
          }
        },
        Source: email.source
      };

      ses.sendEmail(params, function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  async sendUsernameExistsEmailV3(username, request) {
    console.log('==>sendUsernameExistsEmailV3 for username: ' + username);

    var playerEmail = await self.db.getUsernameExistsEmailDetails(username, request);
    var email = await self.config.getUsernameExistsEmail(playerEmail.playerFirstName);

    try {
      await self.promisifySendEmailV3(playerEmail, email);
      console.log('email successfully sent');
    } catch (err) {
      console.log('ERROR sending email: ' + err);
    }
    await self.db.setUsernameExistsTimestamp(username, request);

    console.log("sendUsernameExistsEmail completed");
    return;
  }

  async sendRegistrationEmailV3(request, response) {
    console.log('==>sendRegistrationEmailV3 for playerToken: ' + request.body.playerToken);

    var playerEmail = await self.db.getRegistrationEmailDetails(request.body.playerToken, request);
    var email = await self.config.getSignUpEmail(playerEmail.playerFirstName);

    try {
      await self.promisifySendEmailV3(playerEmail, email);
      console.log('email successfully sent');
    } catch (err) {
      console.log('ERROR sending email: ' + err)
    }

    await self.completionServices.sendOkResponse(request, response);
    console.log("sendRegistrationEmail completed for playerToken: " + request.body.playerToken);
  }
}
module.exports = LoginHandler;
