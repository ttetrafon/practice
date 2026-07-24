const req = require("request");
var self;

class PostCoderService {
  constructor(db, completionServices, config) {
    self = this;
    this.db = db;
    this.completionServices = completionServices;
    this.config = config;
    this.countriesDictionary = {
      'Afghanistan': 'AFG',
      'Albania': 'ALB',
      'Algeria': 'DZA',
      'American Samoa': 'ASM',
      'Andorra': 'AND',
      'Angola': 'AGO',
      'Anguilla': 'AIA',
      'Antigua and Barbuda': 'ATG',
      'Argentina': 'ARG',
      'Armenia': 'ARM',
      'Aruba': 'ABW',
      'Australia': 'AUS',
      'Austria': 'AUT',
      'Azerbaijan': 'AZE',
      'The Bahamas': 'BHS',
      'Bahamas': 'BHS',
      'Bahrain': 'BHR',
      'Bangladesh': 'BGD',
      'Barbados': 'BRB',
      'Belarus': 'BLR',
      'Belgium': 'BEL',
      'Belize': 'BLZ',
      'Benin': 'BEN',
      'Bermuda': 'BMU',
      'Bhutan': 'BTN',
      'Bolivia': 'BOL',
      'Bosnia and Herzegovina': 'BIH',
      'Botswana': 'BWA',
      'Brazil': 'BRA',
      'British Virgin Islands': 'VGB',
      'Brunei': 'BRN',
      'Bulgaria': 'BGR',
      'Burkina Faso': 'BFA',
      'Burundi': 'BDI',
      'Cambodia': 'KHM',
      'Cameroon': 'CMR',
      'Canada': 'CAN',
      'Cape Verde': 'CPV',
      'Cayman Islands': 'CYM',
      'Central African Republic': 'CAF',
      'Chad': 'TCD',
      'Chile': 'CHL',
      'China': 'CHN',
      'Christmas Island': 'CXR',
      'Cocos (Keeling) Islands': 'CCK',
      'Colombia': 'COL',
      'Comoros': 'COM',
      'Republic of the Congo': 'COG',
      'DR Congo': 'COG',
      'Cook Islands': 'COK',
      'Costa Rica': 'CRI',
      'Cote d\'Ivoire': 'CIV',
      'Ivory Coast': 'CIV',
      'Croatia': 'HRV',
      'Cuba': 'CUB',
      'Cyprus': 'CYP',
      'Czech Republic': 'CZE',
      'Czechia': 'CZE', //new v3 uses this instead
      'Denmark': 'DNK',
      'Djibouti': 'DJI',
      'Dominica': 'DMA',
      'Dominican Republic': 'DOM',
      'Ecuador': 'ECU',
      'Egypt': 'EGY',
      'El Salvador': 'SLV',
      'Equatorial Guinea': 'GNQ',
      'Eritrea': 'ERI',
      'Estonia': 'EST',
      'Ethiopia': 'ETH',
      'Falkland Islands (Islas Malvinas)': 'FLK',
      'Falkland Islands': 'FLK',
      'Faroe Islands': 'FRO',
      'Fiji': 'FJI',
      'Finland': 'FIN',
      'France': 'FRA',
      'French Guiana': 'GUF',
      'French Polynesia': 'PYF',
      'Gabon': 'GAB',
      'The Gambia': 'GMB',
      'Gambia': 'GMB',
      'Georgia': 'GEO',
      'Germany': 'DEU',
      'Ghana': 'GHA',
      'Gibraltar': 'GIB',
      'Greece': 'GRC',
      'Greenland': 'GRL',
      'Grenada': 'GRD',
      'Guadeloupe': 'GLP',
      'Guam': 'GUM',
      'Guatemala': 'GTM',
      'Guinea': 'GIN',
      'Guinea-Bissau': 'GNB',
      'Guyana': 'GUY',
      'Haiti': 'HTI',
      'Holy See (Vatican City)': 'VAT',
      'Honduras': 'HND',
      'Hungary': 'HUN',
      'Iceland': 'ISL',
      'India': 'IND',
      'Indonesia': 'IDN',
      'Iran': 'IRN',
      'Iraq': 'IRQ',
      'Ireland': 'IRL',
      'Israel': 'ISR',
      'Italy': 'ITA',
      'Jamaica': 'JAM',
      'Japan': 'JPN',
      'Jordan': 'JOR',
      'Kazakhstan': 'KAZ',
      'Kenya': 'KEN',
      'Kiribati': 'KIR',
      'North Korea': 'PRK',
      'South Korea': 'KOR',
      'Kuwait': 'KWT',
      'Kyrgyzstan': 'KGZ',
      'Laos': 'LAO',
      'Latvia': 'LVA',
      'Lebanon': 'LBN',
      'Lesotho': 'LSO',
      'Liberia': 'LBR',
      'Libya': 'LBY',
      'Liechtenstein': 'LIE',
      'Lithuania': 'LTU',
      'Luxembourg': 'LUX',
      'North Macedonia': 'MKD',
      'Macedonia': 'MKD',
      'Madagascar': 'MDG',
      'Malawi': 'MWI',
      'Malaysia': 'MYS',
      'Maldives': 'MDV',
      'Mali': 'MLI',
      'Malta': 'MLT',
      'Isle of Man': 'IMN',
      'Marshall Islands': 'MHL',
      'Martinique': 'MTQ',
      'Mauritania': 'MRT',
      'Mauritius': 'MUS',
      'Mayotte': 'MYT',
      'Mexico': 'MEX',
      'Federated States of Micronesia': 'FSM',
      'Micronesia': 'FSM',
      'Moldova': 'MDA',
      'Monaco': 'MCO',
      'Mongolia': 'MNG',
      'Montserrat': 'MSR',
      'Morocco': 'MAR',
      'Mozambique': 'MOZ',
      'Myanmar (Burma)': 'MMR',
      'Myanmar': 'MMR',
      'Namibia': 'NAM',
      'Nauru': 'NRU',
      'Nepal': 'NPL',
      'Netherlands': 'NLD',
      'Netherlands Antilles': 'ANT',
      'New Caledonia': 'NCL',
      'New Zealand': 'NZL',
      'Nicaragua': 'NIC',
      'Niger': 'NER',
      'Nigeria': 'NGA',
      'Niue': 'NIU',
      'Norfolk Island': 'NFK',
      'Northern Mariana Islands': 'MNP',
      'Norway': 'NOR',
      'Oman': 'OMN',
      'Pakistan': 'PAK',
      'Palau': 'PLW',
      'Palestinian Territory': 'PSE',
      'Palestine': 'PSE',
      'Panama': 'PAN',
      'Papua New Guinea': 'PNG',
      'Paraguay': 'PRY',
      'Peru': 'PER',
      'Philippines': 'PHL',
      'Pitcairn Islands': 'PCN',
      'Poland': 'POL',
      'Portugal': 'PRT',
      'Puerto Rico': 'PRI',
      'Qatar': 'QAT',
      'Reunion': 'REU',
      'Romania': 'ROU',
      'Russia': 'RUS',
      'Rwanda': 'RWA',
      'Saint Kitts and Nevis': 'KNA',
      'Saint Lucia': 'LCA',
      'Saint Pierre and Miquelon': 'SPM',
      'Saint Vincent and the Grenadines': 'VCT',
      'San Marino': 'SMR',
      'Sao Tome and Principe': 'STP',
      'Saudi Arabia': 'SAU',
      'Senegal': 'SEN',
      'Seychelles': 'SYC',
      'Sierra Leone': 'SLE',
      'Singapore': 'SGP',
      'Slovakia': 'SVK',
      'Slovenia': 'SVN',
      'Solomon Islands': 'SLB',
      'Somalia': 'SOM',
      'South Africa': 'ZAF',
      'Spain': 'ESP',
      'Sri Lanka': 'LKA',
      'Sudan': 'SDN',
      'Suriname': 'SUR',
      'Svalbard': 'SJM',
      'Svalbard and Jan Mayen': 'SJM',
      'Eswatini': 'SWZ',
      'Sweden': 'SWE',
      'Switzerland': 'CHE',
      'Syria': 'SYR',
      'Taiwan': 'TWN',
      'Tajikistan': 'TJK',
      'Tanzania': 'TZA',
      'Thailand': 'THA',
      'Togo': 'TGO',
      'Tokelau': 'TKL',
      'Tonga': 'TON',
      'Trinidad and Tobago': 'TTO',
      'Tunisia': 'TUN',
      'Turkey': 'TUR',
      'Turkmenistan': 'TKM',
      'Turks and Caicos Islands': 'TCA',
      'Tuvalu': 'TUV',
      'Uganda': 'UGA',
      'Ukraine': 'UKR',
      'United Arab Emirates': 'ARE',
      'United Kingdom': 'GBR',
      'United States': 'USA',
      'United States Minor Outlying Islands': 'UMI',
      'Uruguay': 'URY',
      'Uzbekistan': 'UZB',
      'Vanuatu': 'VUT',
      'Venezuela': 'VEN',
      'Vietnam': 'VNM',
      'Virgin Islands': 'VIR',
      'Wallis and Futuna': 'WLF',
      'Western Sahara': 'ESH',
      'Western Samoa': 'WSM',
      'Samoa': 'WSM',
      'Yemen': 'YEM',
      'Democratic Republic of the Congo': 'COD',
      'Republic of the Congo': 'COD',
      'Zambia': 'ZMB',
      'Zimbabwe': 'ZWE',
      'Hong Kong': 'HKG',
      'Macau': 'MAC',
      'Antarctica': 'ATA',
      'Bouvet Island': 'BVT',
      'British Indian Ocean Territory': 'IOT',
      'French Southern and Antarctic Lands': 'ATF',
      'Heard Island and McDonald Islands': 'HMD',
      'Saint Helena': 'SHN',
      'Saint Helena, Ascension and Tristan da Cunha': 'SHN',
      'South Georgia and the South Sandwich Islands': 'SGS',
      'South Georgia': 'SGS',
      'Guernsey': 'GGY',
      'Serbia': 'SRB',
      'Saint Barthélemy': 'BLM',
      'Montenegro': 'MNE',
      'Jersey': 'JEY',
      'Curaçao': 'CUW',
      'Saint Martin': 'MAF',
      'Sint Maarten': 'SXM',
      'Timor-Leste': 'TLS',
      'South Sudan': 'SSD',
      'Åland Islands': 'ALA',
      'Bonaire': 'BES',
      'Republic of Kosovo': 'UNK',
      'Kosovo': 'UNK'
    }
  }

  //NOT USED IN V3
  /**
   * This method receives a player token and a postcode.
   * Based on the address already stored in the db for the specific player, it goes:
   * null -> will use the PostCoder API to reply with a list of addresses that match the provided postcode
   * s_# -> As long as # is less than the maximum allowed searches, it will do as above.
   * s_# -> If # greater than the maximum allowed searches it will return an empty array and the user will have to set the adddress manually.
   * f_... -> Since the address is already found, it will respond with the address.
   */
  async getAddress(request, response) {
    console.log("\n---> GetAddress()");
    var maxSearches = this.config.POSTCODER_MAX_SEARCHES;
    var playerToken = request.body.playerToken;
    if (!request.body.hasOwnProperty("postcode") && (!request.body.postcode)) {
      throw new Error("A postcode has not been submitted.");
    }
    var postcode = request.body.postcode.trim().toUpperCase();
    var status = await this.db.getPlayerAddressStatus(playerToken);
    if (status.length === 0) {
      throw new Error('The player was not found in the database.');
    }
    var addressStatus = status[0].playerAddressStatus;
    var addressSearches = status[0].playerAddressSearches;
    var responseObj = {
      "address": {}
    }
    console.log('current stored address statues: ' + addressStatus + '; searches: ' + addressSearches);
    // If the address is already found, do not call PostCoder, instead just return the address back and the appropriate completionCode.
    /*if (addressStatus == 1) {
        console.log("address already known...");
        var email = await this.db.getUserEmail(playerToken);
        var ageVerified = await this.db.isAgeVerified(playerToken, request);
        responseObj[ageVerified] = ageVerified;
        await this.completionServices.sendFailResponse(request, response, self.completionServices.completionCodes.POSTCODER_ADDRESS_ALREADY_FOUND, responseObj);
        return;
    }*/

    // On the other cases, determine how many times a search has been attempted, and either do a search or return an empty array so that the user will have to manually input the address.
    // Do not search if the maximum number  of searches has been reached.
    if (addressSearches >= maxSearches) {
      await this.completionServices.sendFailResponse(request, response, self.completionServices.completionCodes.POSTCODER_TOO_MANY_SEARCHES, responseObj);
      return;
    }
    // Otherwise, send a request to the PostCoder service.
    // Set up the API call.
    var country = "uk";
    const API_KEY = "PCWSH-WZXV5-K23Y4-ZWJR5";
    const address_url = `https://ws.postcoder.com/pcw/${ API_KEY }/address/${ country }/${ postcode }`;
    // Make the call.
    try {
      var body = await self.promisifyReq(address_url);
    } catch (err) {
      console.log('PostCoder API... failure :/ ', err);
      this.completionServices.sendFailResponse(request, response, self.completionServices.completionCodes.POSTCODER_ADDRESS_NOT_FOUND, responseObj);
      return;
    }

    console.log('PostCoder API... success!');
    addressSearches += 1;
    await this.db.setPlayerAddressSearches(playerToken, addressSearches);
    var addresses = JSON.parse(body);
    for (var i = 0; i < addresses.length; i++) {
      responseObj.address[addresses[i].summaryline] = addresses[i];
    }

    this.completionServices.sendOkResponse(request, response, responseObj);
  }

  //NOT USED IN V3
  /**
   * This method receives a selected or manual address from the user (TP-MPA) and stores it in the database.
   */
  async setAddress(request, response) {
    console.log("\n---> SetAddress()");
    var playerToken = request.body.playerToken;
    var address1 = request.body.addressLine1.trim();
    var address2 = request.body.addressLine2.trim();
    var address3 = request.body.addressLine3.trim();
    var address4 = request.body.addressLine4.trim();
    var country = request.body.country.trim();
    var countryCode = '';
    if (this.countriesDictionary.hasOwnProperty(country)) {
      var countryCode = this.countriesDictionary[country];
    }
    else {
      console.log('ERROR address cannot be set due to wrong country code.');
      await this.completionServices.sendFailResponse(request, response, this.completionServices.completionCodes.POSTCODER_COUNTRY_NOT_VALID);
      return;
    }
    var postcode = (request.body.postcode).toUpperCase().split(' ').join('');
    var ageVerified = await this.db.isAgeVerified(playerToken, request);
    try {
      await this.db.setPlayerAddress(playerToken, address1, address2, address3, address4, countryCode, postcode);
      await this.db.setPlayerAddressStatus(playerToken, 1);
      var operatorWallets = await self.db.getAllOperatorWallets(playerToken, request);

      var additionalProperties = {
        operatorWallets: operatorWallets,
        ageVerified: ageVerified
      }

      await this.completionServices.sendOkResponse(request, response, additionalProperties);
      return;
    }
    catch (error) {
      await this.completionServices.sendFailResponse(request, response, this.completionServices.POSTCODER_FAILED_TO_SET_ADDRESS, responseObj);
      return;
    }
  }

  //NOT USED IN V3
  promisifyReq(reqParam) {
    return new Promise(function (resolve, reject) {
      req(reqParam, function (error, resp, body) {
        console.log("Req.post result, res: ", resp);
        console.log("Req.post result, body: ", body);
        if (error || resp.statusCode != 200) {
          console.log("Req.post result, ERROR: ", error);
          reject(error);
        } else {
          resolve(body);
        }
      });
    });
  }


  /****************************************************************************************
   * V3 METHODS
   ****************************************************************************************/

  /**
   * This method receives a player token and a postcode.
   * Based on the address already stored in the db for the specific player, it goes:
   * null -> will use the PostCoder API to reply with a list of addresses that match the provided postcode
   * s_# -> As long as # is less than the maximum allowed searches, it will do as above.
   * s_# -> If # greater than the maximum allowed searches it will return an empty array and the user will have to set the adddress manually.
   * f_... -> Since the address is already found, it will respond with the address.
   */
  async getAddressV3(request, response) {
    console.log("==>GetAddressV3");

    const maxSearches = this.config.POSTCODER_MAX_SEARCHES;
    const playerToken = request.body.playerToken;
    if (!request.body.hasOwnProperty("postcode") && (!request.body.postcode)) {
      throw new Error("A postcode has not been submitted.");
    }
    const postcode = request.body.postcode.trim().toUpperCase();
    const status = await this.db.getPlayerAddressStatus(playerToken);
    if (status.length === 0) {
      throw new Error('The player was not found in the database.');
    }
    const addressStatus = status[0].playerAddressStatus;
    let addressSearches = status[0].playerAddressSearches;
    let responseObj = {
      "address": {}
    }
    console.log('current stored address statues: ' + addressStatus + '; searches: ' + addressSearches);

    // On the other cases, determine how many times a search has been attempted, and either do a search or return an empty array so that the user will have to manually input the address.
    // Do not search if the maximum number  of searches has been reached.
    if (addressSearches >= maxSearches) {
      await self.completionServices.sendFailResponse(request, response, self.completionServices.completionCodes.POSTCODER_TOO_MANY_SEARCHES, responseObj);
      return;
    }
    // Otherwise, send a request to the PostCoder service.
    // Set up the API call.
    const country = "uk";
    const API_KEY = "PCWSH-WZXV5-K23Y4-ZWJR5";
    const address_url = `https://ws.postcoder.com/pcw/${ API_KEY }/address/${ country }/${ postcode }`;
    // Make the call.
    try {
      var body = await self.promisifyReqV3(address_url);
    } catch (err) {
      console.log('PostCoder API... failure :/ ', err);
      await self.completionServices.sendFailResponse(request, response, self.completionServices.completionCodes.POSTCODER_ADDRESS_NOT_FOUND, responseObj);
      return;
    }

    console.log('PostCoder API... success!');
    addressSearches += 1;
    await this.db.setPlayerAddressSearches(playerToken, addressSearches);

    let addresses = JSON.parse(body);

    if (addresses.length == 0) {
      await self.completionServices.sendFailResponse(request, response, self.completionServices.completionCodes.POSTCODER_ADDRESS_NOT_FOUND, responseObj);
      return;
    }

    responseObj.address = [];
    for (var i = 0; i < addresses.length; i++) {
      addresses[i].id = i;
      responseObj.address.push(addresses[i]);
    }

    await self.completionServices.sendOkResponse(request, response, responseObj);
  }

  /**
   * This method receives a selected or manual address from the user (TP-MPA) and stores it in the database.
   */
  async setAddressV3(request, response) {
    console.log("==>SetAddressV3");
    const playerToken = request.body.playerToken;
    const address1 = request.body.addressLine1.trim();
    const address2 = request.body.addressLine2 ? request.body.addressLine2.trim() : null;
    const address3 = request.body.addressLine3.trim();
    const address4 = request.body.addressLine4 ? request.body.addressLine4.trim() : null;
    const country = request.body.country.trim();
    let countryCode = '';
    if (this.countriesDictionary.hasOwnProperty(country)) {
      countryCode = this.countriesDictionary[country];
    }
    else {
      console.log('ERROR address cannot be set due to wrong country code.');
      await this.completionServices.sendFailResponse(request, response, self.completionServices.completionCodes.POSTCODER_COUNTRY_NOT_VALID);
      return;
    }
    const postcode = (request.body.postcode).toUpperCase().split(' ').join('');

    try {
      await self.db.setPlayerAddress(playerToken, address1, address2, address3, address4, countryCode, postcode);
      await self.db.setPlayerAddressStatus(playerToken, 1);

      await self.completionServices.sendOkResponse(request, response);
      return;
    }
    catch (error) {
      await self.completionServices.sendFailResponse(request, response, this.completionServices.POSTCODER_FAILED_TO_SET_ADDRESS);
      return;
    }
  }

  promisifyReqV3(reqParam) {
    return new Promise(function (resolve, reject) {
      req(reqParam, function (error, resp, body) {
        console.log("Req.post result, res: ", resp);
        console.log("Req.post result, body: ", body);
        if (error || resp.statusCode != 200) {
          console.log("Req.post result, ERROR: ", error);
          reject(error);
        } else {
          resolve(body);
        }
      });
    });
  }
}

module.exports = PostCoderService;
