import JWT from 'jsonwebtoken'

const generateToken = async (payload, secretSignature, expiresIn) => {
  try {
    // Do something
    return JWT.sign(payload, secretSignature, {
      expiresIn,
      algorithm: 'HS256',
    })
  } catch (error) {
    throw new Error(error)
  }
}

const verifyToken = async (token, secretSignature) => {
  try {
    // Do something
    return JWT.verify(token, secretSignature)
  } catch (error) {
    throw new Error(error)
  }
}

export const JwtProvider = {
  generateToken,
  verifyToken,
}
