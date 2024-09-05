import React from 'react'
import Uplaod from './Uplaod'

const NoImages = () => {
  return (
    <>
      <div className="h-[92vh] w-full flex justify-center items-center gap-3">
        <h1 className='text-muted-foreground'>No images. Upload Images</h1>
        <Uplaod />
    </div>
    </>
  )
}

export default NoImages