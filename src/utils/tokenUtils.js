const crypto = require("crypto");

const base64UrlEncode = (str) => {
  return Buffer.from(str)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

const createSignature = (header, payload, secret) => {
  const data = `${header}.${payload}`
  return crypto
    .createHmac("sha256", secret)
    .update(data)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
}

const createToken = (payload) => {
  let header = JSON.stringify({ alg: "HS256", typ: "JWT" })
  let payloadStr = JSON.stringify(payload)
  let encodedHeader = base64UrlEncode(header)
  let encodedPayload = base64UrlEncode(payloadStr)
  var secret = "elearningSecret"
  let signature = createSignature(encodedHeader, encodedPayload, secret)
  return `${encodedHeader}.${encodedPayload}.${signature}`
}

const verifyToken = (token) => {
  var result = {token}
  var secret = "elearningSecret"
  const [header, payload, signature] = token.split('.')
  const expectedSignature = createSignature(header, payload, secret)
  if (signature !== expectedSignature) {
    result = {...result, token: ""}
    return result
  }
  
  const decodedPayload = JSON.parse(Buffer.from(payload, 'base64').toString("utf8"))
  var id = decodedPayload.id
  var username = decodedPayload.username
  var roleId = decodedPayload.roleId
  result = {id, username, roleId, token}
  if (decodedPayload.exp < Math.floor(Date.now() / 1000)) {
    let newPayload = { id, username, roleId, exp: Math.floor(Date.now() / 1000) + (15) }
    let newToken = createToken(newPayload)
    result = {id, username, roleId, token: newToken}
    return result
  }
  return result
}



module.exports = {
  base64UrlEncode,
  createSignature,
  createToken,
  verifyToken,
};