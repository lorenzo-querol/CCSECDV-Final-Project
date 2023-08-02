import React from 'react'

export default function Timeout() {
   return (
      <div className="flex items-center justify-center h-full">
         <div className='flex-col'>
            <span className='text-2xl font-bold'>Your account has been reported.</span>
            <p className='text-center'>Please wait a few moments then try again.</p>
         </div>
      </div>
   );
}
