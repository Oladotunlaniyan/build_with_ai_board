'use client';

import Link from 'next/link';
import Logo from './logo';
import { ThemeToggle } from './theme-toggle';
import { useUser,
  useFirestore,
  useDoc,
  useMemoFirebase,
  useAuth as useFirebaseAuth,
} from '@/firebase';
import { Button } from './ui/button';
import { SubmitProjectButton } from './projects/submit-project-button';
import { doc } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';
import { signOut } from 'firebase/auth';

export default function Header() {
  const { user, isUserLoading } = useUser();
  const auth = useFirebaseAuth();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(
    () => (user ? doc(firestore, 'users', user.uid) : null),
    [user, firestore]
  );
  const { data: userProfile, isLoading: isProfileLoading } =
    useDoc<UserProfile>(userDocRef);

  const isLoading = isUserLoading || isProfileLoading;
  const isAuthenticated = !isLoading && !!user;
  const isAdmin = isAuthenticated && userProfile?.role === 'admin';

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-4">
        <Logo />
        <div className="flex items-center space-x-2">
          {!isLoading && ( 
            <>
              {isAuthenticated ? (
                <>
                  <SubmitProjectButton />
                  {isAdmin && (
                    <Button variant="ghost" asChild>
                      <Link href="/admin">Admin</Link>
                    </Button>
                  )}
                  <Button variant="ghost" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                <Button asChild>
                  <Link href="/auth">Login</Link>
                </Button>
              )}
            </>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
