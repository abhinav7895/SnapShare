"use client"

import { DocumentData, doc, getDoc, increment, updateDoc } from 'firebase/firestore'
import React, { useEffect, useRef, useState } from 'react'
import { db } from '../../../../firebase.config'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import Image from 'next/image';
import { buttonVariants } from '@/components/ui/button'

const Page = ({ params }: { params: { id: string } }) => {
    const [imageData, setImageData] = useState<DocumentData>();
    const [revealSecret, setRevealSecret] = useState(false);
    const downloadRef = useRef<HTMLAnchorElement | null>(null);
    const hasIncremented = useRef(false); // Track if increment has occurred


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

    const incrementViews = async () => {
        if (hasIncremented.current) return;


        try {
            const docRef = doc(db, 'images', params.id); // Replace 'your-collection-name' with your actual collection name
            await updateDoc(docRef, {
                views: increment(1),
            });
            console.log('Views successfully incremented');
            hasIncremented.current = true;
        } catch (error) {
            console.error('Error incrementing views: ', error);
        }
    };

    useEffect(() => {
        getData();
    }, []);


    useEffect(() => {
        if (typeof window !== 'undefined') {
            incrementViews();
        }
    }, []);

    return (
        <MaxWidthWrapper >
            <div className='pt-20' style={{ minHeight: 'calc(100vh - 137px)' }}>
                <h2 className='text-3xl sm:text-4xl md:text-5xl  font-bold bg-gradient-to-r from-neutral-500  to-orange-600 inline-block text-transparent bg-clip-text'>Knock Knock</h2>
                <p className='mt-8 border w-fit text-base sm:text-lg text-neutral-700 p-1 px-2 border-neutral-500 rounded-md'>
                    Here&apos;s the your secret 🎁</p>
                {!imageData && !revealSecret && <div className='mt-4 bg-zinc-300 shimmer max-w-80 w-full h-60' >

                </div>}
                {!revealSecret && imageData ? <button onClick={() => { setRevealSecret(true) }} className={buttonVariants({
                    size: 'sm',
                    className: "bg-gray-100 border border-orange-600 mt-5 flex gap-1 hover:bg-orange-500"
                })}>Reveal Secret</button> : null}
                {(imageData && revealSecret) &&
                    <div className='mt-7 max-w-[500px] w-full max-h-[281px] h-full'>
                        <div className='max-w-[500px] max-h-[281px] rounded-md border overflow-hidden w-full h-full'>
                            <Image className=' object-cover ' src={imageData.imageUrl} alt='image' width={500} height={281} />
                        </div>
                        <div className='flex flex-col items-start'>
                            <div className='flex text-sm gap-1  mt-4 '>
                                <span className='text-neutral-600'>Shared by </span>
                                <h3 className=' text-neutral-700'> {imageData.userName}</h3>
                            </div>
                            {/* <button onClick={() => download(imageData.imageUrl)} className={buttonVariants({
                                size: 'sm',
                                className: "bg-gray-100 border border-orange-600 mt-5 flex gap-1 hover:bg-orange-500"
                            })}>
                                Download
                                <Download width={15} />
                            </button> */}
                        </div>
                    </div>}
                <a ref={downloadRef} style={{ display: 'none' }}>Download Link</a>

            </div>

        </MaxWidthWrapper>
    )
}

export default Page