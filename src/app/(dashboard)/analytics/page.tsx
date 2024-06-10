"use client"

import { DocumentData, collection, getDocs, query, where } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { db } from '../../../../firebase.config'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import Image from 'next/image';
import { ImageDataType } from '@/lib/types'
import { useAuth } from '@/contexts/AuthContext'
import { formatTimestamp } from '@/lib/utils'
import { Calendar, CloudUpload, Eye, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { DashboardShimmer } from '@/components/Shimmer'
import { buttonVariants } from '@/components/ui/button'


const Page = () => {
  const [imageData, setImageData] = useState<DocumentData[]>();
  const { currentUser } = useAuth();

  const getData = async () => {
    try {
      const q = query(collection(db, "images"), where("userId", "==", currentUser?.uid));
      const imagesData = await getDocs(q);
      let data: ImageDataType[] = []
      imagesData.forEach((image) => {
        data.push({
          id: image.id,
          ...image.data() as ImageDataType
        })
      })
      setImageData(data);
      console.log(data);

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getData()
  }, []);

  if (!imageData) {
    return <DashboardShimmer />
  }

  return (
    <MaxWidthWrapper  >
      <div>
        <h1 className=' text-3xl sm:text-4xl md:text-6xl  mt-4 font-bold text-neutral-800 gap-2 flex items-center'>Dashboard <Sparkles className='text-yellow-500 size-8 sm:size-10 md:size-14' /></h1>
      </div>
      <div style={{ minHeight: 'calc(100vh - 137px)' }} className='flex py-8 flex-wrap gap-2 items-start'>
        {imageData.length > 0 ? imageData?.map((item, index) => (
          <Link href={"https://snapshare-seven.vercel.app/analytics/" + item.id} key={item.id} className=" w-[270px] border border-neutral-300 rounded-lg h-fit flex flex-col bg-neutral-50 justify-start md:w-80 p-2 min-h-[250px]">
            <div className="relative w-full">
              <div className="w-full h-[191px] bg-gradient-to-tr from-gray-400 to-gray-800 rounded-xl hidden" />
              <img
                className="w-full border h-[191px] object-cover rounded-xl relative "
                src={item.imageUrl}
                alt=""
                loading='lazy'
              />
            </div>
            <div className="w-full mt-4">
              <p className="flex text-sm items-center gap-2">
                <span className='flex border px-2 rounded-md bg-neutral-100 items-center gap-1'>
                  <Eye width={17} /> {item.views}
                </span> 
                <span className='flex border px-2 rounded-md bg-neutral-100 items-center gap-1'>
                  <Calendar className='' width={15} />
                  {formatTimestamp(item.uploadedAt)}          
                </span>
              </p>
            </div>
          </Link>

        )) : (
          <div className='w-full flex items-center justify-center'>
            <div>
              <h1 className='text-xl sm:text-3xl text-center text-neutral-700 font-medium'>Empty</h1>
              <Link href='/upload' className={buttonVariants({
                size: 'sm',
                className: 'flex group text-2xl mt-8 border border-orange-600 px-3 py-5 items-center gap-1',
              })}>Upload an image <CloudUpload /> </Link>

            </div>
          </div>
        )}
      </div>
    </MaxWidthWrapper>
  )
}

export default Page