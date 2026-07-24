/**
 * Node Express application providing the Unsecured Server for the TapAndPlay System
 *
 */
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors')
const Db = require('./services/database');
const LoginHandler = require('./services/LoginHandler');
const CognitoServices = require('./services/CognitoServices');
const SessionRequestHandlers = require('./services/SessionRequestHandlers');
const RequestValidationServices = require('./services/RequestValidationServices');
const CompletionServices = require('./services/CompletionServices');
const WalletRequestHandlers = require('./services/WalletRequestHandlers');
const Config = require('./services/Config');
const PostCoderService = require('./services/PostCoderService');
const AgeVerificationRequestHandlers = require('./services/AgeVerificationRequestHandlers');
const MpaConfiguration = require('./services/MpaConfiguration');
const CyberSourceServices = require('./services/CyberSourceServices');

const config = new Config();
const db = new Db(config);
const requestValidationServices = new RequestValidationServices();
const cyberSourceServices = new CyberSourceServices(db, config);
const completionServices = new CompletionServices(db);
const postcoderService = new PostCoderService(db, completionServices, config);
const cognitoServices = new CognitoServices(db, requestValidationServices, completionServices, config);
const loginHandler = new LoginHandler(db, completionServices, cognitoServices, config);
const sessionRequestHandlers = new SessionRequestHandlers(db, requestValidationServices, completionServices, cognitoServices);
const walletRequestHandlers = new WalletRequestHandlers(db, requestValidationServices, completionServices, config, cyberSourceServices);
const ageVerificationRequestHandlers = new AgeVerificationRequestHandlers(db, requestValidationServices, completionServices, config);
const mpaConfigurationHandlers = new MpaConfiguration(db, completionServices, config);

app.use(bodyParser.urlencoded({ limit: '6mb', extended: false }));
app.use(bodyParser.json({ limit: '6mb' }));
app.use(cors());
app.set('view engine', 'pug');
app.use(express.static('public'));

//Run the application on port 5000
console.log("process.env.PORT=" + process.env.PORT);
app.set('port', (process.env.PORT || 5001));

//Specify the route of the static resources to be served
app.use(express.static(__dirname + '/public'));

const router = express.Router();

router.use(cors());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

/**
 * Ping request
 *
 * @returns A message confirming that the server is running correctly
 */
app.get('/:apiVersion/ping', function (request, response) {
	console.log(request.params.apiVersion + '/ping HTTP request received');
	console.log('request.hostname: ' + request.hostname);
	console.log('request.originalUrl: ' + request.originalUrl);
	console.log('request.path ' + request.path);
	console.log('request.protocol: ' + request.protocol);
	console.log('request.route: ' + JSON.stringify(request.route));
	console.log('request.baseUrl: ' + request.baseUrl);
	response.json('The Tap and Play Unsecured Service is running just fine');
});

app.post('/:apiVersion/players/account', function (request, response) {
	console.log(request.params.apiVersion + '/players/account: ' + JSON.stringify(obfuscatePassword(request.body)));
	dbTxn(v1PlayersAccount, request, response);
});

async function v1PlayersAccount(request, response, apiVersion) {
	if(apiVersion === 'v3') {
		switch(request.body.requestType) {
			case 'playerRegistration':
				await loginHandler.registerPlayerV3(request, response);
				break;
			case 'playerRegistrationConfirmation':
				await loginHandler.confirmPlayerV3(request, response);
				break;
			case 'postcoderAddressSet':
				await postcoderService.setAddressV3(request, response);
				break;
			case 'postcoderAddressLookup':
				await postcoderService.getAddressV3(request, response);
				break;
			case 'playerResetPassword':
				await loginHandler.resetPasswordV3(request, response);
				break;
			case 'playerResetPasswordConfirmation':
				await loginHandler.resetPasswordConfirmationV3(request, response);
				break;
			case 'playerResendCode':
				await loginHandler.resendCodeV3(request, response);
				break;
			case 'sendRegistrationEmail':
				await loginHandler.sendRegistrationEmailV3(request, response);
				break;
			default:
				throw new Error('unknown requestTypeV3: ' + request.body.requestType);
		}
	} else {
		if (request.body.requestType === 'playerRegistration') {
			await loginHandler.registerPlayer(request, response);

		} else if (request.body.requestType === 'playerRegistrationConfirmation') {
			await loginHandler.confirmPlayer(request, response);

		} else if (request.body.requestType === 'playerResetPassword') {
			await loginHandler.resetPassword(request, response);

		} else if (request.body.requestType === 'playerResetPasswordConfirmation') {
			await loginHandler.resetPasswordConfirmation(request, response);

		} else if (request.body.requestType === 'playerResendCode') {
			await loginHandler.resendCode(request, response);

		} else if (request.body.requestType === 'postcoderAddressLookup') {
			await postcoderService.getAddress(request, response);

		} else if (request.body.requestType === 'postcoderAddressSet') {
			await postcoderService.setAddress(request, response);

		} else if (request.body.requestType === 'sendRegistrationEmail'){
			await loginHandler.sendRegistrationEmail(request, response);
		} else {
			console.log('unknown request type');
			throw 'un recognised request type!!';
		}
	}
}

app.post('/:apiVersion/players/session', function (request, response) {
	console.log(request.params.apiVersion + '/players/session: ' + JSON.stringify(obfuscatePassword(request.body)));
	dbTxn(v1PlayersSession, request, response);
});

async function v1PlayersSession(request, response, apiVersion) {
	if(apiVersion === 'v3') {
		switch(request.body.requestType) {
			case 'playerSignIn':
				await loginHandler.signInV3(request, response);
				break;
			case 'playerRefreshTokens':
				await sessionRequestHandlers.refreshTokensV3(request, response);
				break;
			default:
				throw new Error('unknown requestTypeV3: ' + request.body.requestType);
		}
	} else {
		if (request.body.requestType === 'playerSignIn') {
			await loginHandler.signIn(request, response);
		} else if(request.body.requestType === 'playerRefreshTokens') {
			await sessionRequestHandlers.refreshTokens(request, response);
		}
	}
}

//NOT USED IN V3
app.post('/:apiVersion/players/wallet', function(request, response) {
	dbTxn(playersWallet, request, response);
});

//NOT USED IN V3
async function playersWallet(request, response, apiVersion) {
	if(request.body.requestType === 'addOperatorWallet') {
		await walletRequestHandlers.addOperatorWallet(request, response);
	} else {
		throw 'unknown request type: ' + request.body.requestType;
	}
}

app.post('/:apiVersion/players/ageVerification', function(request, response) {
	//console.log('/v1/players/ageVerification. ' + JSON.stringify(request.body));
	dbTxn(ageVerification, request, response);
});

async function ageVerification (request, response, apiVersion) {
	if(apiVersion === 'v3') {
		switch(request.body.requestType) {
			case 'getAgeVerifiedAttributes':
				await ageVerificationRequestHandlers.getAgeVerifiedAttributesV3(request, response);
				break;
			case 'ageScan':
				await ageVerificationRequestHandlers.ageScanV3(request, response);
				break;
			default:
				throw new Error('unknown requestTypeV3: ' + request.body.requestType);
		}
	} else {
		if(request.body.requestType === 'getAgeVerifiedAttributes') {
			await ageVerificationRequestHandlers.getAgeVerifiedAttributes(request, response);
		} else if(request.body.requestType === 'ageScan') {
			await ageVerificationRequestHandlers.ageScan(request, response);
		} else {
			throw 'unknown request type: ' + request.body.requestType;
		}
	}
}

app.post('/:apiVersion/players/wallet/renderCyberSourcePaymentPage', async function(request, response) {
	console.log(request.params.apiVersion + '/players/wallet ' + JSON.stringify(request.body));
		dbTxn(renderCyberSourcePaymentPage, request, response);
});

async function renderCyberSourcePaymentPage(request, response, apiVersion) {
		if(apiVersion === 'v3') {
			await walletRequestHandlers.renderCyberSourcePaymentPageV3(request, response);
		} else {
			await walletRequestHandlers.renderCyberSourcePaymentPage(request, response);
		}
}

app.post('/:apiVersion/processPaymentAndConsumerAuthentication', async function(request, response) {
	console.log(request.params.apiVersion + '/processPaymentAndConsumerAuthentication' + JSON.stringify(request.body));
	dbTxn(processPaymentAndConsumerAuthentication, request, response);
});

async function processPaymentAndConsumerAuthentication(request, response, apiVersion) {
	if(apiVersion === 'v3') {
		await walletRequestHandlers.processPaymentAndConsumerAuthenticationV3(request, response);
	} else {
		await walletRequestHandlers.processPaymentAndConsumerAuthentication(request, response);
	}
}

app.post('/:apiVersion/players/wallet/validateAuthenticationResult', async function(request, response) {
	console.log(request.params.apiVersion + '/players/wallet/validateAuthenticationResult' + JSON.stringify(request.body));
	dbTxn(validateAuthenticationResult, request, response);
});

async function validateAuthenticationResult(request, response, apiVersion) {
	if(apiVersion === 'v3') {
		await walletRequestHandlers.validateAuthenticationResultV3(request, response);
	} else {
		await walletRequestHandlers.validateAuthenticationResult(request, response);
	}
}

app.post('/:apiVersion/players/wallet/completeValidateAuthenticationResult', async function(request, response) {
	console.log(request.params.apiVersion + '/players/wallet/completeValidateAuthenticationResult' + JSON.stringify(request.body));
	dbTxn(completeValidateAuthenticationResult, request, response);
});

async function completeValidateAuthenticationResult(request, response, apiVersion) {
	if(apiVersion === 'v3') {
		await walletRequestHandlers.completeValidateAuthenticationResultV3(request, response);
	} else {
		await walletRequestHandlers.completeValidateAuthenticationResult(request, response);
	}
}

app.post('/:apiVersion/cyberSourceDeviceDataCollection', async function(request, response) {
	console.log(request.params.apiVersion + '/cyberSourceDeviceDataCollection ' + JSON.stringify(request.body));
	dbTxn(cyberSourceDeviceDataCollection, request, response);
});

async function cyberSourceDeviceDataCollection(request, response, apiVersion) {
	if(apiVersion === 'v3') {
		await walletRequestHandlers.cyberSourceDeviceDataCollectionV3(request, response);
	} else {
		await walletRequestHandlers.cyberSourceDeviceDataCollection(request, response);
	}
}

app.post('/:apiVersion/cancelDepositFundsIntoWalletFromCard', async function(request, response) {
	console.log(request.params.apiVersion + '/cancelDepositFundsIntoWalletFromCard ' + JSON.stringify(request.body));
	dbTxn(cancelDepositFundsIntoWalletFromCard, request, response);
});

async function cancelDepositFundsIntoWalletFromCard(request, response, apiVersion) {
	if(apiVersion === 'v3') {
		await walletRequestHandlers.cancelDepositFundsIntoWalletFromCardV3(request, response);
	} else {
		await walletRequestHandlers.cancelDepositFundsIntoWalletFromCard(request, response);
	}
}

app.post('/:apiVersion/initialConfig', function(request, response) {
	console.log(request.params.apiVersion + '/initialConfig. ' + JSON.stringify(request.body));
	dbTxn(initialConfig, request, response);
});

async function initialConfig(request, response, apiVersion) {
	if (request.body.requestType === 'initialConfig') {
		await mpaConfigurationHandlers.initialConfig(request, response);
	} else {
		throw 'unknown request type: ' + request.body.requestType;
	}
}

function obfuscatePassword(object) {
	var objectJsonStr = JSON.stringify(object);
	var copy = JSON.parse(objectJsonStr);
	if (copy.password) {
		copy.password = "XXXXXX";
	}
	if (copy.playerPassword) {
		copy.playerPassword = "XXXXXX";
	}
	if (copy.newPassword) {
		copy.newPassword = "XXXXXX";
	}
	if (copy.oldPassword) {
		copy.oldPassword = "XXXXXX";
	}
	return copy;
}

/**
 * Wraps a call to func within a database transaction.
 * All SQL statements in a transaction must be sent down the same database connection, so a connection is taken from the pool
 * and added to the request object for ease of passing around.
 * The transaction timestamp is also added to the request object. This is to ensure the same timestamp is used throughout the transaction.
 * @param func the function to call within the DB transaction. It is passed the request and response params.
 * @param request the HTTP request
 * @param response the HTTP response
 */
async function dbTxn(func, request, response) {
	try {
		try {
			await db.connect();
			console.log("Got the DB connection");

			await db.beginTransaction();
			request.serviceTimestamp = Date.now();

			await func(request, response, request.params.apiVersion);

			await db.commit();
			console.log("Committed transaction");

			// await request.dbConnection.release();
			// console.log("Released DB connection");

			if (response.jsonToSend) {
				response.json(response.jsonToSend);
			} else if (response.renderToSend) {
				response.render(
					response.renderToSend.pageToRender,
					{
						dataForPage: response.renderToSend.dataForPage
					}
				);
			} else {
				throw new Error("No response to send to client.");
			}
			console.log("Sent HTTP response");
		} catch(error) {
			console.log("ERROR '" + error + "': Rolling back transaction");
			await db.rollback();
			console.log("After rollback transaction");

			// await request.dbConnection.release();
			// console.log("DB connection released");

			handleError(error, request, response);
			// } finally {
			// Release the connection back to the pool
			// This is here to ensure we don't have any connection leaks.
			// The connection should have been released before the HTTP response was sent,
			// but if that did't happen we make sure it is released here, and log an error.
			// Unfortunately the connection pool API doesn't allow us to determine if the
			// connection has been released already, all we can do is trap the message in
			// the error it throws. Beautiful...
			// try {
			// 	await request.dbConnection.release();
			// } catch(err) {
			// 	if (err && err.message === 'Connection already released') {
			// 		// Good!
			// 	} else {
			// 		throw err;
			// 	}
			// }
		}
	} catch(err) {
		// Probably means something horrid went wrong in commit or rollback or handling an error.
		// Not sure what we can do in this case, but best to catch the error otherwise Node dies,
		// which means any other HTTP requests currently being serviced will not get a response either.
		console.log("ERROR Catch of last resort: ", err.stack);
	}
}

handleError = function(error, request, response) {
	if (error) {
		var stringifiedError = JSON.stringify(error);
		if (stringifiedError && stringifiedError.length > 2) {
			console.log("ERROR occurred: " + stringifiedError);
		} else if (error.stack) {
			console.log("ERROR stack: " + error.stack);
		} else {
			console.log("ERROR message: " + error);
		}
		console.log("ERROR... caused by the request [" + (new Date()) + "]:");
		//console.log(request);
	}
	response.sendStatus(400);
}

//Start the module listening using aws-servlerless mechanism
app.use('/', router);

//Export the module for use in AWS Lambda
module.exports = app;

