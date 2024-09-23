// Author: TrungQuanDev: https://youtube.com/@trungquandev
import { StatusCodes } from 'http-status-codes'
import ms from 'ms'
import { tokenHeader } from '~/config/corsOptions'
import { JwtProvider } from '~/providers/JwtProvider'
/**
 * Mock nhanh thông tin user thay vì phải tạo Database rồi query.
 * Nếu muốn học kỹ và chuẩn chỉnh đầy đủ hơn thì xem Playlist này nhé:
 * https://www.youtube.com/playlist?list=PLP6tw4Zpj-RIMgUPYxhLBVCpaBs94D73V
 */
const MOCK_DATABASE = {
  USER: {
    ID: 'trungquandev-sample-id-12345678',
    EMAIL: 'trungquandev.official@gmail.com',
    PASSWORD: 'trungquandev@123',
  },
}

/**
 * 2 cái chữ ký bí mật quan trọng trong dự án. Dành cho JWT - Jsonwebtokens
 * Lưu ý phải lưu vào biến môi trường ENV trong thực tế cho bảo mật.
 * Ở đây mình làm Demo thôi nên mới đặt biến const và giá trị random ngẫu nhiên trong code nhé.
 * Xem thêm về biến môi trường: https://youtu.be/Vgr3MWb7aOw
 */
export const ACCESS_TOKEN_SECRET_SIGNATURE = 'KBgJwUETt4HeVD05WaXXI9V3JnwCVP'
export const REFRESH_TOKEN_SECRET_SIGNATURE = 'fcCjhnpeopVn2Hg1jG75MUi62051yL'

const login = async (req, res) => {
  try {
    if (
      req.body.email !== MOCK_DATABASE.USER.EMAIL ||
      req.body.password !== MOCK_DATABASE.USER.PASSWORD
    ) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: 'Your email or password is incorrect!' })
    }
    const payload = {
      email: MOCK_DATABASE.USER.EMAIL,
      id: MOCK_DATABASE.USER.ID,
    }

    const accessToken = await JwtProvider.generateToken(
      payload,
      ACCESS_TOKEN_SECRET_SIGNATURE,
      '30 seconds',
    )
    const refreshToken = await JwtProvider.generateToken(
      payload,
      REFRESH_TOKEN_SECRET_SIGNATURE,
      '14 days',
    )
    if (!tokenHeader) {
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: ms('14 days'),
      })
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: ms('14 days'),
      })
    }

    // Trường hợp nhập đúng thông tin tài khoản, tạo token và trả về cho phía Client

    res.status(StatusCodes.OK).json({
      message: 'Login API success!',
      ...payload,
      accessToken,
      refreshToken,
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
  }
}

const logout = async (req, res) => {
  try {
    // Do something
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')
    res.status(StatusCodes.OK).json({ message: 'Logout API success!' })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
  }
}

const refreshToken = async (req, res) => {
  try {
    // Do something
    const refreshTokenFromCookie = req.body.refreshToken
    const refreshTokenDecoded = await JwtProvider.verifyToken(
      refreshTokenFromCookie,
      REFRESH_TOKEN_SECRET_SIGNATURE,
    )
    console.log('refreshTokenDecoded', refreshTokenDecoded)
    const payload = {
      id: refreshTokenDecoded.id,
      email: refreshTokenDecoded.email,
    }
    const accessToken = await JwtProvider.generateToken(
      payload,
      ACCESS_TOKEN_SECRET_SIGNATURE,
      '10 seconds',
    )
    const refreshToken = await JwtProvider.generateToken(
      payload,
      REFRESH_TOKEN_SECRET_SIGNATURE,
      '14 days',
    )
    if (!tokenHeader) {
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: ms('14 days'),
      })
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: ms('14 days'),
      })
    }
    res.status(StatusCodes.OK).json({
      message: ' Refresh Token API success.',
      accessToken,
      refreshToken,
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
  }
}

export const userController = {
  login,
  logout,
  refreshToken,
}
