"use client"
import { useState, useEffect, useTransition } from 'react';
import {
  collection, addDoc,
  doc
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Dropzone, { FileRejection } from 'react-dropzone'; // Or your preferred dropzone library
import { useAuth } from '@/contexts/AuthContext';
import { db, storage } from '../../../firebase.config';
import { v4 as uuidv4 } from 'uuid';
import { MousePointerSquareDashed, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Image } from 'lucide-react';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

const Upload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const router = useRouter();
  const [isDragOver, setIsDragOver] = useState<boolean>(false)

  const uploadImage = async () => {
    if (file) {
      try {
        console.log(file);
        setLoading(true);
        console.log(file.name);

        const imageRef = ref(storage, `uploads/${file.name}${uuidv4()}`);
        await uploadBytes(imageRef, file);
        const url = await getDownloadURL(imageRef);

        const docRef = await addDoc(collection(db, "images"), {
          userName: currentUser?.displayName,
          imageUrl: url,
          userId : currentUser?.uid,
          userImage: currentUser?.photoURL,
          uploadedAt: Date.now(),
          views: 0,
        })
        toast.success("Succesfully uploaded")
        router.push(`/analytics/${docRef.id}`);
      } catch (error) {
        toast.error("Error occured while uploading image")
        setLoading(false)
      }
    }
  };

  // const handleViewCount = async () => {
  //   // Update view count in Firestore
  //   const imageDocRef = doc(db, 'images', imageUrl);
  //   await updateDoc(imageDocRef, {
  //     views: increment(1),
  //   });
  // };

  const onDropRejected = (rejectedFiles: FileRejection[]) => {
    const [file] = rejectedFiles;

    setIsDragOver(false)

    toast.message(`${file.file.type} type is not supported`, {
      description: "Please choose any image format instead."
    })
  }

  const onDropAccepted = (acceptedFiles: File[]) => {
    console.log(acceptedFiles[0]);
    
    setFile(acceptedFiles[0])
    uploadImage();
    setIsDragOver(false)
  }

  useEffect(() => {
    uploadImage();
  }, [file])

  const [isPending, startTransition] = useTransition();

  return (
    <MaxWidthWrapper>

      <div
        className={cn(
          'relative min-h-[600px] select-none h-full flex-1 my-16 w-full rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl flex justify-center flex-col items-center',
          {
            'ring-blue-900/25 bg-blue-900/10': isDragOver,
          }
        )} >
        <div className='relative flex flex-1 flex-col items-center justify-center w-full'>
          <Dropzone
            onDropRejected={onDropRejected}
            onDropAccepted={onDropAccepted}
            onDrop={(acceptedFiles) => {setFile(acceptedFiles[0])}}
            accept={{
              'image/png': ['.png'],
              'image/jpeg': ['.jpeg'],
              'image/jpg': ['.jpg'],
              'image/heic' : ['.heic'],
              'image/webp' : ['.webp'],
              
            }}
            onDragEnter={() => setIsDragOver(true)}
            onDragLeave={() => setIsDragOver(false)}>
            {({ getRootProps, getInputProps }) => (
              <div
                className='h-full w-full flex-1 flex flex-col items-center justify-center'
                {...getRootProps()}>
                <input {...getInputProps()} />
                {isDragOver ? (
                  <MousePointerSquareDashed className='h-6 w-6 text-zinc-500 mb-2' />
                ) : loading || isPending ? (
                  <Loader2 className='animate-spin h-6 w-6 text-zinc-500 mb-2' />
                ) : (
                  <Image className='h-6 w-6 text-zinc-500 mb-2' />
                )}
                <div className='flex flex-col justify-center mb-2 text-sm text-zinc-700'>
                  {loading ? (
                    <div className='flex flex-col items-center'>
                      <p>Uploading...</p>
                    </div>
                  ) : isPending ? (
                    <div className='flex flex-col items-center'>
                      <p>Redirecting, please wait...</p>
                    </div>
                  ) : isDragOver ? (
                    <p>
                      <span className='font-semibold'>Drop file</span> to upload
                    </p>
                  ) : (
                    <p>
                      <span className='font-semibold'>Click to upload</span> or
                      drag and drop
                    </p>
                  )}
                </div>

                {isPending ? null : (
                  <p className='text-xs text-zinc-500'>PNG, JPG, JPEG, Webp</p>
                )}
              </div>
            )}
          </Dropzone>
        </div>
      </div>
    </MaxWidthWrapper>
  )
};

export default Upload;
