import React from 'react'

export default function page() {
   return (
      <div >
         <div class="mx-auto max-w-screen-sm text-center">
            <h1 class="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-indigo-600">404</h1>
            <p class="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">Something&apos;s missing.</p>
            <p class="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">Sorry, we can&apos;t find that page.</p>
            <a href="/home" class="px-5 py-3 mt-8 text-white bg-indigo-600 rounded hover:bg-indigo-500 inline-flex hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium text-xl text-center my-4">Back to Homepage</a>
         </div>
      </div>
   )
}
