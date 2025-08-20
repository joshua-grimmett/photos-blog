import './globals.css';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from '~/components/ui/navigation-menu';
import { Input } from '~/components/ui/input';
import { ThemeProvider } from '~/components/ui/theme-provider';
import ModeToggle from '~/components/mode-toggle';

export const metadata: Metadata = {
  title: 'Josh Grimmett - Photography Blog',
  description: 'Photography by Josh Grimmett',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className='min-h-screen bg-background text-foreground antialiased'
      >
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
          <header className='sticky top-0 z-50 border-b bg-background/80 backdrop-blur'>
            <div className='container mx-auto flex h-16 items-center justify-between px-4'>
              <Link href='/' className='font-semibold'>
                Josh Grimmett Photos
              </Link>
              <div className='flex items-center gap-3'>
                <NavigationMenu>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <NavigationMenuLink asChild>
                        <Link href='/' className={navigationMenuTriggerStyle()}>
                          Home
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <NavigationMenuLink asChild>
                        <Link
                          href='/about'
                          className={navigationMenuTriggerStyle()}
                        >
                          About
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <NavigationMenuLink asChild>
                        <Link
                          href='/contact'
                          className={navigationMenuTriggerStyle()}
                        >
                          Contact
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
                <form className='hidden sm:block'>
                  <Input
                    name='q'
                    placeholder='Search posts…'
                    className='w-56'
                  />
                </form>
                <ModeToggle />
              </div>
            </div>
          </header>
          <main className='container mx-auto px-4 py-8'>{children}</main>
          <footer className='border-t py-8 text-center text-sm text-muted-foreground'>
            © {new Date().getFullYear()} Josh Grimmett
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
