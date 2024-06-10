import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import React, { ReactNode } from 'react'

const layout = ({children} : {children : ReactNode}) => {
  return (
    <MaxWidthWrapper>
        {children}
    </MaxWidthWrapper>
  )
}

export default layout