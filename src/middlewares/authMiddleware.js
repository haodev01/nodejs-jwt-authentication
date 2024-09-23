// Author: TrungQuanDev: https://youtube.com/@trungquandev

import { StatusCodes } from 'http-status-codes'
import { tokenHeader } from '~/config/corsOptions'
import { ACCESS_TOKEN_SECRET_SIGNATURE } from '~/controllers/userController'
import { JwtProvider } from '~/providers/JwtProvider'

const isAuthorized = async (req, res, next) => {
  let accessTokenFromCookie = ''
  if (tokenHeader) {
    accessTokenFromCookie = req.headers.authorization
    accessTokenFromCookie = accessTokenFromCookie.split(' ')[1]
  } else {
    accessTokenFromCookie = req.cookies.accessToken
  }
  console.log('accessTokenFromCookie', accessTokenFromCookie)
  if (!accessTokenFromCookie)
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: 'Unauthorized (Token not found)' })

  try {
    const acessTokenDecoded = await JwtProvider.verifyToken(
      accessTokenFromCookie,
      ACCESS_TOKEN_SECRET_SIGNATURE,
    )
    req.jwtDecoded = acessTokenDecoded
    return next()
  } catch (error) {
    //
    if (error.message?.includes('expired')) {
      return res.status(StatusCodes.GONE).json({ message: 'Token expired' })
    }
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: 'Unauthorized (Token not found)' })
  }
}

export const authMiddleware = {
  isAuthorized,
}
