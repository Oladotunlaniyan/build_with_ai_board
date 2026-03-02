'use client';

import Link from 'next/link';
import Logo from './logo';
import { ThemeToggle } from './theme-toggle';
import { useAuth } from '@/hooks/use-auth';
import { Button } from './ui/button';
import { SubmitProjectButton } from './projects/submit-project-button';

export default function Header() {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-[1200px] items-center justify-between">
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
