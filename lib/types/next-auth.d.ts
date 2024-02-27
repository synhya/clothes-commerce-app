import { DefaultSession, Profile, User } from 'next-auth';
import { JWT } from 'next-auth/jwt';

// Declare your framework library
declare module 'next-auth' {
  /**
   * The shape of the user object returned in the OAuth providers' `dump` callback,
   * or the second parameter of the `session` callback, when using a database.
   */
  export interface User {}
  /**
   * The shape of the account object returned in the OAuth providers' `account` callback,
   * Usually contains information about the provider being used, like OAuth tokens (`access_token`, etc).
   */
  interface Account {}

  /**
   * Returned by `useSession`, `auth`, contains information about the active session.
   */
  interface Session {
    supabaseAccessToken?: string;
    user: {
      // The user's postal address
      address: string;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends User {}
}
