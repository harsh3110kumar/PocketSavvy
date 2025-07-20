import React from 'react'
import { SignedIn, SignedOut, SignInButton, UserButton} from '@clerk/nextjs';
import Link from 'next/link';
import { Button } from './ui/button';
import { LayoutDashboard, PenBox, BarChart3, Home } from 'lucide-react';
import { checkUser } from '@/lib/checkUser';
import Logo from './logo';

const Header = async () => {

  await checkUser(); // Ensuring user authentication check before rendering

  return (
    <div className='fixed top-0 w-full z-50 border-b border-white/10 shadow-lg bg-slate-900/95 backdrop-blur-md transition-colors duration-300'> 
      {/* Sticky header with glass effect */}

      <nav className='container mx-auto px-4 py-4 flex items-center justify-between'> 
        {/* Left: Logo */}
        <div className="flex items-center">
          <Logo className="h-10" />
        </div>

        {/* Center: Navigation */}
        <SignedIn>
          <div className="hidden md:flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" size="sm" className="flex items-center gap-2 hover:bg-white/10 text-white">
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="flex items-center gap-2 hover:bg-white/10 text-white">
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Button>
            </Link>
            <Link href="/transactions">
              <Button variant="ghost" size="sm" className="flex items-center gap-2 hover:bg-white/10 text-white">
                <BarChart3 className="h-4 w-4" />
                <span>Transactions</span>
              </Button>
            </Link>
          </div>
        </SignedIn>

        {/* Right: Actions */}
        <div className='flex items-center space-x-3'>
          <SignedIn> 
            {/* Displayed only when the user is signed in */}
            <Link 
              href="/transaction/create"
              className='text-muted-foreground hover:text-primary transition-colors duration-300'
            >
              <Button className='flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200'>
                <PenBox size={18}/> 
                <span className='hidden md:inline'>Add Transaction</span>
              </Button>
            </Link>

            {/* Mobile Navigation */}
            <div className="md:hidden flex items-center gap-1">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="p-2 text-white">
                  <LayoutDashboard size={18}/> 
                </Button>
              </Link>
              <Link href="/transactions">
                <Button variant="ghost" size="sm" className="p-2 text-white">
                  <BarChart3 size={18}/> 
                </Button>
              </Link>
            </div>
          </SignedIn>

          <SignedOut> 
            {/* Displayed only when the user is signed out */}
            <SignInButton forceRedirectUrl="/dashboard">
              <Button variant="outline" className='hover:bg-primary hover:text-primary-foreground transition-colors duration-300 shadow-md hover:shadow-lg border-white/20 text-white'>
                Login
              </Button>
            </SignInButton>
          </SignedOut>

          <SignedIn> 
            {/* User profile button when signed in */}
            <UserButton appearance={{
              elements: {
                avatarBox: "w-10 h-10 hover-scale shadow-md",
                userButtonPopoverCard: "bg-slate-800 border-white/10 shadow-xl",
                userButtonPopoverActionButton: "hover:bg-white/10 transition-colors duration-200",
                userButtonPopoverActionButtonText: "text-white",
                userButtonPopoverActionButtonIcon: "text-primary",
              },
            }}/>
          </SignedIn>
        </div>
      </nav>
    </div>
  );
}

export default Header;

