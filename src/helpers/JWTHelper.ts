import { sign, decode } from 'jsonwebtoken';
import { JWTSecret } from '../../config/JWTSecret';
import { DecodedToken } from '../types/decodedToken';
import { MS_IN_HOUR } from '../../constants/Times';

export class JWTHelper {
  private static readonly ACCESS_TOKEN_TTL = MS_IN_HOUR;
  private static readonly REFRESH_TOKEN_TTL = 72 * MS_IN_HOUR;

  public static generateAccessToken(email: string): string {
    return this.generateToken({ email }, this.ACCESS_TOKEN_TTL);
  }

  public static generateRefreshToken(email: string): string {
    return this.generateToken({ email }, this.REFRESH_TOKEN_TTL);
  }

  private static generateToken(
    payload: object,
    expirationTime: number,
  ): string {
    return sign(
      { ...payload, expiresIn: Date.now() + expirationTime },
      JWTSecret,
    );
  }

  public static decodeToken(token: string): DecodedToken {
    return decode(token) as DecodedToken;
  }

  public static isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    return decoded.expiresIn < Date.now();
  }

  public static isTokenValid(token: string): boolean {
    return token && !this.isTokenExpired(token);
  }
}
