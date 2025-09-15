'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { logout } from '../../lib/api/clientApi';
import { useAuthStore } from '../../lib/store/authStore';

import css from './AuthNavigation.module.css';

const AuthNavigation = () => {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated
  );

  console.log(isAuthenticated);

  const handleLogout = async () => {
    await logout();
    clearIsAuthenticated();
    router.push('/sign-in');
  };
  return isAuthenticated ? (
    <>
      <li className={css.navigationItem}>
        <p className={css.userEmail}>
          {user?.username ? user?.username : user?.email}
        </p>
      </li>
      <li>
        <button onClick={handleLogout} className={css.logoutButton}>
          Log out
        </button>
      </li>
    </>
  ) : (
    <>
      <li className={css.navigationItem}>
        <Link href="/sign-in" className={css.navigationLink}>
          Log in
        </Link>
      </li>
      <li className={css.navigationItem}>
        <Link href="/sign-up" className={css.navigationLink}>
          Sign up
        </Link>
      </li>
    </>
  );
};

export default AuthNavigation;
