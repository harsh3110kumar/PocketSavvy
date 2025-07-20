import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='text-center space-y-6'>
        <h1 className='text-6xl font-bold gradient-title mb-4'>404</h1>
        <h2 className='text-2xl font-semibold text-foreground'>Page Not Found</h2>
        <p className='text-muted-foreground max-w-md mx-auto'>
          Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or you entered the wrong URL.
        </p>
        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
          <Link href='/'>
            <Button className='flex items-center gap-2'>
              <Home className='h-4 w-4' />
              Back to PocketSavvy
            </Button>
          </Link>
          <Link href='/dashboard'>
            <Button variant='outline' className='flex items-center gap-2'>
              <ArrowLeft className='h-4 w-4' />
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
