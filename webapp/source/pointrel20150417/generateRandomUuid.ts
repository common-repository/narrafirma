// From Dojo 1.10.4
import kludgeForUseStrict = require("../kludgeForUseStrict");

"use strict";

function generateRandomUuid(className: string) {
    // summary:
    //        This function generates random UUIDs, meaning "version 4" UUIDs.
    // description:
    //        A typical generated value would be something like this:
    //        "3b12f1df-5232-4804-897e-917bf397618a"
    //
    //        For more information about random UUIDs, see sections 4.4 and
    //        4.5 of RFC 4122: http://tools.ietf.org/html/rfc4122#section-4.4
    //
    //        This generator function is designed to be small and fast,
    //        but not necessarily good.
    //
    //        Small: This generator has a small footprint. Once comments are
    //        stripped, it's only about 25 lines of code, and it doesn't
    //        dojo.require() any other modules.
    //
    //        Fast: This generator can generate lots of new UUIDs fairly quickly
    //        (at least, more quickly than the other dojo UUID generators).
    //
    //        Not necessarily good: We use Math.random() as our source
    //        of randomness, which may or may not provide much randomness.
    // examples:
    //        const string = dojox.uuid.generateRandomUuid();
    const HEX_RADIX = 16;

    function _generateRandomEightCharacterHexString() {
        // Make random32bitNumber be a randomly generated floating point number
        // between 0 and (4,294,967,296 - 1), inclusive.
        const random32bitNumber = Math.floor( (Math.random() % 1) * Math.pow(2, 32) );
        let eightCharacterHexString = random32bitNumber.toString(HEX_RADIX);
        while (eightCharacterHexString.length < 8) {
            eightCharacterHexString = "0" + eightCharacterHexString;
        }
        return eightCharacterHexString; // for example: "3B12F1DF"
    }

    const hyphen = "-";
    const versionCodeForRandomlyGeneratedUuids = "4"; // 8 == binary2hex("0100")
    const variantCodeForDCEUuids = "8"; // 8 == binary2hex("1000")
    let a = _generateRandomEightCharacterHexString();
    let b = _generateRandomEightCharacterHexString();
    b = b.substring(0, 4) + hyphen + versionCodeForRandomlyGeneratedUuids + b.substring(5, 8);
    let c = _generateRandomEightCharacterHexString();
    c = variantCodeForDCEUuids + c.substring(1, 4) + hyphen + c.substring(4, 8);
    let d = _generateRandomEightCharacterHexString();
    let returnValue = a + hyphen + b + hyphen + c + d;
    returnValue = returnValue.toLowerCase();
    return className + "_" + returnValue; // String
}

export = generateRandomUuid;
