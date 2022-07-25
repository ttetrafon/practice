var mysql = require('promise-mysql');
var self;
const uuidv4 = require('uuid/v4');
const AWS = require('aws-sdk');
const SecretsManager = new AWS.SecretsManager({
  region: "eu-west-2"
});

class Db {
  constructor(config) {
    console.log("==>Db constructor");
    self = this;
    // self.initialised = false;
    self.config = config;
    self.connection = null;
  }

  // async initialise() {
  // 	// Get all required configuration options from the database.
  // 	var opts = await this.getAllMeaConfigurationOptions();

  // 	console.log('DB Configuration:')
  // 	var optKeys = Object.keys(opts);
  // 	optKeys.forEach((option) => {
  // 		if (this.config.hasOwnProperty(option)) {
  // 			var value = opts[option];
  // 			this.config[option] = (isNaN(value) ? value : parseFloat(value));
  // 			console.log(' - setting "' + option + '" to ' + (isNaN(value) ? value : parseFloat(value)) + ' (' + (isNaN(value) ? 'text' : 'number') + ')');
  // 		}
  // 		else if ((option != 'blacklistAndroid') || (option != 'blacklistIos')) {
  // 			console.log(' - property "' + option + '" not required to be stored in Config.js.');
  // 		}
  // 		else {
  // 			console.error(' - property "' + option + '" not found in Config.js!');
  // 		}
  // 	});
  // 	console.log("Finished reading config from database");
  // 	self.initialised = true;
  // }

  /**
   * We just have one permanent connection to the DB for the life of the lambda.
   * AWS does not pass more than 1 HTTP request to a lambda at a time, and the processing of an HTTP request never requires
   * simultaneous SQL query executions, so we only need one DB connection. Pooling is unnecessary.
   * For safety we issue a rollback, just in case the processing of the previous HTTP request left some uncommitted changes.
   * This should not happen, it would be nice to be able to detect this and log an error.
   *
   */
  async connect() {
    console.log("==>Db connect(): database: " + self.config.dbName());

    if (self.connection) {
      try {
        // Ping the databasse to make sure the connection is OK.
        await self.connection.ping();
        // Do a rollback, just in case the previous execution of this lambda did not commit/rollback it's work.
        await self.connection.rollback();
      } catch (pingError) {
        try {
          console.log("Failed to ping (or rollback) the DB connection. Will attempt to end it and create another...", pingError);
          // If the ping failed, then gracefully end the connetion.
          await self.connection.end();
        } catch (endError) {
          console.log("ERROR: Failed to end the DB connection because ping failed. Will attempt to destroy the connection instead...", endError);
          try {
            // If we could not gracefully end the connection then destroy it.
            await self.connection.destroy();
          } catch (endError) {
            console.log("ERROR: Failed to destroy the DB connection because ping and end both failed. ", endError);
          }
        }
        self.connection = null;
      }
    }

    if (!self.connection) {
      let secretKeyName = self.config.dbSecretKey();
      let credentials;
      try {
        credentials = await self.secretCredentials(secretKeyName);
      } catch (err) {
        throw new Error('error retrieivng DB credentials: ' + err);
      }


      console.log("Creating a connection to the database on host: " + credentials.host);
      self.connection = await mysql.createConnection({
        host: credentials.host,
        user: credentials.username,
        password: credentials.password,
        database: self.config.dbName()
      });

      // await self.initialise();

    } else {
      console.log("Already connected to the database, nothing to do.");
    }
  }

  async beginTransaction() {
    console.log("==>Db.beginTransaction()");
    await self.connection.beginTransaction();
  }

  async commit() {
    console.log("==>Db.commit()");
    await self.connection.commit();
  }

  async rollback() {
    console.log("==>Db.rollback()");
    if (self.connection) {
      console.log("Rolling back transaction");
      await self.connection.rollback();
    } else {
      // This could happen if the DB connection failed.
      console.log("No transaction to rollback");
    }
  }

  async end() {
    console.log("==>Db.end()");
    await self.connection.end();
  }

  // async getConnectionFromPool() {
  // 	return await self.pool.getConnection();
  // }

  async getUserEmail(playerToken) {
    ;
    return await self.connection.query('select playerExternalId from playerAccounts where playerToken=?', [playerToken]);
  }

  async getPlayerToken(email) {
    return await self.connection.query('select playerToken from playerAccounts where playerConfirmedDatetime IS NULL and playerExternalId=?', [email]);
  }

  async getPlayerTokenVar(email) {
    return await self.connection.query('select playerToken from playerAccounts where playerExternalId=?', [email]);
  }

  async createPlayer(playerToken, username, phoneNumber, firstName, familyName, birthDate) {
    console.log('createPlayer called with username: ' + username);
    var sql = 'insert into playerAccounts (playerToken, playerExternalId, playerPhoneNumber, playerFirstName, playerFamilyName, playerBirthDate, playerRegisteredDatetime, optInMarketing) VALUES (?,?,?,?,?,?,?,?)';
    var values = [playerToken, username, phoneNumber, firstName, familyName, birthDate, Date.now(), 1];
    return await self.connection.query(sql, values);
  }

  async confirmPlayerInDatabase(playerToken) {
    console.log('confirmPlayer called with playerToken: ' + playerToken);
    var sql = 'update playerAccounts set playerConfirmedDatetime=?, playerEmailVerifiedDatetime=? where playerToken=?';
    var currentTime = Date.now();
    var values = [currentTime, currentTime, playerToken];
    await self.connection.query(sql, values);
  }

  async confirmPlayerYotiShareVerified(playerExternalId, timestamp, status, data, accountState) {
    console.log('confirmPlayerAgeVerified with playerToken:' + playerExternalId);
    var sql = 'update playerAccounts set ageVerifiedTime=?, ageVerifiedStatus=?, ageVerifiedData=?, accountState=? where playerExternalId=?';
    var values = [timestamp, status, data, accountState, playerExternalId];
    await self.connection.query(sql, values);
  }

  async confirmPlayerYotiAgeScanVerified(playerToken, timestamp, status, ageVerifiedData, image, accountState) {
    console.log('confirmPlayerAgeVerified with playerToken:' + playerToken);
    var sql = 'update playerAccounts set ageVerifiedTime=?, ageVerifiedStatus=?, ageVerifiedData =?, ageScanImage=?, accountState=? where playerToken=?';
    var values = [timestamp, status, ageVerifiedData, image, accountState, playerToken];
    await self.connection.query(sql, values);
  }

  async updateAccountStatus(playerToken, status, request) {
    console.log('updateAccountStatus to ' + status + ' for playerToken:' + playerToken);
    var sql = 'update playerAccounts set accountState=? where playerToken=?';
    var values = [status, playerToken];
    self.checkOneRowUpdated(await self.connection.query(sql, values));
  }

  async getAccountStatus(playerExternalId, request) {
    console.log('getAccountStatus');
    var sql = 'select accountState from playerAccounts where playerExternalId=?';
    var values = [playerExternalId];
    return self.checkOneRow(await self.connection.query(sql, values))[0].accountState;
  }

  async getRegistrationEmailDetails(playerToken, request) {
    console.log('get registrationEmailDetails called for: ' + playerToken);
    var sql = 'select playerFirstName, playerExternalId from playerAccounts where playerToken=?';
    var values = [playerToken];
    return self.checkOneRow(await self.connection.query(sql, values))[0];
  }

  async getPlayerBreakDetails(email, request) {
    console.log('getPlayerBreakDetails called with player email: ' + email);
    var sql = 'select takeABreakEndDatetime from playerAccounts where playerExternalId = ?';
    var values = [email];
    return self.checkOneRow(await self.connection.query(sql, values))[0];
  }

  async getPlayerAddressStatus(playerToken) {
    console.log('getPlayerAddressStatus called with player id: ' + playerToken);
    var sql = 'select playerAddressStatus, playerAddressSearches from playerAccounts where playerToken=?';
    var values = [playerToken];
    return await self.connection.query(sql, values);
  }

  async setPlayerAddressStatus(playerToken, status, searches) {
    console.log('setPlayerAddressStatus called with player id: ' + playerToken + ', status: ' + status);
    var sql = 'update playerAccounts set playerAddressStatus=? where playerToken=?';
    var values = [status, playerToken];
    return await self.connection.query(sql, values);
  }

  async setPlayerAddressSearches(playerToken, searches) {
    console.log('setPlayerAddressStatus called with player id: ' + playerToken + ', searches: ' + searches);
    var sql = 'update playerAccounts set playerAddressSearches=? where playerToken=?';
    var values = [searches, playerToken];
    return await self.connection.query(sql, values);
  }

  async getPlayerAddress(playerToken, request) {
    console.log('getPlayerAddress called with player id: ' + playerToken);
    var sql = 'select playerFirstName, playerFamilyName, playerExternalId, playerPhoneNumber, playerAddressLine1, playerAddressLine2, playerAddressLine3, playerAddressLine4, playerAddressCountry, playerAddressPostcode from playerAccounts where playerToken=?';
    var values = [playerToken];
    return self.checkOneRow(await self.connection.query(sql, values))[0];
  }

  async setPlayerAddress(playerToken, line1, line2, line3, line4, country, postcode) {
    console.log('setPlayerAddress called for player id: ' + playerToken + ' with ' + [line1, line2, line3, line4, country, postcode].join(', '));
    var sql = 'update playerAccounts set playerAddressLine1=?, playerAddressLine2=?, playerAddressLine3=?, playerAddressLine4=?, playerAddressCountry=?, playerAddressPostcode=? where playerToken=?';
    var values = [line1, line2, line3, line4, country, postcode, playerToken];
    await self.connection.query(sql, values);
  }

  async isAgeVerified(playerToken, request) {
    console.log('isAgeVerified called with playerToken: ' + playerToken);
    var sql = 'select ageVerifiedStatus from playerAccounts where playerToken = ?';
    var values = [playerToken];
    return await self.checkOneRow(await self.connection.query(sql, values))[0].ageVerifiedStatus;
  }

  async isAccountConfirmed(email) {
    console.log('isAccountConfirmed called with player email: ' + email);
    var sql = 'select playerConfirmedDatetime from playerAccounts where playerExternalId = ?';
    var values = [email];
    var obj = await self.connection.query(sql, values);
    if (obj.length > 0 && obj[0].playerConfirmedDatetime !== null && obj[0].playerConfirmedDatetime > 0) {
      return true;
    }
    return false;
  }

  async getPlayerPhoneBirthDate(email, request) {
    console.log('getPlayerPhoneBirthDate');
    var sql = 'select playerPhoneNumber, playerBirthDate from playerAccounts where playerExternalId = ?';
    var values = [email];
    return self.checkOneRow(await self.connection.query(sql, values))[0];
  }

  async isAddressVerified(email) {
    console.log('isAddressVerified called with player email: ' + email);
    var sql = 'select playerAddressStatus from playerAccounts where playerExternalId=?';
    var values = [email];
    var obj = await self.connection.query(sql, values);
    console.log(obj);
    if ((obj != null) && (obj.length > 0) && (obj[0].playerAddressStatus == 1)) {
      return true;
    }
    return false;
  }

  async isEmailVerified(playerToken) {
    console.log('isEmailVerified called with for player: ' + playerToken);
    var sql = 'select playerEmailVerifiedDatetime from playerAccounts where playerToken=?';
    var values = [playerToken];
    var obj = await self.connection.query(sql, values);
    console.log(obj);
    if ((obj != null) && (obj.length > 0) && (obj[0].playerEmailVerifiedDatetime != null)) {
      return true;
    }
    return false;
  }

  async createWallet(playerToken, walletId, processorToken, operatorWalletToken, currencyCode, status, optInMarketing, request) {
    console.log('creating a wallet for the player with playerToken: ' + playerToken);
    var sql = 'insert into wallets (walletToken, playerToken, processorToken, walletBalance, walletBalanceCurrencyCode, operatorWalletToken, walletActive, optInOperatorMarketing, walletCreatedDatetime) VALUES (?,?,?,?,?,?,?,?,?)';
    var values = [walletId, playerToken, processorToken, 0, currencyCode, operatorWalletToken, status, optInMarketing, request.serviceTimestamp];
    await self.connection.query(sql, values);
  }

  async updateWalletDetInGamingSpendLimits(playerToken, walletId, limit, request) {
    console.log('wallet created, updating gamingSpendLimits for the player with playerToken: ' + playerToken);
    var sql = 'insert into gamingSpendLimits (walletToken, gamingSpendLimitAmount, gamingSpendLimitSetTimestamp, gamingSpendLimitEffectiveDatetime, isGamingSpendLimitCancelled) VALUES (?,?,?,?,?)';
    var values = [walletId, limit, request.serviceTimestamp, request.serviceTimestamp, 0];
    await self.connection.query(sql, values);
  }

  async confirmPlayer(playerToken, processorToken, request) {
    //Confirm the player in DB
    var walletId = uuidv4();

    var operatorWalletToken = '992f6a9d-9209-11eb-b758-065ea351134e';
    var operatorWallet = await self.getOperatorWallet(operatorWalletToken);

    //Create a wallet for the player
    var status = 1;
    await self.createWallet(playerToken, walletId, processorToken, operatorWallet.operatorWalletToken, operatorWallet.operatorWalletCurrency, status, null, request);

    //confirm player in the database
    await self.confirmPlayerInDatabase(playerToken);

    await self.updateDefaultWallet(playerToken, walletId);

    //update wallet details in gamingSpendLimits
    await self.updateWalletDetInGamingSpendLimits(playerToken, walletId, operatorWallet.operatorDefaultGamingSpendLimitWeekly, request);
  }

  async getCardTransactionByToken(transactionToken, request) {
    console.log('getCardTransactionByToken called with transactionToken: ' + transactionToken);
    var sql = 'select * from cardTransactions where transactionToken=?';
    var values = [transactionToken];
    return self.checkOneRow(await self.connection.query(sql, values))[0];
  }

  async declareFailedCardTransaction(txnDetails, request, operation) {
    console.log('declareFailedCardTransaction called with txnDetails: ' + JSON.stringify(txnDetails));
    var sql = '';
    if (operation === 'add') {
      sql = 'insert into cardTransactions (serviceStatus, paymentProviderResponse, transactionToken) values (?, ?, ?)';
    }
    else {
      sql = 'update cardTransactions set serviceStatus=?, paymentProviderResponse=?, paymentProviderMessage=?, serviceTimestampEnd=? where transactionToken=?';
    }
    var values = [
      txnDetails.serviceStatus,
      txnDetails.paymentProviderResponse,
      (txnDetails.cause ? txnDetails.cause.message : null),
      Date.now(),
      txnDetails.transactionToken
    ];
    self.checkOneRowUpdated(await self.connection.query(sql, values));
  }

  async updateCardTransaction(txnDetails, request) {
    console.log('updateCardTransaction called with txnDetails: ' + JSON.stringify(txnDetails));

    var sql = 'update cardTransactions set cardToken=?, eftPaymentId=?, eftResponseCode=?, paymentProviderErrorCode=?, paymentProviderStatus=?, paymentProviderMessage=?, paymentProviderRequest=?, paymentProviderResponse=?, paymentProviderTimestamp=?, serviceStatus=?, serviceCompletionCode=?, serviceTimestampEnd=? where transactionToken=?';
    var values = [txnDetails.cardToken,
    txnDetails.eftPaymentId,
    txnDetails.eftResponseCode,
    txnDetails.paymentProviderErrorCode,
    txnDetails.paymentProviderStatus,
    txnDetails.paymentProviderMessage,
    txnDetails.paymentProviderRequest,
    txnDetails.paymentProviderResponse,
    txnDetails.paymentProviderTimestamp,
    txnDetails.serviceStatus,
    txnDetails.serviceCompletionCode,
    txnDetails.serviceTimestampEnd,
    txnDetails.transactionToken];

    self.checkOneRowUpdated(await self.connection.query(sql, values));
  }

  async addCard(paymentCard, playerToken, userPaymentId, request) {
    console.log('addCard called with playerToken: ' + playerToken + ', paymentCard: ' + JSON.stringify(paymentCard));

    // See if this card already exists.
    var cardInDb = await self.getCardByMerchantTokenId(paymentCard.merchantTokenId, request);

    var cardToken;

    if (cardInDb) {
      cardToken = cardInDb.cardToken;
      // if the card already exists in the DB, then check it has the attributes we expect.
      if (cardInDb.cardPanStar !== paymentCard.cardPanStar) {
        console.log("ERROR: Expected cardPanStar to be '" + paymentCard.cardPanStar + "' in: " + JSON.stringify(cardInDb));
      }
      if (cardInDb.cardSchemeId !== paymentCard.cardSchemeId) {
        console.log("ERROR: Expected cardSchemeId to be '" + paymentCard.cardSchemeId + "' in: " + JSON.stringify(cardInDb));
      }
      if (cardInDb.cardExpiryMmyy !== paymentCard.cardExpiryMmyy) {
        //updating expiry date for card in database
        await self.updateCardExpiry(cardToken, paymentCard.cardExpiryMmyy, request);
      }
    } else {
      // if the card doesn't exist in the DB yet, then insert it.
      cardToken = uuidv4();
      var sql = 'insert into cards (cardToken, merchantTokenId, cardPanStar, cardSchemeId, cardExpiryMmyy, processorToken) '
        + 'values (?,?,?,?,?,?)';
      var values = [
        cardToken,
        paymentCard.merchantTokenId,
        paymentCard.cardPanStar,
        paymentCard.cardSchemeId,
        paymentCard.cardExpiryMmyy,
        paymentCard.processorToken];

      self.checkOneRowUpdated(await self.connection.query(sql, values));
    }

    self.setCardActive(cardToken, playerToken, userPaymentId, request);
  }

  async getCardByMerchantTokenId(merchantTokenId, request) {
    console.log('getCardByMerchantTokenId called with merchantTokenId: ' + merchantTokenId);
    var sql = 'select * from cards where merchantTokenId=?';
    var values = [merchantTokenId];
    var cards = await self.connection.query(sql, values);
    return (cards.length === 0) ? null : cards[0];
  }

  async isCardActiveForPlayer(cardToken, playerToken, userPaymentId, request) {
    console.log('isCardActiveForPlayer called with cardToken: ' + cardToken + ', playerToken:' + playerToken);

    var activeCard = await self.getActiveCardForPlayer(playerToken, request);
    if (activeCard && activeCard.cardToken === cardToken && activeCard.userPaymentId === userPaymentId) {
      return true;
    }
    return false;
  }

  /**
   * method for retreiving the players card details from the database
   * @param playerToken
   * @param request
   */
  async getActiveCardForPlayer(playerToken, request) {
    console.log('getActiveCardForPlayer called with player token: ' + playerToken);
    var sql = 'select c.cardToken, c.merchantTokenId, l.userPaymentId, c.cardPanStar, c.cardSchemeId, c.cardExpiryMmyy'
      + ' from cards c inner join playerAccountCardLinks l'
      + ' on l.cardToken=c.cardToken'
      + ' and l.playerAccountCardLinkStartDatetime<? and (l.playerAccountCardLinkEndDatetime>? or l.playerAccountCardLinkEndDatetime is null)'
      + ' where l.playerToken=?'
    var values = [request.serviceTimestamp, request.serviceTimestamp, playerToken];
    var result = await self.connection.query(sql, values);
    if (result.length === 0) {
      return null;
    }
    return result[0];
  }

  async setCardActive(cardToken, playerToken, userPaymentId, request) {
    console.log('setCardActive called with cardToken: ' + cardToken + ', playerToken:' + playerToken);

    if (await self.isCardActiveForPlayer(cardToken, playerToken, userPaymentId, request)) {
      console.log('card is already active, nothing to do');
      return;
    }

    // Make sure all cards are inactive for this player.
    var sql = 'update playerAccountCardLinks set playerAccountCardLinkEndDatetime=? where playerToken=? and (playerAccountCardLinkEndDatetime is null or playerAccountCardLinkEndDatetime>?)';
    var values = [request.serviceTimestamp - 1, playerToken, request.serviceTimestamp];
    await self.connection.query(sql, values);

    var sql = 'insert into playerAccountCardLinks (playerToken, cardToken, userPaymentId, playerAccountCardLinkStartDatetime, playerAccountCardLinkEndDatetime) values (?,?,?,?,?)';
    var values = [playerToken, cardToken, userPaymentId, request.serviceTimestamp, null];
    self.checkOneRowUpdated(await self.connection.query(sql, values));
  }

  async getWalletTokenForPlayer(playerToken, request) {
    console.log('getWalletTokenForPlayer called with playerToken: ' + playerToken);
    var sql = 'select walletToken from wallets where playerToken=?';
    var values = [playerToken];
    return self.checkOneRow(await self.connection.query(sql, values))[0].walletToken;
  }

  async getWallet(walletToken, request) {
    console.log('getWallet called with walletToken: ' + walletToken);
    var sql = 'select w.walletToken, w.playerToken, p.processorName, w.walletBalance, w.walletBalanceCurrencyCode, ow.operatorStyle, ow.operatorWalletImage, ow.operatorWalletMID, ow.operatorWalletToken '
      + 'from wallets w inner join processors p on w.processorToken = p.processorToken '
      + 'inner join operatorWallets ow on ow.operatorWalletToken = w.operatorWalletToken '
      + 'where w.walletToken=?';
    var values = [walletToken];
    return self.checkOneRow(await self.connection.query(sql, values))[0];
  }

  async setWalletBalance(newWalletBalance, walletToken, request) {
    console.log('setWalletBalance called with newWalletBalance: ' + newWalletBalance);
    var sql = 'update wallets set walletBalance=? where walletToken=?';
    var values = [newWalletBalance, walletToken];

    self.checkOneRowUpdated(await self.connection.query(sql, values));
  }

  async increaseWalletBalance(amount, walletToken, request) {
    console.log('increaseWalletBalance called with amount: ' + amount);
    var sql = 'update wallets set walletBalance=walletBalance+? where walletToken=?';
    var values = [amount, walletToken];

    self.checkOneRowUpdated(await self.connection.query(sql, values));
  }

  async getLatestProcessorToken(request) {
    console.log('getLatestProcessorToken called with processor');
    var sql = 'select processorToken from processors where processorEndDatetime is null order by processorStartDatetime desc limit 1';
    return self.checkOneRow(await self.connection.query(sql))[0].processorToken;
  }

  async getSpecificProcessorToken(processor, request) {
    console.log('getSpecificProcessorToken called with processor');
    var sql = 'select processorToken from processors where processorName=?';
    var values = [processor];
    return self.checkOneRow(await self.connection.query(sql, values))[0].processorToken;
  }

  async getAllConfigurationOptions(request) {
    console.log('getAllConfigurationOptions called');
    var sql = 'select * from mpaConfiguration';
    var values = [];
    var options = await self.connection.query(sql, values);
    var packet = {};
    for (var i = 0; i < options.length; i++) {
      packet[options[i].configKey] = options[i].configValue;
    }
    return packet;
  }

  async getConfigurationOptions(key, request) {
    console.log('getConfigurationOptions called with key: ' + key);
    var sql = 'select configValue from mpaConfiguration where configKey=?';
    var values = [key];
    return self.checkOneRow(await self.connection.query(sql, values))[0];
  }

  async cancelCardTransaction(txnDetails, request) {
    console.log('cancelCardTransaction called with token: ' + txnDetails.transactionToken);
    var sql = 'update cardTransactions set paymentProviderMessage=?, serviceStatus=?, serviceCompletionCode=?, serviceTimestampEnd=? where transactionToken=?';
    var values = [txnDetails.paymentProviderMessage,
    txnDetails.serviceStatus,
    txnDetails.serviceCompletionCode,
    txnDetails.serviceTimestampEnd,
    txnDetails.transactionToken];
    return self.checkOneRowUpdated(await self.connection.query(sql, values));
  }

  /**
   * Counts all the Players transactions to determine if a transaction made recently is the Player's first transaction.
   * @param {*} walletToken
   * @param {*} request
   */
  async isFirstTransaction(walletToken, request) {
    console.log('isFirstTransaction called with walletToken: ' + walletToken);
    var sql = 'select count(*) from cardTransactions where walletToken=? and serviceStatus=?';
    var values = [walletToken, 'complete'];
    // var count = await self.connection.query(sql, values);
    var count = self.checkOneRow(await self.connection.query(sql, values))[0]["count(*)"];
    console.log('transaction count: ' + count);
    return (count === 0 ? true : false);
  }

  async updateCardExpiry(cardToken, expiryDate, request) {
    console.log('updateCardExpiry called for cardToken: ' + cardToken);
    var sql = 'update cards set cardExpiryMmyy=? where cardToken=?';
    var values = [expiryDate, cardToken];
    return self.checkOneRowUpdated(await self.connection.query(sql, values));
  }

  async getUsernameExistsTimestamp(username, request) {
    console.log('getUsernameExistsTimestamp called for username: ' + username);
    var sql = 'select usernameExistsEmailLastSentDatetime from playerAccounts where playerExternalId=?';
    var values = [username];
    return self.checkOneRow(await self.connection.query(sql, values))[0].usernameExistsEmailLastSentDatetime;
  }

  async setUsernameExistsTimestamp(username, request) {
    console.log('setUsernameExistsTimestamp called for username: ' + username);
    var sql = 'update playerAccounts set usernameExistsEmailLastSentDatetime=? where playerExternalId=?';
    var values = [Date.now(), username];
    return self.checkOneRowUpdated(await self.connection.query(sql, values));
  }

  async getUsernameExistsEmailDetails(username, request) {
    console.log('get registrationEmailDetails called for: ' + username);
    var sql = 'select playerFirstName, playerExternalId from playerAccounts where playerExternalId=?';
    var values = [username];
    return self.checkOneRow(await self.connection.query(sql, values))[0];
  }

  async updateProcessorRequestResponse(transactionToken, processorRequest, processorResponse, request) {
    console.log('updateProcessorRequestResponse called for transactionToken: ' + transactionToken);
    var sql = 'update cardTransactions set paymentProviderRequest=?, paymentProviderResponse=? where transactionToken=?';
    var values = [processorRequest, processorResponse, transactionToken];
    return self.checkOneRowUpdated(await self.connection.query(sql, values));
  }

  async updateDefaultWallet(playerToken, walletToken, request) {
    console.log('updateDefaultWallet called with playerToken: ' + playerToken);
    var sql = 'update playerAccounts set defaultWalletToken=? where playerToken=?';
    var values = [walletToken, playerToken];
    self.checkOneRowUpdated(await self.connection.query(sql, values));
  }

  async getDefaultWallet(playerToken, request) {
    console.log('getDefaultWallet called with playerToken: ' + playerToken);
    var sql = 'select pa.defaultWalletToken, ow.operatorStyle->>"$.title" as operatorName from playerAccounts pa '
      + 'inner join wallets w on w.walletToken = pa.defaultWalletToken '
      + 'inner join operatorWallets ow on ow.operatorWalletToken = w.operatorWalletToken '
      + 'where pa.playerToken=?';
    var values = [playerToken];
    return self.checkOneRow(await self.connection.query(sql, values))[0];
  }

  async getPlayerActiveWallets(playerToken, request) {
    console.log('getPlayerActiveWallets called with playerToken: ' + playerToken);
    var sql = 'select w.walletToken, w.playerToken, p.processorToken, p.processorName, w.walletBalance, w.walletBalanceCurrencyCode, w.operatorWalletToken, w.walletActive, operatorStyle->>"$.title" as operatorName, ow.operatorWalletImage, ow.operatorStyle, ow.operatorMaxGamingSpendLimitWeekly '
      + 'from wallets w inner join processors p on w.processorToken = p.processorToken '
      + 'inner join operatorWallets ow on ow.operatorWalletToken = w.operatorWalletToken '
      + 'where w.playerToken=? and w.walletActive=?';
    var values = [playerToken, 1];
    return await self.connection.query(sql, values);
  }

  async getOperatorWalletFromOperatorToken(operatorToken, request) {
    console.log('getOperatorWallet called with operatorToken: ' + operatorToken);
    var sql = 'select * from operatorWallets where operatorToken=?';
    var values = [operatorToken];
    return self.checkOneRow(await self.connection.query(sql, values))[0];
  }

  async getOperatorWallet(operatorWalletToken, request) {
    console.log('getOperatorWallet called with operatorWalletToken: ' + operatorWalletToken);
    var sql = 'select * from operatorWallets where operatorWalletToken=?';
    var values = [operatorWalletToken];
    return self.checkOneRow(await self.connection.query(sql, values))[0];
  }

  async getAllOperatorWallets(playerToken, request) {
    console.log('getAllOperatorWallets');
    var sql = 'select ow.operatorWalletToken, ow.walletType, ow.walletCardType, ow.operatorToken, ow.operatorWalletImage, ow.operatorStyle, '
      + 'ow.operatorMicroSite, ow.operatorWalletAllowTopUp, ow.operatorWalletAllowMachinePlay, ow.operatorWalletAllowNewPlayers, '
      + 'ow.operatorWalletCurrency, ow.operatorDefaultGamingSpendLimitWeekly, ow.operatorMaxGamingSpendLimitWeekly, '
      + 'ow.operatorWalletCreatedDatetime, ow.operatorWalletEffectiveDatetime, ow.operatorWalletEndDatetime, operatorStyle->>"$.title" as operatorName, if(exists(select * from wallets w where w.playerToken=? and w.operatorWalletToken = ow.operatorWalletToken),"true","false") as walletPreviouslyOpened '
      + 'from operatorWallets ow inner join operators o on o.operatorToken = ow.operatorToken '
      + 'where (ow.operatorWalletEffectiveDateTime is not null and ow.operatorWalletEffectiveDatetime <? and ow.operatorWalletAllowNewPlayers=?) '
      + 'and (ow.operatorWalletEndDatetime is null or ow.operatorWalletEndDatetime >?) and ow.operatorWalletToken not in (select operatorWalletToken from wallets where playerToken=? and walletActive=?)';
    var values = [playerToken, request.serviceTimestamp, 1, request.serviceTimestamp, playerToken, 1];
    var result = await self.connection.query(sql, values);
    if (result.length == 0) {
      return null;
    }
    return result;
  }

  async checkCardUniqueToOperatorWallet(merchantTokenId, operatorWalletToken, request) {
    console.log('checkCardUniqueToOperatorWallet called with merchantTokenId: ' + merchantTokenId + ' and operatorWalletToken: ' + operatorWalletToken);
    var sql = 'select * from cards c '
      + 'inner join cardTransactions ct on ct.cardToken = c.cardToken '
      + 'inner join wallets w on w.walletToken = ct.walletToken '
      + 'inner join operatorWallets ow on ow.operatorWalletToken = w.operatorWalletToken '
      + 'where c.merchantTokenId=? and ow.operatorWalletToken=? and ct.serviceStatus=? limit 1';
    var values = [merchantTokenId, operatorWalletToken, 'complete'];
    var cards = await self.connection.query(sql, values);
    return (cards.length === 0) ? null : cards[0];
  }

  async updateDefaultWallet(playerToken, walletToken, request) {
    console.log('updateDefaultWallet called with playerToken: ' + playerToken);
    var sql = 'update playerAccounts set defaultWalletToken=? where playerToken=?';
    var values = [walletToken, playerToken];
    self.checkOneRowUpdated(await self.connection.query(sql, values));
  }

  async getPlayerAgeVerified(playerToken) {
    console.log('getPlayerAgeVerified called with playerToken: ' + playerToken);
    var sql = 'select ageVerifiedTime from playerAccounts where playerToken=?';
    var values = [playerToken];
    var result = self.checkOneRow(await self.connection.query(sql, values))[0].ageVerifiedTime;
    if (result) {
      return true;
    } else {
      return false;
    }
  }

  async getPlayerAccount(playerToken) {
    console.log('getPlayerAccount called with playerToken: ' + playerToken);
    var sql = 'select * from playerAccounts where playerToken=?';
    var values = [playerToken];
    return self.checkOneRow(await self.connection.query(sql, values))[0];
  }

  async getWalletFromOperatorToken(operatorToken, playerToken) {
    console.log('getWalletFromOperatorToken called with operatorToken: ' + operatorToken);
    var sql = 'select w.walletToken, w.playerToken, p.processorToken, p.processorName, w.walletBalance, w.walletBalanceCurrencyCode, w.operatorWalletToken, w.walletActive, ow.operatorWalletImage '
      + 'from wallets w inner join processors p on w.processorToken = p.processorToken '
      + 'inner join operatorWallets ow on ow.operatorWalletToken = w.operatorWalletToken '
      + 'where ow.operatorWalletToken=? and w.playerToken=?';
    var values = [operatorToken, playerToken];
    var result = await self.connection.query(sql, values);
    if (result.length == 0) {
      return null;
    }
    return result[0];
  }

  /**
   * Checks that exactly one row has been returned from a SQL query.
   * @param queryResult the result of the SQL query.
   * @result the queryResult that was passed in, for method chaining.
   * @throws a String containing an error message if 0 or >1 rows were returned from the query.
   */
  checkOneRow(queryResult) {
    if (!queryResult) {
      throw 'no query result.';
    }
    if (queryResult.length === 0) {
      throw 'no records found.';
    }
    if (queryResult.length > 1) {
      throw queryResult.length + ' records found, wanted just one.';
    }
    return queryResult;
  }

  /**
   * Checks that exactly one row has been updated by a SQL query.
   * @param updateResult the result of the SQL update.
   * @result the updateResult that was passed in, for method chaining.
   * @throws a String containing an error message if 0 or >1 rows were updated by the query.
   */
  checkOneRowUpdated(updateResult) {
    if (!updateResult) {
      throw 'no update result.';
    }
    if (updateResult.affectedRows != 1) {
      throw 'Expected 1 row to be updated, but ' + updateResult.affectedRows + ' rows were updated.';
    }
    return updateResult;
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



  /******************************************************************************
   *
   * V3 Methods
   *
   */

  async confirmPlayerV3(playerToken, processorToken, request) {
    //Confirm the player in DB
    var walletId = uuidv4();

    var operatorWalletToken = self.config.operatorWalletToken();
    var operatorWallet = await self.getOperatorWallet(operatorWalletToken);

    //Create a wallet for the player
    var status = 1;
    await self.createWallet(playerToken, walletId, processorToken, operatorWallet.operatorWalletToken, operatorWallet.operatorWalletCurrency, status, null, request);

    //confirm player in the database
    await self.confirmPlayerInDatabase(playerToken);

    await self.updateDefaultWallet(playerToken, walletId);

    await self.updateGamingMachineSessionValues(playerToken, operatorWallet.operatorDefaultGamingMachineSessionLengthInterval, operatorWallet.operatorDefaultGamingMachineSessionSpendCheckAmount);

    //update wallet details in gamingSpendLimits
    await self.updateWalletDetInGamingSpendLimits(playerToken, walletId, operatorWallet.operatorDefaultGamingSpendLimitWeekly, request);
  }

  async updateGamingMachineSessionValues(playerToken, operatorDefaultGamingMachineSessionLengthInterval, operatorDefaultGamingMachineSessionSpendCheckAmount) {
    console.log('updateGamingMachineSessionValues called with playerToken: ' + playerToken);
    var sql = 'update playerAccounts set gamingMachineSessionLengthInterval=?, gamingMachineSessionSpendCheckAmount=? where playerToken=?';
    var values = [operatorDefaultGamingMachineSessionLengthInterval, operatorDefaultGamingMachineSessionSpendCheckAmount, playerToken];
    self.checkOneRowUpdated(await self.connection.query(sql, values));
  }

  async getOperatorWalletStyleV3(operatorWalletToken) {
    console.log("getOperatorWalletStyleV3");
    var sql = 'select operatorStyleJson->>"$.colourSchemes" as colourSchemes from operatorWallets where operatorWalletToken=?';
    var values = [operatorWalletToken];
    return self.checkOneRow(await self.connection.query(sql, values))[0].colourSchemes;
  }
}

module.exports = Db;
