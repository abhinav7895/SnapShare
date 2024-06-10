"use client"

import Link from 'next/link'
import MaxWidthWrapper from './MaxWidthWrapper'
import React from 'react'
import { Auth } from './Auth'
const Navbar = () => {

  return (
    <nav className='sticky z-[100] mx-auto h-14 inset-x-0 top-0 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all'>
      <MaxWidthWrapper className='mx-auto'>
        <div className='flex h-14 items-center justify-between border-b border-zinc-200'>
          <Link href='/' className='flex z-40 font-semibold'>
            snap<span className='text-orange-600'>share</span>
          </Link>

          <Auth />
        </div>
      </MaxWidthWrapper>
    </nav>
  )
}

export default Navbar