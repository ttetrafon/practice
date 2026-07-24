let initialRules = {
    textReq: {
        type: "string",
        required: 1,
    },
    mfa: {
        expression: "^[0-9]{6}$",
        required: 1,
        type: "string"
    }
}

function buildValidationRules(rules) {
    console.log("---> buildValidationRules()", rules);
    final = rules;
    Object.getOwnPropertyNames(rules).map(
        key => final[key] = new Validation_Rule(rules[key])
    );
    return final;
}

class Validation_Rule {
    constructor(rule) {
        this.type = rule.type;
        this.required = rule.required > 0;
        this.regex = (rule.regex ? rule.regex : null);
        this.min = (rule.min ? rule.min : null);
        this.max = (rule.max ? rule.max : null);
        this.maxDecimalPlaces = (rule.maxDecimalPlaces ? rule.maxDecimalPlaces : 2);
    }
}

console.log(buildValidationRules(initialRules));
