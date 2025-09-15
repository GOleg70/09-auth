import { Metadata } from 'next';

import Link from 'next/link';
import Image from 'next/image';

import css from './ProfilePage.module.css';

import { getServerMe } from '../../../lib/api/serverApi';

export const metadata: Metadata = {
  title: 'User Profile',
  description:
    'View and manage your personal information, notes, and settings in your profile.',
  openGraph: {
    title: 'User Profile',
    description:
      'View and manage your personal information, notes, and settings in your profile.',
    url: '/profile',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'User profile preview',
      },
    ],
  },
};

const ProfilePage = async () => {
  const user = await getServerMe();
  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <Link href="profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>
        <div className={css.avatarWrapper}>
          <Image
            src={user.avatar}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>
        <div className={css.profileInfo}>
          <p>Username: {user ? user.username : ''}</p>
          <p>Email: {user ? user.email : 'undefined'}</p>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
