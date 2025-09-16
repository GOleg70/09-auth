'use client';

import { useEffect, useState } from 'react';
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

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // тут можна повернути пустий фрагмент, щоб SSR і CSR співпадали
    return null;
  }

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
