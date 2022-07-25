var self;

class MpaConfiguration {
  constructor(db, completionServices, config) {
    self = this;
    this.db = db;
    this.completionServices = completionServices;
    this.config = config;
  }

  /**
   * This is called by the MPA before the player logs in, so do not return any sensitive info.
   * @param {*} request
   * @param {*} response
   */
  async initialConfig(request, response) {

    const operatorWalletToken = self.config.operatorWalletToken();
    const operatorWalletStyle = await self.db.getOperatorWalletStyleV3(operatorWalletToken);
    var initialConfig = {
      termsAndConditionsUrl: 'http://legal.gamepayment.technology/Game%20Payment%20Terms%20and%20Conditions.html',
      privacyPolicyUrl: "http://legal.gamepayment.technology/Game%20Payment%20Privacy%20Policy.html",
      beGambleAwareUrl: 'https://www.begambleaware.org/',
      gamcareUrl: 'https://www.gamcare.org.uk',
      gamblingTherapyUrl: 'https://www.gamblingtherapy.org',
      gamblersAnonymousUrl: 'https://www.gamblersanonymous.org.uk',
      gordonMoodyUrl: 'https://www.gordonmoody.org.uk',
      yotiInfoUrl: 'https://www.yoti.com/personal/',
      findVenuesUrl: 'https://www.gamepayment.technology/where-to-play/',
      supportUrl: 'https://gamepayment.freshdesk.com/support/home',
      supportUrlRaiseTicket: 'https://gamepayment.freshdesk.com/support/tickets/new',
      applicationWebsite: 'app.gamepayment.technology',
      yotiFaceCaptureStartTimeout: 3000,
      defaultCurrencySymbol: '£',
      inputValidation: {
        nameValidation: "/^[a-zA-Z][a-zA-Z '-]{0,254}$/",
        phoneNumberValidation: "/^[0-9]{7,15}$/",
        usernameValidation: "/^([A-Za-z0-9._%+-]+@([a-z0-9-]+\\.)+[a-z]+(.[a-z]+)*)$/",
        passwordValidation: "/^(?=.{8,})(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!\\^\\$\\*.\\[\\]{}\\(\\)?\\-@#%&\\/,<>':;|_~`\\/\\\\+\\=\"])[0-9A-Za-z!\\^\\$\\*\\.\\[\\]{}\\(\\)?\\-@#%&\\/,<>':;|_~`\\/\\\\+\\=\"]*$/",
        dateValidation: "/^[0-3][0-9]\\-[01][0-9]\\-[0-9]{4}$/",
        confirmationCodeValidation: "/^[0-9]{6}$/",
        addressParts: "/^[A-Za-z0-9 .,'-/]{0,60}$/",
        postcode: "/^[A-Za-z0-9 ]{3,12}$/",
        playerCardExpiryDate: "/^(0[1-9]|1[0-2])\\/\\d{4}$/",
        bluetoothMacAddressValidation: "^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$"
      },
      colourSchemes: JSON.parse(operatorWalletStyle),
      allowedCountryList: [
        'Andorra',
        'Austria',
        'Azerbaijan',
        'Belarus',
        'Bosnia and Herzegovina',
        'Bulgaria',
        'Cyprus',
        'Denmark',
        'Estonia',
        'France',
        'Georgia',
        'Germany',
        'Gibraltar',
        'Greece',
        'Ireland',
        'Italy',
        'Luxembourg',
        'Malta',
        'Monaco',
        'Netherlands',
        'Norway',
        'Romania',
        'San Marino',
        'Slovakia',
        'Slovenia',
        'Spain',
        'Sweden',
        'Ukraine',
        'United Kingdom',
        'Serbia',
        'Montenegro'
      ]
    }
    self.completionServices.sendOkResponse(request, response, initialConfig);
  }
}

module.exports = MpaConfiguration;
