const req = require('request');
const uuidv4 = require('uuid/v4');
const fs = require('fs');
const yoti = require('yoti');
var NodeRSA = require('node-rsa');

var self;

class AgeVerificationRequestHandlers {
  constructor(db, requestValidationServices, completionServices, config) {
    console.log("AgeVerificationRequestHandlers constructor");
    this.db = db;
    this.validation = requestValidationServices;
    this.completionServices = completionServices;
    this.config = config;
    self = this;
  }

  //NOT USED IN V3
  async getAgeVerifiedAttributes(request, response) {
    console.log('getAgeVerifiedAttributes entered');

    var attributesToken = request.body.attributesToken;
    var playerDeviceToken = request.body.playerDeviceToken;
    var playerExternalId = request.body.playerExternalId;
    var timestamp = new Date().getTime();

    const CLIENT_SDK_ID = self.config.YOTI_SDK_ID;
    const PEM = await fs.readFileSync(self.config.YOTI_PEM_FILE);
    const yotiClient = new yoti.Client(CLIENT_SDK_ID, PEM);

    var errorMsg = self.validation.validateDeviceToken(playerDeviceToken)
      || self.validation.validateAttributeToken(attributesToken);

    if (errorMsg) {
      throw errorMsg;
    }

    var activityDetails = await yotiClient.getActivityDetails(attributesToken);

    if (activityDetails.getOutcome() !== 'SUCCESS') {
      throw new Error('ERROR with yotiClient.getActivityDetails token: ', activityDetails);
    }

    const profile = activityDetails.getProfile();
    //console.log('we have success and a profile: ' + JSON.stringify(profile));
    const ageVerified = profile.getAgeVerified().getValue();
    const ageVerifiedSources = profile.getAgeVerified().getSources();
    const sourceValue = ageVerifiedSources[0].getValue();
    if (ageVerified) {
      var data = "over_18: " + ageVerified + " / source: " + sourceValue;
      console.log(data);
      let accountState = await self.db.getAccountStatus(playerExternalId, request);
      console.log(accountState);
      await self.db.confirmPlayerYotiShareVerified(playerExternalId, timestamp, "yotiShareSuccess", data, accountState);
      self.completionServices.sendOkResponse(request, response);
    } else {
      await self.db.confirmPlayerYotiShareVerified(playerExternalId, null, "ageVerifyFailed", null, "FailedAgeVerify");
      var completionMessage = {
        code: 2014,
        message: "failed age verification"
      }
      self.completionServices.sendFailResponse(request, response, completionMessage);
    }
  }

  //NOT USED IN REACT NATIVE
  async ageScan(request, response) {
    console.log('entered age scan...');

    var playerToken = request.body.playerToken;
    var playerDeviceToken = request.body.playerDeviceToken;
    var image = request.body.image;
    var timestamp = new Date().getTime();

    var errorMsg = self.validation.validatePlayerToken(playerToken)
      || self.validation.validateDeviceToken(playerDeviceToken)
      || self.validation.validateImage(image);

    if (errorMsg) {
      throw errorMsg;
    }

    let data = {
      data: image
    };

    var uuid = uuidv4();
    var yotiTimestamp = new Date().getTime();
    var uriPath = "https://api.yoti.com/api/v1/age-verification/checks?nonce=" + uuid + "&timestamp=" + yotiTimestamp;
    var path = uriPath.split("https://api.yoti.com/api/v1/age-verification")[1];
    let signature = self.signMessage("POST", path, data);

    const reqPostParam = {
      url: uriPath,
      headers: {
        "X-Yoti-Auth-Id": self.config.YOTI_SDK_ID,
        "X-Yoti-Auth-Digest": signature,
        "content-type": "application/json"
      },
      body: JSON.stringify(data)
    }
    var body = await self.promisifyReqPost(reqPostParam);

    let values = JSON.parse(body);
    if (values.error_message) {
      let errorMsg = values.error_message;
      if (values.error_code == 1 || values.error_code == 2 || values.error_code == 4 || values.error_code == 5 || values.error_code == 8) {
        console.log('error follows...');
      } else {
        console.log("ERROR follows...");
      }
      console.log({ errorMsg });
      self.completionServices.sendFailResponse(request, response, self.completionServices.completionCodes.AGE_SCAN_UNSUCCESSFUL)
      return;
    }

    let pred_age = values.pred_age;
    let uncertainty = values.uncertainty;
    var ageVerifiedData = "pred_age: " + pred_age + " / uncertainty: " + uncertainty;
    console.log(ageVerifiedData);

    //Yoti recommends rejecting any response with an uncertainty greater than 6.0.
    //Typically this indicates a problem with image capture.
    if (uncertainty > 6) {
      self.completionServices.sendFailResponse(request, response, self.completionServices.completionCodes.AGE_SCAN_UNSUCCESSFUL)
      return;
    } else if (pred_age >= 21 && uncertainty <= 6) {
      console.log("Age Scan Success...");
      let playerExternalId = await self.db.getUserEmail(playerToken);
      let accountState = await self.db.getAccountStatus(playerExternalId[0].playerExternalId, request);
      await self.db.confirmPlayerYotiAgeScanVerified(playerToken, timestamp, "yotiAgeScanSuccess", ageVerifiedData, request.body.image, accountState);
      self.completionServices.sendOkResponse(request, response);
      return;
    }

    console.log("Age Scan Failed...")
    await self.db.confirmPlayerYotiAgeScanVerified(playerToken, null, "yotiAgeScanFailed", ageVerifiedData, null, "FailedAgeScan");
    var completionMessage = {
      code: 2014,
      message: "failed age verification"
    }
    await self.completionServices.sendFailResponse(request, response, completionMessage);
    console.log("age scan failed complete...");
  }

  //not needed in v3
  promisifyReqPost(reqPostParam) {
    return new Promise(function (resolve, reject) {
      req.post(reqPostParam, function (error, resp, body) {
        //console.log("Req.post result, res: ", resp);
        console.log("Req.post result, body: ", body);
        var bodyParsed = JSON.parse(body);
        if (bodyParsed.error_code == 1 || bodyParsed.error_code == 2 || bodyParsed.error_code == 4 || bodyParsed.error_code == 5 || bodyParsed.error_code == 8) {
          resolve(body);
        } else {
          resolve(body);
        }
      });
    });
  }

  //NOT NEEDED IN V3
  signMessage(method, path, body) {
    let message = method;
    message = message.concat("&");
    message = message.concat(path);
    if (body !== "") {
      message = message.concat("&");
      message = message.concat(
        Buffer.from(JSON.stringify(body)).toString("base64")
      );
    }
    return getDigest(message);

    //Build the digest using privateKeys loaded
    function getDigest(message) {
      const key = new NodeRSA();
      var PEM = fs.readFileSync(self.config.YOTI_PEM_FILE);
      key.importKey(PEM);
      let msgSignature = key.sign(message, "base64");
      return msgSignature;
    }
  }


  /*******************************************************************************
   * V3 Methods
   *******************************************************************************/

  async getAgeVerifiedAttributesV3(request, response) {
    console.log('==>getAgeVerifiedAttributesV3');

    var attributesToken = request.body.attributesToken;
    var playerDeviceToken = request.body.playerDeviceToken;
    var playerToken = request.body.playerToken;
    var timestamp = new Date().getTime();

    const CLIENT_SDK_ID = self.config.YOTI_SDK_ID;
    const PEM = await fs.readFileSync(self.config.YOTI_PEM_FILE);
    const yotiClient = new yoti.Client(CLIENT_SDK_ID, PEM);

    var errorMsg = self.validation.validateDeviceToken(playerDeviceToken)
      || self.validation.validateAttributeToken(attributesToken);

    if (errorMsg) {
      throw errorMsg;
    }

    var activityDetails = await yotiClient.getActivityDetails(attributesToken);

    if (activityDetails.getOutcome() !== 'SUCCESS') {
      throw new Error('ERROR with yotiClient.getActivityDetails token: ', activityDetails);
    }

    const profile = activityDetails.getProfile();
    //console.log('we have success and a profile: ' + JSON.stringify(profile));
    const ageVerified = profile.getAgeVerified().getValue();
    const ageVerifiedSources = profile.getAgeVerified().getSources();
    const sourceValue = ageVerifiedSources[0].getValue();
    if (ageVerified) {
      var data = "over_18: " + ageVerified + " / source: " + sourceValue;
      console.log(data);
      let playerExternalId = await self.db.getUserEmail(playerToken);
      let accountState = await self.db.getAccountStatus(playerExternalId[0].playerExternalId, request);
      console.log(accountState);
      await self.db.confirmPlayerYotiShareVerified(playerExternalId[0].playerExternalId, timestamp, "yotiShareSuccess", data, accountState);
      let additionalProperties = {
        playerAgeVerifiedStatus: 'yotiShareSuccess',
        completionMessage: 'You have successfully age verified.'
      }

      self.completionServices.sendOkResponse(request, response, additionalProperties);
    } else {
      await self.db.confirmPlayerYotiShareVerified(playerExternalId, null, "ageVerifyFailed", null, "FailedAgeVerify");
      var completionMessage = {
        code: 2014,
        message: "failed age verification",
        playerAgeVerifiedStatus: "ageVerifyFailed"
      }
      self.completionServices.sendFailResponse(request, response, completionMessage);
    }
  }

  async ageScanV3(request, response) {
    console.log('==>ageScanV3');

    var playerToken = request.body.playerToken;
    var playerDeviceToken = request.body.playerDeviceToken;
    var image = request.body.image;
    var timestamp = request.serviceTimestamp;

    var errorMsg = self.validation.validatePlayerToken(playerToken)
      || self.validation.validateDeviceToken(playerDeviceToken)
      || self.validation.validateImage(image);

    if (errorMsg) {
      throw errorMsg;
    }

    let data = {
      img: image
    };

    const yotiRequest = new yoti.RequestBuilder()
      .withBaseUrl('https://api.yoti.com/ai/v1')
      .withPemFilePath(self.config.YOTI_PEM_FILE)
      .withEndpoint('/age-antispoofing') // optionally PATHS.AGE or PATHS.LIVENESS
      .withPayload(new yoti.Payload(data))
      .withMethod('POST')
      .withHeader('X-Yoti-Auth-Id', self.config.YOTI_SDK_ID)
      .build();

    try {
      const yotiResponse = await yotiRequest.execute();
      let values = yotiResponse.parsedResponse;

      let prediction = values.antispoofing.prediction;
      let pred_age = values.age.age;
      let uncertainty = values.age.st_dev;

      //logging out the full response, but only storing age and uncertainty in db to be backwards compatible
      //with quicksight reports across both versions of the app
      console.log("prediction: " + prediction + " / pred_age: " + pred_age + " / uncertainty: " + uncertainty);
      var ageVerifiedData = "pred_age: " + pred_age + " / uncertainty: " + uncertainty;;

      //Yoti recommends rejecting any response with an uncertainty greater than 6.0.
      //Typically this indicates a problem with image capture.
      if (uncertainty > 6 || prediction != 'real') {
        self.completionServices.sendFailResponse(request, response, self.completionServices.completionCodes.AGE_SCAN_UNSUCCESSFUL);
        return;
      } else if (pred_age >= 21 && uncertainty <= 6) {
        console.log("Age Scan Success...");
        let playerExternalId = await self.db.getUserEmail(playerToken);
        let accountState = await self.db.getAccountStatus(playerExternalId[0].playerExternalId, request);
        await self.db.confirmPlayerYotiAgeScanVerified(playerToken, timestamp, "yotiAgeScanSuccess", ageVerifiedData, request.body.image, accountState);
        let additionalProperties = {
          playerAgeVerifiedStatus: 'yotiAgeScanSuccess',
          completionMessage: 'You have successfully age verified.'
        }

        self.completionServices.sendOkResponse(request, response, additionalProperties);
        return;
      }

      console.log("Age Scan Failed...")
      await self.db.confirmPlayerYotiAgeScanVerified(playerToken, null, "yotiAgeScanFailed", ageVerifiedData, null, "FailedAgeScan");
      let completionMessage = {
        code: 2014,
        message: "failed age verification",
        playerAgeVerifiedStatus: "yotiAgeScanFailed"
      }

      await self.completionServices.sendFailResponse(request, response, completionMessage);

    } catch (err) {
      console.log(err);
      //TODO do we need to bother sending back the reason for the failure if we are using the face capture then in theory it should never fail
      //because image isn't correct, and there isn't much we can do as the picture is taken automatically when the sdk thinks its correct
      self.completionServices.sendFailResponse(request, response, self.completionServices.completionCodes.AGE_SCAN_UNSUCCESSFUL);
      return;
    }
  }
}

module.exports = AgeVerificationRequestHandlers;