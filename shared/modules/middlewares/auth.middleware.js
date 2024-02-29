import jwt from 'jsonwebtoken';

export async function checkToken(authHeader) {
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) throw { status: 401, message: 'Нет токена' };

  const { id, phone, hash } = jwt.verify(
    token,
    process.env.SECRET_KEY,
    (err, user) => {
      if (err) return {};
      return user;
    }
  );

  if (!id || !phone || !hash) throw { status: 401, message: 'Не верный токен' };

  return { id, phone, hash };
}
