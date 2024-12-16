'use client';
import React, { use, useEffect, useState, useCallback } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer';
import Roadmap from '../../components/Roadmap';
import supabase from '@/supbase';
import Link from 'next/link';
import useSessionStorage from '@/lib/useSessionStorage';
import spaceIcon from '../../assets/img/space.png'

function View({ params }) {

    const [userKeys, setUserKeys] = useState([])
    const [education, setEducation] = useState(null)
    const [work, setWork] = useState(null)
    const [certification, setCertification] = useState(null)
    const [project, setProject] = useState(null)
    const [blocks, setBlocks] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [empty, setEmpty] = useState(false)

    const [cLog] = useSessionStorage('country')

    const { keyword } = use(params)

    useEffect(() => {
        getUserKeys()
        getEducation()
        getWork()
        getCertification()
        getProject()
        return () => {}
    },[])

    async function getUserKeys() {
        const  { error, data } = await supabase.from('person').select('id,professions!inner(name)').eq('professions.name', keyword?.replace(/-/g,' ')).eq('country', JSON.parse(cLog)?.id)
        if (error) return console.error(error?.message)
        setEmpty(data.length?false:true)
        setUserKeys(data.map(({id}) => id))
    }

    async function getEducation() {
        const  { error, data } = await supabase.from('education').select('*,name(*),courses(*)')
        if (error) return console.error(error?.message)
        setEducation(groupBy(data, 'user_key'))
    }
    
    function groupBy(array, key) {
        return array.reduce((result, item) => {
            // Get the value of the key for grouping
            const groupKey = item[key].toString();
            
            // If the group doesn't exist, create it with an empty array
            if (!result[groupKey]) {
                result[groupKey] = [];
            }

            // Push the item into the group
            result[groupKey].push(item);

            return result;
        }, {});
    }

    async function getWork() {
        const  { error, data } = await supabase.from('work').select('*,name(*)')
        if (error) return console.error(error?.message)
        setWork(groupBy(data, 'user_key'))
    }

    async function getCertification() {
        const  { error, data } = await supabase.from('certification').select('*,provider(*)')
        if (error) return console.error(error?.message)
        setCertification(groupBy(data, 'user_key'))
    }

    async function getProject() {
        const  { error, data } = await supabase.from('project').select('*')
        if (error) return console.error(error?.message)
        setProject(groupBy(data, 'user_key'))
    }

    function mergeAndSortArrays(arraysWithTypes) {
        // Step 1: Flatten the array of arrays into a single array
        let combinedArray = arraysWithTypes.flatMap(({ type, items=[] }) => 
            items.map(item => ({ ...item, type }))
        );
        
        // Step 2: Sort the combined array by the timestamp property
        combinedArray.sort((a, b) => {
            // Convert timestamp strings to Date objects for comparison
            const dateA = new Date((a?.start_date||a?.year||a?.happenedOn) + '-01');
            const dateB = new Date((b?.start_date||b?.year||b?.happenedOn) + '-01');
            
            return dateA - dateB;
        });
        
        return combinedArray;
    }

    useEffect(() => {
        if (education && project && work && certification && userKeys?.length) {buildDirections()}
        return () => {}
    }, [education, project, work, certification, userKeys])

    function buildDirections() {
        // sort the order of blocks
        const sortedBlocks = []
        userKeys.map(key => {
            sortedBlocks.push(mergeAndSortArrays([{type:'education',items:education[key]},{type:'work',items:work[key]},{type:'certification',items:certification[key]},{type:'project',items:project[key]}]))
        })        
        setBlocks(sortedBlocks)
    }
    
    const handleSpaceBarPress = (event) => {
        if (event.keyCode === 32) {
            
            let newIndex = currentIndex
    
            if (newIndex < blocks.length-1) {
                newIndex++
            } else {
                newIndex=0
            }
            
            setCurrentIndex(newIndex)
        }

    };

  return (
    <div className='w-full h-screen relative' tabIndex={0} onKeyDown={e => handleSpaceBarPress(e)}>
        <Header />
        <div
            className='w-full h-screen bg-white relative'
        >
        <Roadmap isEmpty={empty} block={blocks[currentIndex]} />
        {
            empty && (
                <div className='max-w-[90%] lg:w-[400px] max-h-[250px] absolute mx-auto top-[40%] p-4 bg-white bottom-0 left-0 right-0 border-2 rounded-lg flex flex-col items-center justify-center space-y-2'>
                    <h2 className='w-full text-center font-bold text-2xl text-black tracking-tighter'>
                        We have no information about <br/>{keyword?.replace(/-/g,' ')}!
                    </h2>
                    <p className='w-full text-center tracking-tighter text-gray-500 text-md py-2'>
                        But you can help us, by submitting our survey so that your journey could help someone 
                    </p>
                    <Link href='/'>
                        <button
                            className='rounded-lg border-rose-700 border-2 border-transparent bg-white hover:bg-rose-600 hover:text-white text-rose-500 font-semibold tracking-tighter text-sm py-2 px-3'
                            >Submit Your Journey</button>
                    </Link>
                </div>
            )
        }
        </div>
        <div className='absolute mx-auto bottom-8 left-4 lg:left-0 lg:right-0 flex items-center justify-center space-x-2'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 text-gray-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 8.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v8.25A2.25 2.25 0 0 0 6 16.5h2.25m8.25-8.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-7.5A2.25 2.25 0 0 1 8.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 0 0-2.25 2.25v6" />
            </svg>
            <img
                src={spaceIcon.src} 
                className='font-light h-[30px] text-xs rounded-sm flex items-center flex-row'    
            />
            <p className='text-xs text-gray-600'>to see others</p>
        </div>
    </div>
  )
}

export default View