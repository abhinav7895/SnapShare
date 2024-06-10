"use client"

import { DocumentData, doc, getDoc } from 'firebase/firestore'
import React, { useEffect, useRef, useState } from 'react'
import { db } from '../../../../../firebase.config'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import Image from 'next/image';
import { ClipboardCheck, Clipboard, Eye, Share } from 'lucide-react';
import { Calendar } from 'lucide-react';
// import { formatTimestamp } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { formatTimestamp } from '@/lib/utils'
import { AnalyticShimmer } from '@/components/Shimmer'
import { FaXTwitter, FaInstagram, FaFacebook } from "react-icons/fa6";
import { SiGooglemessages } from "react-icons/si";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import Link from 'next/link'

const SOCIAL = [
    {
        element : <FaXTwitter className='size-8 ' />,
        id : 1,
        href : (urlToShare : string) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(urlToShare)}`
    },
    {
        element : <FaInstagram className='size-8 ' />,
        id : 2,
        href : (urlToShare : string) => `https://www.instagram.com/`
    },
    {
        element : <FaFacebook className='size-8 ' />,
        id : 3,
        href : (urlToShare : string) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(urlToShare)}`
    },
    {
        element : <SiGooglemessages className='size-8 ' />,
        id : 4,
        href : (urlToShare : string) => `https://messages.google.com/` 
    },
];

const Page = ({ params }: { params: { id: string } }) => {
    const [imageData, setImageData] = useState<DocumentData>();
    const [copy, setCopy] = useState({
        text: "Copy",
        element: <Clipboard width={15} />
    });
    const linkRef = useRef<HTMLParagraphElement | null>(null);
    const getData = async () => {
        try {
            const docRef = doc(db, "images", params.id);
            const imageDetails = await getDoc(docRef);

            const data = imageDetails.data()
            setImageData(data);
        } catch (error) {
            console.log(error);
        }
    }

    const handleCopy = () => {
        if (linkRef && linkRef.current) {
            const textToCopy = linkRef.current.textContent;
            linkRef.current.classList.add("bg-blue-50")
            navigator.clipboard.writeText(textToCopy!)
                .then(() => {
                    setCopy({
                        text: "Copied",
                        element: <ClipboardCheck width={15} />
                    });
                    const id = setTimeout(() => {
                        if (linkRef && linkRef.current) {
                            linkRef.current.classList.remove("bg-blue-50")
                        }
                        setCopy(
                            {
                                text: "Copy",
                                element: <Clipboard width={15} />
                            }
                        );
                        clearTimeout(id);
                    }, 2000);
                })
                .catch((error) => {
                    console.log("Failed to copy " + error);
                })
        }
    }

    useEffect(() => {
        getData()
    }, []);

    return (
        <MaxWidthWrapper >
            <div className='pt-20' style={{ minHeight: 'calc(100vh - 137px)' }}>
                {imageData ?
                    <div className=' border flex-col items-start mx-auto flex p-4 rounded-md border-zinc-200 max-w-[540px] w-full' >
                        <div className='max-w-xs max-h-60 w-full h-full'>
                            <Image
                                className='w-full max-w-xs max-h-60 object-contain rounded-md'
                                src={imageData.imageUrl}
                                alt='image'
                                width={320}
                                height={240}
                            />
                        </div>
                        <div>
                            <div className='flex flex-col  gap-1 mt-3'>
                                <div className='flex border p-1 rounded bg-zinc-100 gap-1 items-center'>
                                    <Image src={imageData.userImage} className=' rounded-full  ' alt={imageData.userName + " photo"} width={20} height={20} />
                                    <h3 className='text-sm text-neutral-700'>{imageData.userName}</h3>
                                </div>
                                <div className='gap-1 flex items-center'>
                                    <Eye className='text-neutral-600' />
                                    <span className=' text-neutral-600'>{imageData.views}</span>
                                </div>
                                <div className='gap-1 flex items-center'>
                                    <Calendar className='text-neutral-600' />
                                    <span className=' text-neutral-600'>{formatTimestamp(imageData.uploadedAt)}</span>
                                </div>
                            </div>
                        </div>
                        <div className=' w-full mt-4 flex flex-col rounded-md  bg-neutral-200 border border-neutral-300 text-neutral-700 px-2 py-4'>
                            <p ref={linkRef} className='p-1 rounded text-start  border border-opacity-0 truncate'>
                                {
                                    // `https://snapshare-seven.vercel.app/shared/${params.id}`
                                    `https://snapshare-seven.vercel.app/shared/${params.id}`
                                }
                            </p>
                            <div className='mt-4 flex gap-3' >
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <button className={buttonVariants({
                                            size: 'sm',
                                            variant: 'ghost',
                                            className: "bg-gray-100 border border-neutral-300 flex gap-1 hover:bg-gray-50"
                                        })}>
                                            Share <Share width={15} />
                                        </button >
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-md">
                                        <DialogHeader>
                                            <DialogTitle>Share link</DialogTitle>
                                            <DialogDescription>
                                                Anyone who has this link will be able to view this.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="flex items-center space-x-4">
                                            {
                                                SOCIAL.map((e) => (
                                                    <Link className=' border p-2 hover:bg-neutral-100 rounded-full' href={e.href(`http://localhost:3000/analytics/${params.id}`)} key={e.id}>
                                                        {e.element}
                                                    </Link>
                                                ))
                                            }
                                        </div>
                                        <DialogFooter className="sm:justify-start">
                                            <DialogClose asChild>
                                                <button className={buttonVariants({
                                                    size: 'sm',
                                                    variant: 'ghost',
                                                    className: "bg-gray-100 flex gap-1 border border-gray-300 hover:bg-gray-200"
                                                })}>
                                                    Close
                                                </button>
                                            </DialogClose>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                                <button onClick={handleCopy} className={buttonVariants({
                                    size: 'sm',
                                    className: `bg-gray-100 border border-orange-600 flex gap-1 hover:bg-orange-500 ${copy.text === "Copied" && "bg-green-500 text-neutral-50 hover:bg-green-600 border-green-600"}`
                                })}>
                                    {copy.text} {copy.element}
                                </button>
                            </div>
                        </div>
                    </div> : <AnalyticShimmer />}
            </div>
        </MaxWidthWrapper>
    )
}

export default Page