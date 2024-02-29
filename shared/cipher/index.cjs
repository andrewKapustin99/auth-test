const ad = require('./build/Release/generateKeys');
const addonGetPublicKey = require('./build/Release/getPublickKey');
const addonGetSecretKeyAndCiphertext = require('./build/Release/decupsSC');
const adEncupsChacha = require('./build/Release/encupsChacha');
const decupsChacha = require('./build/Release/decupsChacha');

const result = ad.MyFunction();
let publicKey = result.publicKey;
let secretKey = result.secretKey;


// clietn_shared_secret
const result2 = addonGetPublicKey.GetPublicKey(publicKey);
let shared_secret = result2.shared_secret;
let ciphertext = result2.ciphertext;

const result3 = addonGetSecretKeyAndCiphertext.GetSecretKeyAndCiphertext(
  secretKey,
  ciphertext
);

let result4 = adEncupsChacha.DecryptMessage("Тест С", shared_secret);

const cipher = result4.cipher;
const block = result4.block;
const authTag = result4.authTag;

let result5 = decupsChacha.DecryptMessage(cipher, block, authTag, result3);
console.log("result5 ", result5);

// module.exports = { ad };
