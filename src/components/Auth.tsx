"use client"

import React from 'react'
import { signInWithGoogle } from '../../firebase.config'
import { buttonVariants } from './ui/button'
import { ArrowRight, BarChart2, CloudUpload, LogOut, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export const Auth = () => {
    const { currentUser, logout } = useAuth();
    const router = useRouter();

    return (
        <div className='h-full flex items-center space-x-4'>
            {currentUser ? (
                <>
                    <Image src={currentUser.photoURL!} width={30} height={30} className='hidden sm:block rounded-full border border-orange-600' alt='profile-photo' />
                    <Link
                        href='/upload'
                        className={buttonVariants({
                            size: 'sm',
                            className: 'flex group items-center gap-1',
                        })}>
                        <span className='hidden sm:block'>
                            Upload
                        </span>
                        <CloudUpload className='sm:ml-1.5 h-5 w-5' />
                    </Link>
                    <Link
                        href='/analytics'
                        className={buttonVariants({
                            size: 'sm',
                            variant: 'ghost',
                            className: "bg-gray-100 flex gap-1 hover:bg-gray-200 border border-neutral-200"
                        })}>
                        <span className='hidden sm:block'>Dashboard</span>
                        <Sparkles width={16} className=' hidden sm:block text-yellow-500' />
                        <BarChart2 className='block sm:hidden sm:ml-1.5 h-5 w-5' />
                    </Link>
                    <button
                        onClick={() => {
                            logout();
                            router.push("/");
                        }}
                        className={buttonVariants({
                            size: 'sm',
                            variant: 'ghost',
                            className: "bg-gray-100 hover:bg-gray-200 border border-neutral-200"
                        })}>
                        <span className='hidden sm:block'>Sign out</span>
                        <LogOut className='sm:ml-1.5 h-5 w-5' />
                    </button>

                </>
            ) : (
                <>
                    <button
                        onClick={() => {
                            signInWithGoogle();

                        }}
                        className={buttonVariants({
                            size: 'sm',
                            className: 'flex items-center group gap-1',
                        })}>
                        Get Started
                        <ArrowRight className='ml-1.5 h-5 w-5 group-hover:translate-x-1' />
                    </button>
                </>
            )}
        </div>


    )
}
