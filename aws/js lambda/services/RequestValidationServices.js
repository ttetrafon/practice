var self;

//this has been copied from PlayerService, alot of it isn't being used but left it in for now
class RequestValidationServices {
  constructor() {
    console.log("RequestValidationServices constructor");
    self = this;
  }

  validateDeviceToken(playerDeviceToken) {
    if (!playerDeviceToken) {
      return 'playerDeviceToken is missing';
    }
    return null;
  }

  validatePlayerToken(playerToken) {
    if (!playerToken) {
      return 'playerToken is missing';
    }
    return null;
  }

  validatePassword(password, name) {
    if (!password) {
      return name + ' password is missing';
    }
    return null;
  }

  validateAttributeToken(attributesToken) {
    if (!attributesToken) {
      return 'attributes token is missing';
    }
    return null;
  }

  validateImage(image) {
    if (!image) {
      return 'image is missing';
    }
    return null;
  }

  validateJwtToken(jwtToken, name) {
    if (!jwtToken) {
      return name + ' token is missing';
    }
    return null;
  }

  validateAmount(amount) {
    return self.validateInteger(amount, 'amount', 0);
  }

  validateInteger(int, name, min, max) {
    if (int === undefined) {
      return name + ' is missing';
    }
    if (!Number.isInteger(int)) {
      return name + ' is not a valid integer';
    }
    if (min !== undefined && int < min) {
      return name + ' cannot be less than ' + min;
    }
    if (max !== undefined && int > max) {
      return name + ' cannot be greater than ' + max;
    }

    return null;
  }

  validateCurrencyCode(currencyCode) {
    if (!currencyCode) {
      return 'currencyCode is missing';
    }
    if (currencyCode !== "GBP") {
      return 'currencyCode must be GBP';
    }
    return null;
  }

  validateDatetime(datetime, name, min, max) {
    if (!datetime) {
      return name + ' is missing';
    }
    if (!Number.isInteger(datetime)) {
      return name + ' is not a valid datetime';
    }
    if (min && datetime < min) {
      return name + ' (' + new Date(datetime) + ') must be after ' + new Date(min);
    }
    if (max && datetime > max) {
      return name + ' (' + new Date(datetime) + ') must be before ' + new Date(max);
    }
    return null;
  }

  validateTransactionToken(transactionToken) {
    if (!transactionToken) {
      return 'transactionToken is missing';
    }
    return null;
  }

  validateTransactionType(transactionType) {
    if (!transactionType) {
      return 'transactionType is missing';
    }
    if (transactionType !== 'deposit' && transactionType !== 'withdrawal') {
      return 'transactionType must be either deposit or withdrawal';
    }

    return null;
  }

  validateTransactionStatus(transactionStatus, name) {
    if (!transactionStatus) {
      return name + ' is missing';
    }
    if (transactionStatus !== 'pending' && transactionStatus !== 'complete' && transactionStatus !== 'failed') {
      return name + ' must be either pending, complete or failed';
    }

    return null;
  }

  validateCompletionCode(completionCode, name) {
    return this.validateInteger(completionCode, 'completionCode', 0);
  }

  validateCardToken(cardToken) {
    if (!cardToken) {
      return 'cardToken is missing';
    }
    return null;
  }

  validateDepositOutcome(paymentData) {
    if (!paymentData) {
      return 'paymentData is missing';
    }
    return null;
  }

  validateWalletToken(walletToken) {
    if (!walletToken) {
      return 'walletToken is missing'
    }
    return null;
  }
}

module.exports = RequestValidationServices;