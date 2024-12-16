'use client'
import React, { Suspense, useEffect, useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import Roadmap from './components/Roadmap'
import HomeMap from './components/HomeMap'
import { ReactFlowProvider } from '@xyflow/react'
import supabase from '@/supbase'
import toast from 'react-hot-toast'
import useSessionStorage from '@/lib/useSessionStorage'

function Home() {

  const [keyword, setKeyword] = useState(null)
  const [countries, setCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState('')
  const [countryS, setCountryS] = useState(null)

  const [cLog, setClog] = useSessionStorage('country')

  useEffect(() => {
    async function getCountries() {
      const { error, data } = await supabase.from('countries').select('*')
      if (error) return toast.error(error.message)
      setCountries(data)
      let canada = data.filter(item => item?.name==="India")[0]
      setClog(JSON.stringify(canada))
      setCountryS(canada)
      setSelectedCountry(canada?.name)
    }
    getCountries()
  }, [])

  return (
    <div>
      <Header onSearchSubmit={(val) => setKeyword(val)} />
      <div
        className='w-full h-screen z-10 relative'
      >
        <h1 className='text-center w-full lg:max-w-[50%] mx-auto text-4xl lg:text-6xl tracking-tighter font-extrabold absolute top-[40%] bottom-[40%] left-0 right-0 rounded-lg'>
          We help you make decisions for a better future
        </h1>
        <ReactFlowProvider>
          <HomeMap 
            keyword={keyword}
          />
        </ReactFlowProvider>
        <div className='rounded-lg bg-rose-500 flex items-center space-x-1 absolute bottom-6 right-6 px-2 shadow-lg'>
          {countryS?.iso2&&(<img 
            src={`https://flagsapi.com/${countryS?.iso2}/flat/64.png`}
            className='contain h-6 w-6' 
          />)}
          <select 
            value={selectedCountry}
            onChange={e => {
              const countrySelec = countries.filter(item => item?.name===e.target.value)[0]
              setSelectedCountry(e.target.value)
              setClog(JSON.stringify(countrySelec))
              setCountryS(countrySelec)
            }}
            className='w-full outline-none text-sm text-white px-2 py-2 bg-transparent text-clip max-w-[100px]'>
            {
              countries.map(country => (
                <option key={country.id} value={country?.name}>{country?.name}</option>
              ))
            }
          </select>
        </div>
      </div>
    </div>
  )
}

export default Home