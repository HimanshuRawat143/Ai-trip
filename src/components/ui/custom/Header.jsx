import React from 'react'
import { Button } from "@/components/ui/button"

function Header() {
  return (
    <>
    <div className='p-3 shadow-sm flex justify-between items-center px-5 fixed top-0 left-0 w-full z-10 bg-white'>
      <img src="/logo.svg" />
      <div>
      <Button>Sign In</Button>
      </div>
    </div>
    </>
    
  )
}

export default Header