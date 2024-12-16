import { useCallback, useEffect, useState } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import Select from 'react-select'
import supabase from '@/supbase';
import toast from 'react-hot-toast';

function EduBlock({
  id,
  data
}) {

    const [courseList, setCourseList] = useState([])

    const { updateNodeData } = useReactFlow()

  function getDomain(url) {
    // Use a regular expression to remove protocols and slashes
    return url.replace(/(^\w+:|^)\/\//, '').split('/')[0];
  }

  useEffect(() => {
    async function getCourses() {
        const { error, data } = await supabase.from('courses').select('*')
        if (error) return toast.error(error.message)
        setCourseList(data||[])
    }
    getCourses()
  }, [])

  const degreeList = [
    { label: 'Bachelors', value: 'Bachelors' },
    { label: 'Masters', value: 'Masters' },
    { label: 'PHD', value: 'PHD' },
  ]

  function wrapUrlsWithAnchor(input) {
    const urlPattern = /https?:\/\/[^\s]+/g; // Regular expression to match URLs
    return input.replace(urlPattern, (url) => `<a className='cursor-pointer hover:text-purpl-800 text-purple-600 underline' href="${url}" target="_blank">${url}</a>`);
  }

  function containsURL(str) {
    const urlPattern = /https?:\/\/[^\s$.?#].[^\s]*/i; // Regular expression to match URLs
    return urlPattern.test(str);
  }

  return (
    <>
      <Handle type={'source'} position={Position.Left} id="x" />
      <div className='border-2 border-purple-500 p-3 rounded-lg max-w-[400px] bg-purple-100 flex flex-col items-center space-y-1'>
        <p className='w-full text-left text-md text-black font-semibold'>{data?.action}</p>
        <p className='w-full text-left text-sm text-purple-700 border-b border-purple-500 pb-1'>{data?.description}</p>
        {
          containsURL(data?.references) ? (
            <div className='w-full text-left text-sm text-purple-500' dangerouslySetInnerHTML={{__html:wrapUrlsWithAnchor(data?.references)}}></div>
          ) : (<p className='w-full text-left text-sm text-purple-500'>{data?.references}</p>)
        }
      </div>
    </>
  )
}

export default EduBlock