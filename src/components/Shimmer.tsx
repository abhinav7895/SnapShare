import React from 'react';

export const AnalyticShimmer = () => {
    return (
        <div className='border flex-col items-start mx-auto flex p-4 rounded-md border-zinc-200 max-w-[540px] w-full'>
            <div className='max-w-xs max-h-60 w-full h-full  animate-pulse rounded-md' />
            <div className='mt-3'>
                <div className='flex flex-col gap-1'>
                    <div className='flex border p-1 h-40 w-40 rounded bg-zinc-100 gap-1 items-center shimmer'>
                        <div className='rounded-full w-5 h-5 shimmer' />
                        <div className='w-24 h-4 shimmer' />
                    </div>
                    <div className='gap-1 flex items-center'>
                        <div className='w-5 h-4 shimmer' />
                        <div className='w-16 h-4 shimmer' />
                    </div>
                    <div className='gap-1 flex items-center'>
                        <div className='w-5 h-4 shimmer' />
                        <div className='w-20 h-4 shimmer' />
                    </div>
                </div>
            </div>
            <div className='w-full mt-4 flex flex-col rounded-md bg-neutral-200 border border-neutral-300 px-2 py-4'>
                <div className='w-full rounded-md h-6 shimmer' />
                <div className='mt-4  flex gap-3'>
                    <div className='w-20 rounded-md h-8 shimmer' />
                    <div className='w-20 rounded-md h-8 shimmer' />
                </div>
            </div>
        </div>
    );
}

export const DashboardShimmer = () => {
    return (
        <div className='flex flex-wrap gap-5 mt-6'>
        {Array(10).fill("").map((_, index) => (
          <div className='border rounded-md p-3 max-w-[300px] w-full' key={index}>
            <div className='flex flex-col h-full items-start'>
              <div className='w-full'>
                <div className='relative w-full pb-[100%] shimmer'></div>
              </div>
              <div className='mt-2 w-full'>
                <p className='flex text-sm items-center gap-2 shimmer h-4 w-full rounded-md'></p>
                <p className='flex text-sm items-center gap-2 shimmer h-4 w-1/2 rounded-md mt-1'></p>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
}

