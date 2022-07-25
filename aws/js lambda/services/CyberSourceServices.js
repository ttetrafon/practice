const CybersourceRestApi = require('cybersource-rest-client');
const jwt = require('jsonwebtoken');
const jwkToPem = require('jwk-to-pem');
const CryptoJS = require('crypto-js');
const AWS = require('aws-sdk');
const SecretsManager = new AWS.SecretsManager({
  region: "eu-west-2"
});
let self;

class CyberSourceServices {
  constructor(db, config) {
    self = this;
    this.db = db;
    this.config = config;
    this.secretKeyName = null;

    if (config.paymentProviderAccount() === 'LIVE') {
      console.log('configuring CyberSource for LIVE payments');
      this.ENVIRONMENT = "api.cybersource.com";//"cybersource.environment.production";

      this.DEVICE_DATA_COLLECTION_EVENT_ORIGIN_URL = "https://centinelapi.cardinalcommerce.com";

    } else {
      console.log('configuring CyberSource for test payments');

      this.ENVIRONMENT = "apitest.cybersource.com";//"cybersource.environment.SANDBOX";

      this.DEVICE_DATA_COLLECTION_EVENT_ORIGIN_URL = "https://centinelapistag.cardinalcommerce.com";
    }

    this.MESSAGE_SECRET_KEY = '4yu1E8IqQylARZm0tqHhdGFowGgZN3p5';
    this.FUNDING_MID = null;
    this.FUNDING_KEY_ID = null;
    this.FUNDING_SECRET_KEY = null;
    this.NON_GAMBLING_MID = null;
    this.NON_GAMBLING_KEY_ID = null;
    this.NON_GAMBLING_SECRET_KEY = null;

    this.AUTHENTICATION_RETURN_URL = "/v2/players/wallet/validateAuthenticationResult";
    this.AUTHENTICATION_RETURN_URL_V3 = "/v3/players/wallet/validateAuthenticationResult";
    this.AUTHENTICATION_TYPE = "http_signature";
  }

  /**
   * get cybersource keys and credentials from secrets if first requests since lambda started
   */
  async setupCredentials(operatorWalletSecretKey) {
    if (!self.secretKeyName || (operatorWalletSecretKey && (self.secretKeyName != operatorWalletSecretKey))) {
      self.secretKeyName = (operatorWalletSecretKey ? operatorWalletSecretKey : self.config.cyberSourceSecretKey());
      let secretKeys;

      try {
        secretKeys = await self.secretCredentials(self.secretKeyName);
        console.log('successfully retrieved cybersource credentials');
      } catch (err) {
        self.secretKeyName = null;
        throw new Error('error retrieivng CyberSource credentials: ' + err);
      }

      self.FUNDING_MID = secretKeys.FUNDING_MID;
      self.FUNDING_KEY_ID = secretKeys.FUNDING_KEY_ID;
      self.FUNDING_SECRET_KEY = secretKeys.FUNDING_SECRET_KEY;
      self.NON_GAMBLING_MID = secretKeys.NON_GAMBLING_MID;
      self.NON_GAMBLING_KEY_ID = secretKeys.NON_GAMBLING_KEY_ID;
      self.NON_GAMBLING_SECRET_KEY = secretKeys.NON_GAMBLING_SECRET_KEY;

      self.credentials = true;
    }
  }

  /**
   * setups the payerAuth to to enable 3DS to be used
   * @param {String} paymentToken the tokenised card details
   * @param {String} transactionToken the transaction token
   * @param {Boolean} newCard whether the player is using a new card to add funds
   */
  async setupPayerAuth(paymentToken, transientToken, transactionToken, newCard, operatorWalletSecretKey, playerNonGamblingMid) {

    try {

      await self.setupCredentials(operatorWalletSecretKey); //setups credentials if not already done so
      var transactionType = (playerNonGamblingMid ? 'NON-GAMBLING' : 'FUNDING');
      let configObj = await self.apiConfigObj(transactionType);
      let apiClient = new CybersourceRestApi.ApiClient();
      let requestObj = new CybersourceRestApi.PayerAuthSetupRequest();

      let clientReferenceInformation = new CybersourceRestApi.Riskv1decisionsClientReferenceInformation();
      clientReferenceInformation.code = transactionToken;
      requestObj.clientReferenceInformation = clientReferenceInformation;

      if (newCard) {
        let tokenInformation = new CybersourceRestApi.Riskv1authenticationsetupsTokenInformation();
        tokenInformation.transientToken = paymentToken;
        requestObj.tokenInformation = tokenInformation;
      } else {
        let paymentInformation = new CybersourceRestApi.Riskv1authenticationsetupsPaymentInformation();
        let paymentInformationCustomer = new CybersourceRestApi.Riskv1authenticationsetupsPaymentInformationCustomer();
        paymentInformationCustomer.customerId = paymentToken;
        paymentInformation.customer = paymentInformationCustomer;

        requestObj.paymentInformation = paymentInformation;

        let tokenInformation = new CybersourceRestApi.Riskv1authenticationsetupsTokenInformation();
        tokenInformation.transientToken = transientToken;
        requestObj.tokenInformation = tokenInformation;
      }

      let instance = new CybersourceRestApi.PayerAuthenticationApi(configObj, apiClient);

      /**
       * API call to cybersource to set the payerAuth up
       * @param requestObj the request to send to cybersource
       */
      function payerAuthSetup(requestObj) {
        return new Promise(function (resolve, reject) {
          instance.payerAuthSetup(requestObj, function (error, data, response) {
            if (error) {
              reject(error);
            }
            console.log(JSON.stringify(data));
            resolve(response.body);
          });
        });
      }

      let data = await payerAuthSetup(requestObj);
      //concatenates values from validateTopUp request and confirmation request for storing in the database
      let reqStringified = "setupPayerAuth: " + self.stringifyObject(requestObj);

      //concatenates values from validateTopUp response and confirmation response for storing in the database
      let resStringified = "setupPayerAuthResponse: " + self.stringifyObject(data);

      let responseData = {
        setupPayerAuthRes: data,
        reqStringified: reqStringified,
        resStringified: resStringified
      }

      return responseData;

    } catch (err) {
      console.log('error setting up payerAuth: ' + err);
      return;
    }
  }

  /**
   * send payment request to cybersource for authorisation
   * @param {*} amount the amount of the transaction
   * @param {*} currencyCode the currency code of the transaction
   * @param {*} addressDetails the address details of the player
   * @param {*} paymentToken the tokenised card details
   * @param {*} authenticationId the id to authenticate the payment
   * @param {*} transactionToken the token of the transaction
   * @param {*} validateAuth whether the request should include payer enrollment or check or validate request
   * @param {*} newCard whether the player is using a new card or not
   */
  async processPayment(request, amount, currencyCode, addressDetails, paymentToken, transientToken, authenticationId, transactionToken, validateAuth, newCard, operatorWalletSecretKey, playerNonGamblingMid) {
    console.log('processPayment');

    try {

      await self.setupCredentials(operatorWalletSecretKey); //setups credentials if not already done so

      let allConfigOptions = await self.db.getAllConfigurationOptions(request);

      var transactionType = (playerNonGamblingMid ? 'NON-GAMBLING' : 'FUNDING');
      let configObj = await self.apiConfigObj(transactionType);
      let apiClient = new CybersourceRestApi.ApiClient();
      let requestObj = new CybersourceRestApi.CreatePaymentRequest();

      let clientReferenceInformation = new CybersourceRestApi.Ptsv2paymentsClientReferenceInformation();
      clientReferenceInformation.code = transactionToken;
      requestObj.clientReferenceInformation = clientReferenceInformation;

      let consumerAuthenticationInformation = new CybersourceRestApi.Ptsv2paymentsConsumerAuthenticationInformation();
      if (!validateAuth) {
        consumerAuthenticationInformation.authenticationTransactionId = authenticationId;
      } else {
        consumerAuthenticationInformation.referenceId = authenticationId;
        if (request.params.apiVersion === 'v3') {
          consumerAuthenticationInformation.returnUrl = allConfigOptions.authenticationServiceUrl + self.AUTHENTICATION_RETURN_URL_V3;
        } else {
          consumerAuthenticationInformation.returnUrl = allConfigOptions.authenticationServiceUrl + self.AUTHENTICATION_RETURN_URL;
        }
      }
      requestObj.consumerAuthenticationInformation = consumerAuthenticationInformation;

      let actionList = new Array();
      if (newCard === "true") {
        actionList.push("TOKEN_CREATE");

        let tokenInformation = new CybersourceRestApi.Ptsv2paymentsTokenInformation();
        tokenInformation.jti = paymentToken;
        requestObj.tokenInformation = tokenInformation;
      } else {
        let paymentInformation = new CybersourceRestApi.Ptsv2paymentsPaymentInformation()
        let paymentInformationCustomer = new CybersourceRestApi.Ptsv2paymentsPaymentInformationCustomer();
        paymentInformationCustomer.customerId = paymentToken;
        paymentInformation.customer = paymentInformationCustomer;
        requestObj.paymentInformation = paymentInformation;

        let tokenInformation = new CybersourceRestApi.Ptsv2paymentsTokenInformation();
        tokenInformation.jti = transientToken;
        requestObj.tokenInformation = tokenInformation;
      }


      let processingInformation = new CybersourceRestApi.Ptsv2paymentsProcessingInformation();
      let processingInformationAuthorizationOptions = new CybersourceRestApi.Ptsv2paymentsProcessingInformationAuthorizationOptions();
      if (newCard === "true") {
        processingInformationAuthorizationOptions.declineAvsFlags = new Array('A', 'B', 'C', 'N', 'O');
      }

      processingInformation.authorizationOptions = processingInformationAuthorizationOptions;
      if (validateAuth) {
        actionList.push("CONSUMER_AUTHENTICATION");
      } else {
        actionList.push("VALIDATE_CONSUMER_AUTHENTICATION");
      }

      processingInformation.actionList = actionList;

      let actionTokenTypes = new Array();

      actionTokenTypes.push("paymentInstrument");
      actionTokenTypes.push("instrumentIdentifier");
      processingInformation.actionTokenTypes = actionTokenTypes;
      processingInformation.capture = false;
      requestObj.processingInformation = processingInformation;

      let orderInformation = new CybersourceRestApi.Ptsv2paymentsOrderInformation();
      let orderInformationAmountDetails = new CybersourceRestApi.Ptsv2paymentsOrderInformationAmountDetails();
      orderInformationAmountDetails.totalAmount = amount / 100;
      orderInformationAmountDetails.currency = currencyCode;
      orderInformation.amountDetails = orderInformationAmountDetails;

      //address is stored with token so don't need to send with every payment unless new card
      if (newCard === 'true') {
        let orderInformationBillTo = new CybersourceRestApi.Ptsv2paymentsOrderInformationBillTo();
        orderInformationBillTo.firstName = addressDetails.playerFirstName;
        orderInformationBillTo.lastName = addressDetails.playerFamilyName;
        orderInformationBillTo.address1 = addressDetails.playerAddressLine1;
        if (addressDetails.playerAddressLine2) orderInformationBillTo.address2 = addressDetails.playerAddressLine2;

        if (addressDetails.playerAddressLine4.length > 50) {
          orderInformationBillTo.locality = addressDetails.playerAddressLine4.substring(0, 50);
        } else {
          orderInformationBillTo.locality = addressDetails.playerAddressLine4;
        }

        if (addressDetails.playerAddressLine3 && addressDetails.playerAddressLine3.length > 20) {
          orderInformationBillTo.administrativeArea = addressDetails.playerAddressLine3.substring(0, 20);
        } else if (addressDetails.playerAddressLine3 && addressDetails.playerAddressLine3.length <= 20) {
          orderInformationBillTo.administrativeArea = addressDetails.playerAddressLine3;
        } else {
          orderInformationBillTo.administrativeArea = addressDetails.playerAddressLine4;
        }

        if (addressDetails.playerAddressPostcode.length > 10) {
          orderInformationBillTo.postalCode = addressDetails.playerAddressPostcode.substring(0, 10);
        } else {
          orderInformationBillTo.postalCode = addressDetails.playerAddressPostcode;
        }

        orderInformationBillTo.country = addressDetails.playerAddressCountry;
        orderInformationBillTo.email = addressDetails.playerExternalId;
        orderInformationBillTo.phoneNumber = addressDetails.playerPhoneNumber;
        orderInformation.billTo = orderInformationBillTo;
      }

      requestObj.orderInformation = orderInformation;

      let instance = new CybersourceRestApi.PaymentsApi(configObj, apiClient);

      /**
       * API call to cybersource to process the payment
       * @param {*} requestObj
       */
      function createPayment(requestObj) {
        return new Promise(function (resolve, reject) {
          instance.createPayment(requestObj, function (error, data, response) {
            if (error) {
              reject(error);
            } else {
              console.log(JSON.stringify(data));
              resolve(response.body);
            }
          });
        })
      }

      let data = await createPayment(requestObj);

      //concatenates values from validateTopUp request and confirmation request for storing in the database
      let reqStringified = (validateAuth ? "authorisationAndConsumerAuthentication: " : "authorisationAndValidateAuth: ") + self.stringifyObject(requestObj);

      //concatenates values from validateTopUp response and confirmation response for storing in the database
      let resStringified = (validateAuth ? "authorisationAndConsumerAuthenticationResponse: " : "authorisationAndValidateAuthResponse: ") + self.stringifyObject(data);

      let responseData = {
        processPaymentRes: data,
        reqStringified: reqStringified,
        resStringified: resStringified
      }

      return responseData;

    } catch (err) {
      console.log('error processing payment: ' + err);
      return;
    }
  }

  /**
   * capture the payment after successful authorisation
   * @param {*} paymentId the id of the payment supplied by the processor
   * @param {*} transactionToken the token of the transaction
   * @param {*} amount the amount of the transaction
   * @param {*} currencyCode the currency code of the transaction
   */
  async completePayment(paymentId, transactionToken, amount, currencyCode, operatorWalletSecretKey, playerNonGamblingMid) {
    console.log('capture payment');

    try {
      await self.setupCredentials(operatorWalletSecretKey); //setups credentials if not already done so

      var transactionType = (playerNonGamblingMid ? 'NON-GAMBLING' : 'FUNDING');
      let configObj = await self.apiConfigObj(transactionType);
      let apiClient = new CybersourceRestApi.ApiClient();
      let requestObj = new CybersourceRestApi.CapturePaymentRequest();

      let clientReferenceInformation = new CybersourceRestApi.Ptsv2paymentsClientReferenceInformation();
      clientReferenceInformation.code = transactionToken;
      requestObj.clientReferenceInformation = clientReferenceInformation;

      let orderInformation = new CybersourceRestApi.Ptsv2paymentsidcapturesOrderInformation();
      let orderInformationAmountDetails = new CybersourceRestApi.Ptsv2paymentsidcapturesOrderInformationAmountDetails();
      orderInformationAmountDetails.totalAmount = amount / 100;
      orderInformationAmountDetails.currency = currencyCode;
      orderInformation.amountDetails = orderInformationAmountDetails;
      requestObj.orderInformation = orderInformation;

      let instance = new CybersourceRestApi.CaptureApi(configObj, apiClient);

      /**
       * API call to cybersource to set the payerAuth up
       * @param requestObj the request to send to cybersource
       */
      function capturePayment(requestObj, paymentId) {
        return new Promise(function (resolve, reject) {
          instance.capturePayment(requestObj, paymentId, function (error, data, response) {
            if (error) {
              reject(error);
            } else {
              console.log(JSON.stringify(data));
              resolve(response.body);
            }
          });
        });
      }

      let data = await capturePayment(requestObj, paymentId);
      //concatenates values from validateTopUp request and confirmation request for storing in the database
      let reqStringified = "capturePayment: " + self.stringifyObject(requestObj);

      //concatenates values from validateTopUp response and confirmation response for storing in the database
      let resStringified = "capturePaymentResponse: " + self.stringifyObject(data);

      let responseData = {
        capturePaymentRes: data,
        reqStringified: reqStringified,
        resStringified: resStringified
      }

      return responseData;

    } catch (err) {
      console.log('error completing payment: ' + err);
      return;
    }
  }

  /**
   * reverse a successful authorisation
   * @param {*} paymentId the id of the payment supplied by the processor
   * @param {*} transactionToken the token of the transaction
   * @param {*} amount the amount of the transaction
   */
  async reverseAuthorisation(paymentId, transactionToken, amount, operatorWalletSecretKey, playerNonGamblingMid) {
    console.log('auth reversal');

    try {
      await self.setupCredentials(operatorWalletSecretKey); //setups credentials if not already done so

      var transactionType = (playerNonGamblingMid ? 'NON-GAMBLING' : 'FUNDING');
      let configObj = await self.apiConfigObj(transactionType);
      let apiClient = new CybersourceRestApi.ApiClient();
      let requestObj = new CybersourceRestApi.AuthReversalRequest();

      let clientReferenceInformation = new CybersourceRestApi.Ptsv2paymentsidreversalsClientReferenceInformation();
      clientReferenceInformation.code = transactionToken;
      requestObj.clientReferenceInformation = clientReferenceInformation;

      let orderInformation = new CybersourceRestApi.Ptsv2paymentsidreversalsReversalInformation();
      let orderInformationAmountDetails = new CybersourceRestApi.Ptsv2paymentsidreversalsReversalInformationAmountDetails();
      orderInformationAmountDetails.totalAmount = amount / 100;
      orderInformation.amountDetails = orderInformationAmountDetails;
      requestObj.orderInformation = orderInformation;

      let instance = new CybersourceRestApi.ReversalApi(configObj, apiClient);

      /**
       * API call to cybersource to set the payerAuth up
       * @param requestObj the request to send to cybersource
       */
      function authReversal(requestObj, paymentId) {
        return new Promise(function (resolve, reject) {
          instance.authReversal(paymentId, requestObj, function (error, data, response) {
            if (error) {
              reject(error);
            } else {
              console.log(JSON.stringify(data));
              resolve(response.body);
            }
          });
        });
      }

      let data = await authReversal(requestObj, paymentId);
      //concatenates values from validateTopUp request and confirmation request for storing in the database
      let reqStringified = "authReversal: " + self.stringifyObject(requestObj);

      //concatenates values from validateTopUp response and confirmation response for storing in the database
      let resStringified = "authReversalResponse: " + self.stringifyObject(data);

      let responseData = {
        authReversalRes: data,
        reqStringified: reqStringified,
        resStringified: resStringified
      }

      return responseData;

    } catch (err) {
      console.log('error reversing authorisation: ' + err);
      return;
    }
  }

  /**
   * get card details of the card used for the payment to store in database
   * @param {*} playerToken the token for the players whos card details are being requested
   * @param {*} instrumentId the id of the card that is stored in cybersources system
   */
  async getCardDetails(playerToken, instrumentId, operatorWalletSecretKey, playerNonGamblingMid) {
    console.log('retrieveCardDetails');

    try {

      await self.setupCredentials(operatorWalletSecretKey); //setups credentials if not already done so

      var transactionType = (playerNonGamblingMid ? 'NON-GAMBLING' : 'FUNDING');
      let configObj = await self.apiConfigObj(transactionType);
      let apiClient = new CybersourceRestApi.ApiClient();

      let opts = [];
      if (playerToken != null) opts['profile-id'] = playerToken;

      let instance = new CybersourceRestApi.PaymentInstrumentApi(configObj, apiClient);

      /**
       * API call to cybersource to request the card details
       * @param instrumentId the id of the card being requested
       */
      function getInstrumentIdentifier(instrumentId) {
        return new Promise(function (resolve, reject) {
          instance.getPaymentInstrument(instrumentId, opts, function (error, data, response) {
            if (error) {
              console.log('error with payment: ' + error);
              reject();
            } else {
              console.log(JSON.stringify(response.body));
              resolve(response.body);
            }
          });
        })
      }

      let data = await getInstrumentIdentifier(instrumentId);
      return data;

    } catch (err) {
      console.log('ERROR unable to retrieve card details' + err);
      return;
    }
  }

  /**
  * update the details stored in the players payment token
  * @param {*} paymentToken the payment token to be updated
  * @param {*} playerAccount the players account details to update the token with
  */
  async updateToken(paymentToken, expiryDate, operatorWalletSecretKey, playerNonGamblingMid) {
    console.log('update token');

    try {

      await self.setupCredentials(operatorWalletSecretKey); //setups credentials if not already done so

      var transactionType = (playerNonGamblingMid ? 'NON-GAMBLING' : 'FUNDING');
      let configObj = await self.apiConfigObj(transactionType);
      let apiClient = new CybersourceRestApi.ApiClient();
      let requestObj = new CybersourceRestApi.PatchPaymentInstrumentRequest();

      let paymentInstrumentTokenId = paymentToken;

      let card = new CybersourceRestApi.Tmsv2customersEmbeddedDefaultPaymentInstrumentCard();
      card.expirationMonth = expiryDate.expirationMonth;
      card.expirationYear = expiryDate.expirationYear;

      requestObj.card = card;

      let instance = new CybersourceRestApi.PaymentInstrumentApi(configObj, apiClient);

      /**
       * API call to cybersource to request withdrawal
       * @param requestObj the request to send to cybersource
       */
      function patchPaymentInstrument(paymentInstrumentTokenId, requestObj) {
        return new Promise(function (resolve, reject) {
          instance.patchPaymentInstrument(paymentInstrumentTokenId, requestObj, [], function (error, data, response) {
            if (error) {
              console.log('error with patchPaymentInstrument: ' + error);
              reject();
            }
            console.log(JSON.stringify(response.body));
            resolve(response.body);
          });
        });
      }

      await patchPaymentInstrument(paymentInstrumentTokenId, requestObj);

      return;
    } catch (err) {
      console.log('error with updating token:' + err);
      return;
    }
  }

  /**
   * verify the jwt token returned by cybersource
   * @param paymentToken the tokenised card details
   * @param jwtToken the jwt token containing the public key to verify the token
   */
  async verifyJwtToken(paymentToken, jwtToken) {
    console.log('verifyJwtToken');

    try {
      let decodeJwt = await jwt.decode(jwtToken);
      let pem = await jwkToPem(decodeJwt.flx.jwk);
      await jwt.verify(paymentToken, pem);
      console.log('jwt token successfully verified');
      return true;
    } catch (err) {
      console.log('error verifying jwt token: ' + err);
      return false;
    }
  }

  /**
   * the config for the API calls to cybersource
   */
  async apiConfigObj(transactionType) {
    if (transactionType === 'FUNDING') {
      return {
        authenticationType: self.AUTHENTICATION_TYPE,
        runEnvironment: self.ENVIRONMENT,
        merchantID: self.FUNDING_MID,
        merchantKeyId: self.FUNDING_KEY_ID,
        merchantsecretKey: self.FUNDING_SECRET_KEY,

        logConfiguration: {
          enableLog: false
        }
      }
    } else if (transactionType === 'NON-GAMBLING') {
      return {
        authenticationType: self.AUTHENTICATION_TYPE,
        runEnvironment: self.ENVIRONMENT,
        merchantID: self.NON_GAMBLING_MID,
        merchantKeyId: self.NON_GAMBLING_KEY_ID,
        merchantsecretKey: self.NON_GAMBLING_SECRET_KEY,

        logConfiguration: {
          enableLog: false
        }
      }
    }
  }

  /**
   * Verify encrypted message matches base64 request
   * @param {*} optohmac encrypted request
   * @param {*} optoreq base64 request
   */
  async verifyMessage(optohmac, optoreq) {
    console.log('entered verify message');

    try {

      let decryptMessage = await CryptoJS.AES.decrypt(optohmac, this.MESSAGE_SECRET_KEY).toString(CryptoJS.enc.Utf8);
      let decryptedMessageArray = decryptMessage.split('|');
      let messageArray = optoreq.split('|');

      for (var i = 0; i < decryptedMessageArray.length; i++) {
        if (decryptedMessageArray[i] != messageArray[i]) {
          return false;
        }
      }

      return true;
    } catch (err) {
      console.log('error decrypting message: ' + err);
      return false;
    }
  }

  /**
    * method for concatenating an object's values for storing in the database
    * @param {*} object
    */
  stringifyObject(object) {

    let flattened = self.flattenObject(object);

    let objectConcat = '';
    Object.keys(flattened).forEach(function (key) {
      if (flattened[key] && !key.includes('accessToken')) {
        objectConcat += key + flattened[key] + '|';
      }
    });

    return objectConcat;

  }

  /**
   * method for flattening an object into a single level
   * @param {*} request the object to be flattened
   */
  flattenObject(request) {

    function flatten(object, flattened, str_key) {
      for (var key in object) {

        if (object[key] instanceof Object && object[key] != "") {
          flatten(object[key], flattened, str_key + key);
        } else {
          flattened[str_key + key] = object[key];
        }
      }
    }

    let flattened = {};
    flatten(request, flattened, "");

    return flattened;
  }

  /**
* Hash a String and convert it to base 64
* @param message the String to be hashed and converted
* @return the hash of the message, encoded in base 64
*/
  hashMessage(message) {
    let hash = CryptoJS.AES.encrypt(message, this.MESSAGE_SECRET_KEY).toString();
    return hash;
  }

  /**
   * decrypt encrypted payment info message
   * @param {*} data encrypted request
   */
  async decodeMessage(message) {
    console.log('entered decode message');

    try {

      let decryptMessage = await CryptoJS.AES.decrypt(message, this.MESSAGE_SECRET_KEY).toString(CryptoJS.enc.Utf8);
      let messageObject = JSON.parse(decryptMessage);

      return messageObject;
    } catch (err) {
      console.log('error decrypting message: ' + err);
      return;
    }
  }

  //function for retrieving the DB credentials from secret manager
  secretCredentials(secretName) {
    return new Promise((resolve, reject) => {
      SecretsManager.getSecretValue({ SecretId: secretName }, function (err, data) {
        if (err) {
          reject(err);
        }
        else {
          resolve(JSON.parse(data.SecretString));
        }
      });
    });
  }
}

module.exports = CyberSourceServices;