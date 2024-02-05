import { auth } from '@/auth';

export const GET = auth((req) => {
  if (req.auth) {
    return Response.json({ data: 'protected data' });
  }

  return Response.json({ data: 'public data' });
});
