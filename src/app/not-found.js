import Navbar from '@/components/Navbar'
import React from 'react'

const NotFound = () => {
  return (
    <>
    <Navbar />
      <div className="h-[92vh] w-full flex justify-center items-center gap-3">
        <h1 className='text-muted-foreground font-medium'>404 | Not Found</h1>
    </div>
    </>
  )
}

export default NotFound