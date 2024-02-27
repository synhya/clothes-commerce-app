import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';

const secretKey = 'secret';
const key = new TextEncoder().encode(secretKey);

export async function sign(
  payload: any,
  exp: string | number | Date,
  secret: string,
): Promise<string> {
  const iat = Math.floor(Date.now() / 1000);

  return new SignJWT({ payload })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setExpirationTime(exp)
    .setIssuedAt(iat)
    .setNotBefore(iat)
    .sign(new TextEncoder().encode(secret));
}

async function decrypt(token: string) {
  const { payload } = await jwtVerify(token, key, {
    algorithms: ['HS256'],
  });
  return payload;
}

// async function login(formData: FormData) {
//   const user = { email: formData.get('email'), password: formData.get('password') };
//
//   const expires = new Date(Date.now() + 10 * 1000);
//   const session = await encrypt({ user, expires });
//
//   cookies().set('session', session, { expires, httpOnly: true });
// }
