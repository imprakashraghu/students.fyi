'use client';
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Toaster } from 'react-hot-toast'
import supabase from '@/supbase'
import { usePathname, useRouter } from 'next/navigation';

function Header({
  onSearchSubmit=oss=>oss
}) {

  const router = useRouter()
  const pathname = usePathname()
  const [search, setSearch] = useState('')
  const [results, setResults] = useState([])

  useEffect(() => {
      if (!search) return

      const getData = setTimeout(async () => {
        const { error, data } = await supabase.from('professions').select('id,name').ilike('name', `%${search}%`)
        if (error) return console.log(error.message)
        setResults(data||[])
      }, 1000)

      return () => clearTimeout(getData)
  }, [search])
  

  return (
    <div className='w-[95%] z-20 absolute top-0 left-0 right-0 shadow-lg mx-auto rounded-lg my-3 flex flex-row items-center py-1 lg:py-2 px-2 lg:px-10 justify-between bg-rose-500'>
        <div className='w-full flex flex-row items-center justify-between space-x-2'>
            <div className='flex flex-row items-center space-x-3'>
              <Link href="/">
                <div className='cursor-pointer flex flex-row items-center'>
                  <div className='hidden lg:block w-6 h-6 bg-gray-100 bg-opacity-50 rounded-sm'></div>
                  <h1 className='text-white font-semibold text-left px-2 text-lg lg:text-xl tracking-tighter flex flex-row items-center space-x-2'>
                      <span>students.fyi</span>
                  </h1>
                </div>
              </Link>
              <div className='relative flex flex-row items-center space-x-1 bg-rose-600 rounded-lg px-2 py-2 lg:py-1'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4 lg:size-5 text-rose-200">
                  <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
                </svg>
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder='Search Profession, Career, Position, Dream Job'
                  className='w-full lg:w-[400px] placeholder-rose-300 outline-none px-1 lg:px-2 py-1 lg:py-2 bg-transparent text-white font-medium text-sm'
                  type='text'
                />
                <div className={`duration-200 absolute ${results.length?'flex':'hidden'} items-center flex-col top-11 left-0 right-0 w-[98%] mx-auto border min-h-[50px] max-h-[200px] overflow-y-auto bg-white shadow-lg rounde-md`}>
                {
                  results.map(result => (
                    
                      <p 
                        onClick={() => {
                          setResults([])
                          if (pathname === '/') {
                            onSearchSubmit(result?.id)
                          } else {
                            router.push('/?key='+result?.id)
                            onSearchSubmit(result?.id)
                          }
                        }} key={result.id} className='w-full text-left text-black text-sm py-3 border-b font-medium hover:bg-gray-100 cursor-pointer px-3'>
                        {result?.name}
                      </p>

                  ))
                }
                </div>
              </div>
            </div>
           <div className='hidden lg:flex flex-row items-center space-x-4'>
              <Link href='/about'>
                <span className='px-2 text-sm text-white cursor-pointer hover:text-rose-200'>About</span>
              </Link>
              <Link href='/simulator'>
                <span className='px-2 text-sm text-white cursor-pointer hover:text-rose-200'>Simulator</span>
              </Link>
              <button 
                onClick={() => router.push('http://localhost:3001')}
                className='rounded-lg hover:border-rose-700 hover:text-rose-700 border-2 border-transparent bg-white text-rose-500 font-semibold tracking-tighter text-sm py-2 px-3'
              >Add Your Data</button>
           </div>
        </div>
        <Toaster
          position="top-center"
          reverseOrder={false}
        />
    </div>
  )
}

export default Header