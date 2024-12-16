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

  return (
    <>
      {data?.isTarget&&(<Handle type={data?.isReverse?'source':'target'} position={Position.Left} id="a" />)}
      <div className='border-2 border-blue-500 p-3 rounded-lg max-w-[300px] bg-white flex flex-col items-center space-y-1'>
        <p className='w-full text-center text-sm text-black font-semibold'>Education</p>
        <Select
            placeholder='Select Degree'
            className='text-sm min-w-[200px] max-w-[250px] nodrag'
            options={degreeList}
            defaultValue={data?.degree||null}
            onChange={e => {
              updateNodeData(id, { degree: e.value })
            }}
        />
        <Select
            placeholder='Select Course'
            className='text-sm min-w-[200px] max-w-[250px] nodrag'
            options={courseList.map(course => ({label: course.name, value: course.id}))}
            defaultValue={data?.course||null}
            onChange={e => {
              updateNodeData(id, { course: e.value })
            }}
        />
      </div>
      {data?.isSource&&(<Handle type={data?.isReverse?'target':'source'} position={Position.Right} id="b" />)}
    </>
  )
}

export default EduBlock