import React from 'react'

function Footer() {
  return (
    <div className='w-full flex flex-col items-center py-4 min-h-[150px] px-10 justify-center space-y-2 bg-gray-200'>
        <div className='w-6 h-6 bg-gray-400 bg-opacity-50 rounded-sm'></div>
        <p className='w-full text-gray-800 font-light text-center text-sm'>
            students.fyi | Helping you to contribute to the future of others
        </p>
        <p className='w-full text-gray-400 text-xs text-center'>
            All the information submitted here will not require any form of data that points to a particular person or induvial
        </p>
    </div>
  )
}

export default Footer