const uuidv4 = require('uuid/v4');
const btoa = require('btoa');
const atob = require('atob');
const jwt = require('jsonwebtoken');
const getSymbolFromCurrency = require('currency-symbol-map');

var self;

class WalletRequestHandlers {
  constructor(db, requestValidationServices, completionServices, config, cyberSourceServices) {
    console.log("WalletRequestHandlers constructor");
    this.db = db;
    this.validation = requestValidationServices;
    this.completionServices = completionServices;
    this.config = config;
    this.cyberSourceServices = cyberSourceServices;
    self = this;
  }

  //NOT USED IN V3
  //if error before transaction finishes then this updates the cardTransaction table
  async logFailedTransaction(b64optores, transactionToken, serviceStatus, request, response, operation, cause) {
    await self.db.declareFailedCardTransaction({
      paymentProviderResponse: b64optores,
      serviceStatus: serviceStatus,
      transactionToken: transactionToken,
      cause
    }, request, operation);

    var cardTransaction = await self.db.getCardTransactionByToken(transactionToken, request);
    var wallet = await self.db.getWallet(cardTransaction.walletToken, request);

    var operatorStyle = JSON.parse(wallet.operatorStyle);

    var pageToRender;
    if (cause && cause.reason === 'declined') {
      pageToRender = 'paymentFailed';
    } else if (cause && cause.reason === 'paymentTakenError') {
      pageToRender = 'SignatureVerificationFailed';
    } else {
      pageToRender = 'paymentError';
    }
    response.renderToSend = {
      pageToRender: pageToRender,
      dataForPage: {
        logo: wallet.operatorWalletImage,
        transactionToken: transactionToken,
        walletBalance: (wallet ? wallet.walletBalance : null),
        six: operatorStyle.six,
        seven: operatorStyle.seven
      }
    }
  }

  //NOT USED IN V3
  /**
   * Render cybersource payment page if required
   * @param {*} request
   * @param {*} response
   */
  async renderCyberSourcePaymentPage(request, response) {
    console.log('renderCyberSourcePaymentForm');

    var decrypt = atob(request.body.OptoReq);
    var decryptArray = decrypt.split('|');

    var verifyMessage = await self.cyberSourceServices.verifyMessage(request.body.OptoHmac, decrypt);

    var cardTransaction = await self.db.getCardTransactionByToken(decryptArray[0], request);
    var wallet = await self.db.getWallet(cardTransaction.walletToken, request);
    var operatorStyle = JSON.parse(wallet.operatorStyle);

    if (!verifyMessage) {
      response.renderToSend = {
        pageToRender: 'SignatureVerificationFailed',
        dataForPage: {
          logo: wallet.operatorWalletImage,
          six: operatorStyle.six,
          seven: operatorStyle.seven
        }
      }
      return;
    }

    var transactionToken = decryptArray[0];
    var captureContext = decryptArray[1];
    var amount = decryptArray[2];
    var timeoutMinutes = decryptArray[3];
    var userToken = decryptArray[4];
    var paymentCard = decryptArray[5];


    var expiredCard = false;
    var card;
    if (paymentCard) {
      card = await self.db.getActiveCardForPlayer(userToken, request);

      var date = new Date();
      var dateMonth = date.getMonth() + 2;
      var dateYear = date.getFullYear() % 100;

      if (dateMonth < 10) {
        dateMonth = '0' + dateMonth;
      }

      var cardExpiryMonth = card.cardExpiryMmyy.substring(0, 2);
      var cardExpiryYear = card.cardExpiryMmyy.substring(2);

      if (cardExpiryYear < dateYear || (cardExpiryYear == dateYear && cardExpiryMonth <= dateMonth)) {
        console.log('players card has expired');
        expiredCard = true;
      }
    }

    var pageToRender;

    if (!paymentCard) {
      pageToRender = 'cyberSourcePaymentFormNewCard'
    } else {
      pageToRender = 'cyberSourcePaymentFormExistingCard'
    }

    var placeholderTextColour = self.lightenDarkenColor(operatorStyle.seven, 100);
    response.renderToSend = {
      pageToRender: pageToRender,
      dataForPage: {
        logo: wallet.operatorWalletImage,
        acceptedPaymentLogos: self.config.ACCEPTED_PAYMENT_LOGOS_URL,
        transactionToken: transactionToken,
        captureContext: captureContext,
        amount: amount,
        timeoutMinutes: timeoutMinutes,
        two: operatorStyle.two,
        five: operatorStyle.five,
        six: operatorStyle.six,
        seven: operatorStyle.seven,
        eight: operatorStyle.eight,
        nine: operatorStyle.nine,
        placeholder: placeholderTextColour,
        paymentCard: paymentCard,
        activeCardToken: (paymentCard ? card.cardPanStar : null),
        expiredCard: expiredCard
      }
    }
  }

  //NOT USED IN V3
  /**
   * render cybersource device data collection page
   * @param {*} request
   * @param {*} response
   * @param {*} transactionInfo
   */
  async cyberSourceDeviceDataCollection(request, response, transactionInfo) {
    console.log('configure3dsSecurityCyberSource:');

    //TODO check if need to verify token returned

    let verifyToken;
    let paymentToken;
    let transientToken;
    let transactionToken;
    let newCard = false;
    let expiryDate;
    if (!request.body.transientToken) {
      verifyToken = self.cyberSourceServices.verifyJwtToken(request.body.paymentToken, request.body.captureContext);
      let paymentTokenDecoded = await jwt.decode(request.body.paymentToken);
      paymentToken = paymentTokenDecoded.jti;
      transactionToken = request.body.transactionToken;
      newCard = true;
    } else {
      verifyToken = self.cyberSourceServices.verifyJwtToken(request.body.transientToken, request.body.captureContext);
      let transientTokenDecoded = await jwt.decode(request.body.transientToken);
      transientToken = transientTokenDecoded.jti;
      paymentToken = request.body.paymentCard;
      transactionToken = request.body.transactionToken;
      if (transientTokenDecoded.data && transientTokenDecoded.data.expirationMonth && transientTokenDecoded.data.expirationYear) {
        expiryDate = {
          expirationMonth: transientTokenDecoded.data.expirationMonth,
          expirationYear: transientTokenDecoded.data.expirationYear
        }

        expiryDate = self.cyberSourceServices.hashMessage(JSON.stringify(expiryDate));
      }
    }

    if (verifyToken) {

      let cardTransaction = await self.db.getCardTransactionByToken(transactionToken, request);
      let wallet = await self.db.getWallet(cardTransaction.walletToken, request);

      let playerAccount = await self.db.getPlayerAccount(cardTransaction.playerToken);
      let playerNonGamblingMid = (!playerAccount.ageVerifiedTime || playerAccount.ageVerifiedTime && self.config.getBlockedCountryCodeList().includes(playerAccount.playerAddressCountry) ? true : false);

      let payerAuthCheck = await self.cyberSourceServices.setupPayerAuth(paymentToken, transientToken, transactionToken, newCard, wallet.operatorWalletMID, playerNonGamblingMid);
      console.log(JSON.stringify(payerAuthCheck));

      if (payerAuthCheck && payerAuthCheck.setupPayerAuthRes.consumerAuthenticationInformation && payerAuthCheck.setupPayerAuthRes.consumerAuthenticationInformation.accessToken) {

        let processorRequest = (cardTransaction.paymentProviderRequest ? cardTransaction.paymentProviderRequest : '') + ' ' + payerAuthCheck.reqStringified;
        let processorResponse = (cardTransaction.paymentProviderResponse ? cardTransaction.paymentProviderResponse : '') + ' ' + payerAuthCheck.resStringified;
        await self.db.updateProcessorRequestResponse(transactionToken, processorRequest, processorResponse, request)

        var operatorStyle = JSON.parse(wallet.operatorStyle);

        response.renderToSend = {
          pageToRender: 'cyberSourceDeviceDataCollection',
          dataForPage: {
            logo: wallet.operatorWalletImage,
            deviceDataCollectioneEventOriginUrl: self.cyberSourceServices.DEVICE_DATA_COLLECTION_EVENT_ORIGIN_URL,
            accessToken: payerAuthCheck.setupPayerAuthRes.consumerAuthenticationInformation.accessToken,
            deviceDataCollectionUrl: payerAuthCheck.setupPayerAuthRes.consumerAuthenticationInformation.deviceDataCollectionUrl,
            paymentToken: paymentToken,
            transientToken: transientToken,
            transactionToken: transactionToken,
            expiryDate: expiryDate,
            referenceId: payerAuthCheck.setupPayerAuthRes.consumerAuthenticationInformation.referenceId,
            newCard: newCard,
            six: operatorStyle.six,
            seven: operatorStyle.seven
          }
        }
      } else {
        var paymentProcessorResponse = cardTransaction.paymentProviderResponse;
        let failureCause = {
          reason: 'error',
          message: "error setting up payerAuth"
        }
        await self.logFailedTransaction(paymentProcessorResponse, transactionToken, 'failed', request, response, 'update', failureCause);
        return;
      }
    }
  }

  //NOT USED IN V3
  /**
   * check if player enrolled in 3DS and needs authentication window, if so render 3DS page, if not process the payment
   * @param {*} request
   * @param {*} response
   */
  async processPaymentAndConsumerAuthentication(request, response) {
    console.log('processPaymentAndConsumerAuthentication: ' + JSON.stringify(request.body));

    let cardTransaction = await self.db.getCardTransactionByToken(request.body.transactionToken, request);
    let addressDetails = await self.db.getPlayerAddress(cardTransaction.playerToken, request); //TODO get address details for player
    let allConfigOptions = await self.db.getAllConfigurationOptions(request);
    let wallet = await self.db.getWallet(cardTransaction.walletToken, request);
    let playerAccount = await self.db.getPlayerAccount(cardTransaction.playerToken);
    let playerNonGamblingMid = (!playerAccount.ageVerifiedTime || playerAccount.ageVerifiedTime && self.config.getBlockedCountryCodeList().includes(playerAccount.playerAddressCountry) ? true : false);

    let eventData = JSON.parse(request.body.eventData);

    let processPayment = await self.cyberSourceServices.processPayment(request, cardTransaction.amount, cardTransaction.currencyCode, addressDetails, request.body.paymentToken, request.body.transientToken, eventData.SessionId, request.body.transactionToken, true, request.body.newCard, wallet.operatorWalletMID, playerNonGamblingMid);

    if (processPayment) {
      let processorRequest = (cardTransaction.paymentProviderRequest ? cardTransaction.paymentProviderRequest.substring(cardTransaction.paymentProviderRequest.indexOf('setupPayerAuth')) : '') + ' ' + processPayment.reqStringified;
      let processorResponse = (cardTransaction.paymentProviderResponse ? cardTransaction.paymentProviderResponse.substring(cardTransaction.paymentProviderResponse.indexOf('setupPayerAuthResponse')) : '') + ' ' + processPayment.resStringified;

      await self.db.updateProcessorRequestResponse(request.body.transactionToken, processorRequest, processorResponse, request);

      let transactionInfo = {
        paymentToken: request.body.paymentToken,
        transientToken: (request.body.transientToken ? request.body.transientToken : null),
        transactionToken: request.body.transactionToken,
        expiryDate: (request.body.expiryDate ? request.body.expiryDate : null),
        newCard: request.body.newCard
      }

      if (processPayment.processPaymentRes.status === 'PENDING_AUTHENTICATION') {
        console.log('transaction requires authentication');

        var operatorStyle = JSON.parse(wallet.operatorStyle);

        let transactionInfoStringified = btoa(JSON.stringify(transactionInfo));
        response.renderToSend = {
          pageToRender: 'cyberSourcePayment3DSAuthentication',
          dataForPage: {
            logo: wallet.operatorWalletImage,
            stepUpUrl: processPayment.processPaymentRes.consumerAuthenticationInformation.stepUpUrl,
            accessToken: processPayment.processPaymentRes.consumerAuthenticationInformation.accessToken,
            origin: allConfigOptions.authenticationServiceUrl,
            //sending transactionToken seperate as well as below so that can be used if message posted back
            //from iframe not from expected origin can fail the transaction
            transactionToken: request.body.transactionToken,
            transactionInfo: transactionInfoStringified,
            six: operatorStyle.six,
            seven: operatorStyle.seven
          }
        }

      } else {
        console.log('transaction has either succeded or failed without the need for authentication');
        let paymentToken;
        if (processPayment.processPaymentRes.tokenInformation && processPayment.processPaymentRes.tokenInformation.paymentInstrument) {
          paymentToken = processPayment.processPaymentRes.tokenInformation.paymentInstrument.id;
        } else {
          paymentToken = transactionInfo.paymentToken;
        }

        if (processPayment.processPaymentRes.status === 'AUTHORIZED') {
          if (processPayment.processPaymentRes.consumerAuthenticationInformation && (processPayment.processPaymentRes.consumerAuthenticationInformation.ecommerceIndicator === 'vbv' || processPayment.processPaymentRes.consumerAuthenticationInformation.ecommerceIndicator === 'vbv_attempted' || processPayment.processPaymentRes.consumerAuthenticationInformation.ecommerceIndicator === 'spa')) {

            let updateCardToken = true;
            if (transactionInfo.transientToken && transactionInfo.expiryDate) {
              let decodedExpiryDate = await self.cyberSourceServices.decodeMessage(transactionInfo.expiryDate);
              if (decodedExpiryDate) {
                updateCardToken = await self.cyberSourceServices.updateToken(paymentToken, decodedExpiryDate, wallet.operatorWalletMID, playerNonGamblingMid);
              } else {
                updateCardToken = false;
              }
            }

            let cardDetails = await self.cyberSourceServices.getCardDetails(cardTransaction.playerToken, paymentToken, wallet.operatorWalletMID, playerNonGamblingMid);
            if (cardDetails && updateCardToken) {
              let capturePayment = await self.cyberSourceServices.completePayment(processPayment.processPaymentRes.id, transactionInfo.transactionToken, cardTransaction.amount, cardTransaction.currencyCode, wallet.operatorWalletMID, playerNonGamblingMid);
              cardTransaction = await self.db.getCardTransactionByToken(transactionInfo.transactionToken, request);
              if (capturePayment) {
                let processorRequest = (cardTransaction.paymentProviderRequest ? cardTransaction.paymentProviderRequest.substring(cardTransaction.paymentProviderRequest.indexOf('authorisationAndConsumerAuthentication')) : '') + ' ' + capturePayment.reqStringified;
                let processorResponse = (cardTransaction.paymentProviderResponse ? cardTransaction.paymentProviderResponse.substring(cardTransaction.paymentProviderResponse.indexOf('authorisationAndConsumerAuthenticationResponse')) : '') + ' ' + capturePayment.resStringified;

                await self.db.updateProcessorRequestResponse(request.body.transactionToken, processorRequest, processorResponse, request);
                await self.cyberSourceCompletePayment(request, response, processPayment, paymentToken, transactionInfo, playerNonGamblingMid, capturePayment, cardDetails);
              } else {
                let reverseAuth = await self.cyberSourceServices.reverseAuthorisation(processPayment.processPaymentRes.id, transactionInfo.transactionToken, cardTransaction.amount, wallet.operatorWalletMID, playerNonGamblingMid);
                var paymentProcessorResponse = cardTransaction.paymentProviderResponse.substring(cardTransaction.paymentProviderResponse.indexOf('authorisationAndConsumerAuthenticationResponse')) + ' ' + (reverseAuth ? reverseAuth.resStringified : '');
                let failureCause = {
                  reason: (reverseAuth ? 'error' : 'paymentTakenError'),
                  message: (reverseAuth ? "error capturing payment" : "error reversing authorisation")
                }
                await self.logFailedTransaction(paymentProcessorResponse, transactionInfo.transactionToken, 'failed', request, response, 'update', failureCause);
                return;
              }
            } else {
              let reverseAuth = await self.cyberSourceServices.reverseAuthorisation(processPayment.processPaymentRes.id, transactionInfo.transactionToken, cardTransaction.amount, wallet.operatorWalletMID, playerNonGamblingMid);
              let paymentProcessorResponse = cardTransaction.paymentProviderResponse.substring(cardTransaction.paymentProviderResponse.indexOf('authorisationAndValidateAuthResponse')) + ' ' + (reverseAuth ? reverseAuth.resStringified : '');
              let failureCause = {
                reason: (reverseAuth ? 'declined' : 'paymentTakenError'),
                message: (reverseAuth ? "unable to retrieve card details" : "error reversing authorisation")
              }
              await self.logFailedTransaction(paymentProcessorResponse, transactionInfo.transactionToken, 'failed', request, response, 'update', failureCause);
              return;
            }
          } else {
            let reverseAuth = await self.cyberSourceServices.reverseAuthorisation(processPayment.processPaymentRes.id, transactionInfo.transactionToken, cardTransaction.amount, wallet.operatorWalletMID, playerNonGamblingMid);
            var paymentProcessorResponse = cardTransaction.paymentProviderResponse.substring(cardTransaction.paymentProviderResponse.indexOf('authorisationAndConsumerAuthenticationResponse')) + ' ' + (reverseAuth ? reverseAuth.resStringified : '');
            let failureCause = {
              reason: (reverseAuth ? 'declined' : 'paymentTakenError'),
              message: (reverseAuth ? "no liability shift" : "error reversing authorisation")
            }
            await self.logFailedTransaction(paymentProcessorResponse, transactionInfo.transactionToken, 'failed', request, response, 'update', failureCause);
            return;
          }
        } else {
          cardTransaction = await self.db.getCardTransactionByToken(transactionInfo.transactionToken, request);

          if (processPayment.processPaymentRes.errorInformation && (processPayment.processPaymentRes.errorInformation.reason === 'AVS_FAILED' || ((processPayment.processPaymentRes.errorInformation.reason === 'DECISION_PROFILE_REJECT') && !(processPayment.processPaymentRes.paymentInformation && processPayment.processPaymentRes.paymentInformation.scheme && processPayment.processPaymentRes.paymentInformation.scheme.includes('CREDIT'))))) {
            let reverseAuth = await self.cyberSourceServices.reverseAuthorisation(processPayment.processPaymentRes.id, transactionInfo.transactionToken, cardTransaction.amount, wallet.operatorWalletMID, playerNonGamblingMid);
            if (reverseAuth) {
              let processorRequest = (cardTransaction.paymentProviderRequest ? cardTransaction.paymentProviderRequest.substring(cardTransaction.paymentProviderRequest.indexOf('authorisationAndConsumerAuthentication')) : '') + ' ' + reverseAuth.reqStringified;
              let processorResponse = (cardTransaction.paymentProviderResponse ? cardTransaction.paymentProviderResponse.substring(cardTransaction.paymentProviderResponse.indexOf('authorisationAndConsumerAuthenticationResponse')) : '') + ' ' + reverseAuth.resStringified;

              await self.db.updateProcessorRequestResponse(request.body.transactionToken, processorRequest, processorResponse, request);
              await self.cyberSourceCompletePayment(request, response, processPayment, paymentToken, transactionInfo, playerNonGamblingMid);
            } else {
              var paymentProcessorResponse = cardTransaction.paymentProviderResponse;
              let failureCause = {
                reason: 'paymentTakenError',
                message: "error reversing authorisation"
              }
              await self.logFailedTransaction(paymentProcessorResponse, transactionInfo.transactionToken, 'failed', request, response, 'update', failureCause);
              return;
            }
          } else {
            await self.cyberSourceCompletePayment(request, response, processPayment, paymentToken, transactionInfo, playerNonGamblingMid);
          }
        }
      }
    } else {
      var paymentProcessorResponse = cardTransaction.paymentProviderResponse;
      let failureCause = {
        reason: 'error',
        message: "error authorising payment"
      }
      await self.logFailedTransaction(paymentProcessorResponse, request.body.transactionToken, 'failed', request, response, 'update', failureCause);
      return;
    }
  }

  //NOT USED IN V3
  /**
   * render page to post back from 3DS iframe to parent
   * needed this as otherwise payment result pages were being rendered inside iframe
   * @param {*} request
   * @param {*} response
   */
  async validateAuthenticationResult(request, response) {
    console.log('validateAuthenticationResult: ' + JSON.stringify(request.body));
    let allConfigOptions = await self.db.getAllConfigurationOptions(request);
    response.renderToSend = {
      pageToRender: 'cyberSourceComplete3DSAuthentication',
      dataForPage: {
        data: btoa(JSON.stringify(request.body)),
        origin: allConfigOptions.authenticationServiceUrl
      }
    }
  }

  //NOT USED IN V3
  /**
   * If 3DS authentication needed this completes the transaction
   * @param {*} request
   * @param {*} response
   */
  async completeValidateAuthenticationResult(request, response) {
    console.log('completeValidateAuthenticationResult');
    let data = atob(request.body.data);
    let dataParsed = JSON.parse(data);
    let transactionInfo = atob(dataParsed.MD);
    let transactionInfoParsed = JSON.parse(transactionInfo);
    console.log(transactionInfo);
    let cardTransaction = await self.db.getCardTransactionByToken(transactionInfoParsed.transactionToken, request);
    let wallet = await self.db.getWallet(cardTransaction.walletToken, request);
    let addressDetails = await self.db.getPlayerAddress(cardTransaction.playerToken, request); //TODO get address details for player
    let playerAccount = await self.db.getPlayerAccount(cardTransaction.playerToken);
    let playerNonGamblingMid = (!playerAccount.ageVerifiedTime || playerAccount.ageVerifiedTime && self.config.getBlockedCountryCodeList().includes(playerAccount.playerAddressCountry) ? true : false);

    let processPayment = await self.cyberSourceServices.processPayment(request, cardTransaction.amount, cardTransaction.currencyCode, addressDetails, transactionInfoParsed.paymentToken, transactionInfoParsed.transientToken, dataParsed.TransactionId, transactionInfoParsed.transactionToken, false, transactionInfoParsed.newCard, wallet.operatorWalletMID, playerNonGamblingMid);

    if (processPayment) {

      let processorRequest = (cardTransaction.paymentProviderRequest ? cardTransaction.paymentProviderRequest.substring(cardTransaction.paymentProviderRequest.indexOf('authorisationAndConsumerAuthentication')) : '') + ' ' + processPayment.reqStringified;
      let processorResponse = (cardTransaction.paymentProviderResponse ? cardTransaction.paymentProviderResponse.substring(cardTransaction.paymentProviderResponse.indexOf('authorisationAndConsumerAuthenticationResponse')) : '') + ' ' + processPayment.resStringified;

      await self.db.updateProcessorRequestResponse(transactionInfoParsed.transactionToken, processorRequest, processorResponse, request);

      let paymentToken;
      if (processPayment.processPaymentRes.tokenInformation && processPayment.processPaymentRes.tokenInformation.paymentInstrument) {
        paymentToken = processPayment.processPaymentRes.tokenInformation.paymentInstrument.id;
      } else {
        paymentToken = transactionInfoParsed.paymentToken;
      }

      if (processPayment.processPaymentRes.status === 'AUTHORIZED') {

        if (processPayment.processPaymentRes.consumerAuthenticationInformation && (processPayment.processPaymentRes.consumerAuthenticationInformation.indicator === 'vbv' || processPayment.processPaymentRes.consumerAuthenticationInformation.indicator === 'vbv_attempted' || processPayment.processPaymentRes.consumerAuthenticationInformation.indicator === 'spa')) {

          let updateCardToken = true;
          if (transactionInfoParsed.transientToken && transactionInfoParsed.expiryDate) {
            let decodedExpiryDate = await self.cyberSourceServices.decodeMessage(transactionInfoParsed.expiryDate);
            if (decodedExpiryDate) {
              updateCardToken = await self.cyberSourceServices.updateToken(paymentToken, decodedExpiryDate, wallet.operatorWalletMID, playerNonGamblingMid);
            } else {
              updateCardToken = false;
            }
          }

          let cardDetails = await self.cyberSourceServices.getCardDetails(cardTransaction.playerToken, paymentToken, wallet.operatorWalletMID, playerNonGamblingMid);
          if (cardDetails && updateCardToken) {
            let capturePayment = await self.cyberSourceServices.completePayment(processPayment.processPaymentRes.id, transactionInfoParsed.transactionToken, cardTransaction.amount, cardTransaction.currencyCode, wallet.operatorWalletMID, playerNonGamblingMid);
            cardTransaction = await self.db.getCardTransactionByToken(transactionInfoParsed.transactionToken, request);
            if (capturePayment) {
              let processorRequest = (cardTransaction.paymentProviderRequest ? cardTransaction.paymentProviderRequest.substring(cardTransaction.paymentProviderRequest.indexOf('authorisationAndValidateAuth')) : '') + ' ' + capturePayment.reqStringified;
              let processorResponse = (cardTransaction.paymentProviderResponse ? cardTransaction.paymentProviderResponse.substring(cardTransaction.paymentProviderResponse.indexOf('authorisationAndValidateAuthResponse')) : '') + ' ' + capturePayment.resStringified;

              await self.db.updateProcessorRequestResponse(transactionInfoParsed.transactionToken, processorRequest, processorResponse, request);
              await self.cyberSourceCompletePayment(request, response, processPayment, paymentToken, transactionInfoParsed, playerNonGamblingMid, capturePayment, cardDetails);
            } else {

              let reverseAuth = await self.cyberSourceServices.reverseAuthorisation(processPayment.processPaymentRes.id, transactionInfoParsed.transactionToken, cardTransaction.amount, wallet.operatorWalletMID, playerNonGamblingMid);
              let paymentProcessorResponse = cardTransaction.paymentProviderResponse + ' ' + (reverseAuth ? reverseAuth.resStringified : '');
              let failureCause = {
                reason: (reverseAuth ? 'error' : 'paymentTakenError'),
                message: (reverseAuth ? "error capturing payment" : "error reversing authorisation")
              }
              await self.logFailedTransaction(paymentProcessorResponse, transactionInfoParsed.transactionToken, 'failed', request, response, 'update', failureCause);
              return;
            }
          } else {
            let reverseAuth = await self.cyberSourceServices.reverseAuthorisation(processPayment.processPaymentRes.id, transactionInfoParsed.transactionToken, cardTransaction.amount, wallet.operatorWalletMID, playerNonGamblingMid);
            let paymentProcessorResponse = cardTransaction.paymentProviderResponse.substring(cardTransaction.paymentProviderResponse.indexOf('authorisationAndValidateAuthResponse')) + ' ' + (reverseAuth ? reverseAuth.resStringified : '');
            let failureCause = {
              reason: (reverseAuth ? 'declined' : 'paymentTakenError'),
              message: (reverseAuth ? "unable to retrieve card details" : "error reversing authorisation")
            }
            await self.logFailedTransaction(paymentProcessorResponse, transactionInfoParsed.transactionToken, 'failed', request, response, 'update', failureCause);
            return;
          }
        } else {
          let reverseAuth = await self.cyberSourceServices.reverseAuthorisation(processPayment.processPaymentRes.id, transactionInfoParsed.transactionToken, cardTransaction.amount, wallet.operatorWalletMID, playerNonGamblingMid);
          let paymentProcessorResponse = cardTransaction.paymentProviderResponse.substring(cardTransaction.paymentProviderResponse.indexOf('authorisationAndValidateAuthResponse')) + ' ' + (reverseAuth ? reverseAuth.resStringified : '');
          let failureCause = {
            reason: (reverseAuth ? 'declined' : 'paymentTakenError'),
            message: (reverseAuth ? "no liability shift" : "error reversing authorisation")
          }
          await self.logFailedTransaction(paymentProcessorResponse, transactionInfoParsed.transactionToken, 'failed', request, response, 'update', failureCause);
          return;
        }
      } else {

        if (processPayment.processPaymentRes.errorInformation && (processPayment.processPaymentRes.errorInformation.reason === 'AVS_FAILED' || ((processPayment.processPaymentRes.errorInformation.reason === 'DECISION_PROFILE_REJECT') && !(processPayment.processPaymentRes.paymentInformation && processPayment.processPaymentRes.paymentInformation.scheme && processPayment.processPaymentRes.paymentInformation.scheme.includes('CREDIT'))))) {
          let reverseAuth = await self.cyberSourceServices.reverseAuthorisation(processPayment.processPaymentRes.id, transactionInfoParsed.transactionToken, cardTransaction.amount, wallet.operatorWalletMID, playerNonGamblingMid);
          if (reverseAuth) {
            let processorRequest = (cardTransaction.paymentProviderRequest ? cardTransaction.paymentProviderRequest.substring(cardTransaction.paymentProviderRequest.indexOf('authorisationAndValidateAuth')) : '') + ' ' + reverseAuth.reqStringified;
            let processorResponse = (cardTransaction.paymentProviderResponse ? cardTransaction.paymentProviderResponse.substring(cardTransaction.paymentProviderResponse.indexOf('authorisationAndValidateAuthResponse')) : '') + ' ' + reverseAuth.resStringified;

            await self.db.updateProcessorRequestResponse(transactionInfoParsed.transactionToken, processorRequest, processorResponse, request);
            await self.cyberSourceCompletePayment(request, response, processPayment, paymentToken, transactionInfoParsed, playerNonGamblingMid);
          } else {
            var paymentProcessorResponse = cardTransaction.paymentProviderResponse;
            let failureCause = {
              reason: 'paymentTakenError',
              message: "error reversing authorisation"
            }
            await self.logFailedTransaction(paymentProcessorResponse, transactionInfoParsed.transactionToken, 'failed', request, response, 'update', failureCause);
            return;
          }
        } else {
          await self.cyberSourceCompletePayment(request, response, processPayment, paymentToken, transactionInfoParsed, playerNonGamblingMid);
        }
      }

    } else {
      var paymentProcessorResponse = cardTransaction.paymentProviderResponse;
      let failureCause = {
        reason: 'error',
        message: "error authorising payment"
      }
      await self.logFailedTransaction(paymentProcessorResponse, transactionInfoParsed.transactionToken, 'failed', request, response, 'update', failureCause);
      return;
    }
  }

  //NOT USED IN V3
  /**
   * completes the cybersource payment flow
   * @param {*} request
   * @param {*} response
   * @param {*} paymentData
   * @param {*} paymentToken
   * @param {*} transactionInfo
   */
  async cyberSourceCompletePayment(request, response, paymentData, paymentToken, transactionInfo, playerNonGamblingMid, capturePayment, cardDetails) {
    console.log('cybersourceCompletePayment');

    let transactionToken = transactionInfo.transactionToken;

    var cardTransaction = await self.db.getCardTransactionByToken(transactionToken, request);
    var playerToken = cardTransaction.playerToken;
    //gets wallet data to retrieve processorName
    let wallet = await self.db.getWallet(cardTransaction.walletToken, request);

    // Sanity check the transaction in the DB is in the state we expect it to be.
    // These are logged as warnings because cybersource has taken the payment, so we must complete our transaction even if something seems wrong.
    if (cardTransaction.paymentProcessor != wallet.processorName) {
      console.log("ERROR: Expected paymentProcessor to be " + wallet.processorName + " in: " + JSON.stringify(cardTransaction));
    }
    if (cardTransaction.eftPaymentId != null) {
      console.log("ERROR: Expected eftPaymentId to be null in: " + JSON.stringify(cardTransaction));
    }
    if (cardTransaction.paymentProviderTimestamp != null) {
      console.log("ERROR: Expected paymentProviderTimestamp to be null in: " + JSON.stringify(cardTransaction));
    }
    if (cardTransaction.serviceStatus != 'pending') {
      console.log("ERROR: Expected serviceStatus to be 'pending' in: " + JSON.stringify(cardTransaction));
    }
    if (cardTransaction.serviceTimestampStart < Date.now() - (15 * 60 * 1000)) {
      console.log("ERROR: Expected Start to be less than 15 minutes ago in: " + JSON.stringify(cardTransaction));
    }

    let paymentProcessorRequest = cardTransaction.paymentProviderRequest;
    let paymentProcessorResponse = cardTransaction.paymentProviderResponse;

    //only set card active/store card in database if transaction successful
    if (paymentData.processPaymentRes.status === 'AUTHORIZED' && (capturePayment && capturePayment.capturePaymentRes.status === 'PENDING')) {

      var paymentCard;

      var paymentCardExpiryDate = cardDetails.card.expirationMonth + cardDetails.card.expirationYear.substring(2) //concat cybersource card month/year
      let cardPanStar = cardDetails._embedded.instrumentIdentifier.card.number.substring(0, 1) + '****' + cardDetails._embedded.instrumentIdentifier.card.number.substring(12);
      paymentCard = await self.db.getCardByMerchantTokenId(cardDetails._embedded.instrumentIdentifier.id, request);
      var firstTransaction = await self.db.isFirstTransaction(cardTransaction.walletToken, request);
      if (paymentCard && !firstTransaction) {
        if (cardTransaction.cardToken && paymentCard.cardToken !== cardTransaction.cardToken) {
          console.log("ERROR: unexpected MerchantTokenId '" + paymentCard.cardToken + "' in OptoRes. Payment card: " + JSON.stringify(paymentCard) + ", cardTransaction: " + JSON.stringify(cardTransaction));
        }
        if (cardPanStar && paymentCard.cardPanStar !== cardPanStar) {
          console.log("ERROR: Expected cardPanStar to be '" + cardPanStar + "' in: " + JSON.stringify(paymentCard));
        }
        if (paymentCard.cardExpiryMmyy !== paymentCardExpiryDate) {
          //updating expiry date for card in database
          await self.db.updateCardExpiry(paymentCard.cardToken, paymentCardExpiryDate, request);
        }
        self.db.setCardActive(paymentCard.cardToken, cardTransaction.playerToken, paymentToken, request);
        await self.db.updateAccountStatus(cardTransaction.playerToken, "Active", request);
      } else {
        // Store the payments card's details in our DB
        let status;
        //TODO get proper token that will be in live, or can we just use the same as testing?
        if (firstTransaction && wallet.operatorWalletToken === '992f6a9d-9209-11eb-b758-065ea351134e') {
          var newCard = await self.db.checkCardUniqueToOperatorWallet(cardDetails._embedded.instrumentIdentifier.id, wallet.operatorWalletToken, request);
          if (!newCard) {
            status = 'FirstCardRegistered';
          } else {
            status = 'Active';
          }
        } else {
          status = 'Active';
        }

        await self.db.updateAccountStatus(cardTransaction.playerToken, status, request);

        let processorToken = await self.db.getSpecificProcessorToken('CyberSource', request);

        paymentCard = {
          merchantTokenId: cardDetails._embedded.instrumentIdentifier.id,
          userPaymentId: paymentToken,
          cardPanStar: cardPanStar,
          cardSchemeId: null,
          cardExpiryMmyy: paymentCardExpiryDate,
          processorToken: processorToken
        }
        await self.db.addCard(paymentCard, cardTransaction.playerToken, paymentToken, request);

        //get the updated paymentCard with the cardToken
        paymentCard = await self.db.getCardByMerchantTokenId(cardDetails._embedded.instrumentIdentifier.id, request);
      }




      // If it was a successful card payment, then add the money to the wallet.
      await self.db.increaseWalletBalance(cardTransaction.amount, cardTransaction.walletToken, request);

      wallet = await self.db.getWallet(cardTransaction.walletToken, request);
      var newWalletBalance = wallet.walletBalance;
      console.log("newWalletBalance=" + newWalletBalance);
    }
    var processorTimestamp;
    if (capturePayment) {
      processorTimestamp = new Date(capturePayment.capturePaymentRes.submitTimeUtc);
    } else {
      processorTimestamp = new Date(paymentData.processPaymentRes.submitTimeUtc);
    }
    // Update the pending cardTransaction
    var txnDetails = {
      cardToken: (paymentCard ? paymentCard.cardToken : null),
      eftPaymentId: (capturePayment ? capturePayment.capturePaymentRes.id : paymentData.processPaymentRes.id),
      eftResponseCode: null,
      paymentProviderErrorCode: null,
      paymentProviderStatus: paymentData.processPaymentRes.status,
      paymentProviderMessage: (capturePayment ? (capturePayment.capturePaymentRes.errorInformation ? capturePayment.capturePaymentRes.errorInformation.reason : paymentData.processPaymentRes.status) : (paymentData.processPaymentRes.errorInformation ? paymentData.processPaymentRes.errorInformation.reason : paymentData.processPaymentRes.status)),
      paymentProviderRequest: paymentProcessorRequest,
      paymentProviderResponse: paymentProcessorResponse,
      paymentProviderTimestamp: processorTimestamp.getTime(),
      serviceStatus: (paymentData.processPaymentRes.status === 'AUTHORIZED' && (capturePayment && capturePayment.capturePaymentRes.status === 'PENDING') ? 'complete' : 'failed'),
      serviceCompletionCode: 0,
      serviceTimestampEnd: request.serviceTimestamp,
      transactionToken: cardTransaction.transactionToken
    }
    await self.db.updateCardTransaction(txnDetails, request);

    wallet = await self.db.getWallet(cardTransaction.walletToken, request);

    var pageToRender;
    if (paymentData.processPaymentRes.status === 'AUTHORIZED' && (capturePayment && capturePayment.capturePaymentRes.status === 'PENDING')) {
      pageToRender = 'paymentComplete';
    } else if (paymentData.processPaymentRes.status === 'DECLINED' && (paymentData.processPaymentRes.paymentInformation && paymentData.processPaymentRes.paymentInformation.scheme && paymentData.processPaymentRes.paymentInformation.scheme.includes('CREDIT'))) {
      pageToRender = 'paymentFailedCreditCard';
    } else if (paymentData.processPaymentRes.status != 'AUTHORIZED' && (paymentData.processPaymentRes.status === '202' || (paymentData.processPaymentRes.processorInformation && paymentData.processPaymentRes.processorInformation.avs && paymentData.processPaymentRes.processorInformation.avs.code && paymentData.processPaymentRes.processorInformation.avs.code === 'A')
      || (paymentData.processPaymentRes.processorInformation && paymentData.processPaymentRes.processorInformation.avs && paymentData.processPaymentRes.processorInformation.avs.code && paymentData.processPaymentRes.processorInformation.avs.code === 'B')
      || (paymentData.processPaymentRes.processorInformation && paymentData.processPaymentRes.processorInformation.avs && paymentData.processPaymentRes.processorInformation.avs.code && paymentData.processPaymentRes.processorInformation.avs.code === 'C')
      || (paymentData.processPaymentRes.processorInformation && paymentData.processPaymentRes.processorInformation.avs && paymentData.processPaymentRes.processorInformation.avs.code && paymentData.processPaymentRes.processorInformation.avs.code === 'N')
      || (paymentData.processPaymentRes.processorInformation && paymentData.processPaymentRes.processorInformation.avs && paymentData.processPaymentRes.processorInformation.avs.code && paymentData.processPaymentRes.processorInformation.avs.code === 'O'))) {
      pageToRender = 'paymentFailedAddressVerification';
    } else {
      pageToRender = 'paymentFailed';
    }

    var operatorStyle = JSON.parse(wallet.operatorStyle);

    response.renderToSend = {
      pageToRender: pageToRender,
      dataForPage: {
        logo: wallet.operatorWalletImage,
        txnAmount: cardTransaction.amount,
        walletBalance: wallet.walletBalance,
        six: operatorStyle.six,
        seven: operatorStyle.seven
      }
    }
  }

  //NOT USED IN V3
  //Cancels the transaction based on player action
  async cancelDepositFundsIntoWalletFromCard(request, response) {
    console.log('entered cancelDepositFundsIntoWalletFromCard');

    var errorMsg = self.validation.validateTransactionToken(request.body.transactionToken);

    if (errorMsg) {
      throw new Error(errorMsg);
    }
    console.log("  Request is valid");

    var cardTransaction = await self.db.getCardTransactionByToken(request.body.transactionToken, request);
    let wallet = await self.db.getWallet(cardTransaction.walletToken, request);

    var txnDetails = {
      paymentProviderMessage: request.body.cancelReason,
      serviceStatus: 'failed',
      serviceCompletionCode: 0,
      serviceTimestampEnd: request.serviceTimestamp,
      transactionToken: request.body.transactionToken
    }

    await self.db.cancelCardTransaction(txnDetails, request);

    var operatorStyle = JSON.parse(wallet.operatorStyle);

    response.renderToSend = {
      pageToRender: (request.body.cancelReason === 'Cancelled By Player' ? 'paymentCancelled' : (request.body.cancelReason === 'transactionTimeout' ? 'paymentTimeout' : 'paymentError')),
      dataForPage: {
        logo: wallet.operatorWalletImage,
        walletBalance: wallet.walletBalance,
        six: operatorStyle.six,
        seven: operatorStyle.seven
      }
    }
  }

  //NOT USED IN V3
  async addOperatorWallet(request, response) {
    console.log('addOperatorWallet entered');

    var playerToken = request.body.playerToken;
    var playerDeviceToken = request.body.playerDeviceToken;
    var operatorWalletToken = request.body.operatorWalletToken;
    var optInMarketing = (request.body.optInMarketing ? 1 : 0);
    var setDefaultWallet = (request.body.setDefaultWallet ? 1 : 0);

    var errorMsg = self.validation.validatePlayerToken(playerToken)
      || self.validation.validateDeviceToken(playerDeviceToken)
      || self.validation.validateWalletToken(operatorWalletToken);

    if (errorMsg) {
      throw new Error(errorMsg);
    }

    var operatorWallet = await self.db.getOperatorWallet(operatorWalletToken, request);

    let wallet = await self.db.getWalletFromOperatorToken(operatorWalletToken, playerToken);
    if (wallet) {
      await self.completionServices.sendFailResponse(request, response, self.completionServices.completionCodes.WALLET_ALREADY_CREATED);
      return;
    }

    var walletToken = uuidv4();

    //gets the processor token to assign to a wallet
    var processorToken = await self.db.getLatestProcessorToken(request);

    //Create a wallet for the player
    var status = 1; //1 means wallet is active
    await self.db.createWallet(playerToken, walletToken, processorToken, operatorWallet.operatorWalletToken, operatorWallet.operatorWalletCurrency, status, optInMarketing, request);

    //update wallet details in gamingSpendLimits
    await self.db.updateWalletDetInGamingSpendLimits(playerToken, walletToken, operatorWallet.operatorDefaultGamingSpendLimitWeekly, request);

    if (setDefaultWallet) {
      await self.db.updateDefaultWallet(playerToken, walletToken, request);
    }

    delete operatorWallet.operatorWalletMID;

    let additionalProperties = {
      operatorWallet: operatorWallet
    }

    await self.completionServices.sendOkResponse(request, response, additionalProperties);
  }

  //NOT USED IN V3
  lightenDarkenColor(color, amount) {
    return '#' + color.replace(/^#/, '').replace(/../g, color => ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
  }


  /*********************************************************************
   *
   * V3 Methods for React Native
   ******************************************************************/
  //if error before transaction finishes then this updates the cardTransaction table
  async logFailedTransactionV3(b64optores, transactionToken, serviceStatus, request, response, operation, cause, colourScheme) {
    await self.db.declareFailedCardTransaction({
      paymentProviderResponse: b64optores,
      serviceStatus: serviceStatus,
      transactionToken: transactionToken,
      cause
    }, request, operation);

    const cardTransaction = await self.db.getCardTransactionByToken(transactionToken, request);
    const wallet = await self.db.getWallet(cardTransaction.walletToken, request);

    const operatorStyle = JSON.parse(await self.db.getOperatorWalletStyleV3(wallet.operatorWalletToken));
    const operatorStyleColourScheme = colourScheme && colourScheme === 'dark' ? operatorStyle.darkMode : operatorStyle.lightMode

    let pageToRender;
    if (cause && cause.reason === 'declined') {
      pageToRender = 'v3paymentFailed';
    } else if (cause && cause.reason === 'paymentTakenError') {
      pageToRender = 'v3SignatureVerificationFailed';
    } else {
      pageToRender = 'v3paymentError';
    }
    response.renderToSend = {
      pageToRender: pageToRender,
      dataForPage: {
        currencySymbol: self.getCurrencySymbol(wallet.walletBalanceCurrencyCode),
        logo: operatorStyleColourScheme.operatorWalletImage,
        transactionToken: transactionToken,
        walletBalance: (wallet ? wallet.walletBalance : null),
        background: operatorStyleColourScheme.background,
        text: operatorStyleColourScheme.text
      }
    }
  }

  /**
   * Render cybersource payment page if required
   * @param {*} request
   * @param {*} response
   */
  async renderCyberSourcePaymentPageV3(request, response) {
    console.log("==>renderCyberSourcePaymentPageV3");

    const decrypt = atob(request.body.OptoReq);
    const decryptArray = decrypt.split('|');

    const verifyMessage = await self.cyberSourceServices.verifyMessage(request.body.OptoHmac, decrypt);

    const cardTransaction = await self.db.getCardTransactionByToken(decryptArray[0], request);
    const wallet = await self.db.getWallet(cardTransaction.walletToken, request);
    const operatorStyle = JSON.parse(await self.db.getOperatorWalletStyleV3(wallet.operatorWalletToken));

    //if message fails to decrypt we don't know whether light or dark so just setting to light
    if (!verifyMessage) {
      response.renderToSend = {
        pageToRender: 'v3SignatureVerificationFailed',
        dataForPage: {
          logo: operatorStyle.lightMode.operatorWalletImage,
          background: operatorStyle.lightMode.background,
          text: operatorStyle.lightMode.text
        }
      }
      return;
    }

    const transactionToken = decryptArray[0];
    const captureContext = decryptArray[1];
    const amount = decryptArray[2];
    const timeoutMinutes = decryptArray[3];
    const userToken = decryptArray[4];
    const colourScheme = decryptArray[5];
    const paymentCard = decryptArray[6];


    let expiredCard = false;
    let card;
    if (paymentCard) {
      card = await self.db.getActiveCardForPlayer(userToken, request);

      let date = new Date();
      let dateMonth = date.getMonth() + 2;
      let dateYear = date.getFullYear() % 100;

      if (dateMonth < 10) {
        dateMonth = '0' + dateMonth;
      }

      const cardExpiryMonth = card.cardExpiryMmyy.substring(0, 2);
      const cardExpiryYear = card.cardExpiryMmyy.substring(2);

      if (cardExpiryYear < dateYear || (cardExpiryYear == dateYear && cardExpiryMonth <= dateMonth)) {
        console.log('players card has expired');
        expiredCard = true;
      }
    }

    let pageToRender;

    if (!paymentCard) {
      pageToRender = 'v3cyberSourcePaymentFormNewCard'
    } else {
      pageToRender = 'v3cyberSourcePaymentFormExistingCard'
    }

    const operatorStyleColourScheme = colourScheme && colourScheme === 'dark' ? operatorStyle.darkMode : operatorStyle.lightMode

    const placeholderTextColour = self.lightenDarkenColorV3(operatorStyleColourScheme.text, 100);
    response.renderToSend = {
      pageToRender: pageToRender,
      dataForPage: {
        currencySymbol: self.getCurrencySymbol(wallet.walletBalanceCurrencyCode),
        logo: operatorStyleColourScheme.operatorWalletImage,
        acceptedPaymentLogos: self.config.ACCEPTED_PAYMENT_LOGOS_URL,
        transactionToken: transactionToken,
        captureContext: captureContext,
        amount: amount,
        timeoutMinutes: timeoutMinutes,
        two: operatorStyleColourScheme.two,
        five: operatorStyleColourScheme.five,
        background: operatorStyleColourScheme.background,
        text: operatorStyleColourScheme.text,
        errorMessage: operatorStyleColourScheme.errorMessage,
        buttonText: operatorStyleColourScheme.buttonText,
        placeholder: placeholderTextColour,
        paymentCard: paymentCard,
        activeCardToken: (paymentCard ? card.cardPanStar : null),
        expiredCard: expiredCard,
        colourScheme: colourScheme
      }
    }
  }

  /**
   * render cybersource device data collection page
   * @param {*} request
   * @param {*} response
   * @param {*} transactionInfo
   */
  async cyberSourceDeviceDataCollectionV3(request, response, transactionInfo) {
    console.log("==>configure3dsSecurityCyberSourceV3");

    //TODO check if need to verify token returned

    let verifyToken;
    let paymentToken;
    let transientToken;
    let transactionToken;
    let newCard = false;
    let expiryDate;
    if (!request.body.transientToken) {
      verifyToken = self.cyberSourceServices.verifyJwtToken(request.body.paymentToken, request.body.captureContext);
      let paymentTokenDecoded = await jwt.decode(request.body.paymentToken);
      paymentToken = paymentTokenDecoded.jti;
      transactionToken = request.body.transactionToken;
      newCard = true;
    } else {
      verifyToken = self.cyberSourceServices.verifyJwtToken(request.body.transientToken, request.body.captureContext);
      let transientTokenDecoded = await jwt.decode(request.body.transientToken);
      transientToken = transientTokenDecoded.jti;
      paymentToken = request.body.paymentCard;
      transactionToken = request.body.transactionToken;
      if (transientTokenDecoded.data && transientTokenDecoded.data.expirationMonth && transientTokenDecoded.data.expirationYear) {
        expiryDate = {
          expirationMonth: transientTokenDecoded.data.expirationMonth,
          expirationYear: transientTokenDecoded.data.expirationYear
        }

        expiryDate = self.cyberSourceServices.hashMessage(JSON.stringify(expiryDate));
      }
    }

    if (verifyToken) {

      let cardTransaction = await self.db.getCardTransactionByToken(transactionToken, request);
      let wallet = await self.db.getWallet(cardTransaction.walletToken, request);

      let playerAccount = await self.db.getPlayerAccount(cardTransaction.playerToken);
      let playerNonGamblingMid = (!playerAccount.ageVerifiedTime || playerAccount.ageVerifiedTime && !self.config.getAllowedCountryCodeList().includes(playerAccount.playerAddressCountry) ? true : false);

      let payerAuthCheck = await self.cyberSourceServices.setupPayerAuth(paymentToken, transientToken, transactionToken, newCard, wallet.operatorWalletMID, playerNonGamblingMid);
      console.log(JSON.stringify(payerAuthCheck));

      if (payerAuthCheck && payerAuthCheck.setupPayerAuthRes.consumerAuthenticationInformation && payerAuthCheck.setupPayerAuthRes.consumerAuthenticationInformation.accessToken) {

        let processorRequest = (cardTransaction.paymentProviderRequest ? cardTransaction.paymentProviderRequest : '') + ' ' + payerAuthCheck.reqStringified;
        let processorResponse = (cardTransaction.paymentProviderResponse ? cardTransaction.paymentProviderResponse : '') + ' ' + payerAuthCheck.resStringified;
        await self.db.updateProcessorRequestResponse(transactionToken, processorRequest, processorResponse, request)

        const operatorStyle = JSON.parse(await self.db.getOperatorWalletStyleV3(wallet.operatorWalletToken));
        const operatorStyleColourScheme = request.body.colourScheme && request.body.colourScheme === 'dark' ? operatorStyle.darkMode : operatorStyle.lightMode;

        response.renderToSend = {
          pageToRender: 'v3cyberSourceDeviceDataCollection',
          dataForPage: {
            logo: operatorStyleColourScheme.operatorWalletImage,
            deviceDataCollectioneEventOriginUrl: self.cyberSourceServices.DEVICE_DATA_COLLECTION_EVENT_ORIGIN_URL,
            accessToken: payerAuthCheck.setupPayerAuthRes.consumerAuthenticationInformation.accessToken,
            deviceDataCollectionUrl: payerAuthCheck.setupPayerAuthRes.consumerAuthenticationInformation.deviceDataCollectionUrl,
            paymentToken: paymentToken,
            transientToken: transientToken,
            transactionToken: transactionToken,
            expiryDate: expiryDate,
            referenceId: payerAuthCheck.setupPayerAuthRes.consumerAuthenticationInformation.referenceId,
            newCard: newCard,
            background: operatorStyleColourScheme.background,
            text: operatorStyleColourScheme.text,
            colourScheme: request.body.colourScheme
          }
        }
      } else {
        var paymentProcessorResponse = cardTransaction.paymentProviderResponse;
        let failureCause = {
          reason: 'error',
          message: "error setting up payerAuth"
        }
        await self.logFailedTransactionV3(paymentProcessorResponse, transactionToken, 'failed', request, response, 'update', failureCause, request.body.colourScheme);
        return;
      }
    }
  }

  /**
   * check if player enrolled in 3DS and needs authentication window, if so render 3DS page, if not process the payment
   * @param {*} request
   * @param {*} response
   */
  async processPaymentAndConsumerAuthenticationV3(request, response) {
    console.log("==>processPaymentAndConsumerAuthenticationV3" + JSON.stringify(request.body));

    let cardTransaction = await self.db.getCardTransactionByToken(request.body.transactionToken, request);
    let addressDetails = await self.db.getPlayerAddress(cardTransaction.playerToken, request); //TODO get address details for player
    let allConfigOptions = await self.db.getAllConfigurationOptions(request);
    let wallet = await self.db.getWallet(cardTransaction.walletToken, request);
    let playerAccount = await self.db.getPlayerAccount(cardTransaction.playerToken);
    let playerNonGamblingMid = (!playerAccount.ageVerifiedTime || playerAccount.ageVerifiedTime && !self.config.getAllowedCountryCodeList().includes(playerAccount.playerAddressCountry) ? true : false);

    let eventData = JSON.parse(request.body.eventData);

    let processPayment = await self.cyberSourceServices.processPayment(request, cardTransaction.amount, cardTransaction.currencyCode, addressDetails, request.body.paymentToken, request.body.transientToken, eventData.SessionId, request.body.transactionToken, true, request.body.newCard, wallet.operatorWalletMID, playerNonGamblingMid);

    if (processPayment) {
      let processorRequest = (cardTransaction.paymentProviderRequest ? cardTransaction.paymentProviderRequest.substring(cardTransaction.paymentProviderRequest.indexOf('setupPayerAuth')) : '') + ' ' + processPayment.reqStringified;
      let processorResponse = (cardTransaction.paymentProviderResponse ? cardTransaction.paymentProviderResponse.substring(cardTransaction.paymentProviderResponse.indexOf('setupPayerAuthResponse')) : '') + ' ' + processPayment.resStringified;

      await self.db.updateProcessorRequestResponse(request.body.transactionToken, processorRequest, processorResponse, request);

      let transactionInfo = {
        paymentToken: request.body.paymentToken,
        transientToken: (request.body.transientToken ? request.body.transientToken : null),
        transactionToken: request.body.transactionToken,
        expiryDate: (request.body.expiryDate ? request.body.expiryDate : null),
        newCard: request.body.newCard,
        colourScheme: request.body.colourScheme
      }

      if (processPayment.processPaymentRes.status === 'PENDING_AUTHENTICATION') {
        console.log('transaction requires authentication');

        const operatorStyle = JSON.parse(await self.db.getOperatorWalletStyleV3(wallet.operatorWalletToken));
        const operatorStyleColourScheme = request.body.colourScheme && request.body.colourScheme === 'dark' ? operatorStyle.darkMode : operatorStyle.lightMode;

        let transactionInfoStringified = btoa(JSON.stringify(transactionInfo));
        response.renderToSend = {
          pageToRender: 'v3cyberSourcePayment3DSAuthentication',
          dataForPage: {
            logo: operatorStyleColourScheme.operatorWalletImage,
            stepUpUrl: processPayment.processPaymentRes.consumerAuthenticationInformation.stepUpUrl,
            accessToken: processPayment.processPaymentRes.consumerAuthenticationInformation.accessToken,
            origin: allConfigOptions.authenticationServiceUrl,
            //sending transactionToken seperate as well as below so that can be used if message posted back
            //from iframe not from expected origin can fail the transaction
            transactionToken: request.body.transactionToken,
            transactionInfo: transactionInfoStringified,
            background: operatorStyleColourScheme.background,
            text: operatorStyleColourScheme.text,
            colourScheme: request.body.colourScheme
          }
        }

      } else {
        console.log('transaction has either succeded or failed without the need for authentication');
        let paymentToken;
        if (processPayment.processPaymentRes.tokenInformation && processPayment.processPaymentRes.tokenInformation.paymentInstrument) {
          paymentToken = processPayment.processPaymentRes.tokenInformation.paymentInstrument.id;
        } else {
          paymentToken = transactionInfo.paymentToken;
        }

        if (processPayment.processPaymentRes.status === 'AUTHORIZED') {
          if (processPayment.processPaymentRes.consumerAuthenticationInformation && (processPayment.processPaymentRes.consumerAuthenticationInformation.ecommerceIndicator === 'vbv' || processPayment.processPaymentRes.consumerAuthenticationInformation.ecommerceIndicator === 'vbv_attempted' || processPayment.processPaymentRes.consumerAuthenticationInformation.ecommerceIndicator === 'spa')) {

            let updateCardToken = true;
            if (transactionInfo.transientToken && transactionInfo.expiryDate) {
              let decodedExpiryDate = await self.cyberSourceServices.decodeMessage(transactionInfo.expiryDate);
              if (decodedExpiryDate) {
                updateCardToken = await self.cyberSourceServices.updateToken(paymentToken, decodedExpiryDate, wallet.operatorWalletMID, playerNonGamblingMid);
              } else {
                updateCardToken = false;
              }
            }

            let cardDetails = await self.cyberSourceServices.getCardDetails(cardTransaction.playerToken, paymentToken, wallet.operatorWalletMID, playerNonGamblingMid);
            if (cardDetails && updateCardToken) {
              let capturePayment = await self.cyberSourceServices.completePayment(processPayment.processPaymentRes.id, transactionInfo.transactionToken, cardTransaction.amount, cardTransaction.currencyCode, wallet.operatorWalletMID, playerNonGamblingMid);
              cardTransaction = await self.db.getCardTransactionByToken(transactionInfo.transactionToken, request);
              if (capturePayment) {
                let processorRequest = (cardTransaction.paymentProviderRequest ? cardTransaction.paymentProviderRequest.substring(cardTransaction.paymentProviderRequest.indexOf('authorisationAndConsumerAuthentication')) : '') + ' ' + capturePayment.reqStringified;
                let processorResponse = (cardTransaction.paymentProviderResponse ? cardTransaction.paymentProviderResponse.substring(cardTransaction.paymentProviderResponse.indexOf('authorisationAndConsumerAuthenticationResponse')) : '') + ' ' + capturePayment.resStringified;

                await self.db.updateProcessorRequestResponse(request.body.transactionToken, processorRequest, processorResponse, request);
                await self.cyberSourceCompletePaymentV3(request, response, processPayment, paymentToken, transactionInfo, playerNonGamblingMid, capturePayment, cardDetails);
              } else {
                let reverseAuth = await self.cyberSourceServices.reverseAuthorisation(processPayment.processPaymentRes.id, transactionInfo.transactionToken, cardTransaction.amount, wallet.operatorWalletMID, playerNonGamblingMid);
                var paymentProcessorResponse = cardTransaction.paymentProviderResponse.substring(cardTransaction.paymentProviderResponse.indexOf('authorisationAndConsumerAuthenticationResponse')) + ' ' + (reverseAuth ? reverseAuth.resStringified : '');
                let failureCause = {
                  reason: (reverseAuth ? 'error' : 'paymentTakenError'),
                  message: (reverseAuth ? "error capturing payment" : "error reversing authorisation")
                }
                await self.logFailedTransactionV3(paymentProcessorResponse, transactionInfo.transactionToken, 'failed', request, response, 'update', failureCause, request.body.colourScheme);
                return;
              }
            } else {
              let reverseAuth = await self.cyberSourceServices.reverseAuthorisation(processPayment.processPaymentRes.id, transactionInfo.transactionToken, cardTransaction.amount, wallet.operatorWalletMID, playerNonGamblingMid);
              let paymentProcessorResponse = cardTransaction.paymentProviderResponse.substring(cardTransaction.paymentProviderResponse.indexOf('authorisationAndValidateAuthResponse')) + ' ' + (reverseAuth ? reverseAuth.resStringified : '');
              let failureCause = {
                reason: (reverseAuth ? 'declined' : 'paymentTakenError'),
                message: (reverseAuth ? "unable to retrieve card details" : "error reversing authorisation")
              }
              await self.logFailedTransactionV3(paymentProcessorResponse, transactionInfo.transactionToken, 'failed', request, response, 'update', failureCause, request.body.colourScheme);
              return;
            }
          } else {
            let reverseAuth = await self.cyberSourceServices.reverseAuthorisation(processPayment.processPaymentRes.id, transactionInfo.transactionToken, cardTransaction.amount, wallet.operatorWalletMID, playerNonGamblingMid);
            var paymentProcessorResponse = cardTransaction.paymentProviderResponse.substring(cardTransaction.paymentProviderResponse.indexOf('authorisationAndConsumerAuthenticationResponse')) + ' ' + (reverseAuth ? reverseAuth.resStringified : '');
            let failureCause = {
              reason: (reverseAuth ? 'declined' : 'paymentTakenError'),
              message: (reverseAuth ? "no liability shift" : "error reversing authorisation")
            }
            await self.logFailedTransactionV3(paymentProcessorResponse, transactionInfo.transactionToken, 'failed', request, response, 'update', failureCause, request.body.colourScheme);
            return;
          }
        } else {
          cardTransaction = await self.db.getCardTransactionByToken(transactionInfo.transactionToken, request);

          if (processPayment.processPaymentRes.errorInformation && (processPayment.processPaymentRes.errorInformation.reason === 'AVS_FAILED' || ((processPayment.processPaymentRes.errorInformation.reason === 'DECISION_PROFILE_REJECT') && !(processPayment.processPaymentRes.paymentInformation && processPayment.processPaymentRes.paymentInformation.scheme && processPayment.processPaymentRes.paymentInformation.scheme.includes('CREDIT'))))) {
            let reverseAuth = await self.cyberSourceServices.reverseAuthorisation(processPayment.processPaymentRes.id, transactionInfo.transactionToken, cardTransaction.amount, wallet.operatorWalletMID, playerNonGamblingMid);
            if (reverseAuth) {
              let processorRequest = (cardTransaction.paymentProviderRequest ? cardTransaction.paymentProviderRequest.substring(cardTransaction.paymentProviderRequest.indexOf('authorisationAndConsumerAuthentication')) : '') + ' ' + reverseAuth.reqStringified;
              let processorResponse = (cardTransaction.paymentProviderResponse ? cardTransaction.paymentProviderResponse.substring(cardTransaction.paymentProviderResponse.indexOf('authorisationAndConsumerAuthenticationResponse')) : '') + ' ' + reverseAuth.resStringified;

              await self.db.updateProcessorRequestResponse(request.body.transactionToken, processorRequest, processorResponse, request);
              await self.cyberSourceCompletePaymentV3(request, response, processPayment, paymentToken, transactionInfo, playerNonGamblingMid);
            } else {
              var paymentProcessorResponse = cardTransaction.paymentProviderResponse;
              let failureCause = {
                reason: 'paymentTakenError',
                message: "error reversing authorisation"
              }
              await self.logFailedTransactionV3(paymentProcessorResponse, transactionInfo.transactionToken, 'failed', request, response, 'update', failureCause, request.body.colourScheme);
              return;
            }
          } else {
            await self.cyberSourceCompletePaymentV3(request, response, processPayment, paymentToken, transactionInfo, playerNonGamblingMid);
          }
        }
      }
    } else {
      var paymentProcessorResponse = cardTransaction.paymentProviderResponse;
      let failureCause = {
        reason: 'error',
        message: "error authorising payment"
      }
      await self.logFailedTransactionV3(paymentProcessorResponse, request.body.transactionToken, 'failed', request, response, 'update', failureCause, request.body.colourScheme);
      return;
    }
  }

  /**
   * render page to post back from 3DS iframe to parent
   * needed this as otherwise payment result pages were being rendered inside iframe
   * @param {*} request
   * @param {*} response
   */
  async validateAuthenticationResultV3(request, response) {
    console.log("==>validateAuthenticationResultV3" + JSON.stringify(request.body));
    let allConfigOptions = await self.db.getAllConfigurationOptions(request);
    response.renderToSend = {
      pageToRender: 'v3cyberSourceComplete3DSAuthentication',
      dataForPage: {
        data: btoa(JSON.stringify(request.body)),
        origin: allConfigOptions.authenticationServiceUrl
      }
    }
  }

  /**
   * If 3DS authentication needed this completes the transaction
   * @param {*} request
   * @param {*} response
   */
  async completeValidateAuthenticationResultV3(request, response) {
    console.log("==>completeValidateAuthenticationResultV3");
    let data = atob(request.body.data);
    let dataParsed = JSON.parse(data);
    let transactionInfo = atob(dataParsed.MD);
    let transactionInfoParsed = JSON.parse(transactionInfo);
    let cardTransaction = await self.db.getCardTransactionByToken(transactionInfoParsed.transactionToken, request);
    let wallet = await self.db.getWallet(cardTransaction.walletToken, request);
    let addressDetails = await self.db.getPlayerAddress(cardTransaction.playerToken, request); //TODO get address details for player
    let playerAccount = await self.db.getPlayerAccount(cardTransaction.playerToken);
    let playerNonGamblingMid = (!playerAccount.ageVerifiedTime || playerAccount.ageVerifiedTime && !self.config.getAllowedCountryCodeList().includes(playerAccount.playerAddressCountry) ? true : false);

    let processPayment = await self.cyberSourceServices.processPayment(request, cardTransaction.amount, cardTransaction.currencyCode, addressDetails, transactionInfoParsed.paymentToken, transactionInfoParsed.transientToken, dataParsed.TransactionId, transactionInfoParsed.transactionToken, false, transactionInfoParsed.newCard, wallet.operatorWalletMID, playerNonGamblingMid);

    if (processPayment) {

      let processorRequest = (cardTransaction.paymentProviderRequest ? cardTransaction.paymentProviderRequest.substring(cardTransaction.paymentProviderRequest.indexOf('authorisationAndConsumerAuthentication')) : '') + ' ' + processPayment.reqStringified;
      let processorResponse = (cardTransaction.paymentProviderResponse ? cardTransaction.paymentProviderResponse.substring(cardTransaction.paymentProviderResponse.indexOf('authorisationAndConsumerAuthenticationResponse')) : '') + ' ' + processPayment.resStringified;

      await self.db.updateProcessorRequestResponse(transactionInfoParsed.transactionToken, processorRequest, processorResponse, request);

      let paymentToken;
      if (processPayment.processPaymentRes.tokenInformation && processPayment.processPaymentRes.tokenInformation.paymentInstrument) {
        paymentToken = processPayment.processPaymentRes.tokenInformation.paymentInstrument.id;
      } else {
        paymentToken = transactionInfoParsed.paymentToken;
      }

      if (processPayment.processPaymentRes.status === 'AUTHORIZED') {

        if (processPayment.processPaymentRes.consumerAuthenticationInformation && (processPayment.processPaymentRes.consumerAuthenticationInformation.indicator === 'vbv' || processPayment.processPaymentRes.consumerAuthenticationInformation.indicator === 'vbv_attempted' || processPayment.processPaymentRes.consumerAuthenticationInformation.indicator === 'spa')) {

          let updateCardToken = true;
          if (transactionInfoParsed.transientToken && transactionInfoParsed.expiryDate) {
            let decodedExpiryDate = await self.cyberSourceServices.decodeMessage(transactionInfoParsed.expiryDate);
            if (decodedExpiryDate) {
              updateCardToken = await self.cyberSourceServices.updateToken(paymentToken, decodedExpiryDate, wallet.operatorWalletMID, playerNonGamblingMid);
            } else {
              updateCardToken = false;
            }
          }

          let cardDetails = await self.cyberSourceServices.getCardDetails(cardTransaction.playerToken, paymentToken, wallet.operatorWalletMID, playerNonGamblingMid);
          if (cardDetails && updateCardToken) {
            let capturePayment = await self.cyberSourceServices.completePayment(processPayment.processPaymentRes.id, transactionInfoParsed.transactionToken, cardTransaction.amount, cardTransaction.currencyCode, wallet.operatorWalletMID, playerNonGamblingMid);
            cardTransaction = await self.db.getCardTransactionByToken(transactionInfoParsed.transactionToken, request);
            if (capturePayment) {
              let processorRequest = (cardTransaction.paymentProviderRequest ? cardTransaction.paymentProviderRequest.substring(cardTransaction.paymentProviderRequest.indexOf('authorisationAndValidateAuth')) : '') + ' ' + capturePayment.reqStringified;
              let processorResponse = (cardTransaction.paymentProviderResponse ? cardTransaction.paymentProviderResponse.substring(cardTransaction.paymentProviderResponse.indexOf('authorisationAndValidateAuthResponse')) : '') + ' ' + capturePayment.resStringified;

              await self.db.updateProcessorRequestResponse(transactionInfoParsed.transactionToken, processorRequest, processorResponse, request);
              await self.cyberSourceCompletePaymentV3(request, response, processPayment, paymentToken, transactionInfoParsed, playerNonGamblingMid, capturePayment, cardDetails);
            } else {

              let reverseAuth = await self.cyberSourceServices.reverseAuthorisation(processPayment.processPaymentRes.id, transactionInfoParsed.transactionToken, cardTransaction.amount, wallet.operatorWalletMID, playerNonGamblingMid);
              let paymentProcessorResponse = cardTransaction.paymentProviderResponse + ' ' + (reverseAuth ? reverseAuth.resStringified : '');
              let failureCause = {
                reason: (reverseAuth ? 'error' : 'paymentTakenError'),
                message: (reverseAuth ? "error capturing payment" : "error reversing authorisation")
              }
              await self.logFailedTransactionV3(paymentProcessorResponse, transactionInfoParsed.transactionToken, 'failed', request, response, 'update', failureCause, transactionInfoParsed.colourScheme);
              return;
            }
          } else {
            let reverseAuth = await self.cyberSourceServices.reverseAuthorisation(processPayment.processPaymentRes.id, transactionInfoParsed.transactionToken, cardTransaction.amount, wallet.operatorWalletMID, playerNonGamblingMid);
            let paymentProcessorResponse = cardTransaction.paymentProviderResponse.substring(cardTransaction.paymentProviderResponse.indexOf('authorisationAndValidateAuthResponse')) + ' ' + (reverseAuth ? reverseAuth.resStringified : '');
            let failureCause = {
              reason: (reverseAuth ? 'declined' : 'paymentTakenError'),
              message: (reverseAuth ? "unable to retrieve card details" : "error reversing authorisation")
            }
            await self.logFailedTransactionV3(paymentProcessorResponse, transactionInfoParsed.transactionToken, 'failed', request, response, 'update', failureCause, transactionInfoParsed.colourScheme);
            return;
          }
        } else {
          let reverseAuth = await self.cyberSourceServices.reverseAuthorisation(processPayment.processPaymentRes.id, transactionInfoParsed.transactionToken, cardTransaction.amount, wallet.operatorWalletMID, playerNonGamblingMid);
          let paymentProcessorResponse = cardTransaction.paymentProviderResponse.substring(cardTransaction.paymentProviderResponse.indexOf('authorisationAndValidateAuthResponse')) + ' ' + (reverseAuth ? reverseAuth.resStringified : '');
          let failureCause = {
            reason: (reverseAuth ? 'declined' : 'paymentTakenError'),
            message: (reverseAuth ? "no liability shift" : "error reversing authorisation")
          }
          await self.logFailedTransactionV3(paymentProcessorResponse, transactionInfoParsed.transactionToken, 'failed', request, response, 'update', failureCause, transactionInfoParsed.colourScheme);
          return;
        }
      } else {

        if (processPayment.processPaymentRes.errorInformation && (processPayment.processPaymentRes.errorInformation.reason === 'AVS_FAILED' || ((processPayment.processPaymentRes.errorInformation.reason === 'DECISION_PROFILE_REJECT') && !(processPayment.processPaymentRes.paymentInformation && processPayment.processPaymentRes.paymentInformation.scheme && processPayment.processPaymentRes.paymentInformation.scheme.includes('CREDIT'))))) {
          let reverseAuth = await self.cyberSourceServices.reverseAuthorisation(processPayment.processPaymentRes.id, transactionInfoParsed.transactionToken, cardTransaction.amount, wallet.operatorWalletMID, playerNonGamblingMid);
          if (reverseAuth) {
            let processorRequest = (cardTransaction.paymentProviderRequest ? cardTransaction.paymentProviderRequest.substring(cardTransaction.paymentProviderRequest.indexOf('authorisationAndValidateAuth')) : '') + ' ' + reverseAuth.reqStringified;
            let processorResponse = (cardTransaction.paymentProviderResponse ? cardTransaction.paymentProviderResponse.substring(cardTransaction.paymentProviderResponse.indexOf('authorisationAndValidateAuthResponse')) : '') + ' ' + reverseAuth.resStringified;

            await self.db.updateProcessorRequestResponse(transactionInfoParsed.transactionToken, processorRequest, processorResponse, request);
            await self.cyberSourceCompletePaymentV3(request, response, processPayment, paymentToken, transactionInfoParsed, playerNonGamblingMid);
          } else {
            var paymentProcessorResponse = cardTransaction.paymentProviderResponse;
            let failureCause = {
              reason: 'paymentTakenError',
              message: "error reversing authorisation"
            }
            await self.logFailedTransactionV3(paymentProcessorResponse, transactionInfoParsed.transactionToken, 'failed', request, response, 'update', failureCause, transactionInfoParsed.colourScheme);
            return;
          }
        } else {
          await self.cyberSourceCompletePaymentV3(request, response, processPayment, paymentToken, transactionInfoParsed, playerNonGamblingMid);
        }
      }

    } else {
      var paymentProcessorResponse = cardTransaction.paymentProviderResponse;
      let failureCause = {
        reason: 'error',
        message: "error authorising payment"
      }
      await self.logFailedTransactionV3(paymentProcessorResponse, transactionInfoParsed.transactionToken, 'failed', request, response, 'update', failureCause, transactionInfoParsed.colourScheme);
      return;
    }
  }

  /**
   * completes the cybersource payment flow
   * @param {*} request
   * @param {*} response
   * @param {*} paymentData
   * @param {*} paymentToken
   * @param {*} transactionInfo
   */
  async cyberSourceCompletePaymentV3(request, response, paymentData, paymentToken, transactionInfo, playerNonGamblingMid, capturePayment, cardDetails, colourScheme) {
    console.log("==>cyberSourceCompletePaymentV3");

    let transactionToken = transactionInfo.transactionToken;

    var cardTransaction = await self.db.getCardTransactionByToken(transactionToken, request);
    var playerToken = cardTransaction.playerToken;
    //gets wallet data to retrieve processorName
    let wallet = await self.db.getWallet(cardTransaction.walletToken, request);

    // Sanity check the transaction in the DB is in the state we expect it to be.
    // These are logged as warnings because cybersource has taken the payment, so we must complete our transaction even if something seems wrong.
    if (cardTransaction.paymentProcessor != wallet.processorName) {
      console.log("ERROR: Expected paymentProcessor to be " + wallet.processorName + " in: " + JSON.stringify(cardTransaction));
    }
    if (cardTransaction.eftPaymentId != null) {
      console.log("ERROR: Expected eftPaymentId to be null in: " + JSON.stringify(cardTransaction));
    }
    if (cardTransaction.paymentProviderTimestamp != null) {
      console.log("ERROR: Expected paymentProviderTimestamp to be null in: " + JSON.stringify(cardTransaction));
    }
    if (cardTransaction.serviceStatus != 'pending') {
      console.log("ERROR: Expected serviceStatus to be 'pending' in: " + JSON.stringify(cardTransaction));
    }
    if (cardTransaction.serviceTimestampStart < Date.now() - (15 * 60 * 1000)) {
      console.log("ERROR: Expected Start to be less than 15 minutes ago in: " + JSON.stringify(cardTransaction));
    }

    let paymentProcessorRequest = cardTransaction.paymentProviderRequest;
    let paymentProcessorResponse = cardTransaction.paymentProviderResponse;

    //only set card active/store card in database if transaction successful
    if (paymentData.processPaymentRes.status === 'AUTHORIZED' && (capturePayment && capturePayment.capturePaymentRes.status === 'PENDING')) {

      var paymentCard;

      var paymentCardExpiryDate = cardDetails.card.expirationMonth + cardDetails.card.expirationYear.substring(2) //concat cybersource card month/year
      let cardPanStar = cardDetails._embedded.instrumentIdentifier.card.number.substring(0, 1) + '****' + cardDetails._embedded.instrumentIdentifier.card.number.substring(12);
      paymentCard = await self.db.getCardByMerchantTokenId(cardDetails._embedded.instrumentIdentifier.id, request);
      var firstTransaction = await self.db.isFirstTransaction(cardTransaction.walletToken, request);
      if (paymentCard && !firstTransaction) {
        if (cardTransaction.cardToken && paymentCard.cardToken !== cardTransaction.cardToken) {
          console.log("ERROR: unexpected MerchantTokenId '" + paymentCard.cardToken + "' in OptoRes. Payment card: " + JSON.stringify(paymentCard) + ", cardTransaction: " + JSON.stringify(cardTransaction));
        }
        if (cardPanStar && paymentCard.cardPanStar !== cardPanStar) {
          console.log("ERROR: Expected cardPanStar to be '" + cardPanStar + "' in: " + JSON.stringify(paymentCard));
        }
        if (paymentCard.cardExpiryMmyy !== paymentCardExpiryDate) {
          //updating expiry date for card in database
          await self.db.updateCardExpiry(paymentCard.cardToken, paymentCardExpiryDate, request);
        }
        self.db.setCardActive(paymentCard.cardToken, cardTransaction.playerToken, paymentToken, request);
        await self.db.updateAccountStatus(cardTransaction.playerToken, "Active", request);
      } else {
        // Store the payments card's details in our DB
        let status;
        //TODO get proper token that will be in live, or can we just use the same as testing?
        if (firstTransaction) {
          var newCard = await self.db.checkCardUniqueToOperatorWallet(cardDetails._embedded.instrumentIdentifier.id, wallet.operatorWalletToken, request);
          if (!newCard) {
            status = 'FirstCardRegistered';
          } else {
            status = 'Active';
          }
        } else {
          status = 'Active';
        }

        await self.db.updateAccountStatus(cardTransaction.playerToken, status, request);

        let processorToken = await self.db.getSpecificProcessorToken('CyberSource', request);

        paymentCard = {
          merchantTokenId: cardDetails._embedded.instrumentIdentifier.id,
          userPaymentId: paymentToken,
          cardPanStar: cardPanStar,
          cardSchemeId: null,
          cardExpiryMmyy: paymentCardExpiryDate,
          processorToken: processorToken
        }
        await self.db.addCard(paymentCard, cardTransaction.playerToken, paymentToken, request);

        //get the updated paymentCard with the cardToken
        paymentCard = await self.db.getCardByMerchantTokenId(cardDetails._embedded.instrumentIdentifier.id, request);
      }




      // If it was a successful card payment, then add the money to the wallet.
      await self.db.increaseWalletBalance(cardTransaction.amount, cardTransaction.walletToken, request);

      wallet = await self.db.getWallet(cardTransaction.walletToken, request);
      var newWalletBalance = wallet.walletBalance;
      console.log("newWalletBalance=" + newWalletBalance);
    }
    var processorTimestamp;
    if (capturePayment) {
      processorTimestamp = new Date(capturePayment.capturePaymentRes.submitTimeUtc);
    } else {
      processorTimestamp = new Date(paymentData.processPaymentRes.submitTimeUtc);
    }
    // Update the pending cardTransaction
    var txnDetails = {
      cardToken: (paymentCard ? paymentCard.cardToken : null),
      eftPaymentId: (capturePayment ? capturePayment.capturePaymentRes.id : paymentData.processPaymentRes.id),
      eftResponseCode: null,
      paymentProviderErrorCode: null,
      paymentProviderStatus: paymentData.processPaymentRes.status,
      paymentProviderMessage: (capturePayment ? (capturePayment.capturePaymentRes.errorInformation ? capturePayment.capturePaymentRes.errorInformation.reason : paymentData.processPaymentRes.status) : (paymentData.processPaymentRes.errorInformation ? paymentData.processPaymentRes.errorInformation.reason : paymentData.processPaymentRes.status)),
      paymentProviderRequest: paymentProcessorRequest,
      paymentProviderResponse: paymentProcessorResponse,
      paymentProviderTimestamp: processorTimestamp.getTime(),
      serviceStatus: (paymentData.processPaymentRes.status === 'AUTHORIZED' && (capturePayment && capturePayment.capturePaymentRes.status === 'PENDING') ? 'complete' : 'failed'),
      serviceCompletionCode: 0,
      serviceTimestampEnd: request.serviceTimestamp,
      transactionToken: cardTransaction.transactionToken
    }
    await self.db.updateCardTransaction(txnDetails, request);

    wallet = await self.db.getWallet(cardTransaction.walletToken, request);

    var pageToRender;
    if (paymentData.processPaymentRes.status === 'AUTHORIZED' && (capturePayment && capturePayment.capturePaymentRes.status === 'PENDING')) {
      pageToRender = 'v3paymentComplete';
    } else if (paymentData.processPaymentRes.status === 'DECLINED' && (paymentData.processPaymentRes.paymentInformation && paymentData.processPaymentRes.paymentInformation.scheme && paymentData.processPaymentRes.paymentInformation.scheme.includes('CREDIT'))) {
      pageToRender = 'v3paymentFailedCreditCard';
    } else if (paymentData.processPaymentRes.status != 'AUTHORIZED' && (paymentData.processPaymentRes.status === '202' || (paymentData.processPaymentRes.processorInformation && paymentData.processPaymentRes.processorInformation.avs && paymentData.processPaymentRes.processorInformation.avs.code && paymentData.processPaymentRes.processorInformation.avs.code === 'A')
      || (paymentData.processPaymentRes.processorInformation && paymentData.processPaymentRes.processorInformation.avs && paymentData.processPaymentRes.processorInformation.avs.code && paymentData.processPaymentRes.processorInformation.avs.code === 'B')
      || (paymentData.processPaymentRes.processorInformation && paymentData.processPaymentRes.processorInformation.avs && paymentData.processPaymentRes.processorInformation.avs.code && paymentData.processPaymentRes.processorInformation.avs.code === 'C')
      || (paymentData.processPaymentRes.processorInformation && paymentData.processPaymentRes.processorInformation.avs && paymentData.processPaymentRes.processorInformation.avs.code && paymentData.processPaymentRes.processorInformation.avs.code === 'N')
      || (paymentData.processPaymentRes.processorInformation && paymentData.processPaymentRes.processorInformation.avs && paymentData.processPaymentRes.processorInformation.avs.code && paymentData.processPaymentRes.processorInformation.avs.code === 'O'))) {
      pageToRender = 'v3paymentFailedAddressVerification';
    } else {
      pageToRender = 'v3paymentFailed';
    }

    const operatorStyle = JSON.parse(await self.db.getOperatorWalletStyleV3(wallet.operatorWalletToken));
    const operatorStyleColourScheme = transactionInfo.colourScheme && transactionInfo.colourScheme === 'dark' ? operatorStyle.darkMode : operatorStyle.lightMode;

    response.renderToSend = {
      pageToRender: pageToRender,
      dataForPage: {
        currencySymbol: self.getCurrencySymbol(wallet.walletBalanceCurrencyCode),
        logo: operatorStyleColourScheme.operatorWalletImage,
        txnAmount: cardTransaction.amount,
        walletBalance: wallet.walletBalance,
        background: operatorStyleColourScheme.background,
        text: operatorStyleColourScheme.text
      }
    }
  }

  //Cancels the transaction based on player action
  async cancelDepositFundsIntoWalletFromCardV3(request, response) {
    console.log("==>cancelDepositFundsIntoWalletFromCardV3");

    var errorMsg = self.validation.validateTransactionToken(request.body.transactionToken);

    if (errorMsg) {
      throw new Error(errorMsg);
    }
    console.log("  Request is valid");

    var cardTransaction = await self.db.getCardTransactionByToken(request.body.transactionToken, request);
    let wallet = await self.db.getWallet(cardTransaction.walletToken, request);

    var txnDetails = {
      paymentProviderMessage: request.body.cancelReason,
      serviceStatus: 'failed',
      serviceCompletionCode: 0,
      serviceTimestampEnd: request.serviceTimestamp,
      transactionToken: request.body.transactionToken
    }

    await self.db.cancelCardTransaction(txnDetails, request);

    const operatorStyle = JSON.parse(await self.db.getOperatorWalletStyleV3(wallet.operatorWalletToken));
    const operatorStyleColourScheme = request.body.colourScheme && request.body.colourScheme === 'dark' ? operatorStyle.darkMode : operatorStyle.lightMode;

    response.renderToSend = {
      pageToRender: (request.body.cancelReason === 'Cancelled By Player' ? 'v3paymentCancelled' : (request.body.cancelReason === 'transactionTimeout' ? 'v3paymentTimeout' : 'v3paymentError')),
      dataForPage: {
        currencySymbol: self.getCurrencySymbol(wallet.walletBalanceCurrencyCode),
        logo: operatorStyleColourScheme.operatorWalletImage,
        walletBalance: wallet.walletBalance,
        background: operatorStyleColourScheme.background,
        text: operatorStyleColourScheme.text
      }
    }
  }

  lightenDarkenColorV3(color, amount) {
    return '#' + color.replace(/^#/, '').replace(/../g, color => ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
  }

  getCurrencySymbol(walletBalanceCurrencyCode) {
    let currencySymbol = getSymbolFromCurrency(walletBalanceCurrencyCode);
    if (!currencySymbol) {
      currencySymbol = '£';
    }
    return currencySymbol;
  }
}

module.exports = WalletRequestHandlers;