var self;

////this has been copied from PlayerService, some of it isn't being used but left it in for now
class CompletionServices {

  constructor(db) {
    console.log("CompletionServices constructor");
    self = this;
    self.db = db;
    self.completionCodes = {
      OK: { code: 0, message: "Ok" },
      REGISTER_USER_USERNAME_ALREADY_EXISTS: { code: 2000, message: "An error occurred and we can't register you at the moment. Please try again later." },
      RESET_PASSWORD_ATTEMPT_LIMIT_EXCEEDED: { code: 2001, message: "Attempt limit exceeded, please try after some time" },
      RESET_PASSWORD_USER_NOT_FOUND: { code: 2002, message: "An unexpected error occurred,and we can't reset your password at the moment" },
      RESET_PASSWORD_FAILED_FOR_UNCONFIRMED_USER: { code: 2003, message: "Cannot reset password for the user as there is no registered/verified email" },
      SIGN_IN_USER_NOT_CONFIRMED: { code: 2004, message: "User is not confirmed" },
      SIGN_IN_INCORRECT_CREDENTIALS: { code: 2005, message: "Incorrect username or password" },
      SIGN_IN_PLAYER_EXCLUDED: { code: 2006, message: "Sign in unsuccessful as player is self-excluded" },
      SIGN_IN_NOT_AGE_VERIFIED: { code: 2007, message: "Sign in unsuccessful as player is not age verified" },
      POSTCODER_ADDRESS_ALREADY_FOUND: { code: 2008, message: "Address lookup not performed as address is already known" },
      POSTCODER_ADDRESS_NOT_FOUND: { code: 2009, message: "Address lookup failed to return addresses" },
      POSTCODER_TOO_MANY_SEARCHES: { code: 2010, message: "The user has exceeded the maximum number of postcode search" },
      POSTCODER_FAILED_TO_SET_ADDRESS: { code: 2011, message: "The address could not be saved on the db" },
      POSTCODER_ADDRESS_NOT_VERIFIED: { code: 2012, message: "Sign in unsuccessful as player is not address verified" },
      POSTCODER_COUNTRY_NOT_VALID: { code: 2013, message: "Country name provided was not valid" },
      FAILED_AGE_VERIFICATION: { code: 2014 }, //message added within method
      AGE_SCAN_UNSUCCESSFUL: { code: 2015, message: "Age scan failed please try again" },
      SIGN_IN_FAILED_AGE_SCAN: { code: 2016, message: "Sign in unsuccessful as player failed age scan" },
      SIGN_IN_FAILED_AGE_VERIFICATION: { code: 2017, message: "Sign in unsuccessful as player failed age verification" },
      CONFIG_FAILED: { code: 2018, message: "The mpaConfig call prossessing failed" },
      CONFIG_VERSION_BLACKLISTED: { code: 2019, message: "An app update is required, please use the app store to update the version of your app and then try again." },
      CONFIG_OS_NOT_RECOGNISED: { code: 2020, message: "The device's OS is not recognised" },
      SIGN_IN_FIRST_TIME_PASSWORD_CHANGE: { code: 2021, message: "Password change required on first sign in" },
      SIGN_IN_NEW_PASSWORD_REQUIRED_FAILED: { code: 2022, message: "Change of password failed" },
      SIGN_IN_MFA_REQUIRED: { code: 2023, message: "MFA required" },
      SIGN_IN_MFA_FAILED: { code: 2024, message: "MFA failed" },
      WRONG_VERIFICAION_CODE: { code: 2025, message: "Incorrect verification code, please try again or request a new one using the resend code button." },
      DEVICE_BLACKLISTED: { code: 2026, message: "Unexpected error has occured, if the problem persists please contact support." },
      AGE_SCAN_FACE_NOT_FOUND: { code: 2027, message: "No face detected, please try again." },
      AGE_SCAN_MULTIPLE_FACES: { code: 2028, message: "Multiple faces detected, please try again." },
      AGE_SCAN_FACE_TOO_SMALL: { code: 2029, message: "Please move closer to the camera and try again." },
      AGE_SCAN_FACE_TOO_BIG: { code: 2030, message: "Please move further away from the camera and try again." },
      AGE_SCAN_FACE_TOO_BRIGHT: { code: 2031, message: "Please move to an area with less brightness." },
      AGE_SCAN_FACE_TOO_DARK: { code: 2032, message: "Please move to an area with more brightness." },
      AGE_SCAN_IMAGE_NOT_VALIDATED: { code: 2033, message: "We cannot validate the provided image, please make sure you are taking a selfie and not a picture of a picture and try again." },
      PLAYER_ALREADY_CONFIRMED: { code: 2034, message: "You have already confirmed your account." },
      PLAYER_UNABLE_TO_CONFIRM_ACCOUNT: { code: 2035, message: "You are unable to confirm your account, please contact support" },
      WALLET_ALREADY_CREATED: { code: 2036, message: "You have already opened this wallet, please add another wallet or continue registration." },
      SIGN_IN_EMAIL_NOT_VERIFIED: { code: 2037, message: "" } //don't need a message for this one
    }
  }

  async sendOkResponse(request, response, additionalProperties) {
    response.jsonToSend = await self.buildResponseObj(request, response, self.completionCodes.OK, additionalProperties);
  }

  async sendFailResponse(request, response, completionCode, additionalProperties) {
    response.jsonToSend = await self.buildResponseObj(request, response, completionCode, additionalProperties);
  }

  async buildResponseObj(request, response, completionCode, additionalProperties) {
    console.log("Building response object");

    var responseObj = {};
    // Add these first. This allows additionalProperties param to be used to change them.
    // For example to change the 'Ok' message to something more meaningful.
    responseObj.completionCode = completionCode.code;
    responseObj.completionMessage = completionCode.message;

    if (request.body.hasOwnProperty("requestType")) {
      responseObj.associatedRequestType = request.body.requestType;
    }
    if (request.body.hasOwnProperty("playerToken")) {
      responseObj.playerToken = request.body.playerToken;
    }
    if (request.body.hasOwnProperty("amount")) {
      responseObj.amount = request.body.amount;
    }
    if (request.body.hasOwnProperty("currencyCode")) {
      responseObj.currencyCode = request.body.currencyCode;
    }
    if (request.body.hasOwnProperty("takeABreakEndDatetime")) {
      responseObj.takeABreakEndDatetime = request.body.takeABreakEndDatetime;
    }
    if (additionalProperties) {
      Object.assign(responseObj, additionalProperties);
      if (additionalProperties.hasOwnProperty("completionMessage") && additionalProperties.completionMessage) {
        responseObj.completionMessage = additionalProperties.completionMessage;
      }
    }
    return responseObj;
  }
}

module.exports = CompletionServices;
