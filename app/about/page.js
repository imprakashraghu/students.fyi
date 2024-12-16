import React from 'react'
import Header from '../components/Header'

function About() {
  return (
    <div>
      <Header />
      <div
        className='w-full mt-16 h-[calc(100vh_-_200px)] bg-white z-10 px-24 py-10'
      >
        <h1 className='w-full text-black font-bold text-left text-xl'>About students.fyi 🚀</h1>
        <p className='w-full text-left text-black text-md py-2'>
            A consolidated view of a indiviual's career path where one could make thier decisions based on previous outcomes.
        </p>
      </div>
    </div>
  )
}

export default About