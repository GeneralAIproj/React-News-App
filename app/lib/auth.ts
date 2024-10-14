import jwt from 'jsonwebtoken';

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, 'your_secret_key');
  } catch (error) {
    return null;
  }
}
