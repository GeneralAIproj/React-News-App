import jwt from 'jsonwebtoken';

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, 'c2FjaGkvZGhoZWluaTlkZG93a3plZ29uZmRncmtyaW5ndGVy');
  } catch (error) {
    return null;
  }
}
