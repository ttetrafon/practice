var self;

class Config {

  constructor() {
    console.log("Config constructor");
    self = this;

    this.POSTCODER_MAX_SEARCHES = 5;

    // If a player's balance is less than this amount, then they have to withdraw the full balance.
    this.TAP_AND_PLAY_LOGO_URL = "https://s3.eu-west-2.amazonaws.com/public.images.gamepaymenttechnology.co.uk/public-images/GP.png";
    this.TAP_AND_PLAY_LOGO_TEST_URL = "https://s3.eu-west-2.amazonaws.com/public.images.gamepaymenttechnology.co.uk/public-images/GP-Test.png";
    this.ACCEPTED_PAYMENT_LOGOS_URL = "https://s3.eu-west-2.amazonaws.com/public.images.gamepaymenttechnology.co.uk/public-images/acceptedPaymentLogos.png";

    //Yoti age verification info
    this.YOTI_SDK_ID = "47ea81a9-b0db-4afa-9191-66c4389bd5d0";
    this.YOTI_PEM_FILE = './keys/ageSecurity.pem';
    this.YOTI_REFID = 'https://api.yoti.com/api/v1.1/qrcodes/refs/'

    this.SIGN_UP_EMAIL_SUBJECT = 'Game Payment – terms and conditions and privacy policy';
    this.EMAIL_SOURCE = 'donotreply@gamepayment.technology';

    this.PRIVACY_POLICY_URL = 'http://legal.gamepayment.technology/Game%20Payment%20Privacy%20Policy.html';
    this.TERMS_AND_CONDITIONS_URL = 'http://legal.gamepayment.technology/Game%20Payment%20Terms%20and%20Conditions.html';
    this.KNOWLEDGE_BASE_URL = 'https://gamepayment.freshdesk.com/support/home';
    this.SUPPORT_TICKET_URL = 'https://gamepayment.freshdesk.com/support/tickets/new';

    this.YOTI_CLIENT_SDK_ID = '47ea81a9-b0db-4afa-9191-66c4389bd5d0';
    this.YOTI_SCENARIO_ID = '48a075af-7509-49ea-a1f0-bc902673a31a';
  }

  getAllowedCountryCodeList() {
    return ['AND', 'AUT', 'AZE', 'BLR', 'BIH', 'BGR', 'CYP', 'DNK', 'EST', 'FRA', 'GEO', 'DEU', 'GIB', 'GRC', 'IRL',
      'ITA', 'LUX', 'MLT', 'MCO', 'NLD', 'NOR', 'ROU', 'SMR', 'SVK', 'SVN', 'ESP', 'SWE', 'UKR', 'GBR', 'SRB', 'MNE',
    ]
  }

  getBlockedCountryCodeList() {
    return [
      'AFG', 'ALB', 'DZA', 'ASM', 'AGO', 'AIA', 'ATG', 'ARG', 'ARM', 'ABW', 'AUS', 'BHS', 'BHR', 'BGD', 'BRB', 'BEL', 'BLZ', 'BEN', 'BMU',
      'BTN', 'BOL', 'BWA', 'BRA', 'VGB', 'BRN', 'BFA', 'BDI', 'KHM', 'CMR', 'CAN', 'CPV', 'CYM', 'CAF', 'TCD', 'CHL', 'CHN', 'CXR', 'CCK',
      'COL', 'COM', 'COG', 'COK', 'CRI', 'CIV', 'HRV', 'CUB', 'CZE', 'DJI', 'DMA', 'DOM', 'ECU', 'EGY', 'SLV', 'GNQ', 'ERI', 'ETH', 'FLK',
      'FRO', 'FJI', 'FIN', 'GUF', 'PYF', 'GAB', 'GMB', 'GHA', 'GRL', 'GRD', 'GLP', 'GUM', 'GTM', 'GIN', 'GNB', 'GUY', 'HTI', 'VAT', 'HND',
      'HUN', 'ISL', 'IND', 'IDN', 'IRN', 'IRQ', 'ISR', 'JAM', 'JPN', 'JOR', 'KAZ', 'KEN', 'KIR', 'PRK', 'KOR', 'KWT', 'KGZ', 'LAO', 'LVA',
      'LBN', 'LSO', 'LBR', 'LBY', 'LIE', 'LTU', 'MKD', 'MDG', 'MWI', 'MYS', 'MDV', 'MLI', 'IMN', 'MHL', 'MTQ', 'MRT', 'MUS', 'MYT', 'MEX',
      'FSM', 'MDA', 'MNG', 'MSR', 'MAR', 'MOZ', 'MMR', 'NAM', 'NRU', 'NPL', 'ANT', 'NCL', 'NZL', 'NIC', 'NER', 'NGA', 'NIU', 'NFK', 'MNP',
      'OMN', 'PAK', 'PLW', 'PSE', 'PAN', 'PNG', 'PRY', 'PER', 'PHL', 'PCN', 'POL', 'PRT', 'PRI', 'QAT', 'REU', 'RUS', 'RWA', 'KNA', 'LCA',
      'SPM', 'VCT', 'STP', 'SAU', 'SEN', 'SYC', 'SLE', 'SGP', 'SLB', 'SOM', 'ZAF', 'LKA', 'SDN', 'SUR', 'SJM', 'SWZ', 'CHE', 'SYR', 'TWN',
      'TJK', 'TZA', 'THA', 'TGO', 'TKL', 'TON', 'TTO', 'TUN', 'TUR', 'TKM', 'TCA', 'TUV', 'UGA', 'ARE', 'USA', 'UMI', 'URY', 'UZB', 'VUT',
      'VEN', 'VNM', 'VIR', 'WLF', 'ESH', 'WSM', 'YEM', 'COD', 'ZMB', 'ZWE', 'HKG', 'MAC', 'ATA', 'BVT', 'IOT', 'ATF', 'HMD', 'SHN', 'SGS',
      'GGY', 'BLM', 'JEY', 'CUW', 'MAF', 'SXM', 'TLS', 'SSD', 'ALA', 'BES', 'UNK'
    ]
  }

  getBlockedCountryList() {
    return [
      'Afghanistan', 'Albania', 'Algeria', 'American Samoa', 'Angola', 'Anguilla', 'Antigua and Barbuda', 'Argentina', 'Armenia',
      'Aruba', 'Australia', 'The Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belgium', 'Belize', 'Benin', 'Bermuda', 'Bhutan',
      'Bolivia', 'Botswana', 'Brazil', 'British Virgin Islands', 'Brunei', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon',
      'Canada', 'Cape Verde', 'Cayman Islands', 'Central African Republic', 'Chad', 'Chile', 'China', 'Christmas Island',
      'Cocos (Keeling) Islands', 'Colombia', 'Comoros', 'Republic of the Congo', 'Cook Islands', 'Costa Rica', 'Cote d\'Ivoire',
      'Croatia', 'Cuba', 'Czech Republic', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador',
      'Equatorial Guinea', 'Eritrea', 'Ethiopia', 'Falkland Islands (Islas Malvinas)', 'Faroe Islands', 'Fiji', 'Finland',
      'French Guiana', 'French Polynesia', 'Gabon', 'The Gambia', 'Ghana', 'Greenland', 'Grenada', 'Guadeloupe', 'Guam',
      'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Holy See (Vatican City)', 'Honduras', 'Hungary', 'Iceland',
      'India', 'Indonesia', 'Iran', 'Iraq', 'Israel', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'North Korea',
      'South Korea', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania',
      'North Macedonia', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Isle of Man', 'Marshall Islands', 'Martinique',
      'Mauritania', 'Mauritius', 'Mayotte', 'Mexico', 'Federated States of Micronesia', 'Moldova', 'Mongolia', 'Montserrat',
      'Morocco', 'Mozambique', 'Myanmar (Burma)', 'Namibia', 'Nauru', 'Nepal', 'Netherlands Antilles', 'New Caledonia', 'New Zealand',
      'Nicaragua', 'Niger', 'Nigeria', 'Niue', 'Norfolk Island', 'Northern Mariana Islands', 'Oman', 'Pakistan', 'Palau',
      'Palestinian Territory', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Pitcairn Islands', 'Poland',
      'Portugal', 'Puerto Rico', 'Qatar', 'Reunion', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Pierre and Miquelon',
      'Saint Vincent and the Grenadines', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Seychelles', 'Sierra Leone', 'Singapore',
      'Solomon Islands', 'Somalia', 'South Africa', 'Sri Lanka', 'Sudan', 'Suriname', 'Svalbard', 'Eswatini', 'Switzerland', 'Syria',
      'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Togo', 'Tokelau', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey',
      'Turkmenistan', 'Turks and Caicos Islands', 'Tuvalu', 'Uganda', 'United Arab Emirates', 'United States', 'United States Minor Outlying Islands',
      'Uruguay', 'Uzbekistan', 'Vanuatu', 'Venezuela', 'Vietnam', 'Virgin Islands', 'Wallis and Futuna', 'Western Sahara',
      'Western Samoa', 'Yemen', 'Democratic Republic of the Congo', 'Zambia', 'Zimbabwe', 'Hong Kong', 'Macau', 'Antarctica', 'Bouvet Island',
      'British Indian Ocean Territory', 'French Southern and Antarctic Lands', 'Heard Island and McDonald Islands', 'Saint Helena',
      'South Georgia and the South Sandwich Islands', 'Guernsey', 'Saint Barthélemy', 'Jersey', 'Curaçao', 'Saint Martin',
      'Sint Maarten', 'Timor-Leste', 'South Sudan', 'Åland Islands', 'Bonaire', 'Republic of Kosovo'
    ]
  }

  dbName() {
    return self.getProperty("DB_NAME");
  }

  dbSecretKey() {
    return self.getProperty("DB_SECRET_KEY");
  }

  cyberSourceSecretKey() {
    return self.getProperty("CYBERSOURCE_SECRET_KEY");
  }

  cognitoUserPoolId() {
    return self.getProperty("COGNITO_USER_POOL_ID");
  }

  cognitoAppClientId() {
    return self.getProperty("COGNITO_APP_CLIENT_ID");
  }

  paymentProviderAccount() {
    return self.getProperty("PAYMENT_PROVIDER_ACCOUNT");
  }

  operatorWalletToken() {
    return self.getProperty("OPERATOR_WALLET_TOKEN");
  }

  getSignUpEmail(playerName) {

    var emailText = {};

    emailText.source = self.EMAIL_SOURCE;
    emailText.subject = 'Game Payment – terms and conditions and privacy policy';

    emailText.message = '<html><head></head><body><p>Dear ' + playerName + '<br><br>' +
      'Welcome to Game Payment from Game Payment Technology Limited (GPT).   Thank you for registering with us.  When you registered, you agreed to the ' +
      '<a href="' + this.TERMS_AND_CONDITIONS_URL + '">Terms and Conditions</a> and <a href="' + this.PRIVACY_POLICY_URL + '">Privacy Policy</a>.<br><br>' +
      'Game Payment is committed to ensuring that players play responsibly and understand the terms and conditions and privacy policy.  To help you understand them, we would like to draw your attention to some of the key points:<br><br>' +
      '<strong>The Services:</strong><br>' +
      'The Game Payment Services allow you to credit your Game Payment wallet using a debit card for the purpose of purchasing credit to be used on gaming machines and non-gaming machines.  The Game Payment Services may also help you to responsibly manage and track your purchase of credit via the app using our safer gambling tools.<br><br>' +
      'GPT is not responsible for the gaming services and non-gaming services that you purchase using the app. Any dispute with a third-party provider regarding any product or service purchased by you using the app is between you and the third-party provider. We do not provide any warranties, representations, conditions, or guarantees with respect to such services.<br><br>' +
      '<strong>Safer Gambling:</strong><br>' +
      'Game Payment wants all customers to play responsibly.  We offer a number of tools to help you stay in control, all accessible from the Safer Gambling page of the app:' +
      '<ul><li>Gaming Spend Limit: Game Payment includes the ability for you to set your own weekly deposit limit.  As a new account holder, you have a weekly net spend limit of £100 which you can spend in gaming machines.  Within the Safer Gambling page of Game Payment you can review and request a change to your gaming spend limit.</li>' +
      '<li>Transaction History: Game Payment allows you to see all transactions for up to the last 6 months from within the app.  If you want the data for a longer period, please contact us using the support page in the app.</li>' +
      '<li>Take a Break: you can take a break of between 1 week and 6 months, during which time you will not be able to use the app.</li>' +
      '<li>Close Your Account: allows you to permanently close your account.</li></ul>' +
      '<strong>How We Contact You:</strong><br>' +
      'If we have to contact you, we will do so using the contact details you have provided to us within the app.<br><br>' +
      '<strong>Who May Use the Game Payment App?</strong><br>' +
      'The app and the services are intended to be used by players who uses gaming services and non-gaming services located within the UK only.  You must be 18 or over to use gaming services – it is a criminal offence in the UK to gamble if you are aged under 18.  In accepting the terms and conditions, you have confirmed that you do not have a gambling addiction, are not self-excluded from gambling, and do not suffer from any other issues relating to gambling.<br><br>' +
      '<strong>Acceptable Use:</strong><br>' +
      'You are responsible for the fair and acceptable use of your Game Payment account.   Your account must not be used for any fraudulent or unlawful activity.  The terms and conditions outline what we consider to be fraudulent or unlawful and the steps we may take if an account is used in this way.<br><br>' +
      '<strong>Deposits and Withdrawals:</strong><br>' +
      'Game Payment will only allow you to deposit money into your wallet using a debit card.  The card must be registered to the same address as your account.  Any withdrawals must be transferred to the debit card which you used to credit your Game Payment wallet.<br><br>' +
      '<strong>Closing Accounts:</strong><br>' +
      'You may close your account at any time using the Close Account option within the app.  We reserve the right, at our reasonable discretion, to close or suspend your account and/or void any plays and/or withhold your account balance and/or recover from your account the amount of any affected winnings or bonuses and/or implement a permanent ban from our services for the reasons that are outlined in the terms and conditions.<br><br>' +
      'If you have any questions about the Game Payment services, terms and conditions, or privacy policy, please check our <a href="' + this.KNOWLEDGE_BASE_URL + '">knowledge base</a> or contact us by raising a <a href="' + this.SUPPORT_TICKET_URL + '">support ticket</a>.</body></html>';

    return emailText;
  }

  getUsernameExistsEmail(playerName) {

    var emailText = {};

    emailText.source = self.EMAIL_SOURCE;
    emailText.subject = 'Game Payment – email already exists';

    emailText.message = '<html><head></head><body><p>Dear ' + playerName + '<br><br>' +
      'An attempt was made today to register a Game Payment account using this email address.  Because this email address is already registered with the Game Payment app the registration was unsuccessful.  If you have forgotten your password, you can use the forgot password option in the Game Payment app.<br><br>'
      + 'If you have any concerns about this, please contact <a href="' + this.SUPPORT_TICKET_URL + '">support</a>.<br><br>'
      + 'Regards,<br><br>'
      + 'Game Payment Technology</body></html>';

    return emailText;
  }

  getProperty(propertyName) {
    if (process.env[propertyName]) {
      console.log("Property " + propertyName + " is an env var value is [" + process.env[propertyName] + "]");
      return process.env[propertyName];
    } else {
      // console.log("ARGV IS: ", process.argv);
      // for (var i = 0; i < process.argv.length; i++) {
      for (const arg of process.argv) {
        //var arg = process.argv[i];
        // console.log("One of the Args is: ", arg);
        var prefix = "--" + propertyName + "=";
        if (arg.startsWith(prefix)) {
          var propertyValue = arg.replace(prefix, "");
          // console.log("Property " + propertyName + " is: ", propertyValue);
          return propertyValue;
        }
      }
      throw "Cannot determine value for property: " + propertyName;
    }
  }
}

module.exports = Config;
