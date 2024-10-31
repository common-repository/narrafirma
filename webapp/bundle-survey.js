// From CryptoJS: http://crypto-js.googlecode.com/svn/tags/3.1.2/src/sha256.js
define('js/pointrel20150417/sha256',["require", "exports"], function (require, exports) {
    "use strict";
    /* tslint:disable no-bitwise */
    /**
     * CryptoJS namespace.
     */
    var C = {
        SHA256: undefined
    };
    /**
     * Base object for prototypal inheritance.
     */
    var Base = (function () {
        function F() { }
        return {
            /**
             * Creates a new object that inherits from this object.
             *
             * @param {Object} overrides Properties to copy into the new object.
             *
             * @return {Object} The new object.
             *
             * @static
             *
             * @example
             *
             *     var MyType = CryptoJS.lib.Base.extend({
             *         field: 'value',
             *
             *         method: function () {
             *         }
             *     });
             */
            extend: function (overrides) {
                if (overrides === void 0) { overrides = undefined; }
                // Spawn
                F.prototype = this;
                var subtype = new F();
                // Augment
                if (overrides) {
                    subtype.mixIn(overrides);
                }
                // Create default initializer
                if (!subtype.hasOwnProperty('init')) {
                    subtype.init = function () {
                        subtype.$super.init.apply(this, arguments);
                    };
                }
                // Initializer's prototype is the subtype object
                subtype.init.prototype = subtype;
                // Reference supertype
                subtype.$super = this;
                return subtype;
            },
            /**
             * Extends this object and runs the init method.
             * Arguments to create() will be passed to init().
             *
             * @return {Object} The new object.
             *
             * @static
             *
             * @example
             *
             *     var instance = MyType.create();
             */
            create: function () {
                var instance = this.extend();
                instance.init.apply(instance, arguments);
                return instance;
            },
            /**
             * Initializes a newly created object.
             * Override this method to add some logic when your objects are created.
             *
             * @example
             *
             *     var MyType = CryptoJS.lib.Base.extend({
             *         init: function () {
             *             // ...
             *         }
             *     });
             */
            init: function () {
            },
            /**
             * Copies properties into this object.
             *
             * @param {Object} properties The properties to mix in.
             *
             * @example
             *
             *     MyType.mixIn({
             *         field: 'value'
             *     });
             */
            mixIn: function (properties) {
                for (var propertyName in properties) {
                    if (properties.hasOwnProperty(propertyName)) {
                        this[propertyName] = properties[propertyName];
                    }
                }
                // IE won't copy toString using the loop above
                if (properties.hasOwnProperty('toString')) {
                    this.toString = properties.toString;
                }
            },
            /**
             * Creates a copy of this object.
             *
             * @return {Object} The clone.
             *
             * @example
             *
             *     var clone = instance.clone();
             */
            clone: function () {
                return this.init.prototype.extend(this);
            }
        };
    }());
    /**
     * An array of 32-bit words.
     *
     * @property {Array} words The array of 32-bit words.
     * @property {number} sigBytes The number of significant bytes in this word array.
     */
    var WordArray = Base.extend({
        /**
         * Initializes a newly created word array.
         *
         * @param {Array} words (Optional) An array of 32-bit words.
         * @param {number} sigBytes (Optional) The number of significant bytes in the words.
         *
         * @example
         *
         *     var wordArray = CryptoJS.lib.WordArray.create();
         *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607]);
         *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607], 6);
         */
        init: function (words, sigBytes) {
            words = this.words = words || [];
            if (sigBytes != undefined) {
                this.sigBytes = sigBytes;
            }
            else {
                this.sigBytes = words.length * 4;
            }
        },
        /**
         * Converts this word array to a string.
         *
         * @param {Encoder} encoder (Optional) The encoding strategy to use. Default: CryptoJS.enc.Hex
         *
         * @return {string} The stringified word array.
         *
         * @example
         *
         *     var string = wordArray + '';
         *     var string = wordArray.toString();
         *     var string = wordArray.toString(CryptoJS.enc.Utf8);
         */
        toString: function (encoder) {
            return (encoder || Hex).stringify(this);
        },
        /**
         * Concatenates a word array to this word array.
         *
         * @param {WordArray} wordArray The word array to append.
         *
         * @return {WordArray} This word array.
         *
         * @example
         *
         *     wordArray1.concat(wordArray2);
         */
        concat: function (wordArray) {
            // Shortcuts
            var thisWords = this.words;
            var thatWords = wordArray.words;
            var thisSigBytes = this.sigBytes;
            var thatSigBytes = wordArray.sigBytes;
            // Clamp excess bits
            this.clamp();
            // Concat
            if (thisSigBytes % 4) {
                // Copy one byte at a time
                for (var i = 0; i < thatSigBytes; i++) {
                    var thatByte = (thatWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                    thisWords[(thisSigBytes + i) >>> 2] |= thatByte << (24 - ((thisSigBytes + i) % 4) * 8);
                }
            }
            else if (thatWords.length > 0xffff) {
                // Copy one word at a time
                for (var i = 0; i < thatSigBytes; i += 4) {
                    thisWords[(thisSigBytes + i) >>> 2] = thatWords[i >>> 2];
                }
            }
            else {
                // Copy all words at once
                thisWords.push.apply(thisWords, thatWords);
            }
            this.sigBytes += thatSigBytes;
            // Chainable
            return this;
        },
        /**
         * Removes insignificant bits.
         *
         * @example
         *
         *     wordArray.clamp();
         */
        clamp: function () {
            // Shortcuts
            var words = this.words;
            var sigBytes = this.sigBytes;
            // Clamp
            words[sigBytes >>> 2] &= 0xffffffff << (32 - (sigBytes % 4) * 8);
            words.length = Math.ceil(sigBytes / 4);
        },
        /**
         * Creates a copy of this word array.
         *
         * @return {WordArray} The clone.
         *
         * @example
         *
         *     var clone = wordArray.clone();
         */
        clone: function () {
            var clone = Base.clone.call(this);
            clone.words = this.words.slice(0);
            return clone;
        },
        /**
         * Creates a word array filled with random bytes.
         *
         * @param {number} nBytes The number of random bytes to generate.
         *
         * @return {WordArray} The random word array.
         *
         * @static
         *
         * @example
         *
         *     var wordArray = CryptoJS.lib.WordArray.random(16);
         */
        random: function (nBytes) {
            var words = [];
            for (var i = 0; i < nBytes; i += 4) {
                words.push((Math.random() * 0x100000000) | 0);
            }
            return new WordArray.init(words, nBytes);
        }
    });
    /**
     * Hex encoding strategy.
     */
    var Hex = {
        /**
         * Converts a word array to a hex string.
         *
         * @param {WordArray} wordArray The word array.
         *
         * @return {string} The hex string.
         *
         * @static
         *
         * @example
         *
         *     var hexString = CryptoJS.enc.Hex.stringify(wordArray);
         */
        stringify: function (wordArray) {
            // Shortcuts
            var words = wordArray.words;
            var sigBytes = wordArray.sigBytes;
            // Convert
            var hexChars = [];
            for (var i = 0; i < sigBytes; i++) {
                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                hexChars.push((bite >>> 4).toString(16));
                hexChars.push((bite & 0x0f).toString(16));
            }
            return hexChars.join('');
        },
        /**
         * Converts a hex string to a word array.
         *
         * @param {string} hexStr The hex string.
         *
         * @return {WordArray} The word array.
         *
         * @static
         *
         * @example
         *
         *     var wordArray = CryptoJS.enc.Hex.parse(hexString);
         */
        parse: function (hexStr) {
            // Shortcut
            var hexStrLength = hexStr.length;
            // Convert
            var words = [];
            for (var i = 0; i < hexStrLength; i += 2) {
                words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << (24 - (i % 8) * 4);
            }
            return new WordArray.init(words, hexStrLength / 2);
        }
    };
    /**
     * Latin1 encoding strategy.
     */
    var Latin1 = {
        /**
         * Converts a word array to a Latin1 string.
         *
         * @param {WordArray} wordArray The word array.
         *
         * @return {string} The Latin1 string.
         *
         * @static
         *
         * @example
         *
         *     var latin1String = CryptoJS.enc.Latin1.stringify(wordArray);
         */
        stringify: function (wordArray) {
            // Shortcuts
            var words = wordArray.words;
            var sigBytes = wordArray.sigBytes;
            // Convert
            var latin1Chars = [];
            for (var i = 0; i < sigBytes; i++) {
                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                latin1Chars.push(String.fromCharCode(bite));
            }
            return latin1Chars.join('');
        },
        /**
         * Converts a Latin1 string to a word array.
         *
         * @param {string} latin1Str The Latin1 string.
         *
         * @return {WordArray} The word array.
         *
         * @static
         *
         * @example
         *
         *     var wordArray = CryptoJS.enc.Latin1.parse(latin1String);
         */
        parse: function (latin1Str) {
            // Shortcut
            var latin1StrLength = latin1Str.length;
            // Convert
            var words = [];
            for (var i = 0; i < latin1StrLength; i++) {
                words[i >>> 2] |= (latin1Str.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
            }
            return new WordArray.init(words, latin1StrLength);
        }
    };
    /**
     * UTF-8 encoding strategy.
     */
    var Utf8 = {
        /**
         * Converts a word array to a UTF-8 string.
         *
         * @param {WordArray} wordArray The word array.
         *
         * @return {string} The UTF-8 string.
         *
         * @static
         *
         * @example
         *
         *     var utf8String = CryptoJS.enc.Utf8.stringify(wordArray);
         */
        stringify: function (wordArray) {
            try {
                return decodeURIComponent(escape(Latin1.stringify(wordArray)));
            }
            catch (e) {
                throw new Error('Malformed UTF-8 data');
            }
        },
        /**
         * Converts a UTF-8 string to a word array.
         *
         * @param {string} utf8Str The UTF-8 string.
         *
         * @return {WordArray} The word array.
         *
         * @static
         *
         * @example
         *
         *     var wordArray = CryptoJS.enc.Utf8.parse(utf8String);
         */
        parse: function (utf8Str) {
            return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
        }
    };
    /**
     * Abstract buffered block algorithm template.
     *
     * The property blockSize must be implemented in a concrete subtype.
     *
     * @property {number} _minBufferSize The number of blocks that should be kept unprocessed in the buffer. Default: 0
     */
    var BufferedBlockAlgorithm = Base.extend({
        /**
         * Resets this block algorithm's data buffer to its initial state.
         *
         * @example
         *
         *     bufferedBlockAlgorithm.reset();
         */
        reset: function () {
            // Initial values
            this._data = new WordArray.init();
            this._nDataBytes = 0;
        },
        /**
         * Adds new data to this block algorithm's buffer.
         *
         * @param {WordArray|string} data The data to append. Strings are converted to a WordArray using UTF-8.
         *
         * @example
         *
         *     bufferedBlockAlgorithm._append('data');
         *     bufferedBlockAlgorithm._append(wordArray);
         */
        _append: function (data) {
            // Convert string to WordArray, else assume WordArray already
            if (typeof data == 'string') {
                data = Utf8.parse(data);
            }
            // Append
            this._data.concat(data);
            this._nDataBytes += data.sigBytes;
        },
        /**
         * Processes available data blocks.
         *
         * This method invokes _doProcessBlock(offset), which must be implemented by a concrete subtype.
         *
         * @param {boolean} doFlush Whether all blocks and partial blocks should be processed.
         *
         * @return {WordArray} The processed data.
         *
         * @example
         *
         *     var processedData = bufferedBlockAlgorithm._process();
         *     var processedData = bufferedBlockAlgorithm._process(!!'flush');
         */
        _process: function (doFlush) {
            // Shortcuts
            var data = this._data;
            var dataWords = data.words;
            var dataSigBytes = data.sigBytes;
            var blockSize = this.blockSize;
            var blockSizeBytes = blockSize * 4;
            // Count blocks ready
            var nBlocksReady = dataSigBytes / blockSizeBytes;
            if (doFlush) {
                // Round up to include partial blocks
                nBlocksReady = Math.ceil(nBlocksReady);
            }
            else {
                // Round down to include only full blocks,
                // less the number of blocks that must remain in the buffer
                nBlocksReady = Math.max((nBlocksReady | 0) - this._minBufferSize, 0);
            }
            // Count words ready
            var nWordsReady = nBlocksReady * blockSize;
            // Count bytes ready
            var nBytesReady = Math.min(nWordsReady * 4, dataSigBytes);
            // Process blocks
            if (nWordsReady) {
                for (var offset = 0; offset < nWordsReady; offset += blockSize) {
                    // Perform concrete-algorithm logic
                    this._doProcessBlock(dataWords, offset);
                }
                // Remove processed words
                var processedWords = dataWords.splice(0, nWordsReady);
                data.sigBytes -= nBytesReady;
            }
            // Return processed words
            return new WordArray.init(processedWords, nBytesReady);
        },
        /**
         * Creates a copy of this object.
         *
         * @return {Object} The clone.
         *
         * @example
         *
         *     var clone = bufferedBlockAlgorithm.clone();
         */
        clone: function () {
            var clone = Base.clone.call(this);
            clone._data = this._data.clone();
            return clone;
        },
        _minBufferSize: 0
    });
    /**
     * Abstract hasher template.
     *
     * @property {number} blockSize The number of 32-bit words this hasher operates on. Default: 16 (512 bits)
     */
    var Hasher = BufferedBlockAlgorithm.extend({
        /**
         * Configuration options.
         */
        cfg: Base.extend(),
        /**
         * Initializes a newly created hasher.
         *
         * @param {Object} cfg (Optional) The configuration options to use for this hash computation.
         *
         * @example
         *
         *     var hasher = CryptoJS.algo.SHA256.create();
         */
        init: function (cfg) {
            // Apply config defaults
            this.cfg = this.cfg.extend(cfg);
            // Set initial values
            this.reset();
        },
        /**
         * Resets this hasher to its initial state.
         *
         * @example
         *
         *     hasher.reset();
         */
        reset: function () {
            // Reset data buffer
            BufferedBlockAlgorithm.reset.call(this);
            // Perform concrete-hasher logic
            this._doReset();
        },
        /**
         * Updates this hasher with a message.
         *
         * @param {WordArray|string} messageUpdate The message to append.
         *
         * @return {Hasher} This hasher.
         *
         * @example
         *
         *     hasher.update('message');
         *     hasher.update(wordArray);
         */
        update: function (messageUpdate) {
            // Append
            this._append(messageUpdate);
            // Update the hash
            this._process();
            // Chainable
            return this;
        },
        /**
         * Finalizes the hash computation.
         * Note that the finalize operation is effectively a destructive, read-once operation.
         *
         * @param {WordArray|string} messageUpdate (Optional) A final message update.
         *
         * @return {WordArray} The hash.
         *
         * @example
         *
         *     var hash = hasher.finalize();
         *     var hash = hasher.finalize('message');
         *     var hash = hasher.finalize(wordArray);
         */
        finalize: function (messageUpdate) {
            // Final message update
            if (messageUpdate) {
                this._append(messageUpdate);
            }
            // Perform concrete-hasher logic
            var hash = this._doFinalize();
            return hash;
        },
        blockSize: 512 / 32,
        /**
         * Creates a shortcut function to a hasher's object interface.
         *
         * @param {Hasher} hasher The hasher to create a helper for.
         *
         * @return {Function} The shortcut function.
         *
         * @static
         *
         * @example
         *
         *     var SHA256 = CryptoJS.lib.Hasher._createHelper(CryptoJS.algo.SHA256);
         */
        _createHelper: function (hasher) {
            return function (message, cfg) {
                return new hasher.init(cfg).finalize(message);
            };
        },
    });
    // Initialization and round constants tables
    var H = [];
    var K = [];
    // Compute constants
    (function () {
        function isPrime(n) {
            var sqrtN = Math.sqrt(n);
            for (var factor = 2; factor <= sqrtN; factor++) {
                if (!(n % factor)) {
                    return false;
                }
            }
            return true;
        }
        function getFractionalBits(n) {
            return ((n - (n | 0)) * 0x100000000) | 0;
        }
        var n = 2;
        var nPrime = 0;
        while (nPrime < 64) {
            if (isPrime(n)) {
                if (nPrime < 8) {
                    H[nPrime] = getFractionalBits(Math.pow(n, 1 / 2));
                }
                K[nPrime] = getFractionalBits(Math.pow(n, 1 / 3));
                nPrime++;
            }
            n++;
        }
    }());
    // Reusable object
    var W = [];
    /**
     * SHA-256 hash algorithm.
     */
    var SHA256 = Hasher.extend({
        _doReset: function () {
            this._hash = new WordArray.init(H.slice(0));
        },
        _doProcessBlock: function (M, offset) {
            // Shortcut
            var H = this._hash.words;
            // Working variables
            var a = H[0];
            var b = H[1];
            var c = H[2];
            var d = H[3];
            var e = H[4];
            var f = H[5];
            var g = H[6];
            var h = H[7];
            // Computation
            for (var i = 0; i < 64; i++) {
                if (i < 16) {
                    W[i] = M[offset + i] | 0;
                }
                else {
                    var gamma0x = W[i - 15];
                    var gamma0 = ((gamma0x << 25) | (gamma0x >>> 7)) ^
                        ((gamma0x << 14) | (gamma0x >>> 18)) ^
                        (gamma0x >>> 3);
                    var gamma1x = W[i - 2];
                    var gamma1 = ((gamma1x << 15) | (gamma1x >>> 17)) ^
                        ((gamma1x << 13) | (gamma1x >>> 19)) ^
                        (gamma1x >>> 10);
                    W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16];
                }
                var ch = (e & f) ^ (~e & g);
                var maj = (a & b) ^ (a & c) ^ (b & c);
                var sigma0 = ((a << 30) | (a >>> 2)) ^ ((a << 19) | (a >>> 13)) ^ ((a << 10) | (a >>> 22));
                var sigma1 = ((e << 26) | (e >>> 6)) ^ ((e << 21) | (e >>> 11)) ^ ((e << 7) | (e >>> 25));
                var t1 = h + sigma1 + ch + K[i] + W[i];
                var t2 = sigma0 + maj;
                h = g;
                g = f;
                f = e;
                e = (d + t1) | 0;
                d = c;
                c = b;
                b = a;
                a = (t1 + t2) | 0;
            }
            // Intermediate hash value
            H[0] = (H[0] + a) | 0;
            H[1] = (H[1] + b) | 0;
            H[2] = (H[2] + c) | 0;
            H[3] = (H[3] + d) | 0;
            H[4] = (H[4] + e) | 0;
            H[5] = (H[5] + f) | 0;
            H[6] = (H[6] + g) | 0;
            H[7] = (H[7] + h) | 0;
        },
        _doFinalize: function () {
            // Shortcuts
            var data = this._data;
            var dataWords = data.words;
            var nBitsTotal = this._nDataBytes * 8;
            var nBitsLeft = data.sigBytes * 8;
            // Add padding
            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = Math.floor(nBitsTotal / 0x100000000);
            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = nBitsTotal;
            data.sigBytes = dataWords.length * 4;
            // Hash final blocks
            this._process();
            // Return final computed hash
            return this._hash;
        },
        clone: function () {
            var clone = Hasher.clone.call(this);
            clone._hash = this._hash.clone();
            return clone;
        }
    });
    /**
     * Shortcut function to the hasher's object interface.
     *
     * @param {WordArray|string} message The message to hash.
     *
     * @return {WordArray} The hash.
     *
     * @static
     *
     * @example
     *
     *     var hash = CryptoJS.SHA256('message');
     *     var hash = CryptoJS.SHA256(wordArray);
     */
    C.SHA256 = Hasher._createHelper(SHA256);
    return C;
});

define('js/pointrel20150417/stringToUtf8',["require", "exports"], function (require, exports) {
    "use strict";
    // From http://stackoverflow.com/questions/18729405/how-to-convert-utf8-string-to-byte-array
    function stringToUtf8(input) {
        return unescape(encodeURIComponent(input));
    }
    ;
    return stringToUtf8;
});

define('js/pointrel20150417/topic',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var subscriptions = {};
    var subscriptionsCount = 0;
    function subscribe(topic, callback) {
        var topicKey = JSON.stringify(topic);
        if (!subscriptions[topicKey])
            subscriptions[topicKey] = {};
        var uniqueIndex = subscriptionsCount++;
        subscriptions[topicKey][uniqueIndex] = callback;
        // Return a handle with a remove function to remove this this subscription
        return {
            remove: function () {
                delete subscriptions[topicKey][uniqueIndex];
            }
        };
    }
    exports.subscribe = subscribe;
    function publish(topic) {
        var data = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            data[_i - 1] = arguments[_i];
        }
        var topicKey = JSON.stringify(topic);
        if (!subscriptions[topicKey])
            return;
        var callbacksForTopic = subscriptions[topicKey];
        for (var callbackKey in callbacksForTopic) {
            var callback = callbacksForTopic[callbackKey];
            callback.apply(null, data);
        }
    }
    exports.publish = publish;
});

// Pointrel20150417 for NodeJS and WordPress
// The focus is on client getting all messages of interest as they are received by the server and indexing them locally
// Each message needs to have enough easily available metadata for the server and client to do that filtering
define('js/pointrel20150417/PointrelClient',["require", "exports", "./sha256", "./stringToUtf8", "./topic"], function (require, exports, sha256, stringToUtf8, topic) {
    "use strict";
    "use strict";
    var defaultCheckFrequency_ms = 15000;
    var shortTimeout_ms = 10000;
    var longTimeout_ms = 30000;
    var debugMessaging = false;
    ;
    var PointrelClient = (function () {
        function PointrelClient(apiURL, journalIdentifier, userCredentials, messageReceivedCallback, serverStatusCallback) {
            if (messageReceivedCallback === void 0) { messageReceivedCallback = null; }
            if (serverStatusCallback === void 0) { serverStatusCallback = null; }
            this.apiURL = null;
            this.journalIdentifier = null;
            this.userIdentifier = null;
            this.started = false;
            this.frequencyOfChecks_ms = defaultCheckFrequency_ms;
            this.timer = null;
            // By default, includeMessageContents of true will retrieve the message contents when polling to reduce back-and-forth latency to server
            // Clients might want to turn this off if they cache messages locally
            // or if they application selectively downloads big messages like images or other media perhaps depending on the topic they are in
            this.includeMessageContents = true;
            // This field is used to ensure only one request at a time is sent to the server
            this.outstandingServerRequestSentAtTimestamp = null;
            // TODO: This flag may no longer be needed on the client libary side; app should implement something like it somehow?
            this.serverResponseWarningIssued = false;
            this.lastReceivedTimestampConsidered = null;
            this.incomingMessageRecords = [];
            this.messagesSortedByReceivedTimeArray = [];
            this.sha256AndLengthToMessageMap = {};
            this.areOutgoingMessagesSuspended = false;
            this.outgoingMessageQueue = [];
            this.messageReceivedCallback = null;
            this.serverStatusCallback = null;
            this.messageSentCount = 0;
            this.messageReceivedCount = 0;
            this.topicIdentifier = undefined;
            this.idleCallback = null;
            if (!apiURL)
                throw new Error("No apiURL supplied");
            if (!journalIdentifier)
                throw new Error("No journalIdentifier supplied");
            if (!userCredentials)
                throw new Error("No userCredentials supplied");
            if (typeof userCredentials === "string" || userCredentials instanceof String) {
                userCredentials = {
                    userIdentifier: userCredentials
                };
            }
            // Use the WordPress AJAX api instead as an override if it is defined
            this.apiURL = window["ajaxurl"] || apiURL;
            this.journalIdentifier = journalIdentifier;
            this.userIdentifier = userCredentials.userIdentifier;
            // private variable to protect against access by other code; see: http://javascript.crockford.com/private.html
            var _userCredentials = userCredentials;
            // privileged method that can access private variable
            this["_prepareApiRequestForSending"] = function (apiRequest) {
                apiRequest.userCredentials = _userCredentials;
            };
            this.messageReceivedCallback = messageReceivedCallback;
            this.serverStatusCallback = serverStatusCallback;
        }
        PointrelClient.prototype.resetJournalContents = function () {
            this.lastReceivedTimestampConsidered = null;
            this.incomingMessageRecords = [];
            this.messagesSortedByReceivedTimeArray = [];
            this.sha256AndLengthToMessageMap = {};
            this.areOutgoingMessagesSuspended = false;
            this.outgoingMessageQueue = [];
        };
        PointrelClient.prototype.prepareApiRequestForSending = function (apiRequest) {
            // Call privileged method that can access private variable
            return this["_prepareApiRequestForSending"](apiRequest);
        };
        // This should be called to start the polling process to keep a client up-to-date with what is in a Journal
        // You should not start polling though if you just want to get the latest message in a topic
        //  like for an application that selectively loads just a bit of published data
        PointrelClient.prototype.startup = function () {
            console.log(new Date().toISOString(), "starting up PointrelClient", this);
            if (this.apiURL === "loopback") {
                console.log("No polling done on loopback");
            }
            else {
                this.started = true;
                this.startTimer();
                this.pollServerForNewMessages();
            }
        };
        // Call this to shut down polling, like when you destroy a related GUI component
        PointrelClient.prototype.shutdown = function () {
            console.log(new Date().toISOString(), "shutting down PointrelClient", this);
            this.stopTimer();
            this.started = false;
        };
        /*
        createAndSendAddTriplesMessage(topicIdentifier, triples) {
            const change = {
                action: "addTriples",
                triples: triples
            };
            return this.createAndSendChangeMessage(topicIdentifier, "TripleStore", change);
        }
        */
        PointrelClient.prototype.apiRequestSend = function (apiRequest, timeout_ms, successCallback, errorCallback) {
            var httpRequest = new XMLHttpRequest();
            httpRequest.onreadystatechange = function () {
                if (httpRequest.readyState === 4) {
                    if (httpRequest.status >= 200 && httpRequest.status < 300) {
                        if (successCallback) {
                            try {
                                var response = JSON.parse(httpRequest.responseText);
                                successCallback(response);
                            }
                            catch (error) {
                                var message = 'Error: Unexpected XMLHttpRequest.responseText (should be JSON format):\n\n' + httpRequest.responseText;
                                console.error(message);
                                alert(message);
                                errorCallback({ status: httpRequest.status, message: httpRequest.responseText });
                            }
                        }
                    }
                    else {
                        // TODO: Might these sometimes be JSON?
                        if (errorCallback)
                            errorCallback({ status: httpRequest.status, message: httpRequest.responseText });
                    }
                }
            };
            httpRequest.ontimeout = function () {
                errorCallback({ status: 0, message: "Timeout" });
            };
            var isWordPressAJAX = !!window["ajaxurl"];
            var apiURL = this.apiURL;
            var contentType = 'application/json; charset=utf-8';
            var data = JSON.stringify(apiRequest);
            if (isWordPressAJAX) {
                apiURL = apiURL + "?action=pointrel20150417";
            }
            httpRequest.open('POST', apiURL, true);
            httpRequest.setRequestHeader('Content-Type', contentType);
            httpRequest.setRequestHeader("Accept", "application/json");
            httpRequest.timeout = timeout_ms;
            httpRequest.send(data);
        };
        PointrelClient.prototype.createChangeMessage = function (topicIdentifier, messageType, change, other) {
            var timestamp = this.getCurrentUniqueTimestamp();
            var message = {
                // TODO: Simplify redundancy in timestamps
                _topicIdentifier: topicIdentifier,
                _topicTimestamp: timestamp,
                // messageIdentifier: generateRandomUuid("Message"), // Is this needed, as we have a unique ID from SHA256?
                creator: this.userIdentifier,
                creationTimestamp: timestamp,
                // TODO: createdAfter: something involving incoming records...
                messageType: messageType,
                change: change
            };
            if (other) {
                for (var key in other) {
                    message[key] = other[key];
                }
            }
            return message;
        };
        PointrelClient.prototype.createAndSendChangeMessage = function (topicIdentifier, messageType, change, other, callback) {
            var message = this.createChangeMessage(topicIdentifier, messageType, change, other);
            this.sendMessage(message, callback);
            return message;
        };
        // Suggested to use createAndSendChangeMessage instead, unless you are doing a special import
        PointrelClient.prototype.sendMessage = function (message, callback) {
            if (debugMessaging)
                console.log("sendMessage", this.areOutgoingMessagesSuspended, message);
            // Calculate the sha256AndLength without the pointrel fields
            delete message.__pointrel_sha256AndLength;
            var oldTrace = message.__pointrel_trace;
            delete message.__pointrel_trace;
            message.__pointrel_sha256AndLength = PointrelClient.makeSHA256AndLength(PointrelClient.calculateCanonicalSHA256AndLengthForObject(message));
            // TODO: Maybe should put in local sender information here?
            if (!oldTrace)
                oldTrace = [];
            message.__pointrel_trace = oldTrace;
            // TODO: What should really go in this trace entry if anything???
            var traceEntry = {
                // TODO: Should sentBy be used???
                sentByClient: this.userIdentifier,
                // TODO: Should the journalIdentifier really be split from the URL?
                sentToJournalIdentifier: this.journalIdentifier,
                sentToURL: this.apiURL,
                sentTimestamp: PointrelClient.getCurrentUniqueTimestamp()
            };
            message.__pointrel_trace.push(traceEntry);
            var previouslySent = this.sha256AndLengthToMessageMap[message.__pointrel_sha256AndLength];
            if (previouslySent) {
                console.log("A message with the same sha256AndLength was previously received (supplied/existing)", message, previouslySent);
                throw new Error("Trying to send a message with the same sha256AndLength of a message previously received");
            }
            // TODO: Extra copyObjectWithSortedKeys is not needed, but makes log messages look nicer so leaving for now
            message = PointrelClient.copyObjectWithSortedKeys(message);
            // TODO: This field ideally should go in a wrapper object and will be deleted later
            if (callback)
                message.__pointrel_callback = callback;
            this.outgoingMessageQueue.push(message);
            this.sendOutgoingMessage();
        };
        PointrelClient.prototype.suspendOutgoingMessages = function (suspend) {
            console.log("suspendOutgoingMessages", suspend);
            if (this.areOutgoingMessagesSuspended === suspend)
                return;
            this.areOutgoingMessagesSuspended = suspend;
            if (!this.areOutgoingMessagesSuspended) {
                this.sendOutgoingMessage();
            }
        };
        PointrelClient.prototype.fetchLatestMessageForTopic = function (topicIdentifier, callback) {
            var self = this;
            if (this.apiURL === "loopback") {
                callback(null, {
                    success: true,
                    statusCode: 200,
                    description: "Success",
                    detail: "latest",
                    timestamp: this.getCurrentUniqueTimestamp(),
                    status: 'OK',
                    currentTimestamp: this.getCurrentUniqueTimestamp(),
                    latestRecord: {
                        messageContents: self.latestMessageForTopic(topicIdentifier),
                        // TODO: Fill these in correctly
                        sha256AndLength: null,
                        receivedTimestamp: null,
                        topicTimestamp: null
                    }
                });
            }
            else {
                // Send to a real server immediately
                var apiRequest = {
                    action: "pointrel20150417_queryForLatestMessage",
                    journalIdentifier: this.journalIdentifier,
                    topicIdentifier: topicIdentifier
                };
                if (debugMessaging)
                    console.log("sending queryForLatestMessage request", apiRequest);
                this.prepareApiRequestForSending(apiRequest);
                // Do not set outstandingServerRequestSentAtTimestamp as this is an immediate request that does not block polling
                this.serverStatus("waiting", "requesting latest message " + new Date().toISOString());
                this.apiRequestSend(apiRequest, shortTimeout_ms, function (response) {
                    if (debugMessaging)
                        console.log("Got latest message for topic response", response);
                    if (!response.success) {
                        console.log("ERROR: report queryForLatestMessage failure", response);
                        self.serverStatus("failure", "Report queryForLatestMessage failure: " + response.statusCode + " :: " + response.description);
                        callback(response || "Failed");
                    }
                    else {
                        self.okStatus();
                        callback(null, response);
                    }
                }, function (error) {
                    self.serverStatus("failure", "Problem fetching latest message for topic from server: " + error.message);
                    console.log("Got server error when fetching latest message for topic from server", error.message);
                    callback(error);
                });
            }
        };
        PointrelClient.prototype.createJournal = function (journalIdentifier, callback) {
            if (this.apiURL === "loopback") {
                callback(null, {
                    success: true,
                    statusCode: 200,
                    description: "Success",
                    timestamp: this.getCurrentUniqueTimestamp(),
                    status: 'OK',
                    version: "PointrelServer-loopback",
                    currentUniqueTimestamp: this.getCurrentUniqueTimestamp(),
                    journalIdentifier: journalIdentifier
                });
            }
            else {
                // Send to a real server immediately
                var apiRequest = {
                    action: "pointrel20150417_createJournal",
                    journalIdentifier: journalIdentifier
                };
                if (debugMessaging)
                    console.log("sending createJournal request", apiRequest);
                this.prepareApiRequestForSending(apiRequest);
                // Do not set outstandingServerRequestSentAtTimestamp as this is an immediate request that does not block polling
                this.serverStatus("waiting", "requesting createJournal " + new Date().toISOString());
                var self_1 = this;
                this.apiRequestSend(apiRequest, shortTimeout_ms, function (response) {
                    if (debugMessaging)
                        console.log("Got createJournal response", response);
                    if (!response.success) {
                        console.log("ERROR: report createJournal failure", response);
                        self_1.serverStatus("failure", "Report createJournal failure: " + response.statusCode + " :: " + response.description);
                        callback(response || "Failed");
                    }
                    else {
                        self_1.okStatus();
                        callback(null, response);
                    }
                }, function (error) {
                    self_1.serverStatus("failure", "Problem with createJournal from server: " + error.description);
                    console.log("Got server error for createJournal", error.message);
                    callback(error);
                });
            }
        };
        PointrelClient.prototype.resetJournal = function (journalIdentifier, callback) {
            if (this.apiURL === "loopback") {
                callback(null, {
                    success: true,
                    statusCode: 200,
                    description: "Success",
                    timestamp: this.getCurrentUniqueTimestamp(),
                    status: 'OK',
                    version: "PointrelServer-loopback",
                    currentUniqueTimestamp: this.getCurrentUniqueTimestamp(),
                    journalIdentifier: journalIdentifier
                });
            }
            else {
                // Send to a real server immediately
                var apiRequest = {
                    action: "pointrel20150417_resetJournal",
                    journalIdentifier: journalIdentifier
                };
                if (debugMessaging)
                    console.log("sending resetJournal request", apiRequest);
                this.prepareApiRequestForSending(apiRequest);
                // Do not set outstandingServerRequestSentAtTimestamp as this is an immediate request that does not block polling
                this.serverStatus("waiting", "requesting resetJournal " + new Date().toISOString());
                var self_2 = this;
                this.apiRequestSend(apiRequest, shortTimeout_ms, function (response) {
                    if (debugMessaging)
                        console.log("Got resetJournal response", response);
                    if (!response.success) {
                        console.log("ERROR: report resetJournal failure", response);
                        self_2.serverStatus("failure", "Report resetJournal failure: " + response.statusCode + " :: " + response.description);
                        callback(response || "Failed");
                    }
                    else {
                        self_2.okStatus();
                        self_2.resetJournalContents();
                        callback(null, response);
                    }
                }, function (error) {
                    self_2.serverStatus("failure", "Problem with resetJournal from server: " + error.description);
                    console.log("Got server error for resetJournal", error.message);
                    callback(error);
                });
            }
        };
        PointrelClient.prototype.hideJournal = function (journalIdentifier, callback) {
            if (this.apiURL === "loopback") {
                callback(null, {
                    success: true,
                    statusCode: 200,
                    description: "Success",
                    timestamp: this.getCurrentUniqueTimestamp(),
                    status: 'OK',
                    version: "PointrelServer-loopback",
                    currentUniqueTimestamp: this.getCurrentUniqueTimestamp(),
                    journalIdentifier: journalIdentifier
                });
            }
            else {
                // Send to a real server immediately
                var apiRequest = {
                    action: "pointrel20150417_hideJournal",
                    journalIdentifier: journalIdentifier
                };
                if (debugMessaging)
                    console.log("sending hideJournal request", apiRequest);
                this.prepareApiRequestForSending(apiRequest);
                // Do not set outstandingServerRequestSentAtTimestamp as this is an immediate request that does not block polling
                this.serverStatus("waiting", "requesting hideJournal " + new Date().toISOString());
                var self_3 = this;
                this.apiRequestSend(apiRequest, shortTimeout_ms, function (response) {
                    if (debugMessaging)
                        console.log("Got hideJournal response", response);
                    if (!response.success) {
                        console.log("ERROR: report hideJournal failure", response);
                        self_3.serverStatus("failure", "Report hideJournal failure: " + response.statusCode + " :: " + response.description);
                        callback(response || "Failed");
                    }
                    else {
                        self_3.okStatus();
                        //self.resetJournalContents();  don't need this because it is only called from the admin screen
                        callback(null, response);
                    }
                }, function (error) {
                    self_3.serverStatus("failure", "Problem with hideJournal from server: " + error.description);
                    console.log("Got server error for hideJournal", error.message);
                    callback(error);
                });
            }
        };
        PointrelClient.prototype.reportJournalStatus = function (callback) {
            if (this.apiURL === "loopback") {
                callback(null, {
                    success: true,
                    statusCode: 200,
                    description: "Success",
                    timestamp: this.getCurrentUniqueTimestamp(),
                    status: 'OK',
                    version: "PointrelServer-loopback",
                    currentUniqueTimestamp: this.getCurrentUniqueTimestamp(),
                    journalIdentifier: this.journalIdentifier,
                    // TODO: need to create earliest and latest record for loopback using messagesSortedByReceivedTimeArray
                    journalEarliestRecord: null,
                    journalLatestRecord: null,
                    journalRecordCount: this.messagesSortedByReceivedTimeArray.length,
                    readOnly: false,
                    permissions: {
                        read: true,
                        write: true,
                        admin: true,
                        superUser: true
                    }
                });
            }
            else {
                // Send to a real server immediately
                var apiRequest = {
                    action: "pointrel20150417_reportJournalStatus",
                    journalIdentifier: this.journalIdentifier
                };
                if (debugMessaging)
                    console.log("sending reportJournalStatus request", apiRequest);
                this.prepareApiRequestForSending(apiRequest);
                // Do not set outstandingServerRequestSentAtTimestamp as this is an immediate request that does not block polling
                this.serverStatus("waiting", "requesting journal status " + new Date().toISOString());
                var self_4 = this;
                this.apiRequestSend(apiRequest, shortTimeout_ms, function (response) {
                    if (debugMessaging)
                        console.log("Got journal status response", response);
                    if (!response.success) {
                        console.log("ERROR: report journal status failure", response);
                        self_4.serverStatus("failure", "Report journal status failure: " + response.statusCode + " :: " + response.description);
                        callback(response || "Failed");
                    }
                    else {
                        self_4.okStatus();
                        callback(null, response);
                    }
                }, function (error) {
                    self_4.serverStatus("failure", "Problem requesting status for journal from server: " + error.message);
                    console.log("Got server error for report journal status", error.message);
                    callback(error);
                });
            }
        };
        PointrelClient.prototype.getCurrentUserInformation = function (callback) {
            if (this.apiURL === "loopback") {
                callback(null, {
                    success: true,
                    statusCode: 200,
                    description: "Success",
                    timestamp: this.getCurrentUniqueTimestamp(),
                    status: 'OK',
                    userIdentifier: this.userIdentifier
                });
            }
            else {
                // Send to a real server immediately
                var apiRequest = {
                    action: "pointrel20150417_currentUserInformation"
                };
                if (debugMessaging)
                    console.log("sending currentUserInformation request", apiRequest);
                // Do not send credentials: this.prepareApiRequestForSending(apiRequest);
                // Do not set outstandingServerRequestSentAtTimestamp as this is an immediate request that does not block polling
                this.serverStatus("waiting", "requesting current user information " + new Date().toISOString());
                var self_5 = this;
                this.apiRequestSend(apiRequest, shortTimeout_ms, function (response) {
                    if (debugMessaging)
                        console.log("Got currentUserInformation response", response);
                    if (!response.success) {
                        console.log("ERROR: currentUserInformation request failure", response);
                        self_5.serverStatus("failure", "Current user information request failure: " + response.statusCode + " :: " + response.description);
                        callback(response || "Failed");
                    }
                    else {
                        self_5.okStatus();
                        callback(null, response);
                    }
                }, function (error) {
                    self_5.serverStatus("failure", "Problem requesting current user information from server: " + error.message);
                    console.log("Got server error for current user information", error.message);
                    callback(error);
                });
            }
        };
        PointrelClient.prototype.latestMessageForTopic = function (topicIdentifier) {
            // TODO: Inefficient to search all messages; keep sorted message list per topic or just track latest for each topic?
            var messages = this.messagesSortedByReceivedTimeArray;
            for (var i = messages.length - 1; i >= 0; i--) {
                var message = messages[i];
                if (message._topicIdentifier === topicIdentifier) {
                    return message;
                }
            }
            return null;
        };
        PointrelClient.prototype.filterMessages = function (filterFunction) {
            return this.messagesSortedByReceivedTimeArray.filter(filterFunction);
        };
        PointrelClient.prototype.getCurrentUniqueTimestamp = function () {
            return PointrelClient.getCurrentUniqueTimestamp();
        };
        /* TODO: Maybe make these other static utility functions available at instance levels?
        PointrelClient.prototype.copyObjectWithSortedKeys = copyObjectWithSortedKeys;
        PointrelClient.prototype.randomUUID = generateRandomUuid;
        PointrelClient.prototype.calculateCanonicalSHA256AndLengthForObject = calculateCanonicalSHA256AndLengthForObject;
        PointrelClient.prototype.calculateSHA256 = calculateSHA256;
        */
        // TODO: Next few from server code -- should have common routines to avoid duplicate code
        // TODO: Note that this approach depends on object keys maintaining their order, which is not guaranteed by the JS standards but most browsers support it
        // isObject and copyObjectWithSortedKeys are from Mirko Kiefer (with added semicolons):
        // https://raw.githubusercontent.com/mirkokiefer/canonical-json/master/index2.js
        PointrelClient.isObject = function (a) {
            return Object.prototype.toString.call(a) === '[object Object]';
        };
        PointrelClient.copyObjectWithSortedKeys = function (object) {
            if (PointrelClient.isObject(object)) {
                var newObj = {};
                var keysSorted = Object.keys(object).sort();
                for (var i = 0, len = keysSorted.length; i < len; i++) {
                    var key = keysSorted[i];
                    newObj[key] = PointrelClient.copyObjectWithSortedKeys(object[key]);
                }
                return newObj;
            }
            else if (Array.isArray(object)) {
                return object.map(PointrelClient.copyObjectWithSortedKeys);
            }
            else {
                return object;
            }
        };
        PointrelClient.makeSHA256AndLength = function (sha256AndLengthObject) {
            if (!sha256AndLengthObject.sha256 || !sha256AndLengthObject.length) {
                console.log("Problem making sha256AndLength identifier", sha256AndLengthObject);
                throw new Error("Problem making sha256AndLength identifier from: " + JSON.stringify(sha256AndLengthObject));
            }
            return sha256AndLengthObject.sha256 + "_" + sha256AndLengthObject.length;
        };
        PointrelClient.calculateCanonicalSHA256AndLengthForObject = function (someObject, doNotSortFlag) {
            if (doNotSortFlag === void 0) { doNotSortFlag = false; }
            if (!doNotSortFlag)
                someObject = PointrelClient.copyObjectWithSortedKeys(someObject);
            var minimalJSON = JSON.stringify(someObject);
            // const buffer = new Buffer(minimalJSON, "utf8");
            // console.log("minimalJSON", minimalJSON);
            //let max = 0;
            //for (let i = 0; i < minimalJSON.length; i++) {
            //    const c = minimalJSON.charAt(i);
            //    if (minimalJSON.charCodeAt(i) > 127) console.log("i # c", i, minimalJSON.charCodeAt(i), c);
            //    if (minimalJSON.charCodeAt(i) > max) max = minimalJSON.charCodeAt(i);
            //}
            //console.log("max", max);
            var utf8String = stringToUtf8(minimalJSON);
            //console.log("utf8String", utf8String);
            // console.log("match?", minimalJSON === utf8String, "minimal length", minimalJSON.length, "utf8 length", utf8String.length);
            //for (let i = 0; i < minimalJSON.length; i++) {
            //    console.log("char at i", i, minimalJSON[i]);
            //}
            /*
            const shaObj = new JS_SHA("SHA-256", "TEXT");
            shaObj.update(minimalJSON);
            // console.log("Without string conversion", shaObj.getHash("HEX"));
            */
            var sha256 = PointrelClient.calculateSHA256(minimalJSON);
            var length = utf8String.length;
            var sha256AndLength = "" + sha256 + "_" + length;
            return { sha256: "" + sha256, length: length };
        };
        PointrelClient.calculateSHA256 = function (text) {
            // console.log("calculateSHA256", utf8Bytes);
            return "" + sha256.SHA256(text);
        };
        // Ensure unique timestamps are always incremented from the next by adding values at end...
        // In theory, if the server were to be stopped and be restarted in the same millisecond, these values could overlap for a millisecond in the new session
        PointrelClient.getCurrentUniqueTimestamp = function () {
            // TODO: Add random characters at end of number part of timestamp before Z
            var currentTimestamp = new Date().toISOString();
            var randomNumber = Math.floor(Math.random() * 1000);
            var randomPadding = (PointrelClient.timestampRandomPadding + randomNumber).slice(-(PointrelClient.timestampRandomPadding.length));
            if (PointrelClient.lastTimestamp !== currentTimestamp) {
                PointrelClient.lastTimestamp = currentTimestamp;
                PointrelClient.lastTimestampIncrement = 0;
                return currentTimestamp.replace("Z", PointrelClient.timestampIncrementPadding + randomPadding + "Z");
            }
            // Need to increment timestamp;
            PointrelClient.lastTimestampIncrement++;
            if (PointrelClient.lastTimestampIncrement === 1000) {
                // About to overrun timestamps -- this should probably never be possible in practice
                // on a single thread doing any actual work other than a tight loop for a couple decades (circa 2015).
                // Possible short-term fix is to pad "999999" then add more digits afterwards;
                // long-term fix is to add more zeros to padding string or have better approach
                // Note also that if this condition is reached, ISO timestamp comparisons could be incorrect
                // as the final "Z" interferes with collation
                // Another temporary option would be to introduce a delay in this situation to get
                // to the next millisecond before the timestamp's final text value is determined
                console.log("getCurrentUniqueTimestamp: failure with timestamp padding from fast CPU -- add more timestamp padding");
            }
            var extraDigits = (PointrelClient.timestampIncrementPadding + PointrelClient.lastTimestampIncrement).slice(-(PointrelClient.timestampIncrementPadding.length));
            currentTimestamp = currentTimestamp.replace("Z", extraDigits + randomPadding + "Z");
            return currentTimestamp;
        };
        // End -- from server
        // ------------- Internal methods below not meant to be called by users
        PointrelClient.prototype.sendOutgoingMessage = function () {
            var callback;
            if (debugMessaging)
                console.log("sendOutgoingMessage");
            if (this.outgoingMessageQueue.length === 0)
                return;
            if (debugMessaging)
                console.log("sendOutgoingMessage proceeding");
            var self = this;
            if (this.apiURL === "loopback" || this.areOutgoingMessagesSuspended) {
                // Pretend to send all the outgoing messages we have
                while (this.outgoingMessageQueue.length) {
                    var loopbackMessage = this.outgoingMessageQueue.shift();
                    callback = loopbackMessage.__pointrel_callback;
                    if (callback !== undefined)
                        delete loopbackMessage.__pointrel_callback;
                    this.messageSentCount++;
                    // Simulating eventual response from server, generally for testing
                    this.messageReceived(PointrelClient.copyObjectWithSortedKeys(loopbackMessage));
                    if (callback)
                        callback(null, { success: true });
                }
            }
            else {
                // Send to a real server
                // Wait for later if a request is outstanding already, like polling for new messages
                if (this.outstandingServerRequestSentAtTimestamp)
                    return;
                // If this fails, and there is no callback, this will leave message on outgoing queue (unless it was rejected for some reason)
                // If there is a callback, the message will be discarded as presumably the caller will handle resending it
                var message = this.outgoingMessageQueue[0];
                callback = message.__pointrel_callback;
                if (callback !== undefined)
                    delete message.__pointrel_callback;
                var apiRequest = {
                    action: "pointrel20150417_storeMessage",
                    journalIdentifier: this.journalIdentifier,
                    message: message
                };
                if (debugMessaging)
                    console.log("sending store message request", apiRequest);
                this.prepareApiRequestForSending(apiRequest);
                this.outstandingServerRequestSentAtTimestamp = new Date();
                this.serverStatus("waiting", "storing " + this.outstandingServerRequestSentAtTimestamp);
                this.apiRequestSend(apiRequest, shortTimeout_ms, function (response) {
                    if (debugMessaging)
                        console.log("Got store response", response);
                    self.outstandingServerRequestSentAtTimestamp = null;
                    if (!response.success) {
                        console.log("ERROR: Message store failure", response, self.outgoingMessageQueue[0], JSON.stringify(self.outgoingMessageQueue[0]));
                        if (callback) {
                            self.serverStatus("failure", "Message store failure: " + response.statusCode + " :: " + response.description);
                            // Discard the message from the queue as presumably the caller will resend it
                            self.outgoingMessageQueue.shift();
                            callback(response || "Failed");
                            return;
                        }
                        // Need to otherwise decide whether to discard the message based on the nature of the problem
                        // Should leave it in the queue if it is not malformed and it is just a possibly temporary problem with server
                        // If the message we sent was rejected because it was malformed or a duplicate, we should discard it
                        // Do not continue with requests until next poll...
                        // TODO: Should we not discard messages for an internal server error (500)?
                        if (response.statusCode !== "403") {
                            // Discard all problematical messages except for ones that are not authenticated and might succeed if resent after (re)authetication
                            self.outgoingMessageQueue.shift();
                            self.serverStatus("failure-loss", "Data loss from message store failure: " + response.statusCode + " :: " + response.description);
                        }
                        return;
                    }
                    else {
                        self.okStatus();
                        self.messageSentCount++;
                        self.outgoingMessageQueue.shift();
                    }
                    // Keep sending outgoing messages if there are any more, or do other task as needed
                    // Do this as a timeout so the event loop can finish its cycle first
                    // Only do this if polling has been started; otherwis just assume user is sending individual messages
                    if (callback)
                        callback(null, response);
                    if (self.started) {
                        setTimeout(function () {
                            // Could instead just send outgoing messages and let the timer restart the others, this will cause some extra polls
                            self.sendFetchOrPollIfNeeded();
                        }, 0);
                    }
                }, function (error) {
                    // TODO: Need to check for rejected status and then remove the message from the outgoing queue
                    self.serverStatus("failure", "Problem storing message to server: " + error.message +
                        "<br>You may need to reload the page to synchronize it with the current state of the server if a message was rejected for some reason.");
                    console.log("Got store error", error.message);
                    self.outstandingServerRequestSentAtTimestamp = null;
                    if (callback) {
                        // Discard the message from the queue as presumably the caller will resend it
                        self.outgoingMessageQueue.shift();
                        callback(error);
                    }
                });
            }
        };
        PointrelClient.prototype.messageReceived = function (message) {
            // if (debugMessaging) console.log("messageReceived", JSON.stringify(message, null, 2));
            if (!message) {
                console.log("ERROR: Problem with server response. No message!");
                return;
            }
            this.messageReceivedCount++;
            // Ignore the message if we already have it
            if (this.sha256AndLengthToMessageMap[message.__pointrel_sha256AndLength]) {
                // console.log("Message already received", message.__pointrel_sha256AndLength);
                return;
            }
            if (!message.__pointrel_trace)
                message.__pointrel_trace = [];
            // TODO: Still unsure about how to implement trace???
            var traceEntry = {
                // TODO: Should receivedBy be used???
                receivedByClient: this.userIdentifier,
                // TODO: Should the journalIdentifier really be split from the URL?
                receivedFromJournalIdentifier: this.journalIdentifier,
                receivedFromURL: this.apiURL,
                receivedTimestamp: this.getCurrentUniqueTimestamp()
            };
            message.__pointrel_trace.push(traceEntry);
            // TODO: Make sure the list stays sorted -- copy code from server
            this.messagesSortedByReceivedTimeArray.push(message);
            this.sha256AndLengthToMessageMap[message.__pointrel_sha256AndLength] = message;
            // TODO: Maybe do excepting handling for callback, as otherwise could break incoming message handling?
            if (this.messageReceivedCallback)
                this.messageReceivedCallback(message);
            topic.publish("messageReceived", message);
            if (message.messageType) {
                // console.log("publishing message", message);
                topic.publish(message.messageType, message);
            }
        };
        // Start boiler plate for timer management
        PointrelClient.prototype.startTimer = function () {
            // Stop the timer in case it was running already
            // TODO: Is stopTimer/clearTimeout safe to call if the timer has already completed?
            this.stopTimer();
            this.timer = window.setTimeout(this.timerSentSignal.bind(this), this.frequencyOfChecks_ms);
        };
        PointrelClient.prototype.stopTimer = function () {
            if (this.timer) {
                window.clearTimeout(this.timer);
                this.timer = null;
            }
        };
        // In addition to doing polling if there are no other messages to send or recieve,
        // the timer will give everything a kick to get going again shortly after something errors out
        PointrelClient.prototype.timerSentSignal = function () {
            // if (debugMessaging) console.log(new Date().toISOString(), "should do check now for new messages", this);
            this.timer = null;
            // catch any exceptions to ensure timer is started again
            try {
                this.sendFetchOrPollIfNeeded();
            }
            catch (e) {
                console.log("Exception when trying to server for changes", e);
            }
            this.startTimer();
        };
        PointrelClient.prototype.sendFetchOrPollIfNeeded = function () {
            // TODO: Prioritizing outgoing messages -- might want to revisit this for some applications?
            if (!this.areOutgoingMessagesSuspended && this.outgoingMessageQueue.length) {
                this.sendOutgoingMessage();
            }
            else if (this.incomingMessageRecords.length) {
                this.fetchIncomingMessage();
            }
            else {
                this.pollServerForNewMessages();
            }
        };
        // End boilerplate for timer management
        PointrelClient.prototype.pollServerForNewMessages = function () {
            // Do not poll if the document is not visible
            if (document.hidden === true) {
                // console.log("pollServerForNewMessages: not polling because not visible");
                return;
            }
            if (this.outstandingServerRequestSentAtTimestamp) {
                // TODO: Warn if connection seems to have failed
                console.log("Still waiting on previous server request");
                var waiting_ms = new Date().getTime() - this.outstandingServerRequestSentAtTimestamp.getTime();
                console.log("Have been waiting on server for waiting_ms", waiting_ms);
                if (waiting_ms > 10000) {
                    // Should never get here if timeout is 2000ms and timers get the process restarted
                    if (!this.serverResponseWarningIssued) {
                        console.log("Server not responding");
                        this.serverStatus("falure", "The server is not responding...");
                        this.serverResponseWarningIssued = true;
                    }
                }
                return;
            }
            if (debugMessaging)
                console.log("Polling server for changes...");
            var apiRequest = {
                action: "pointrel20150417_queryForNextMessage",
                journalIdentifier: this.journalIdentifier,
                fromTimestampExclusive: this.lastReceivedTimestampConsidered,
                // The server may return less than this number of message if including message contents and they exceed about 1MB in total
                limitCount: 100,
                includeMessageContents: this.includeMessageContents,
                topicIdentifier: undefined
            };
            if (this.topicIdentifier !== undefined) {
                apiRequest.topicIdentifier = this.topicIdentifier;
            }
            if (debugMessaging)
                console.log("sending polling request", apiRequest);
            this.prepareApiRequestForSending(apiRequest);
            // TODO: What do do if it fails? Leave message on outgoing queue?
            this.outstandingServerRequestSentAtTimestamp = new Date();
            this.serverStatus("waiting", "polling " + this.outstandingServerRequestSentAtTimestamp);
            var self = this;
            // Use longer timeout to account for reading multiple records on server
            this.apiRequestSend(apiRequest, longTimeout_ms, function (response) {
                if (debugMessaging)
                    console.log("Got query response", response);
                if (!response.success) {
                    console.log("Response was a failure", response);
                    self.serverStatus("failure", "Polling response failure: " + response.statusCode + " :: " + response.description);
                }
                else {
                    self.okStatus();
                    for (var i = 0; i < response.receivedRecords.length; i++) {
                        var receivedRecord = response.receivedRecords[i];
                        // if (debugMessaging) console.log("New message", receivedRecord);
                        if (receivedRecord.messageContents !== undefined) {
                            /// console.log("got contents directly", receivedRecord);
                            if (receivedRecord.messageContents !== null) {
                                self.messageReceived(receivedRecord.messageContents);
                            }
                            else {
                                // Would be issue with the messages becoming out of order if did not just reject messages
                                //   with null contents when requesting contents with polling result, like if did a retry instead
                                console.log("Message contents not available for message", receivedRecord);
                            }
                            // delete receivedRecord.messageContents;
                        }
                        else {
                            self.incomingMessageRecords.push(receivedRecord);
                        }
                    }
                    self.lastReceivedTimestampConsidered = response.lastReceivedTimestampConsidered;
                }
                self.outstandingServerRequestSentAtTimestamp = null;
                if (response.receivedRecords && response.receivedRecords.length) {
                    // Schedule another request immediately if getting contents
                    setTimeout(function () {
                        self.sendFetchOrPollIfNeeded();
                    }, 0);
                }
                else {
                    if (self.idleCallback) {
                        var callback = self.idleCallback;
                        self.idleCallback = null;
                        console.log("Doing one-time idle callback");
                        callback();
                    }
                }
            }, function (error) {
                console.log("Got query error", error.message);
                self.serverStatus("failure", "Something went wrong talking to the server when querying for new messages: " + error.message);
                // TODO: How to recover?
                self.outstandingServerRequestSentAtTimestamp = null;
            });
        };
        PointrelClient.prototype.fetchIncomingMessage = function () {
            if (this.incomingMessageRecords.length === 0) {
                this.serverStatus("waiting", "waiting");
                return;
            }
            if (this.outstandingServerRequestSentAtTimestamp)
                return;
            if (debugMessaging)
                console.log("Trying to fetch incoming message");
            var incomingMessageRecord = this.incomingMessageRecords[0];
            if (incomingMessageRecord.messageContents) {
                this.incomingMessageRecords.shift();
                this.messageReceived(incomingMessageRecord.messageContents);
                this.sendFetchOrPollIfNeeded();
                return;
            }
            if (debugMessaging)
                console.log("Retrieving new message...");
            var apiRequest = {
                action: "pointrel20150417_loadMessage",
                journalIdentifier: this.journalIdentifier,
                sha256AndLength: incomingMessageRecord.sha256AndLength,
                topicIdentifier: undefined
            };
            if (this.topicIdentifier !== undefined) {
                // The topicIdentifier is needed in case we only have permission to read within a specific topic
                apiRequest.topicIdentifier = this.topicIdentifier;
            }
            if (debugMessaging)
                console.log("sending load request", apiRequest);
            this.prepareApiRequestForSending(apiRequest);
            this.outstandingServerRequestSentAtTimestamp = new Date();
            this.serverStatus("waiting", "loading " + this.outstandingServerRequestSentAtTimestamp);
            var self = this;
            this.apiRequestSend(apiRequest, shortTimeout_ms, function (response) {
                self.okStatus();
                if (debugMessaging)
                    console.log("Got load response", response);
                self.outstandingServerRequestSentAtTimestamp = null;
                self.incomingMessageRecords.shift();
                if (!response.success) {
                    console.log("Problem retrieving message; response:", response, "for message record:", incomingMessageRecord);
                    // TODO; Is this really a "serverStatus" to display?
                    self.serverStatus("failure", "Message retrieval failure: " + response.statusCode + " :: " + response.description);
                    // TODO: Just assuming that this was an error that the item is not available, as opposed to authentication error or other
                    // TODO: so assuming it is OK to discard it from incomingMessageRecords
                    // TODO: maybe also want to move record to an unavalible records list?
                }
                else {
                    self.messageReceived(response.message);
                }
                // Keep loading incoming messages if there are any more, or do other task as needed
                // Do this as a timeout so the event loop can finish its cycle first
                setTimeout(function () {
                    self.sendFetchOrPollIfNeeded();
                }, 0);
            }, function (error) {
                console.log("Got load error", error.message);
                self.serverStatus("failure", "Something went wrong talking to the server when loading a message: " + error.message);
                self.outstandingServerRequestSentAtTimestamp = null;
            });
        };
        // Status should be ok, waiting, or failure
        PointrelClient.prototype.serverStatus = function (status, message) {
            if (this.serverStatusCallback)
                this.serverStatusCallback(status, message);
        };
        PointrelClient.prototype.okStatus = function () {
            this.serverStatus("ok", "OK (sent: " + this.messageSentCount + ", received: " + this.messageReceivedCount + ")");
        };
        // Variables related to generating unique timestamps
        // Note: timestamp padding needs to get longer as computers get faster
        PointrelClient.lastTimestamp = null;
        PointrelClient.lastTimestampIncrement = 0;
        PointrelClient.timestampIncrementPadding = "000";
        PointrelClient.timestampRandomPadding = "000";
        return PointrelClient;
    }());
    return PointrelClient;
});

var m = (function app(window, undefined) {
	var OBJECT = "[object Object]", ARRAY = "[object Array]", STRING = "[object String]", FUNCTION = "function";
	var type = {}.toString;
	var parser = /(?:(^|#|\.)([^#\.\[\]]+))|(\[.+?\])/g, attrParser = /\[(.+?)(?:=("|'|)(.*?)\2)?\]/;
	var voidElements = /^(AREA|BASE|BR|COL|COMMAND|EMBED|HR|IMG|INPUT|KEYGEN|LINK|META|PARAM|SOURCE|TRACK|WBR)$/;
	var noop = function() {}

	// caching commonly used variables
	var $document, $location, $requestAnimationFrame, $cancelAnimationFrame;

	// self invoking function needed because of the way mocks work
	function initialize(window){
		$document = window.document;
		$location = window.location;
		$cancelAnimationFrame = window.cancelAnimationFrame || window.clearTimeout;
		$requestAnimationFrame = window.requestAnimationFrame || window.setTimeout;
	}

	initialize(window);


	/**
	 * @typedef {String} Tag
	 * A string that looks like -> div.classname#id[param=one][param2=two]
	 * Which describes a DOM node
	 */

	/**
	 *
	 * @param {Tag} The DOM node tag
	 * @param {Object=[]} optional key-value pairs to be mapped to DOM attrs
	 * @param {...mNode=[]} Zero or more Mithril child nodes. Can be an array, or splat (optional)
	 *
	 */
	function m() {
		var args = [].slice.call(arguments);
		var hasAttrs = args[1] != null && type.call(args[1]) === OBJECT && !("tag" in args[1] || "view" in args[1]) && !("subtree" in args[1]);
		var attrs = hasAttrs ? args[1] : {};
		var classAttrName = "class" in attrs ? "class" : "className";
		var cell = {tag: "div", attrs: {}};
		var match, classes = [];
		if (type.call(args[0]) != STRING) throw new Error("selector in m(selector, attrs, children) should be a string")
		while (match = parser.exec(args[0])) {
			if (match[1] === "" && match[2]) cell.tag = match[2];
			else if (match[1] === "#") cell.attrs.id = match[2];
			else if (match[1] === ".") classes.push(match[2]);
			else if (match[3][0] === "[") {
				var pair = attrParser.exec(match[3]);
				cell.attrs[pair[1]] = pair[3] || (pair[2] ? "" :true)
			}
		}

		var children = hasAttrs ? args.slice(2) : args.slice(1);
		if (children.length === 1 && type.call(children[0]) === ARRAY) {
			cell.children = children[0]
		}
		else {
			cell.children = children
		}
		
		for (var attrName in attrs) {
			if (attrs.hasOwnProperty(attrName)) {
				if (attrName === classAttrName && attrs[attrName] != null && attrs[attrName] !== "") {
					classes.push(attrs[attrName])
					cell.attrs[attrName] = "" //create key in correct iteration order
				}
				else cell.attrs[attrName] = attrs[attrName]
			}
		}
		if (classes.length > 0) cell.attrs[classAttrName] = classes.join(" ");
		
		return cell
	}
	function build(parentElement, parentTag, parentCache, parentIndex, data, cached, shouldReattach, index, editable, namespace, configs) {
		//`build` is a recursive function that manages creation/diffing/removal of DOM elements based on comparison between `data` and `cached`
		//the diff algorithm can be summarized as this:
		//1 - compare `data` and `cached`
		//2 - if they are different, copy `data` to `cached` and update the DOM based on what the difference is
		//3 - recursively apply this algorithm for every array and for the children of every virtual element

		//the `cached` data structure is essentially the same as the previous redraw's `data` data structure, with a few additions:
		//- `cached` always has a property called `nodes`, which is a list of DOM elements that correspond to the data represented by the respective virtual element
		//- in order to support attaching `nodes` as a property of `cached`, `cached` is *always* a non-primitive object, i.e. if the data was a string, then cached is a String instance. If data was `null` or `undefined`, cached is `new String("")`
		//- `cached also has a `configContext` property, which is the state storage object exposed by config(element, isInitialized, context)
		//- when `cached` is an Object, it represents a virtual element; when it's an Array, it represents a list of elements; when it's a String, Number or Boolean, it represents a text node

		//`parentElement` is a DOM element used for W3C DOM API calls
		//`parentTag` is only used for handling a corner case for textarea values
		//`parentCache` is used to remove nodes in some multi-node cases
		//`parentIndex` and `index` are used to figure out the offset of nodes. They're artifacts from before arrays started being flattened and are likely refactorable
		//`data` and `cached` are, respectively, the new and old nodes being diffed
		//`shouldReattach` is a flag indicating whether a parent node was recreated (if so, and if this node is reused, then this node must reattach itself to the new parent)
		//`editable` is a flag that indicates whether an ancestor is contenteditable
		//`namespace` indicates the closest HTML namespace as it cascades down from an ancestor
		//`configs` is a list of config functions to run after the topmost `build` call finishes running

		//there's logic that relies on the assumption that null and undefined data are equivalent to empty strings
		//- this prevents lifecycle surprises from procedural helpers that mix implicit and explicit return statements (e.g. function foo() {if (cond) return m("div")}
		//- it simplifies diffing code
		//data.toString() might throw or return null if data is the return value of Console.log in Firefox (behavior depends on version)
		try {if (data == null || data.toString() == null) data = "";} catch (e) {data = ""}
		if (data.subtree === "retain") return cached;
		var cachedType = type.call(cached), dataType = type.call(data);
		if (cached == null || cachedType !== dataType) {
			if (cached != null) {
				if (parentCache && parentCache.nodes) {
					var offset = index - parentIndex;
					var end = offset + (dataType === ARRAY ? data : cached.nodes).length;
					clear(parentCache.nodes.slice(offset, end), parentCache.slice(offset, end))
				}
				else if (cached.nodes) clear(cached.nodes, cached)
			}
			cached = new data.constructor;
			if (cached.tag) cached = {}; //if constructor creates a virtual dom element, use a blank object as the base cached node instead of copying the virtual el (#277)
			cached.nodes = []
		}

		if (dataType === ARRAY) {
			//recursively flatten array
			for (var i = 0, len = data.length; i < len; i++) {
				if (type.call(data[i]) === ARRAY) {
					data = data.concat.apply([], data);
					i-- //check current index again and flatten until there are no more nested arrays at that index
					len = data.length
				}
			}
			
			var nodes = [], intact = cached.length === data.length, subArrayCount = 0;

			//keys algorithm: sort elements without recreating them if keys are present
			//1) create a map of all existing keys, and mark all for deletion
			//2) add new keys to map and mark them for addition
			//3) if key exists in new list, change action from deletion to a move
			//4) for each key, handle its corresponding action as marked in previous steps
			var DELETION = 1, INSERTION = 2 , MOVE = 3;
			var existing = {}, shouldMaintainIdentities = false;
			for (var i = 0; i < cached.length; i++) {
				if (cached[i] && cached[i].attrs && cached[i].attrs.key != null) {
					shouldMaintainIdentities = true;
					existing[cached[i].attrs.key] = {action: DELETION, index: i}
				}
			}
			
			var guid = 0
			for (var i = 0, len = data.length; i < len; i++) {
				if (data[i] && data[i].attrs && data[i].attrs.key != null) {
					for (var j = 0, len = data.length; j < len; j++) {
						if (data[j] && data[j].attrs && data[j].attrs.key == null) data[j].attrs.key = "__mithril__" + guid++
					}
					break
				}
			}
			
			if (shouldMaintainIdentities) {
				var keysDiffer = false
				if (data.length != cached.length) keysDiffer = true
				else for (var i = 0, cachedCell, dataCell; cachedCell = cached[i], dataCell = data[i]; i++) {
					if (cachedCell.attrs && dataCell.attrs && cachedCell.attrs.key != dataCell.attrs.key) {
						keysDiffer = true
						break
					}
				}
				
				if (keysDiffer) {
					for (var i = 0, len = data.length; i < len; i++) {
						if (data[i] && data[i].attrs) {
							if (data[i].attrs.key != null) {
								var key = data[i].attrs.key;
								if (!existing[key]) existing[key] = {action: INSERTION, index: i};
								else existing[key] = {
									action: MOVE,
									index: i,
									from: existing[key].index,
									element: cached.nodes[existing[key].index] || $document.createElement("div")
								}
							}
						}
					}
					var actions = []
					for (var prop in existing) actions.push(existing[prop])
					var changes = actions.sort(sortChanges);
					var newCached = new Array(cached.length)
					newCached.nodes = cached.nodes.slice()

					for (var i = 0, change; change = changes[i]; i++) {
						if (change.action === DELETION) {
							clear(cached[change.index].nodes, cached[change.index]);
							newCached.splice(change.index, 1)
						}
						if (change.action === INSERTION) {
							var dummy = $document.createElement("div");
							dummy.key = data[change.index].attrs.key;
							parentElement.insertBefore(dummy, parentElement.childNodes[change.index] || null);
							newCached.splice(change.index, 0, {attrs: {key: data[change.index].attrs.key}, nodes: [dummy]})
							newCached.nodes[change.index] = dummy
						}

						if (change.action === MOVE) {
							if (parentElement.childNodes[change.index] !== change.element && change.element !== null) {
								parentElement.insertBefore(change.element, parentElement.childNodes[change.index] || null)
							}
							newCached[change.index] = cached[change.from]
							newCached.nodes[change.index] = change.element
						}
					}
					cached = newCached;
				}
			}
			//end key algorithm

			for (var i = 0, cacheCount = 0, len = data.length; i < len; i++) {
				//diff each item in the array
				var item = build(parentElement, parentTag, cached, index, data[i], cached[cacheCount], shouldReattach, index + subArrayCount || subArrayCount, editable, namespace, configs);
				if (item === undefined) continue;
				if (!item.nodes.intact) intact = false;
				if (item.$trusted) {
					//fix offset of next element if item was a trusted string w/ more than one html element
					//the first clause in the regexp matches elements
					//the second clause (after the pipe) matches text nodes
					subArrayCount += (item.match(/<[^\/]|\>\s*[^<]/g) || [0]).length
				}
				else subArrayCount += type.call(item) === ARRAY ? item.length : 1;
				cached[cacheCount++] = item
			}
			if (!intact) {
				//diff the array itself
				
				//update the list of DOM nodes by collecting the nodes from each item
				for (var i = 0, len = data.length; i < len; i++) {
					if (cached[i] != null) nodes.push.apply(nodes, cached[i].nodes)
				}
				//remove items from the end of the array if the new array is shorter than the old one
				//if errors ever happen here, the issue is most likely a bug in the construction of the `cached` data structure somewhere earlier in the program
				for (var i = 0, node; node = cached.nodes[i]; i++) {
					if (node.parentNode != null && nodes.indexOf(node) < 0) clear([node], [cached[i]])
				}
				if (data.length < cached.length) cached.length = data.length;
				cached.nodes = nodes
			}
		}
		else if (data != null && dataType === OBJECT) {
			var views = [], controllers = []
			while (data.view) {
				var view = data.view.$original || data.view
				var controllerIndex = m.redraw.strategy() == "diff" && cached.views ? cached.views.indexOf(view) : -1
				var controller = controllerIndex > -1 ? cached.controllers[controllerIndex] : new (data.controller || noop)
				var key = data && data.attrs && data.attrs.key
				data = pendingRequests == 0 || (cached && cached.controllers && cached.controllers.indexOf(controller) > -1) ? data.view(controller) : {tag: "placeholder"}
				if (data.subtree === "retain") return cached;
				if (key) {
					if (!data.attrs) data.attrs = {}
					data.attrs.key = key
				}
				if (controller.onunload) unloaders.push({controller: controller, handler: controller.onunload})
				views.push(view)
				controllers.push(controller)
			}
			if (!data.tag && controllers.length) throw new Error("Component template must return a virtual element, not an array, string, etc.")
			if (!data.attrs) data.attrs = {};
			if (!cached.attrs) cached.attrs = {};

			var dataAttrKeys = Object.keys(data.attrs)
			var hasKeys = dataAttrKeys.length > ("key" in data.attrs ? 1 : 0)
			//if an element is different enough from the one in cache, recreate it
			if (data.tag != cached.tag || dataAttrKeys.sort().join() != Object.keys(cached.attrs).sort().join() || data.attrs.id != cached.attrs.id || data.attrs.key != cached.attrs.key || (m.redraw.strategy() == "all" && (!cached.configContext || cached.configContext.retain !== true)) || (m.redraw.strategy() == "diff" && cached.configContext && cached.configContext.retain === false)) {
				if (cached.nodes.length) clear(cached.nodes);
				if (cached.configContext && typeof cached.configContext.onunload === FUNCTION) cached.configContext.onunload()
				if (cached.controllers) {
					for (var i = 0, controller; controller = cached.controllers[i]; i++) {
						if (typeof controller.onunload === FUNCTION) controller.onunload({preventDefault: noop})
					}
				}
			}
			if (type.call(data.tag) != STRING) return;

			var node, isNew = cached.nodes.length === 0;
			if (data.attrs.xmlns) namespace = data.attrs.xmlns;
			else if (data.tag === "svg") namespace = "http://www.w3.org/2000/svg";
			else if (data.tag === "math") namespace = "http://www.w3.org/1998/Math/MathML";
			
			if (isNew) {
				if (data.attrs.is) node = namespace === undefined ? $document.createElement(data.tag, data.attrs.is) : $document.createElementNS(namespace, data.tag, data.attrs.is);
				else node = namespace === undefined ? $document.createElement(data.tag) : $document.createElementNS(namespace, data.tag);
				cached = {
					tag: data.tag,
					//set attributes first, then create children
					attrs: hasKeys ? setAttributes(node, data.tag, data.attrs, {}, namespace) : data.attrs,
					children: data.children != null && data.children.length > 0 ?
						build(node, data.tag, undefined, undefined, data.children, cached.children, true, 0, data.attrs.contenteditable ? node : editable, namespace, configs) :
						data.children,
					nodes: [node]
				};
				if (controllers.length) {
					cached.views = views
					cached.controllers = controllers
					for (var i = 0, controller; controller = controllers[i]; i++) {
						if (controller.onunload && controller.onunload.$old) controller.onunload = controller.onunload.$old
						if (pendingRequests && controller.onunload) {
							var onunload = controller.onunload
							controller.onunload = noop
							controller.onunload.$old = onunload
						}
					}
				}
				
				if (cached.children && !cached.children.nodes) cached.children.nodes = [];
				//edge case: setting value on <select> doesn't work before children exist, so set it again after children have been created
				if (data.tag === "select" && "value" in data.attrs) setAttributes(node, data.tag, {value: data.attrs.value}, {}, namespace);
				parentElement.insertBefore(node, parentElement.childNodes[index] || null)
			}
			else {
				node = cached.nodes[0];
				if (hasKeys) setAttributes(node, data.tag, data.attrs, cached.attrs, namespace);
				cached.children = build(node, data.tag, undefined, undefined, data.children, cached.children, false, 0, data.attrs.contenteditable ? node : editable, namespace, configs);
				cached.nodes.intact = true;
				if (controllers.length) {
					cached.views = views
					cached.controllers = controllers
				}
				if (shouldReattach === true && node != null) parentElement.insertBefore(node, parentElement.childNodes[index] || null)
			}
			//schedule configs to be called. They are called after `build` finishes running
			if (typeof data.attrs["config"] === FUNCTION) {
				var context = cached.configContext = cached.configContext || {};

				// bind
				var callback = function(data, args) {
					return function() {
						return data.attrs["config"].apply(data, args)
					}
				};
				configs.push(callback(data, [node, !isNew, context, cached]))
			}
		}
		else if (typeof data != FUNCTION) {
			//handle text nodes
			var nodes;
			if (cached.nodes.length === 0) {
				if (data.$trusted) {
					nodes = injectHTML(parentElement, index, data)
				}
				else {
					nodes = [$document.createTextNode(data)];
					if (!parentElement.nodeName.match(voidElements)) parentElement.insertBefore(nodes[0], parentElement.childNodes[index] || null)
				}
				cached = "string number boolean".indexOf(typeof data) > -1 ? new data.constructor(data) : data;
				cached.nodes = nodes
			}
			else if (cached.valueOf() !== data.valueOf() || shouldReattach === true) {
				nodes = cached.nodes;
				if (!editable || editable !== $document.activeElement) {
					if (data.$trusted) {
						clear(nodes, cached);
						nodes = injectHTML(parentElement, index, data)
					}
					else {
						//corner case: replacing the nodeValue of a text node that is a child of a textarea/contenteditable doesn't work
						//we need to update the value property of the parent textarea or the innerHTML of the contenteditable element instead
						if (parentTag === "textarea") parentElement.value = data;
						else if (editable) editable.innerHTML = data;
						else {
							if (nodes[0].nodeType === 1 || nodes.length > 1) { //was a trusted string
								clear(cached.nodes, cached);
								nodes = [$document.createTextNode(data)]
							}
							parentElement.insertBefore(nodes[0], parentElement.childNodes[index] || null);
							nodes[0].nodeValue = data
						}
					}
				}
				cached = new data.constructor(data);
				cached.nodes = nodes
			}
			else cached.nodes.intact = true
		}

		return cached
	}
	function sortChanges(a, b) {return a.action - b.action || a.index - b.index}
	function setAttributes(node, tag, dataAttrs, cachedAttrs, namespace) {
		for (var attrName in dataAttrs) {
			var dataAttr = dataAttrs[attrName];
			var cachedAttr = cachedAttrs[attrName];
			if (!(attrName in cachedAttrs) || (cachedAttr !== dataAttr)) {
				cachedAttrs[attrName] = dataAttr;
				try {
					//`config` isn't a real attributes, so ignore it
					if (attrName === "config" || attrName == "key") continue;
					//hook event handlers to the auto-redrawing system
					else if (typeof dataAttr === FUNCTION && attrName.indexOf("on") === 0) {
						node[attrName] = autoredraw(dataAttr, node)
					}
					//handle `style: {...}`
					else if (attrName === "style" && dataAttr != null && type.call(dataAttr) === OBJECT) {
						for (var rule in dataAttr) {
							if (cachedAttr == null || cachedAttr[rule] !== dataAttr[rule]) node.style[rule] = dataAttr[rule]
						}
						for (var rule in cachedAttr) {
							if (!(rule in dataAttr)) node.style[rule] = ""
						}
					}
					//handle SVG
					else if (namespace != null) {
						if (attrName === "href") node.setAttributeNS("http://www.w3.org/1999/xlink", "href", dataAttr);
						else if (attrName === "className") node.setAttribute("class", dataAttr);
						else node.setAttribute(attrName, dataAttr)
					}
					//handle cases that are properties (but ignore cases where we should use setAttribute instead)
					//- list and form are typically used as strings, but are DOM element references in js
					//- when using CSS selectors (e.g. `m("[style='']")`), style is used as a string, but it's an object in js
					else if (attrName in node && !(attrName === "list" || attrName === "style" || attrName === "form" || attrName === "type" || attrName === "width" || attrName === "height")) {
						//#348 don't set the value if not needed otherwise cursor placement breaks in Chrome
						if (tag !== "input" || node[attrName] !== dataAttr) node[attrName] = dataAttr
					}
					else node.setAttribute(attrName, dataAttr)
				}
				catch (e) {
					//swallow IE's invalid argument errors to mimic HTML's fallback-to-doing-nothing-on-invalid-attributes behavior
					if (e.message.indexOf("Invalid argument") < 0) throw e
				}
			}
			//#348 dataAttr may not be a string, so use loose comparison (double equal) instead of strict (triple equal)
			// PDF fix for issue #701 https://github.com/lhorie/mithril.js/issues/701
            //#348 dataAttr may not be a string, so use loose comparison (double equal) instead of strict (triple equal)
            // PDF updates per Mithril issue #691 and Issue #701
			else if (attrName === "value" && (tag === "input" || tag === "textarea") && node.value != dataAttr) {
			    node[attrName] = dataAttr;
			}
			// The below fixes seem to break selects (the "selected" parts) so backing it all out for now, except for the textarea addition above
			/*
			else if (attrName === "checked" || attrName === "selected") node[attrName] = !!dataAttr; 
			else if (node[attrName] != dataAttr) node[attrName] = dataAttr;
			*/
			/*
            else if (attrName === "value" && (tag === "input" || tag === "textarea" || tag === "select") && node.value != dataAttr) {
                node.value = dataAttr;
            }
            else if (attrName === "checked" && (tag === "input") && node.checked != dataAttr) {
                // TODO: Maybe this case should be more selective to checkbox and radio?
                node.checked = !!dataAttr;
            }
            else if (attrName === "selected" && (tag === "option") && node.selected != dataAttr) {
                node.selected = !!dataAttr;
            }
            else if (attrName === "selectionStart" && (tag === "input" || tag === "textarea") && node.selectionStart != dataAttr) {
                node.selectionStart = dataAttr;
            }
            else if (attrName === "selectionEnd" && (tag === "input" || tag === "textarea") && node.selectionEnd != dataAttr) {
                node.selectionEnd = dataAttr;
            }
            else if (attrName === "selectionDirection" && (tag === "input" || tag === "textarea") && node.selectionDirection != dataAttr) {
                node.selectionDirection = dataAttr;
            }
            else if (attrName === "scrollTop" && node.scrollTop != dataAttr) {
                // TODO: Maybe this case should be more selective?
                node.scrollTop = dataAttr;
            }
            else if (tag === "keygen") {
                throw new Error("keygen support unfininshed");
            }
            */
		}
		return cachedAttrs
	}
	function clear(nodes, cached) {
		for (var i = nodes.length - 1; i > -1; i--) {
			if (nodes[i] && nodes[i].parentNode) {
				try {nodes[i].parentNode.removeChild(nodes[i])}
				catch (e) {} //ignore if this fails due to order of events (see http://stackoverflow.com/questions/21926083/failed-to-execute-removechild-on-node)
				cached = [].concat(cached);
				if (cached[i]) unload(cached[i])
			}
		}
		if (nodes.length != 0) nodes.length = 0
	}
	function unload(cached) {
		if (cached.configContext && typeof cached.configContext.onunload === FUNCTION) {
			cached.configContext.onunload();
			cached.configContext.onunload = null
		}
		if (cached.controllers) {
			for (var i = 0, controller; controller = cached.controllers[i]; i++) {
				if (typeof controller.onunload === FUNCTION) controller.onunload({preventDefault: noop});
			}
		}
		if (cached.children) {
			if (type.call(cached.children) === ARRAY) {
				for (var i = 0, child; child = cached.children[i]; i++) unload(child)
			}
			else if (cached.children.tag) unload(cached.children)
		}
	}
	function injectHTML(parentElement, index, data) {
		var nextSibling = parentElement.childNodes[index];
		if (nextSibling) {
			var isElement = nextSibling.nodeType != 1;
			var placeholder = $document.createElement("span");
			if (isElement) {
				parentElement.insertBefore(placeholder, nextSibling || null);
				placeholder.insertAdjacentHTML("beforebegin", data);
				parentElement.removeChild(placeholder)
			}
			else nextSibling.insertAdjacentHTML("beforebegin", data)
		}
		else parentElement.insertAdjacentHTML("beforeend", data);
		var nodes = [];
		while (parentElement.childNodes[index] !== nextSibling) {
			nodes.push(parentElement.childNodes[index]);
			index++
		}
		return nodes
	}
	function autoredraw(callback, object) {
		return function(e) {
			e = e || event;
			m.redraw.strategy("diff");
			m.startComputation();
			try {return callback.call(object, e)}
			finally {
				endFirstComputation()
			}
		}
	}

	var html;
	var documentNode = {
		appendChild: function(node) {
			if (html === undefined) html = $document.createElement("html");
			if ($document.documentElement && $document.documentElement !== node) {
				$document.replaceChild(node, $document.documentElement)
			}
			else $document.appendChild(node);
			this.childNodes = $document.childNodes
		},
		insertBefore: function(node) {
			this.appendChild(node)
		},
		childNodes: []
	};
	var nodeCache = [], cellCache = {};
	m.render = function(root, cell, forceRecreation) {
		var configs = [];
		if (!root) throw new Error("Ensure the DOM element being passed to m.route/m.mount/m.render is not undefined.");
		var id = getCellCacheKey(root);
		var isDocumentRoot = root === $document;
		var node = isDocumentRoot || root === $document.documentElement ? documentNode : root;
		if (isDocumentRoot && cell.tag != "html") cell = {tag: "html", attrs: {}, children: cell};
		if (cellCache[id] === undefined) clear(node.childNodes);
		if (forceRecreation === true) reset(root);
		cellCache[id] = build(node, null, undefined, undefined, cell, cellCache[id], false, 0, null, undefined, configs);
		for (var i = 0, len = configs.length; i < len; i++) configs[i]()
	};
	function getCellCacheKey(element) {
		var index = nodeCache.indexOf(element);
		return index < 0 ? nodeCache.push(element) - 1 : index
	}

	m.trust = function(value) {
		value = new String(value);
		value.$trusted = true;
		return value
	};

	function gettersetter(store) {
		var prop = function() {
			if (arguments.length) store = arguments[0];
			return store
		};

		prop.toJSON = function() {
			return store
		};

		return prop
	}

	m.prop = function (store) {
		//note: using non-strict equality check here because we're checking if store is null OR undefined
		if (((store != null && type.call(store) === OBJECT) || typeof store === FUNCTION) && typeof store.then === FUNCTION) {
			return propify(store)
		}

		return gettersetter(store)
	};

	var roots = [], components = [], controllers = [], lastRedrawId = null, lastRedrawCallTime = 0, computePreRedrawHook = null, computePostRedrawHook = null, prevented = false, topComponent, unloaders = [];
	var FRAME_BUDGET = 16; //60 frames per second = 1 call per 16 ms
	function parameterize(component, args) {
		var controller = function() {
			return (component.controller || noop).apply(this, args) || this
		}
		var view = function(ctrl) {
			if (arguments.length > 1) args = args.concat([].slice.call(arguments, 1))
			return component.view.apply(component, args ? [ctrl].concat(args) : [ctrl])
		}
		view.$original = component.view
		var output = {controller: controller, view: view}
		if (args[0] && args[0].key != null) output.attrs = {key: args[0].key}
		return output
	}
	m.component = function(component) {
		return parameterize(component, [].slice.call(arguments, 1))
	}
	m.mount = m.module = function(root, component) {
		if (!root) throw new Error("Please ensure the DOM element exists before rendering a template into it.");
		var index = roots.indexOf(root);
		if (index < 0) index = roots.length;
		
		var isPrevented = false;
		var event = {preventDefault: function() {
			isPrevented = true;
			computePreRedrawHook = computePostRedrawHook = null;
		}};
		for (var i = 0, unloader; unloader = unloaders[i]; i++) {
			unloader.handler.call(unloader.controller, event)
			unloader.controller.onunload = null
		}
		if (isPrevented) {
			for (var i = 0, unloader; unloader = unloaders[i]; i++) unloader.controller.onunload = unloader.handler
		}
		else unloaders = []
		
		if (controllers[index] && typeof controllers[index].onunload === FUNCTION) {
			controllers[index].onunload(event)
		}
		
		if (!isPrevented) {
			m.redraw.strategy("all");
			m.startComputation();
			roots[index] = root;
			if (arguments.length > 2) component = subcomponent(component, [].slice.call(arguments, 2))
			var currentComponent = topComponent = component = component || {controller: function() {}};
			var constructor = component.controller || noop
			var controller = new constructor;
			//controllers may call m.mount recursively (via m.route redirects, for example)
			//this conditional ensures only the last recursive m.mount call is applied
			if (currentComponent === topComponent) {
				controllers[index] = controller;
				components[index] = component
			}
			endFirstComputation();
			return controllers[index]
		}
	};
	var redrawing = false
	m.redraw = function(force) {
		if (redrawing) return
		redrawing = true
		//lastRedrawId is a positive number if a second redraw is requested before the next animation frame
		//lastRedrawID is null if it's the first redraw and not an event handler
		if (lastRedrawId && force !== true) {
			//when setTimeout: only reschedule redraw if time between now and previous redraw is bigger than a frame, otherwise keep currently scheduled timeout
			//when rAF: always reschedule redraw
			if ($requestAnimationFrame === window.requestAnimationFrame || new Date - lastRedrawCallTime > FRAME_BUDGET) {
				if (lastRedrawId > 0) $cancelAnimationFrame(lastRedrawId);
				lastRedrawId = $requestAnimationFrame(redraw, FRAME_BUDGET)
			}
		}
		else {
			redraw();
			lastRedrawId = $requestAnimationFrame(function() {lastRedrawId = null}, FRAME_BUDGET)
		}
		redrawing = false
	};
	m.redraw.strategy = m.prop();
	function redraw() {
		if (computePreRedrawHook) {
			computePreRedrawHook()
			computePreRedrawHook = null
		}
		for (var i = 0, root; root = roots[i]; i++) {
			if (controllers[i]) {
				var args = components[i].controller && components[i].controller.$$args ? [controllers[i]].concat(components[i].controller.$$args) : [controllers[i]]
				m.render(root, components[i].view ? components[i].view(controllers[i], args) : "")
			}
		}
		//after rendering within a routed context, we need to scroll back to the top, and fetch the document title for history.pushState
		if (computePostRedrawHook) {
			computePostRedrawHook();
			computePostRedrawHook = null
		}
		lastRedrawId = null;
		lastRedrawCallTime = new Date;
		m.redraw.strategy("diff")
	}

	var pendingRequests = 0;
	m.startComputation = function() {pendingRequests++};
	m.endComputation = function() {
		pendingRequests = Math.max(pendingRequests - 1, 0);
		if (pendingRequests === 0) m.redraw()
	};
	var endFirstComputation = function() {
		if (m.redraw.strategy() == "none") {
			pendingRequests--
			m.redraw.strategy("diff")
		}
		else m.endComputation();
	}

	m.withAttr = function(prop, withAttrCallback) {
		return function(e) {
			e = e || event;
			var currentTarget = e.currentTarget || this;
			withAttrCallback(prop in currentTarget ? currentTarget[prop] : currentTarget.getAttribute(prop))
		}
	};

	//routing
	var modes = {pathname: "", hash: "#", search: "?"};
	var redirect = noop, routeParams, currentRoute, isDefaultRoute = false;
	m.route = function() {
		//m.route()
		if (arguments.length === 0) return currentRoute;
		//m.route(el, defaultRoute, routes)
		else if (arguments.length === 3 && type.call(arguments[1]) === STRING) {
			var root = arguments[0], defaultRoute = arguments[1], router = arguments[2];
			redirect = function(source) {
				var path = currentRoute = normalizeRoute(source);
				if (!routeByValue(root, router, path)) {
					if (isDefaultRoute) throw new Error("Ensure the default route matches one of the routes defined in m.route")
					isDefaultRoute = true
					m.route(defaultRoute, true)
					isDefaultRoute = false
				}
			};
			var listener = m.route.mode === "hash" ? "onhashchange" : "onpopstate";
			window[listener] = function() {
				var path = $location[m.route.mode]
				if (m.route.mode === "pathname") path += $location.search
				if (currentRoute != normalizeRoute(path)) {
					redirect(path)
				}
			};
			computePreRedrawHook = setScroll;
			window[listener]()
		}
		//config: m.route
		else if (arguments[0].addEventListener || arguments[0].attachEvent) {
			var element = arguments[0];
			var isInitialized = arguments[1];
			var context = arguments[2];
			var vdom = arguments[3];
			element.href = (m.route.mode !== 'pathname' ? $location.pathname : '') + modes[m.route.mode] + vdom.attrs.href;
			if (element.addEventListener) {
				element.removeEventListener("click", routeUnobtrusive);
				element.addEventListener("click", routeUnobtrusive)
			}
			else {
				element.detachEvent("onclick", routeUnobtrusive);
				element.attachEvent("onclick", routeUnobtrusive)
			}
		}
		//m.route(route, params, shouldReplaceHistoryEntry)
		else if (type.call(arguments[0]) === STRING) {
			var oldRoute = currentRoute;
			currentRoute = arguments[0];
			var args = arguments[1] || {}
			var queryIndex = currentRoute.indexOf("?")
			var params = queryIndex > -1 ? parseQueryString(currentRoute.slice(queryIndex + 1)) : {}
			for (var i in args) params[i] = args[i]
			var querystring = buildQueryString(params)
			var currentPath = queryIndex > -1 ? currentRoute.slice(0, queryIndex) : currentRoute
			if (querystring) currentRoute = currentPath + (currentPath.indexOf("?") === -1 ? "?" : "&") + querystring;

			var shouldReplaceHistoryEntry = (arguments.length === 3 ? arguments[2] : arguments[1]) === true || oldRoute === arguments[0];

			if (window.history.pushState) {
				computePreRedrawHook = setScroll
				computePostRedrawHook = function() {
					window.history[shouldReplaceHistoryEntry ? "replaceState" : "pushState"](null, $document.title, modes[m.route.mode] + currentRoute);
				};
				redirect(modes[m.route.mode] + currentRoute)
			}
			else {
				$location[m.route.mode] = currentRoute
				redirect(modes[m.route.mode] + currentRoute)
			}
		}
	};
	m.route.param = function(key) {
		if (!routeParams) throw new Error("You must call m.route(element, defaultRoute, routes) before calling m.route.param()")
		return routeParams[key]
	};
	m.route.mode = "search";
	function normalizeRoute(route) {
		return route.slice(modes[m.route.mode].length)
	}
	function routeByValue(root, router, path) {
		routeParams = {};

		var queryStart = path.indexOf("?");
		if (queryStart !== -1) {
			routeParams = parseQueryString(path.substr(queryStart + 1, path.length));
			path = path.substr(0, queryStart)
		}

		// Get all routes and check if there's
		// an exact match for the current path
		var keys = Object.keys(router);
		var index = keys.indexOf(path);
		if(index !== -1){
			m.mount(root, router[keys [index]]);
			return true;
		}

		for (var route in router) {
			if (route === path) {
				m.mount(root, router[route]);
				return true
			}

			var matcher = new RegExp("^" + route.replace(/:[^\/]+?\.{3}/g, "(.*?)").replace(/:[^\/]+/g, "([^\\/]+)") + "\/?$");

			if (matcher.test(path)) {
				path.replace(matcher, function() {
					var keys = route.match(/:[^\/]+/g) || [];
					var values = [].slice.call(arguments, 1, -2);
					for (var i = 0, len = keys.length; i < len; i++) routeParams[keys[i].replace(/:|\./g, "")] = decodeURIComponent(values[i])
					m.mount(root, router[route])
				});
				return true
			}
		}
	}
	function routeUnobtrusive(e) {
		e = e || event;
		if (e.ctrlKey || e.metaKey || e.which === 2) return;
		if (e.preventDefault) e.preventDefault();
		else e.returnValue = false;
		var currentTarget = e.currentTarget || e.srcElement;
		var args = m.route.mode === "pathname" && currentTarget.search ? parseQueryString(currentTarget.search.slice(1)) : {};
		while (currentTarget && currentTarget.nodeName.toUpperCase() != "A") currentTarget = currentTarget.parentNode
		m.route(currentTarget[m.route.mode].slice(modes[m.route.mode].length), args)
	}
	function setScroll() {
		if (m.route.mode != "hash" && $location.hash) $location.hash = $location.hash;
		else window.scrollTo(0, 0)
	}
	function buildQueryString(object, prefix) {
		var duplicates = {}
		var str = []
		for (var prop in object) {
			var key = prefix ? prefix + "[" + prop + "]" : prop
			var value = object[prop]
			var valueType = type.call(value)
			var pair = (value === null) ? encodeURIComponent(key) :
				valueType === OBJECT ? buildQueryString(value, key) :
				valueType === ARRAY ? value.reduce(function(memo, item) {
					if (!duplicates[key]) duplicates[key] = {}
					if (!duplicates[key][item]) {
						duplicates[key][item] = true
						return memo.concat(encodeURIComponent(key) + "=" + encodeURIComponent(item))
					}
					return memo
				}, []).join("&") :
				encodeURIComponent(key) + "=" + encodeURIComponent(value)
			if (value !== undefined) str.push(pair)
		}
		return str.join("&")
	}
	function parseQueryString(str) {
		if (str.charAt(0) === "?") str = str.substring(1);
		
		var pairs = str.split("&"), params = {};
		for (var i = 0, len = pairs.length; i < len; i++) {
			var pair = pairs[i].split("=");
			var key = decodeURIComponent(pair[0])
			var value = pair.length == 2 ? decodeURIComponent(pair[1]) : null
			if (params[key] != null) {
				if (type.call(params[key]) !== ARRAY) params[key] = [params[key]]
				params[key].push(value)
			}
			else params[key] = value
		}
		return params
	}
	m.route.buildQueryString = buildQueryString
	m.route.parseQueryString = parseQueryString
	
	function reset(root) {
		var cacheKey = getCellCacheKey(root);
		clear(root.childNodes, cellCache[cacheKey]);
		cellCache[cacheKey] = undefined
	}

	m.deferred = function () {
		var deferred = new Deferred();
		deferred.promise = propify(deferred.promise);
		return deferred
	};
	function propify(promise, initialValue) {
		var prop = m.prop(initialValue);
		promise.then(prop);
		prop.then = function(resolve, reject) {
			return propify(promise.then(resolve, reject), initialValue)
		};
		return prop
	}
	//Promiz.mithril.js | Zolmeister | MIT
	//a modified version of Promiz.js, which does not conform to Promises/A+ for two reasons:
	//1) `then` callbacks are called synchronously (because setTimeout is too slow, and the setImmediate polyfill is too big
	//2) throwing subclasses of Error cause the error to be bubbled up instead of triggering rejection (because the spec does not account for the important use case of default browser error handling, i.e. message w/ line number)
	function Deferred(successCallback, failureCallback) {
		var RESOLVING = 1, REJECTING = 2, RESOLVED = 3, REJECTED = 4;
		var self = this, state = 0, promiseValue = 0, next = [];

		self["promise"] = {};

		self["resolve"] = function(value) {
			if (!state) {
				promiseValue = value;
				state = RESOLVING;

				fire()
			}
			return this
		};

		self["reject"] = function(value) {
			if (!state) {
				promiseValue = value;
				state = REJECTING;

				fire()
			}
			return this
		};

		self.promise["then"] = function(successCallback, failureCallback) {
			var deferred = new Deferred(successCallback, failureCallback);
			if (state === RESOLVED) {
				deferred.resolve(promiseValue)
			}
			else if (state === REJECTED) {
				deferred.reject(promiseValue)
			}
			else {
				next.push(deferred)
			}
			return deferred.promise
		};

		function finish(type) {
			state = type || REJECTED;
			next.map(function(deferred) {
				state === RESOLVED && deferred.resolve(promiseValue) || deferred.reject(promiseValue)
			})
		}

		function thennable(then, successCallback, failureCallback, notThennableCallback) {
			if (((promiseValue != null && type.call(promiseValue) === OBJECT) || typeof promiseValue === FUNCTION) && typeof then === FUNCTION) {
				try {
					// count protects against abuse calls from spec checker
					var count = 0;
					then.call(promiseValue, function(value) {
						if (count++) return;
						promiseValue = value;
						successCallback()
					}, function (value) {
						if (count++) return;
						promiseValue = value;
						failureCallback()
					})
				}
				catch (e) {
					m.deferred.onerror(e);
					promiseValue = e;
					failureCallback()
				}
			} else {
				notThennableCallback()
			}
		}

		function fire() {
			// check if it's a thenable
			var then;
			try {
				then = promiseValue && promiseValue.then
			}
			catch (e) {
				m.deferred.onerror(e);
				promiseValue = e;
				state = REJECTING;
				return fire()
			}
			thennable(then, function() {
				state = RESOLVING;
				fire()
			}, function() {
				state = REJECTING;
				fire()
			}, function() {
				try {
					if (state === RESOLVING && typeof successCallback === FUNCTION) {
						promiseValue = successCallback(promiseValue)
					}
					else if (state === REJECTING && typeof failureCallback === "function") {
						promiseValue = failureCallback(promiseValue);
						state = RESOLVING
					}
				}
				catch (e) {
					m.deferred.onerror(e);
					promiseValue = e;
					return finish()
				}

				if (promiseValue === self) {
					promiseValue = TypeError();
					finish()
				}
				else {
					thennable(then, function () {
						finish(RESOLVED)
					}, finish, function () {
						finish(state === RESOLVING && RESOLVED)
					})
				}
			})
		}
	}
	m.deferred.onerror = function(e) {
		if (type.call(e) === "[object Error]" && !e.constructor.toString().match(/ Error/)) throw e
	};

	m.sync = function(args) {
		var method = "resolve";
		function synchronizer(pos, resolved) {
			return function(value) {
				results[pos] = value;
				if (!resolved) method = "reject";
				if (--outstanding === 0) {
					deferred.promise(results);
					deferred[method](results)
				}
				return value
			}
		}

		var deferred = m.deferred();
		var outstanding = args.length;
		var results = new Array(outstanding);
		if (args.length > 0) {
			for (var i = 0; i < args.length; i++) {
				args[i].then(synchronizer(i, true), synchronizer(i, false))
			}
		}
		else deferred.resolve([]);

		return deferred.promise
	};
	function identity(value) {return value}

	function ajax(options) {
		if (options.dataType && options.dataType.toLowerCase() === "jsonp") {
			var callbackKey = "mithril_callback_" + new Date().getTime() + "_" + (Math.round(Math.random() * 1e16)).toString(36);
			var script = $document.createElement("script");

			window[callbackKey] = function(resp) {
				script.parentNode.removeChild(script);
				options.onload({
					type: "load",
					target: {
						responseText: resp
					}
				});
				window[callbackKey] = undefined
			};

			script.onerror = function(e) {
				script.parentNode.removeChild(script);

				options.onerror({
					type: "error",
					target: {
						status: 500,
						responseText: JSON.stringify({error: "Error making jsonp request"})
					}
				});
				window[callbackKey] = undefined;

				return false
			};

			script.onload = function(e) {
				return false
			};

			script.src = options.url
				+ (options.url.indexOf("?") > 0 ? "&" : "?")
				+ (options.callbackKey ? options.callbackKey : "callback")
				+ "=" + callbackKey
				+ "&" + buildQueryString(options.data || {});
			$document.body.appendChild(script)
		}
		else {
			var xhr = new window.XMLHttpRequest;
			xhr.open(options.method, options.url, true, options.user, options.password);
			xhr.onreadystatechange = function() {
				if (xhr.readyState === 4) {
					if (xhr.status >= 200 && xhr.status < 300) options.onload({type: "load", target: xhr});
					else options.onerror({type: "error", target: xhr})
				}
			};
			if (options.serialize === JSON.stringify && options.data && options.method !== "GET") {
				xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8")
			}
			if (options.deserialize === JSON.parse) {
				xhr.setRequestHeader("Accept", "application/json, text/*");
			}
			if (typeof options.config === FUNCTION) {
				var maybeXhr = options.config(xhr, options);
				if (maybeXhr != null) xhr = maybeXhr
			}

			var data = options.method === "GET" || !options.data ? "" : options.data
			if (data && (type.call(data) != STRING && data.constructor != window.FormData)) {
				throw "Request data should be either be a string or FormData. Check the `serialize` option in `m.request`";
			}
			xhr.send(data);
			return xhr
		}
	}
	function bindData(xhrOptions, data, serialize) {
		if (xhrOptions.method === "GET" && xhrOptions.dataType != "jsonp") {
			var prefix = xhrOptions.url.indexOf("?") < 0 ? "?" : "&";
			var querystring = buildQueryString(data);
			xhrOptions.url = xhrOptions.url + (querystring ? prefix + querystring : "")
		}
		else xhrOptions.data = serialize(data);
		return xhrOptions
	}
	function parameterizeUrl(url, data) {
		var tokens = url.match(/:[a-z]\w+/gi);
		if (tokens && data) {
			for (var i = 0; i < tokens.length; i++) {
				var key = tokens[i].slice(1);
				url = url.replace(tokens[i], data[key]);
				delete data[key]
			}
		}
		return url
	}

	m.request = function(xhrOptions) {
		if (xhrOptions.background !== true) m.startComputation();
		var deferred = new Deferred();
		var isJSONP = xhrOptions.dataType && xhrOptions.dataType.toLowerCase() === "jsonp";
		var serialize = xhrOptions.serialize = isJSONP ? identity : xhrOptions.serialize || JSON.stringify;
		var deserialize = xhrOptions.deserialize = isJSONP ? identity : xhrOptions.deserialize || JSON.parse;
		var extract = isJSONP ? function(jsonp) {return jsonp.responseText} : xhrOptions.extract || function(xhr) {
			return xhr.responseText.length === 0 && deserialize === JSON.parse ? null : xhr.responseText
		};
		xhrOptions.method = (xhrOptions.method || 'GET').toUpperCase();
		xhrOptions.url = parameterizeUrl(xhrOptions.url, xhrOptions.data);
		xhrOptions = bindData(xhrOptions, xhrOptions.data, serialize);
		xhrOptions.onload = xhrOptions.onerror = function(e) {
			try {
				e = e || event;
				var unwrap = (e.type === "load" ? xhrOptions.unwrapSuccess : xhrOptions.unwrapError) || identity;
				var response = unwrap(deserialize(extract(e.target, xhrOptions)), e.target);
				if (e.type === "load") {
					if (type.call(response) === ARRAY && xhrOptions.type) {
						for (var i = 0; i < response.length; i++) response[i] = new xhrOptions.type(response[i])
					}
					else if (xhrOptions.type) response = new xhrOptions.type(response)
				}
				deferred[e.type === "load" ? "resolve" : "reject"](response)
			}
			catch (e) {
				m.deferred.onerror(e);
				deferred.reject(e)
			}
			if (xhrOptions.background !== true) m.endComputation()
		};
		ajax(xhrOptions);
		deferred.promise = propify(deferred.promise, xhrOptions.initialValue);
		return deferred.promise
	};

	//testing API
	m.deps = function(mock) {
		initialize(window = mock || window);
		return window;
	};
	//for internal testing only, do not use `m.deps.factory`
	m.deps.factory = app;

	return m
})(typeof window != "undefined" ? window : {});

if (typeof module != "undefined" && module !== null && module.exports) module.exports = m;
else if (typeof define === "function" && define.amd) define('mithril',[],function() {return m});

define('js/pointrel20150417/generateRandomUuid',["require", "exports"], function (require, exports) {
    "use strict";
    function generateRandomUuid(className) {
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
        var HEX_RADIX = 16;
        function _generateRandomEightCharacterHexString() {
            // Make random32bitNumber be a randomly generated floating point number
            // between 0 and (4,294,967,296 - 1), inclusive.
            var random32bitNumber = Math.floor((Math.random() % 1) * Math.pow(2, 32));
            var eightCharacterHexString = random32bitNumber.toString(HEX_RADIX);
            while (eightCharacterHexString.length < 8) {
                eightCharacterHexString = "0" + eightCharacterHexString;
            }
            return eightCharacterHexString; // for example: "3B12F1DF"
        }
        var hyphen = "-";
        var versionCodeForRandomlyGeneratedUuids = "4"; // 8 == binary2hex("0100")
        var variantCodeForDCEUuids = "8"; // 8 == binary2hex("1000")
        var a = _generateRandomEightCharacterHexString();
        var b = _generateRandomEightCharacterHexString();
        b = b.substring(0, 4) + hyphen + versionCodeForRandomlyGeneratedUuids + b.substring(5, 8);
        var c = _generateRandomEightCharacterHexString();
        c = variantCodeForDCEUuids + c.substring(1, 4) + hyphen + c.substring(4, 8);
        var d = _generateRandomEightCharacterHexString();
        var returnValue = a + hyphen + b + hyphen + c + d;
        returnValue = returnValue.toLowerCase();
        return className + "_" + returnValue; // String
    }
    return generateRandomUuid;
});

define('js/sanitizeHTML',["require", "exports", "mithril"], function (require, exports, m) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    "use strict";
    // This constructs a nested Mithril object with only specific HTML tags allowed
    // No attributes are allowed.
    // A css class (from a short approved list) can be set on a tag using a ".className" after the opening tag name.
    // For example: <span.narrafirma-special-warning>Warning!!!<span>
    // 1 is normal tag that needs to be closed; 2 is self-closing tag (br and hr)
    var allowedHTMLTags = {
        // a
        address: 1,
        article: 1,
        b: 1,
        big: 1,
        blockquote: 1,
        br: 2,
        caption: 1,
        cite: 1,
        code: 1,
        del: 1,
        div: 1,
        dd: 1,
        d1: 1,
        dt: 1,
        em: 1,
        h1: 1,
        h2: 1,
        h3: 1,
        h4: 1,
        h5: 1,
        h6: 1,
        hr: 2,
        i: 1,
        // img
        kbd: 1,
        li: 1,
        ol: 1,
        p: 1,
        pre: 1,
        s: 1,
        small: 1,
        span: 1,
        sup: 1,
        sub: 1,
        strong: 1,
        strike: 1,
        table: 1,
        td: 1,
        th: 1,
        tr: 1,
        u: 1,
        ul: 1
    };
    var smallerSubsetOfAllowedHTMLTags = {
        b: 1,
        big: 1,
        em: 1,
        i: 1,
        s: 1,
        small: 1,
        sup: 1,
        sub: 1,
        strong: 1,
        strike: 1,
        u: 1
    };
    var allowedCSSClasses = {
        "narrafirma-special-warning": 1,
        "narrafirma-centered-label": 1
    };
    function generateSanitizedHTMLForMithril(html) {
        return generateSpecificTypeOfSanitizedHTMLForMithril(html, allowedHTMLTags);
    }
    exports.generateSanitizedHTMLForMithril = generateSanitizedHTMLForMithril;
    function generateSmallerSetOfSanitizedHTMLForMithril(html) {
        return generateSpecificTypeOfSanitizedHTMLForMithril(html, smallerSubsetOfAllowedHTMLTags);
    }
    exports.generateSmallerSetOfSanitizedHTMLForMithril = generateSmallerSetOfSanitizedHTMLForMithril;
    function generateSpecificTypeOfSanitizedHTMLForMithril(html, specifiedHTMLTags) {
        if (html === undefined || html === null) {
            console.log("Undefined or null html", html);
            html = "";
        }
        // Handle case where is already a Mithril object
        if (html.tag)
            return html;
        var hasMarkup = html.indexOf("<") !== -1;
        if (!hasMarkup)
            return html;
        // Use a fake div tag as a conceptual placeholder
        var tags = [{ tagName: "div", cssClass: undefined }];
        var output = [[]];
        var text = "";
        for (var i = 0, length_1 = html.length; i < length_1; i++) {
            var char = html.charAt(i);
            if (char === "<") {
                if (text !== "") {
                    output[output.length - 1].push(text);
                    text = "";
                }
                var closing = html.charAt(i + 1) === "/";
                if (closing)
                    i++;
                var positionOfClosingAngleBracket = -1;
                if (i < length_1 - 1) {
                    positionOfClosingAngleBracket = html.indexOf(">", i + 1);
                }
                if (positionOfClosingAngleBracket < 0) {
                    text = text + char;
                    // special case: sometimes people want just a < in an answer text
                    // such as for an age range of "<25"
                    // so I have changed this to NOT throw an error - instead, we will just show the unmatched bracket in the HTML text
                    // and hopefully, if they did want an html tag, they will see the unmatched bracket and fix it
                    // throw new Error('For the text "' + html + '", no closing angle bracket was found after position: ' + i);
                }
                else {
                    var tagName = html.substring(i + 1, positionOfClosingAngleBracket);
                    i = positionOfClosingAngleBracket;
                    var cssClass = void 0;
                    var parts = tagName.split(".");
                    if (parts.length > 1) {
                        tagName = parts[0];
                        cssClass = parts[1];
                    }
                    else {
                        cssClass = undefined;
                    }
                    if (/[^A-Za-z0-9]/.test(tagName)) {
                        throw new Error("Tag is not alphanumeric: " + tagName);
                    }
                    if (cssClass && !allowedCSSClasses[cssClass]) {
                        throw new Error("CSS class is not allowed: " + cssClass);
                    }
                    if (closing) {
                        var startTag = tags.pop();
                        if (startTag.tagName !== tagName) {
                            throw new Error("Closing tag does not match opening tag for: " + tagName);
                        }
                        cssClass = startTag.cssClass;
                    }
                    if (!specifiedHTMLTags[tagName]) {
                        throw new Error("Tag is not allowed: " + tagName);
                    }
                    if (specifiedHTMLTags[tagName] === 2) {
                        // self-closing tag like BR
                        output.push([]);
                        closing = true;
                    }
                    if (closing) {
                        var newTag = void 0;
                        if (cssClass) {
                            newTag = m(tagName, { "class": cssClass }, output.pop());
                        }
                        else {
                            newTag = m(tagName, output.pop());
                        }
                        output[output.length - 1].push(newTag);
                    }
                    else {
                        tags.push({ tagName: tagName, cssClass: cssClass });
                        output.push([]);
                    }
                }
            }
            else {
                text = text + char;
            }
        }
        if (text)
            output[output.length - 1].push(text);
        if (tags.length !== 1 || output.length !== 1) {
            throw new Error("Unmatched start tag: " + tags.pop());
        }
        // Don't return the fake div tag, just the contents
        return output.pop();
    }
    exports.generateSpecificTypeOfSanitizedHTMLForMithril = generateSpecificTypeOfSanitizedHTMLForMithril;
    function removeHTMLTags(text) {
        var cleanedText = "";
        var inTag = false;
        for (var i = 0; i < text.length; i++) {
            if (text[i] === "<") {
                inTag = true;
            }
            else if (text[i] === ">") {
                inTag = false;
            }
            else {
                if (!inTag) {
                    cleanedText += text[i];
                }
            }
        }
        return cleanedText;
    }
    exports.removeHTMLTags = removeHTMLTags;
});

define('js/surveyBuilderMithril',["require", "exports", "mithril", "./pointrel20150417/generateRandomUuid", "./sanitizeHTML"], function (require, exports, m, generateRandomUuid, sanitizeHTML) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    "use strict";
    var writeInTag = "WriteInEntry_";
    // TODO: Fix overly long lines and remove next line disabling check
    /* tslint:disable:max-line-length */
    var idsMade = {};
    var idCount = 0;
    var currentLanguage = "";
    exports.defaultFormTexts = {
        startText: 'Please help by taking a short survey. The data you enter will be sent to the server only at the end when you press the "submit survey" button.',
        sliderValuePrompt: "Type a new value",
        sliderDoesNotApply: "Does not apply",
        selectNoChoiceName: "-- select --",
        booleanYesNoNames: "yes/no",
        maxNumAnswersPrompt: "(Please choose up to # answers.)",
        endText: "Thank you for taking the survey.",
        thankYouPopupText: "Your contribution has been added to the story collection. Thank you.",
        chooseQuestionText: "Please choose a question to which you would like to respond.",
        enterStoryText: "Please enter your response in the box below.",
        nameStoryText: "Please give your story a name.",
        aboutYouText: "About you",
        errorMessage_noElicitationQuestionChosen: "Please select the question to which story # is a response.",
        errorMessage_noStoryText: "Please enter some text for story #.",
        errorMessage_noStoryName: "Please give story # a name.",
        deleteStoryButtonText: "Delete this story",
        deleteStoryDialogPrompt: "Are you sure you want to delete this story?",
        submitSurveyButtonText: "Submit Survey",
        couldNotSaveSurveyText: "The server could not save your survey. Please try again.",
        sendingSurveyResultsText: "Now sending survey result to server. Please wait . . .",
        resubmitSurveyButtonText: "Resubmit Survey",
        surveyStoredText: "Your survey has been accepted and stored.",
        surveyResultPaneHeader: "Here are the stories you contributed. You can copy this text and paste it somewhere else to keep your own copy of what you said.",
        tellAnotherStoryText: "Would you like to tell another story?",
        tellAnotherStoryButtonText: "Yes, I'd like to tell another story",
    };
    function translate(storyForm, language, text) {
        if (!language)
            return text;
        if (!storyForm.translationDictionary)
            return text;
        if (!storyForm.translationDictionary[text])
            return text;
        if (!storyForm.translationDictionary[text][language])
            return text;
        return storyForm.translationDictionary[text][language];
    }
    function getIdForText(text) {
        if (!idsMade["$" + text]) {
            idsMade["$" + text] = idCount++;
        }
        return "panelField_" + idsMade["$" + text];
    }
    function loadCSS(document, cssText) {
        var styleElement = document.createElement("style");
        styleElement.type = "text/css";
        document.getElementsByTagName("head")[0].appendChild(styleElement);
        if (styleElement.styleSheet) {
            styleElement.styleSheet.cssText = cssText;
        }
        else {
            styleElement.innerHTML = cssText;
        }
    }
    exports.loadCSS = loadCSS;
    function stringUpTo(aString, upToWhat) {
        if (upToWhat !== "") {
            return aString.split(upToWhat)[0];
        }
        else {
            return aString;
        }
    }
    function stringBeyond(aString, beyondWhat) {
        if (beyondWhat !== "") {
            return aString.split(beyondWhat).pop();
        }
        else {
            return aString;
        }
    }
    function stringBetween(wholeString, startString, endString) {
        if (wholeString.indexOf(startString) < 0 || wholeString.indexOf(endString) < 0)
            return "";
        return stringUpTo(stringBeyond(wholeString.trim(), startString), endString);
    }
    function mithrilForVideoInfo(videoInfoString) {
        if (!videoInfoString)
            return m("div");
        if (videoInfoString.indexOf("iframe") >= 0) {
            var width = stringBetween(videoInfoString, 'width="', '"');
            var height = stringBetween(videoInfoString, 'height="', '"');
            var source = stringBetween(videoInfoString, 'src="', '"');
            var title = stringBetween(videoInfoString, 'title="', '"');
            var allow = stringBetween(videoInfoString, 'allow="', '"');
            return m("iframe", {
                src: source,
                width: width || 560,
                title: title || "Introductory video",
                height: height || 315,
                class: "narrafirma-survey-introductory-video-streaming",
                allow: allow,
            });
        }
        else {
            return m("video", {
                src: videoInfoString,
                type: "video/mp4",
                controls: "controls",
                class: "narrafirma-survey-introductory-video-mp4"
            });
        }
    }
    // Redrawing
    var globalRedrawCallback;
    function setGlobalRedrawFunction(callback) {
        globalRedrawCallback = callback;
    }
    exports.setGlobalRedrawFunction = setGlobalRedrawFunction;
    function globalRedraw(source) {
        if (source === void 0) { source = undefined; }
        globalRedrawCallback(source);
    }
    function addAllowedHTMLToPrompt(text) {
        var result;
        try {
            result = sanitizeHTML.generateSanitizedHTMLForMithril(text);
            return result;
        }
        catch (error) {
            alert(error);
            return text;
        }
    }
    // Builder is used by main application, and is passed in for compatibility
    function displayQuestion(builder, model, fieldSpecification, storyForm) {
        function buildQuestionLabel(fieldSpecification, storyForm) {
            var displayPrompt = tr(fieldSpecification.displayPrompt);
            if (fieldSpecification.displayType === "checkboxes" && fieldSpecification.displayConfiguration) {
                if (storyForm.maxNumAnswersPrompt) {
                    displayPrompt += " " + tr(storyForm.maxNumAnswersPrompt).replace("#", fieldSpecification.displayConfiguration);
                }
                else {
                    displayPrompt += " " + tr(exports.defaultFormTexts.maxNumAnswersPrompt).replace("#", fieldSpecification.displayConfiguration);
                }
            }
            return [
                // TODO: Generalize this css class name
                m("span", { "class": "narrafirma-survey-prompt" }, addAllowedHTMLToPrompt(displayPrompt)),
                m("br")
            ];
        }
        var fieldID = fieldSpecification.id;
        if (model) {
            fieldID = (model.storyID || model.participantID) + "__" + fieldID;
        }
        var questionLabel = buildQuestionLabel(fieldSpecification, storyForm);
        var parts = [];
        var value = null;
        if (model)
            value = model[fieldSpecification.id];
        if (value === undefined)
            value = "";
        function tr(text) {
            return translate(storyForm, currentLanguage, text);
        }
        function standardChangeMethod(event, value) {
            if (event)
                value = event.target.value;
            model[fieldSpecification.id] = value;
            // TODO: redraw on value change seems not needed in this survey case, since values do not affect anything about rest of application?
            // redraw();
            // Except for one case. Could there be more?
            if (fieldSpecification.id === "storyName")
                globalRedraw();
            // yes, there is one more case - the slider needs to interact with the "Does not apply" checkbox
            if (fieldSpecification.displayType === "slider")
                globalRedraw();
        }
        var standardValueOptions = {
            value: value,
            id: getIdForText(fieldID),
            onchange: standardChangeMethod
        };
        //////////////////////////////////////////////////////////////// text, textarea ////////////////////////////////////////////////////////////////
        function displayTextOrTextAreaQuestion(type) {
            questionLabel[0].attrs["for"] = getIdForText(fieldID);
            questionLabel[0].tag = "label";
            if (type === "input") {
                var lengthAsNumber = Number(fieldSpecification.displayConfiguration);
                if (!isNaN(lengthAsNumber)) {
                    if (window.innerWidth < 500) {
                        lengthAsNumber = Math.min(98, lengthAsNumber * 4);
                    }
                    else if (window.innerWidth < 700) {
                        lengthAsNumber = Math.min(98, lengthAsNumber * 3);
                    }
                    else if (window.innerWidth < 900) {
                        lengthAsNumber = Math.min(98, lengthAsNumber * 2);
                    }
                    var valueOptionsWithWidth = {
                        value: value,
                        style: "width: " + lengthAsNumber + "%",
                        id: getIdForText(fieldID),
                        onchange: standardChangeMethod,
                    };
                    return [m(type, valueOptionsWithWidth), m("br")];
                }
                else {
                    return [m(type, standardValueOptions), m("br")];
                }
            }
            else {
                return [m(type, standardValueOptions), m("br")];
            }
        }
        //////////////////////////////////////////////////////////////// one checkbox ////////////////////////////////////////////////////////////////
        function displayCheckBoxQuestion() {
            questionLabel[0].attrs["for"] = getIdForText(fieldID);
            questionLabel[0].tag = "label";
            return [
                m("input[type=checkbox]", {
                    id: getIdForText(fieldID),
                    checked: value,
                    onchange: function (event) { standardChangeMethod(null, event.target.checked); }
                }),
                m("label", { "for": getIdForText(fieldID) }, tr(fieldSpecification.displayConfiguration || "")),
                m("br")
            ];
        }
        //////////////////////////////////////////////////////////////// set of checkboxes ////////////////////////////////////////////////////////////////
        function displayCheckboxesQuestion() {
            function disableUncheckedBoxesIfReachedMaxNumAnswers(checkBoxIDs) {
                var numOptionsChecked = 0;
                checkBoxIDs.map(function (anOptionID, index) {
                    if (document.querySelector('#' + anOptionID + ':checked'))
                        numOptionsChecked++;
                });
                var maxAsNumber = Number(fieldSpecification.displayConfiguration);
                if (isNaN(maxAsNumber))
                    maxAsNumber = null;
                var disableUncheckedBoxes = (maxAsNumber && numOptionsChecked >= maxAsNumber);
                checkBoxIDs.map(function (anOptionID, index) {
                    var element = document.querySelector('#' + anOptionID);
                    if (element && !element.checked) {
                        element.disabled = disableUncheckedBoxes;
                        var label = document.querySelector('label[for="' + anOptionID + '"]');
                        if (label)
                            label.setAttribute("style", "opacity: " + (disableUncheckedBoxes ? "0.5" : "1.0"));
                    }
                });
            }
            delete questionLabel[0].attrs["for"];
            if (!value) {
                value = {};
                model[fieldSpecification.id] = value;
            }
            if (!fieldSpecification.valueOptions || fieldSpecification.valueOptions.length < 1) {
                return [m("p", "Survey error: No options were created for this question.")];
            }
            var checkBoxIDsForThisQuestion = [];
            if (fieldSpecification.displayConfiguration) {
                fieldSpecification.valueOptions.map(function (option, index) {
                    var optionID = getIdForText(fieldID + "_" + option);
                    checkBoxIDsForThisQuestion.push(optionID);
                });
            }
            var questionParts = [
                fieldSpecification.valueOptions.map(function (option, index) {
                    var optionName = (typeof option === "string") ? option : option.name;
                    var optionValue = (typeof option === "string") ? option : option.value;
                    var optionID = getIdForText(fieldID + "_" + option);
                    var checkboxPart = m("input[type=checkbox]", {
                        id: optionID,
                        checked: !!value[optionValue],
                        onchange: function (event) {
                            value[optionValue] = event.target.checked;
                            standardChangeMethod(null, value);
                            if (fieldSpecification.displayConfiguration) {
                                disableUncheckedBoxesIfReachedMaxNumAnswers(checkBoxIDsForThisQuestion);
                            }
                        }
                    });
                    var optionParts = [];
                    if (fieldSpecification.optionImageLinks && index < fieldSpecification.optionImageLinks.length) {
                        var imageHTML = "";
                        imageHTML = "img[src='" + fieldSpecification.optionImageLinks[index] + "'][class='narrafirma-survey-answer-image']";
                        if (fieldSpecification.optionImagesWidth)
                            imageHTML += '[style="width: ' + fieldSpecification.optionImagesWidth + 'px"]';
                        optionParts = [m("td.narrafirma-survey-answer-images", [
                                checkboxPart,
                                m("label", { "for": optionID }, sanitizeHTML.generateSmallerSetOfSanitizedHTMLForMithril(tr(optionName)), m("br"), m(imageHTML), m("br"))
                            ])
                        ];
                    }
                    else {
                        optionParts = [
                            checkboxPart,
                            m("label", { "for": optionID }, sanitizeHTML.generateSmallerSetOfSanitizedHTMLForMithril(tr(optionName))), m("br")
                        ];
                    }
                    return optionParts;
                })
            ];
            if (fieldSpecification.optionImageLinks) {
                questionParts = [m("table.narrafirma-survey-answer-images", m("tr.narrafirma-survey-answer-images", questionParts))];
            }
            questionParts.unshift(m("legend", questionLabel[0]));
            questionLabel = [];
            return questionParts;
        }
        //////////////////////////////////////////////////////////////// radio buttons ////////////////////////////////////////////////////////////////
        function displayRadioButtonsQuestion() {
            delete questionLabel[0].attrs["for"];
            var questionParts = [];
            questionParts = [
                fieldSpecification.valueOptions.map(function (option, index) {
                    var optionName = (typeof option === "string") ? option : option.name;
                    var optionValue = (typeof option === "string") ? option : option.value;
                    var optionID = getIdForText(fieldID + "_" + optionValue);
                    var optionParts = [];
                    if (fieldSpecification.optionImageLinks && index < fieldSpecification.optionImageLinks.length) {
                        var imageHTML = "";
                        imageHTML = "img[src='" + fieldSpecification.optionImageLinks[index] + "'][class='narrafirma-survey-answer-image']";
                        if (fieldSpecification.optionImagesWidth)
                            imageHTML += '[style="width: ' + fieldSpecification.optionImagesWidth + 'px"]';
                        optionParts = [m("td.narrafirma-survey-answer-images", [
                                m("input[type=radio]", {
                                    id: optionID,
                                    key: optionID,
                                    value: optionValue,
                                    name: fieldID,
                                    checked: value === optionValue,
                                    onchange: function (event) { standardChangeMethod(null, optionValue); }
                                }),
                                m("label", { "for": optionID }, sanitizeHTML.generateSmallerSetOfSanitizedHTMLForMithril(tr(optionName)), m("br"), m(imageHTML), m("br"))
                            ])
                        ];
                    }
                    else {
                        optionParts = [
                            m("input[type=radio]", {
                                id: optionID,
                                key: optionID,
                                value: optionValue,
                                name: fieldID,
                                checked: value === optionValue,
                                onchange: function (event) { standardChangeMethod(null, optionValue); }
                            }),
                            m("label", { "for": optionID }, sanitizeHTML.generateSmallerSetOfSanitizedHTMLForMithril(tr(optionName))), m("br")
                        ];
                    }
                    return optionParts;
                })
            ];
            if (fieldSpecification.optionImageLinks) {
                questionParts = [m("table.narrafirma-survey-answer-images", m("tr.narrafirma-survey-answer-images", questionParts))];
            }
            questionParts.unshift(m("legend", questionLabel[0]));
            questionLabel = [];
            return questionParts;
        }
        //////////////////////////////////////////////////////////////// boolean ////////////////////////////////////////////////////////////////
        function displayBooleanQuestion() {
            delete questionLabel[0].attrs["for"];
            var yesName = "yes";
            var noName = "no";
            var yesNoParts = tr(storyForm.booleanYesNoNames || exports.defaultFormTexts.booleanYesNoNames).split("/");
            if (yesNoParts.length > 0)
                yesName = yesNoParts[0];
            if (yesNoParts.length > 1)
                noName = yesNoParts[1];
            var questionParts = [
                m("input[type=radio]", {
                    id: getIdForText(fieldID + "_yes"),
                    value: true,
                    name: fieldID,
                    checked: value === true,
                    onchange: standardChangeMethod.bind(null, null, true)
                }),
                m("label", { "for": getIdForText(fieldID + "_yes") }, yesName),
                m("br"),
                m("input[type=radio]", {
                    id: getIdForText(fieldID + "_no"),
                    value: false,
                    name: fieldID,
                    checked: value === false,
                    onchange: standardChangeMethod.bind(null, null, false)
                }),
                m("label", { "for": getIdForText(fieldID + "_no") }, noName),
                m("br")
            ];
            questionParts.unshift(m("legend", questionLabel[0]));
            questionLabel = [];
            return questionParts;
        }
        //////////////////////////////////////////////////////////////// select ////////////////////////////////////////////////////////////////
        function displaySelectQuestion() {
            questionLabel[0].attrs["for"] = getIdForText(fieldID);
            questionLabel[0].tag = "label";
            var selectOptions = [];
            var defaultOptions = { name: '', value: '', selected: undefined };
            if (!value)
                defaultOptions.selected = 'selected';
            if (!fieldSpecification.displayConfiguration) {
                selectOptions.push(m("option", defaultOptions, tr(storyForm.selectNoChoiceName || exports.defaultFormTexts.selectNoChoiceName)));
            }
            selectOptions = selectOptions.concat(fieldSpecification.valueOptions.map(function (option, index) {
                var optionName = (typeof option === "string") ? option : option.name;
                var optionValue = (typeof option === "string") ? option : option.value;
                var optionOptions = { value: optionValue, selected: undefined };
                if (optionValue === value)
                    optionOptions.selected = 'selected';
                return m("option", optionOptions, tr(optionName));
            }));
            var sizeAsNumber = Number(fieldSpecification.displayConfiguration);
            if (!isNaN(sizeAsNumber))
                standardValueOptions["size"] = sizeAsNumber;
            var questionParts = [
                m("select", standardValueOptions, selectOptions),
                m("br")
            ];
            return questionParts;
        }
        //////////////////////////////////////////////////////////////// slider ////////////////////////////////////////////////////////////////
        function displaySliderQuestion() {
            function setSliderValueWithPopup(event, valuePrompt, value, sliderValueOptions, fieldSpecification, model) {
                var newValueText = prompt(valuePrompt, value);
                var newValue = parseInt(newValueText);
                if (newValue && newValue >= 0 && newValue <= 100) {
                    sliderValueOptions.value = newValue;
                    model[fieldSpecification.id] = "" + newValue;
                    globalRedraw();
                }
            }
            function isEmpty(value) {
                return value === undefined || value === null || value === "";
            }
            questionLabel[0].attrs["for"] = getIdForText(fieldID);
            questionLabel[0].tag = "label";
            var checkboxID = getIdForText(fieldID) + "_doesNotApply";
            var popupPrompt = tr(storyForm.sliderValuePrompt || exports.defaultFormTexts.sliderValuePrompt);
            var doesNotApplyTranslatedText = tr(storyForm.sliderDoesNotApply || exports.defaultFormTexts.sliderDoesNotApply);
            var leftSideText = "";
            var rightSideText = "";
            if (fieldSpecification.displayConfiguration) {
                if (fieldSpecification.displayConfiguration.length > 1) {
                    leftSideText = fieldSpecification.displayConfiguration[0];
                    rightSideText = fieldSpecification.displayConfiguration[1];
                }
                // fieldSpecification.displayConfiguration[2] can exist but be undefined
                if (fieldSpecification.displayConfiguration.length > 2 && fieldSpecification.displayConfiguration[2]) {
                    doesNotApplyTranslatedText = tr(fieldSpecification.displayConfiguration[2]);
                }
            }
            // Could suggest 0-100 to support <IE10 that don't have range input -- or could do polyfill
            // if (fieldSpecification.displayPrompt) questionLabel[0].children = fieldSpecification.displayPrompt + " (0-100)";
            var sliderValueOptions = { value: value, id: getIdForText(fieldID), onchange: standardChangeMethod, min: 0, max: 100, step: 1 };
            var questionParts = [
                m("span", { "class": "narrafirma-survey-low-arrow" }, "◀ "),
                m("span", { "class": "narrafirma-survey-low" }, tr(leftSideText)),
                m('span', { "class": "narrafirma-survey-slider" }, m('input[type="range"]', sliderValueOptions)),
                m('span', { "class": "narrafirma-survey-high" }, tr(rightSideText)),
                m('span', { "class": "narrafirma-survey-high-arrow" }, " ▶"),
                m("span", { "class": "narrafirma-survey-value", "tabindex": "0",
                    onclick: function (event) { setSliderValueWithPopup(event, popupPrompt, value, sliderValueOptions, fieldSpecification, model); },
                    onkeypress: function (event) { if (event.keyCode == 13)
                        setSliderValueWithPopup(event, popupPrompt, value, sliderValueOptions, fieldSpecification, model); }
                }, value),
                m("br"),
                m('input[type="checkbox"]', {
                    "class": "narrafirma-survey-does-not-apply",
                    id: checkboxID,
                    checked: isEmpty(sliderValueOptions.value),
                    onclick: function (event) {
                        var isChecked = event.target.checked;
                        if (isChecked) {
                            model[fieldSpecification.id] = "";
                            globalRedraw();
                        }
                        else {
                            model[fieldSpecification.id] = "50";
                            globalRedraw();
                        }
                    }
                }),
                m("label", { "for": checkboxID }, doesNotApplyTranslatedText)
            ];
            return questionParts;
        }
        ///////////////////////////////////////////////////////////////////// write-in (extra) text box ///////////////////////////////////////////////////////////
        function displayWriteInQuestion() {
            if (!model.hasOwnProperty("writeInTexts"))
                model["writeInTexts"] = {};
            var label = tr(fieldSpecification.writeInTextBoxLabel);
            var mString = "input[type=text].narrafirma-survey-write-in-input";
            if (label.indexOf("**") == 0) {
                mString = "textarea.narrafirma-survey-write-in-textarea";
                label = label.replace("**", "");
            }
            var writeInDivParts = [
                m("span.narrafirma-survey-write-in-prompt"), addAllowedHTMLToPrompt(tr(label)),
                m(mString, {
                    id: getIdForText(fieldID + "_writeIn"),
                    value: model[writeInTag + fieldSpecification.id] || "",
                    onchange: function (event) {
                        if (event && event.target.value) {
                            model[writeInTag + fieldSpecification.id] = event.target.value;
                        }
                    }
                }),
                m("br")
            ];
            return m("div.narrafirma-survey-write-in-div", writeInDivParts);
        }
        ///////////////////////////////////////////////////////////////////// now call the methods ///////////////////////////////////////////////////////////////
        if (fieldSpecification.displayType === "label") {
            // Nothing to do
        }
        else if (fieldSpecification.displayType === "header") {
            // Nothing to do; bolding done using style
        }
        else if (fieldSpecification.displayType === "text") {
            parts = displayTextOrTextAreaQuestion("input");
        }
        else if (fieldSpecification.displayType === "textarea") {
            parts = displayTextOrTextAreaQuestion("textarea");
        }
        else if (fieldSpecification.displayType === "checkbox") {
            parts = displayCheckBoxQuestion();
        }
        else if (fieldSpecification.displayType === "checkboxes") {
            parts = [m("fieldset", displayCheckboxesQuestion())];
        }
        else if (fieldSpecification.displayType === "radiobuttons") {
            parts = [m("fieldset", displayRadioButtonsQuestion())];
        }
        else if (fieldSpecification.displayType === "boolean") {
            parts = [m("fieldset", displayBooleanQuestion())];
        }
        else if (fieldSpecification.displayType === "select") {
            parts = displaySelectQuestion();
        }
        else if (fieldSpecification.displayType === "slider") {
            parts = displaySliderQuestion();
        }
        else {
            parts = [
                m("span", { style: { "font-weight": "bold" } }, "UNFINISHED: " + fieldSpecification.displayType),
                m("br")
            ];
        }
        if (fieldSpecification.writeInTextBoxLabel) {
            parts.push(displayWriteInQuestion());
        }
        if (parts.length) {
            parts = m("div", { "class": "narrafirma-survey-question-internal" }, parts);
        }
        if (questionLabel) {
            parts = questionLabel.concat(parts);
        }
        var classString = "narrafirma-survey-question-external narrafirma-survey-question-type-" + fieldSpecification.displayType;
        if (fieldSpecification.displayClass) {
            classString += " " + fieldSpecification.displayClass;
        }
        return m("div", { key: fieldID, "class": classString }, parts);
    }
    function buildSurveyForm(surveyDiv, storyForm, doneCallback, surveyOptions) {
        if (surveyOptions === void 0) { surveyOptions = {}; }
        function tr(text) {
            return translate(storyForm, currentLanguage, text);
        }
        // console.log("buildSurveyForm questions", storyForm);
        var startQuestions = [];
        if (surveyOptions.previewMode) {
            startQuestions.push({ id: "previewMode_header", displayName: "previewMode", displayClass: "narrafirma-preview", displayPrompt: "Previewing story form; results will not be saved.", displayType: "header", valueOptions: [] });
        }
        if (storyForm.title) {
            startQuestions.push({ id: "title_header", displayName: "title", displayPrompt: tr(storyForm.title), displayType: "header", valueOptions: [], displayClass: "narrafirma-survey-title" });
            if (!surveyOptions.ignoreTitleChange)
                document.title = sanitizeHTML.removeHTMLTags(tr(storyForm.title));
        }
        var startText = tr(storyForm.startText || exports.defaultFormTexts.startText);
        startQuestions.push({ id: "startText_label", displayName: "startText", displayPrompt: startText, displayType: "label", valueOptions: [], displayClass: "narrafirma-survey-start-text" });
        var endText = tr(storyForm.endText || exports.defaultFormTexts.endText);
        var endQuestions = [];
        endQuestions.push({ id: "endText_label", displayName: "endText", displayPrompt: endText, displayType: "label", valueOptions: [], displayClass: "narrafirma-survey-end-text" });
        // TODO: What about idea of having IDs that go with eliciting questions so store reference to ID not text prompt?
        var elicitingQuestionOptions = [];
        for (var elicitingQuestionIndex in storyForm.elicitingQuestions) {
            var elicitingQuestionSpecification = storyForm.elicitingQuestions[elicitingQuestionIndex];
            var value = elicitingQuestionSpecification.id || elicitingQuestionSpecification.text;
            var option = { name: tr(elicitingQuestionSpecification.text), value: value };
            elicitingQuestionOptions.push(option);
        }
        // TODO: What if these IDs for storyText and storyName are not unique?
        var initialStoryQuestions = [];
        var singlePrompt = null;
        if (elicitingQuestionOptions.length !== 1) {
            var chooseQuestionText = tr(storyForm.chooseQuestionText || exports.defaultFormTexts.chooseQuestionText);
            initialStoryQuestions.push({ id: "elicitingQuestion", displayName: "elicitingQuestion", displayPrompt: chooseQuestionText, displayType: "radiobuttons", valueOptions: elicitingQuestionOptions, displayClass: "narrafirma-eliciting-questions" });
            var enterStoryText = tr(storyForm.enterStoryText || exports.defaultFormTexts.enterStoryText);
            initialStoryQuestions.push({ id: "storyText", displayName: "storyText", displayPrompt: enterStoryText, displayType: "textarea", valueOptions: [], displayClass: "narrafirma-story-text" });
        }
        else {
            singlePrompt = elicitingQuestionOptions[0];
            initialStoryQuestions.push({ id: "storyText", displayName: "storyText", displayPrompt: tr(singlePrompt.name), displayType: "textarea", valueOptions: [], displayClass: "narrafirma-story-text" });
        }
        var nameStoryText = tr(storyForm.nameStoryText || exports.defaultFormTexts.nameStoryText);
        initialStoryQuestions.push({ id: "storyName", displayName: "storyName", displayPrompt: nameStoryText, displayType: "text", valueOptions: [], displayConfiguration: "40", displayClass: "narrafirma-story-name" });
        var allStoryQuestions = initialStoryQuestions.concat(storyForm.storyQuestions);
        var aboutYouText = tr(storyForm.aboutYouText || exports.defaultFormTexts.aboutYouText);
        var participantQuestions = [];
        if (storyForm.participantQuestions.length > 0) {
            participantQuestions = [{ id: "participantHeader", displayName: "participantHeader", displayPrompt: aboutYouText, displayType: "header", valueOptions: [], displayClass: "narrafirma-participant-header" }];
            participantQuestions = participantQuestions.concat(storyForm.participantQuestions);
        }
        var timestampStart = new Date();
        var surveyResult = {
            __type: "org.workingwithstories.storyFormResponse",
            // TODO: Think about whether to include entire storyForm or something else perhaps
            questionnaire: storyForm,
            responseID: generateRandomUuid("storyFormResponse"),
            stories: [],
            language: currentLanguage,
            participantData: null,
            timestampStart: "" + timestampStart.toISOString()
        };
        var participantID = generateRandomUuid("Participant");
        var participantDataModel = {
            __type: "org.workingwithstories.ParticipantData",
            participantID: participantID
        };
        surveyResult.participantData = participantDataModel;
        // m.render(surveyDiv, m("div", ["Hello survey ============== b", "More!!"]));
        var stories = surveyResult.stories;
        function addStory() {
            var storyQuestionsModel = {
                __type: "org.workingwithstories.Story",
                storyID: generateRandomUuid("Story"),
                participantID: participantID,
                elicitingQuestion: undefined
            };
            if (singlePrompt)
                storyQuestionsModel.elicitingQuestion = singlePrompt.value;
            stories.push(storyQuestionsModel);
        }
        addStory();
        function makeLabelForStory(story, index) {
            var storyLabel = story.storyName;
            if (storyLabel)
                storyLabel = storyLabel.trim();
            if (!storyLabel) {
                storyLabel = 'Untitled story #' + (index + 1);
            }
            else {
                storyLabel = '"' + storyLabel + '"';
            }
            return storyLabel;
        }
        // submitted can be one of: "never", "pending", "failed", "success"
        var submitted = "never";
        function submitSurvey(surveyResult, wizardPane, doneCallback) {
            console.log("submitting survey...");
            var timestampEnd = new Date();
            surveyResult.timestampEnd = timestampEnd.toISOString();
            surveyResult.timeDuration_ms = timestampEnd.getTime() - timestampStart.getTime();
            console.log("survey answers", surveyResult);
            doneCallback("submitted", surveyResult, wizardPane);
        }
        function validateStoryQuestionsModel(storyQuestionsModel, index) {
            var elicitingQuestion = storyQuestionsModel.elicitingQuestion;
            var storyName = storyQuestionsModel.storyName;
            var storyText = storyQuestionsModel.storyText;
            if (!elicitingQuestion) {
                var prompt_1 = tr(storyForm.errorMessage_noElicitationQuestionChosen || exports.defaultFormTexts.errorMessage_noElicitationQuestionChosen);
                prompt_1 = prompt_1.replace("#", index + 1);
                alert(prompt_1);
                return false;
            }
            if (!storyText) {
                var prompt_2 = tr(storyForm.errorMessage_noStoryText || exports.defaultFormTexts.errorMessage_noStoryText);
                prompt_2 = prompt_2.replace("#", index + 1);
                alert(prompt_2);
                return false;
            }
            if (!storyName) {
                var prompt_3 = tr(storyForm.errorMessage_noStoryName || exports.defaultFormTexts.errorMessage_noStoryName);
                prompt_3 = prompt_3.replace("#", index + 1);
                alert(prompt_3);
                return false;
            }
            return true;
        }
        function displayStoryQuestions(story, index) {
            var storylabel = makeLabelForStory(story, index);
            var storyQuestionsPart = allStoryQuestions.map(function (question, index) {
                return displayQuestion(null, story, question, storyForm);
            });
            var deleteStoryButtonText = tr(storyForm.deleteStoryButtonText || exports.defaultFormTexts.deleteStoryButtonText);
            var deleteStoryPrompt = tr(storyForm.deleteStoryDialogPrompt || exports.defaultFormTexts.deleteStoryDialogPrompt);
            var result = [
                m("button", {
                    "class": "narrafirma-survey-delete-story-button",
                    onclick: function () {
                        if (!confirm(deleteStoryPrompt + " (" + storylabel + ")"))
                            return;
                        stories.splice(index, 1);
                        redraw();
                    }
                }, deleteStoryButtonText),
                m("hr"),
                storyQuestionsPart
            ];
            // invert even and odd to match up with numbers starting at 1, not zero
            var evenOrOdd = (index % 2 === 1) ? "narrafirma-survey-story-even" : "narrafirma-survey-story-odd";
            // A locally unique key needs to be defined so Mithril can track deletions and inserts without rebuilding DOM nodes
            return m("div", { key: story.storyID, id: story.storyID, "class": "narrafirma-survey-story " + evenOrOdd }, result);
        }
        function validate() {
            // TODO: Improve validation
            if (!stories.length) {
                alert("Please add at least one story before proceeding."); // this is never used?
                return false;
            }
            for (var i = 0; i < stories.length; i++) {
                if (!validateStoryQuestionsModel(stories[i], i))
                    return false;
            }
            return true;
        }
        function calculateDerivedFields() {
            stories.forEach(function (story) {
                story.numStoriesTold = "" + stories.length;
            });
        }
        function submitButtonPressed() {
            if (!validate())
                return;
            calculateDerivedFields();
            console.log("Submit survey validated");
            // TODO: Fix no-longer-correct name from Dojo version
            var wizardPane = {
                forward: function () {
                    console.log("survey sending success" + (surveyOptions.previewMode ? " (preview)" : ""));
                    submitted = "success";
                    var thankYouPopupText = tr(storyForm.thankYouPopupText || exports.defaultFormTexts.thankYouPopupText);
                    alert(thankYouPopupText);
                    redraw("network");
                },
                failed: function () {
                    console.log("survey sending failed");
                    submitted = "failed";
                    // TODO: Translate
                    alert("Problem saving survey result; check the console for details.\nPlease try to submit the survey result later.");
                    redraw("network");
                }
            };
            submitted = "pending";
            submitSurvey(surveyResult, wizardPane, doneCallback);
            redraw();
        }
        function submitButtonOrWaitOrFinal() {
            var submitSurveyButtonText = tr(storyForm.submitSurveyButtonText || exports.defaultFormTexts.submitSurveyButtonText);
            var couldNotSaveSurveyText = tr(storyForm.couldNotSaveSurveyText || exports.defaultFormTexts.couldNotSaveSurveyText);
            var sendingSurveyResultsText = tr(storyForm.sendingSurveyResultsText || exports.defaultFormTexts.sendingSurveyResultsText);
            if (submitted === "never") {
                return m("button", { "class": "narrafirma-survey-submit-survey-button", onclick: submitButtonPressed }, submitSurveyButtonText + (surveyOptions.previewMode ? " (preview)" : ""));
            }
            else if (submitted === "failed") {
                var resubmitSurveyButtonText = tr(storyForm.resubmitSurveyButtonText || exports.defaultFormTexts.resubmitSurveyButtonText);
                return m("div.narrafirma-could-not-save-survey", [
                    couldNotSaveSurveyText,
                    m("br"),
                    m("button", { "class": "narrafirma-survey-submit-survey-button", onclick: submitButtonPressed }, resubmitSurveyButtonText + (surveyOptions.previewMode ? " (preview)" : ""))
                ]);
            }
            else if (submitted === "pending") {
                return m("div.narrafirma-sending-survey", m("br"), [sendingSurveyResultsText]);
            }
            else {
                var surveyStoredText_1 = tr(storyForm.surveyStoredText || exports.defaultFormTexts.surveyStoredText);
                return endQuestions.map(function (question, index) {
                    return m("div", [
                        m("br"),
                        m("div.narrafirma-survey-accepted", [surveyStoredText_1,
                            m("br"),
                            displayQuestion(null, null, question, storyForm),
                            m("br")
                        ])
                    ]);
                });
            }
        }
        function questionNameForResultsPane(question) {
            var questionName = "";
            if (question.displayType !== "header" && question.displayType !== "label") {
                questionName = "* " + tr(question.displayPrompt);
            }
            if (question.displayType === "slider") {
                if (question.displayConfiguration) {
                    if (question.displayConfiguration.length > 1) {
                        questionName += " (0 = " + tr(question.displayConfiguration[0]) + "; 100 = " + tr(question.displayConfiguration[1]) + ")";
                    }
                }
                else if (question.valueOptions) {
                    if (question.valueOptions.length > 1) {
                        questionName += " (0 = " + tr(question.valueOptions[0]) + "; 100 = " + tr(question.valueOptions[1]) + ")";
                    }
                }
            }
            return questionName;
        }
        function surveyResultPane() {
            var parts = [];
            stories.forEach(function (story) {
                allStoryQuestions.forEach(function (question) {
                    var questionName = tr(questionNameForResultsPane(question));
                    if (questionName)
                        parts.push(questionName);
                    if (question.id in story) {
                        var response = story[question.id];
                        if (typeof response == "object") {
                            var answers = Object.keys(response);
                            for (var _i = 0, answers_1 = answers; _i < answers_1.length; _i++) {
                                var answer = answers_1[_i];
                                if (response[answer])
                                    parts.push(tr(answer));
                            }
                        }
                        else {
                            parts.push(response);
                        }
                    }
                    if (writeInTag + question.id in story) {
                        var writeinValue = story[writeInTag + question.id];
                        parts.push(writeinValue);
                    }
                });
                parts.push("");
            });
            participantQuestions.forEach(function (question) {
                var questionName = tr(questionNameForResultsPane(question));
                if (questionName)
                    parts.push(questionName);
                if (question.id in surveyResult.participantData) {
                    var response = surveyResult.participantData[question.id];
                    if (typeof response == "object") {
                        var answers = Object.keys(response);
                        for (var _i = 0, answers_2 = answers; _i < answers_2.length; _i++) {
                            var answer = answers_2[_i];
                            if (response[answer])
                                parts.push(tr(answer));
                        }
                    }
                    else {
                        parts.push(response);
                    }
                }
                if (writeInTag + question.id in surveyResult.participantData) {
                    var writeinValue = surveyResult.participantData[writeInTag + question.id];
                    parts.push(writeinValue);
                }
            });
            var surveyResultPaneHeader = tr(storyForm.surveyResultPaneHeader || exports.defaultFormTexts.surveyResultPaneHeader);
            return [m("div", { "class": "narrafirma-survey-result-summary-header" }, surveyResultPaneHeader),
                m("textarea", { "class": "narrafirma-survey-result-summary" }, parts.join("\n"))];
        }
        function tellAnotherStory() {
            addStory();
            redraw();
        }
        var tagsToMakeReadOnly = {
            "input": true,
            "select": true,
            "textarea": true,
            "button": true
        };
        // Make survey read-only after sent to server
        // Recursive function derived from: http://lhorie.github.io/mithril-blog/when-css-lets-you-down.html
        function makeReadOnly(root, parent) {
            if (!root) {
                return root;
            }
            if (root instanceof Array) {
                for (var i = 0; i < root.length; i++) {
                    makeReadOnly(root[i], parent);
                }
                return;
            }
            if (root.children) {
                makeReadOnly(root.children, root);
            }
            if (typeof root === "object" && root.tag in tagsToMakeReadOnly) {
                if (root.tag === "textarea" || (root.tag === "input" && !root.attrs.type)) {
                    // Ensure text fields still have copy available
                    root.attrs.readOnly = true;
                }
                else {
                    root.attrs.disabled = true;
                }
            }
            return root;
        }
        var view = function () {
            function anotherStoryButton(storyForm) {
                var tellAnotherStoryText = tr(storyForm.tellAnotherStoryText || exports.defaultFormTexts.tellAnotherStoryText);
                var tellAnotherStoryButtonText = tr(storyForm.tellAnotherStoryButtonText || exports.defaultFormTexts.tellAnotherStoryButtonText);
                return m("div", { "class": "narrafirma-survey-tell-another-story-button-panel" }, [
                    tellAnotherStoryText,
                    m("button", { "class": "narrafirma-survey-tell-another-story-button", onclick: tellAnotherStory }, tellAnotherStoryButtonText)
                ]);
            }
            function chooseLanguageHTML() {
                if (!storyForm.defaultLanguage)
                    return "";
                if (!storyForm.languageChoiceQuestion_text)
                    return "";
                if (!storyForm.languageChoiceQuestion_choices)
                    return "";
                var languageChoiceQuestionText = sanitizeHTML.removeHTMLTags(storyForm.languageChoiceQuestion_text);
                var languageNames = [];
                var nonDefaultLanguages = storyForm.languageChoiceQuestion_choices.split("\n").map(function (item) { return item.trim(); });
                languageNames = languageNames.concat([storyForm.defaultLanguage], nonDefaultLanguages);
                var selectOptions = languageNames.map(function (aLanguage) { return m("option", { value: aLanguage, selected: aLanguage === currentLanguage }, aLanguage); });
                var defaultOptions = { name: '', value: '', selected: undefined };
                if (!currentLanguage)
                    defaultOptions.selected = 'selected';
                selectOptions.push(m("option", defaultOptions, tr(storyForm.selectNoChoiceName || exports.defaultFormTexts.selectNoChoiceName)));
                var questionParts = [
                    m("div.narrafirma-language-choice-question-text", languageChoiceQuestionText),
                    m("select", {
                        value: currentLanguage,
                        id: "languageChoiceQuestion",
                        onchange: function (event) {
                            if (event.target.value !== currentLanguage) {
                                currentLanguage = event.target.value;
                                globalRedraw();
                            }
                        }
                    }, selectOptions),
                    m("br")
                ];
                return questionParts;
            }
            var imageHTML = storyForm.image ? "img[src='" + tr(storyForm.image) + "'][class='narrafirma-survey-image']" : "";
            var videoPart = mithrilForVideoInfo(tr(storyForm.video));
            var showSurveyResultPane = false;
            if (submitted === "success") {
                switch (storyForm.showSurveyResultPane) {
                    case "never":
                        showSurveyResultPane = false;
                        break;
                    case "only on survey":
                        showSurveyResultPane = !surveyOptions.dataEntry;
                        break;
                    case "only on data entry":
                        showSurveyResultPane = surveyOptions.dataEntry;
                        break;
                    case "always":
                        showSurveyResultPane = true;
                        break;
                }
            }
            var languageHTML = chooseLanguageHTML();
            var result = m("div", [
                languageHTML,
                m(imageHTML || ""),
                startQuestions.map(function (question, index) {
                    return displayQuestion(null, null, question, storyForm);
                }),
                videoPart,
                m("div.narrafirma-survey-text-after-introductory-video", storyForm.textAfterVideo || ""),
                m("div.narrafirma-survey-stories", stories.map(function (story, index) {
                    return m("div.narrafirma-survey-story-question-set", { key: index }, displayStoryQuestions(story, index));
                })),
                (!storyForm.maxNumStories || storyForm.maxNumStories === "no limit" || stories.length < storyForm.maxNumStories) ? anotherStoryButton(storyForm) : "",
                // A locally unique key needs to be defined so Mithril can track deletions and inserts without rebuilding DOM nodes
                m("div", { key: "participant", "class": "narrafirma-survey-participant" }, participantQuestions.map(function (question, index) {
                    return displayQuestion(null, surveyResult.participantData, question, storyForm);
                })),
                submitButtonOrWaitOrFinal(),
                showSurveyResultPane ? surveyResultPane() : ""
                /*
                m("hr"),
                m("button", {
                    onclick: function() {
                        redraw();
                        console.log("stories", stories);
                        console.log("participantData", surveyResult.participantData);
                    }
                }, "Redraw (for debugging)")
                */
            ]);
            if (submitted === "pending" || submitted === "success") {
                makeReadOnly(result, null);
            }
            return result;
        };
        function redraw(source) {
            if (source === void 0) { source = "gui"; }
            if (surveyDiv) {
                m.render(surveyDiv, view());
            }
            else {
                // When the survey form is used in a Dialog, the code will be calling redraw automatically as a mounted component,
                // so only need to call redraw for an asynchronous server response
                if (source === "network")
                    m.redraw();
            }
        }
        setGlobalRedrawFunction(redraw);
        redraw();
        // Return a function that could be called to produce a survey template, like for a dialog
        return view;
    }
    exports.buildSurveyForm = buildSurveyForm;
});

define('js/surveyStorage',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function makeSurveyResultMessage(pointrelClient, projectIdentifier, storyCollectionName, completedSurvey) {
        var surveyResultWrapper = {
            projectIdentifier: projectIdentifier,
            // TODO: Mismatch of stored string's intent and the field name
            storyCollectionIdentifier: storyCollectionName,
            surveyResult: completedSurvey
        };
        var message = pointrelClient.createChangeMessage("surveyResults", "surveyResult", surveyResultWrapper, null);
        return message;
    }
    exports.makeSurveyResultMessage = makeSurveyResultMessage;
    function storeSurveyResult(pointrelClient, projectIdentifier, storyCollectionName, completedSurvey, wizardPane) {
        var message = makeSurveyResultMessage(pointrelClient, projectIdentifier, storyCollectionName, completedSurvey);
        console.log("storeSurveyResult", message);
        var thankYouPopupText = "Your contribution has been added to the story collection. Thank you.";
        if (completedSurvey && completedSurvey.questionnaire && completedSurvey.questionnaire.thankYouPopupText) {
            thankYouPopupText = completedSurvey.questionnaire.thankYouPopupText;
        }
        pointrelClient.sendMessage(message, function (error, result) {
            if (error) {
                console.log("Problem saving survey result", error);
                if (wizardPane && wizardPane.failed) {
                    wizardPane.failed();
                }
                else {
                    // TODO: Translate
                    alert("Problem saving survey result; check the console for details.\nPlease try to submit the survey result later.");
                }
                return;
            }
            console.log("Survey result stored");
            if (wizardPane) {
                wizardPane.forward();
            }
            else {
                // TODO: Translate
                alert(thankYouPopupText);
            }
        });
    }
    exports.storeSurveyResult = storeSurveyResult;
});

define('js/survey-main-mithril',["require", "exports", "./pointrel20150417/PointrelClient", "./surveyBuilderMithril", "./surveyStorage"], function (require, exports, PointrelClient, surveyBuilder, surveyStorage) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    "use strict";
    /* global m */
    // http://localhost:8080/survey.html#project=test1&survey=one
    // TODO: Internationalize
    // TODO: Full survey
    // TODO: Cancel feedback
    // TODO: Closing page when not submitted
    // TODO: Progress when sending to server 
    // TODO: Should refactor code so this prefix is not also duplicated in application and buttonActions
    var narrafirmaProjectPrefix = "NarraFirmaProject-";
    var serverURL = "/api/pointrel20150417";
    var pointrelClient;
    var preview;
    var projectIdentifier;
    var storyCollectionIdentifier;
    function loadQuestionnaire(callback) {
        // Decided on how to load data: Either can get latest with one or more questionnaires, or can query all messages and filter. Went with get latest.
        pointrelClient.fetchLatestMessageForTopic("questionnaires", function (error, data) {
            if (error) {
                // handle an error condition
                console.log("error from request", error);
                // TODO: Translate
                // alert("Could not load survey");
                callback(error, null);
                return;
            }
            // do something with handled data
            console.log("request got data", data);
            if (data.success) {
                console.log("storyCollectionIdentifier", storyCollectionIdentifier, data.latestRecord.messageContents.change);
                var questionnaire = data.latestRecord.messageContents.change[storyCollectionIdentifier];
                if (questionnaire) {
                    callback(null, questionnaire);
                }
                else {
                    callback("Questionnaire not currently available", null);
                }
            }
            else {
                // TODO: Translate
                // alert("Problem loading questionnaire");
                callback("Problem loading questionnaire", null);
            }
        });
    }
    function finishedSurvey(status, completedSurvey, wizardPane) {
        console.log("finishedSurvey", status);
        if (status === "submitted") {
            storeQuestionnaireResult(completedSurvey, wizardPane);
        }
    }
    function storeQuestionnaireResult(completedSurvey, wizardPane) {
        surveyStorage.storeSurveyResult(pointrelClient, projectIdentifier, storyCollectionIdentifier, completedSurvey, wizardPane);
    }
    function createLayout() {
        loadQuestionnaire(function (error, questionnaire, envelope) {
            if (error) {
                console.log("Error loading questionnaire", error);
                // TODO: Translate
                hidePleaseWait();
                document.body.innerHTML += "Something went wrong loading the survey questionnaire from the server:<br>" + JSON.stringify(error);
                alert("Something went wrong loading the survey questionnaire from the server.");
                return;
            }
            console.log("got questionnaire from server", projectIdentifier, storyCollectionIdentifier, questionnaire);
            var surveyDiv = document.getElementById("surveyDiv");
            // m.render(surveyDiv, m("div", ["Hello survey ============== b"]));
            surveyBuilder.buildSurveyForm(surveyDiv, questionnaire, finishedSurvey);
            if (questionnaire && questionnaire.customCSS)
                surveyBuilder.loadCSS(document, questionnaire.customCSS);
            // turn off initial "please wait" display
            hidePleaseWait();
        });
    }
    function receivedMessage() {
        // Do nothing
        ;
    }
    function updateServerStatus(status, message) {
        // Do nothing
        ;
    }
    // getHashParameters derived from: http://stackoverflow.com/questions/4197591/parsing-url-hash-fragment-identifier-with-javascript
    function getHashParameters() {
        var hash = window.location.hash.substr(1);
        var result = {};
        var match;
        // Regex for replacing addition symbol with a space
        var plusMatcher = /\+/g;
        var parameterSplitter = /([^&;=]+)=?([^&;]*)/g;
        var decode = function (s) { return decodeURIComponent(s.replace(plusMatcher, " ")); };
        while (true) {
            match = parameterSplitter.exec(hash);
            if (!match)
                break;
            result[decode(match[1])] = decode(match[2]);
        }
        return result;
    }
    function hidePleaseWait() {
        // This uses a window.narraFirma_pleaseWaitTimeout global set in survey.html
        console.log("turned off please wait at", new Date(), "still waiting to display", !!window["narraFirma_pleaseWaitTimeout"]);
        if (window["narraFirma_pleaseWaitTimeout"]) {
            clearTimeout(window["narraFirma_pleaseWaitTimeout"]);
            window["narraFirma_pleaseWaitTimeout"] = null;
        }
        document.getElementById("pleaseWaitDiv").style.display = "none";
    }
    function finishedPreview(status, surveyResult, wizardPane) {
        console.log("surveyResult for preview", status, surveyResult);
        if (wizardPane)
            wizardPane.forward();
    }
    function initialize() {
        var configuration = getHashParameters();
        console.log("configuration", configuration);
        preview = configuration["preview"];
        if (preview) {
            console.log("Preview mode");
            var surveyDiv = document.getElementById("surveyDiv");
            // m.render(surveyDiv, m("div", ["Hello survey ============== b"]));
            // turn off initial "please wait" display
            hidePleaseWait();
            if (!window.opener || !window.opener["narraFirma_previewQuestionnaire"]) {
                alert("Problem with preview");
                return;
            }
            var questionnaire = window.opener["narraFirma_previewQuestionnaire"];
            if (questionnaire.customCSS)
                surveyBuilder.loadCSS(document, questionnaire.customCSS);
            surveyBuilder.buildSurveyForm(surveyDiv, questionnaire, finishedPreview, { previewMode: true });
            return;
        }
        projectIdentifier = configuration["project"];
        storyCollectionIdentifier = configuration["survey"];
        console.log("configuration: projectIdentifier", projectIdentifier, "storyCollectionIdentifier", storyCollectionIdentifier);
        if (!projectIdentifier || !storyCollectionIdentifier) {
            alert("The URL does not have all the information needed to select a survey");
            document.body.innerHTML += "The URL does not have all the information needed to select a survey. Please contact the project administrator.";
            hidePleaseWait();
            return;
        }
        projectIdentifier = narrafirmaProjectPrefix + projectIdentifier;
        // TODO: Should ping server to get current user identifier in case logged in
        // TODO: Should check with server if have read and write permissions for the specific topics
        var userIdentifier = "anonymous";
        pointrelClient = new PointrelClient(serverURL, projectIdentifier, userIdentifier, receivedMessage, updateServerStatus);
        createLayout();
    }
    initialize();
});

