// import { Roboto } from 'next/font/google';
// import type { Metadata } from 'next';
// import '../app/globals.css';
// import Header from '../components/Header/Header';
// import Footer from '../components/Footer/Footer';
// import TanStackProvider from '../components/TanStackProvider/TanStackProvider';

// const roboto = Roboto({
//   weight: ['400', '700'],
//   style: ['normal', 'italic'],
//   subsets: ['latin'],
//   display: 'swap',
//   variable: '--font-roboto',
// });

// export const metadata: Metadata = {
//   title: 'NoteHub: Your Personal Note-Taking App',
//   description:
//     'Manage your notes effortlessly. Create, organize, and track your ideas with NoteHub.',
//   openGraph: {
//     title: 'NoteHub: Your Personal Note-Taking App',
//     description:
//       'Manage your notes effortlessly. Create, organize, and track your ideas with NoteHub.',
//     url: 'https://08-zustand-xi-one.vercel.app/',
//     images: [
//       {
//         url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
//       },
//     ],
//   },
// };

// export default function RootLayout({
//   children,
//   modal,
// }: Readonly<{
//   children: React.ReactNode;
//   modal: React.ReactNode;
// }>) {
//   return (
//     <html lang="en" className={roboto.variable}>
//       <body>
//         <TanStackProvider>
//           <Header />
//           <main>
//             {children}
//             {modal}
//           </main>
//           <Footer />
//         </TanStackProvider>
//       </body>
//     </html>
//   );
// }

import { Roboto } from 'next/font/google';
import type { Metadata } from 'next';
import '../app/globals.css';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import TanStackProvider from '../components/TanStackProvider/TanStackProvider';
import { checkSession } from '@/lib/api/serverApi';
import { AuthProvider } from '../components/AuthProvider/AuthProvider';
import { User } from '@/types/user';

const roboto = Roboto({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
});

export const metadata: Metadata = {
  title: 'NoteHub: Your Personal Note-Taking App',
  description:
    'Manage your notes effortlessly. Create, organize, and track your ideas with NoteHub.',
  openGraph: {
    title: 'NoteHub: Your Personal Note-Taking App',
    description:
      'Manage your notes effortlessly. Create, organize, and track your ideas with NoteHub.',
    url: 'https://08-zustand-xi-one.vercel.app/',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
      },
    ],
  },
};

export default async function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  let isAuthenticated = false;
  let user: User | null = null;

  try {
    const response = await checkSession();
    if (response.status === 200) {
      isAuthenticated = true;
      user = response.data.user;
    }
  } catch (error) {
    console.error('Session check failed:', error);
    // Якщо перевірка сесії не вдалася, користувач не авторизований
    isAuthenticated = false;
  }

  const initialState = {
    isAuthenticated,
    user,
  };

  return (
    <html lang="en" className={roboto.variable}>
      <body>
        <TanStackProvider>
          {/* ✅ Обгортаємо весь вміст в AuthProvider */}
          <AuthProvider initialState={initialState}>
            <Header />
            <main>
              {children}
              {modal}
            </main>
            <Footer />
          </AuthProvider>
        </TanStackProvider>
      </body>
    </html>
  );
}
