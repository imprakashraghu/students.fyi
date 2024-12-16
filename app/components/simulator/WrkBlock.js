
import { useCallback, useEffect, useState } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import Select from 'react-select'
import supabase from '@/supbase'
import toast from 'react-hot-toast';

function WorkBlock({
    id,
    data
}) {

    const { updateNodeData } = useReactFlow()
    const [professions, setProfessions] = useState([])

    function dateDifference(date1, date2) {
      const startDate = new Date(date1);
      const endDate = date2 ? new Date(date2) : new Date();
      
      const totalMonths = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth());
      
      if (totalMonths >= 12) {
        const years = totalMonths / 12;
        return `${years % 1 === 0 ? years : years.toFixed(1)}yr${years > 1 ? 's' : ''}`;
      } else {
        return `${totalMonths % 1 === 0 ? totalMonths : totalMonths.toFixed(1)}mo`;
      }
    }

    function getDomain(url) {
        // Use a regular expression to remove protocols and slashes
        return url.replace(/(^\w+:|^)\/\//, '').split('/')[0];
    }

    const typeList = [
        { label: 'Full Time', value: 'Full-Time' },
        { label: 'Part Time', value: 'Part-Time' },
        { label: 'Internship', value: 'Internship' }
    ]

    useEffect(() => {
        async function getProfessions() {
            const { error, data } = await supabase.from('professions').select('*')
            if (error) return toast.error(error?.message)
            setProfessions(data||[])
        }
        getProfessions()
    },[])

  return (
    <>
      {data?.isTarget&&(<Handle type={data?.isReverse?'source':'target'} position={Position.Left} id="a" />)}
      <div className={`border-2 border-black p-3 rounded-lg min-w-[200px] max-w-[300px] bg-white flex flex-col items-center space-y-1 relative'`}>
        <p className='w-full text-center text-sm text-black font-semibold'>Work</p>
        <Select
            placeholder='Select Job Type'
            className='text-sm min-w-[200px] max-w-[250px] nodrag'
            options={typeList}
            defaultValue={data?.jobType||null}
            onChange={e => {
              updateNodeData(id, { job_type: e.value })
            }}
        />
        <Select
            placeholder='Select Job Title'
            className='text-sm min-w-[200px] max-w-[250px] nodrag'
            options={professions.map(pro => ({label: pro.name, value: pro.name}))}
            defaultValue={data?.jobTitle||null}
            onChange={e => {
              updateNodeData(id, { job_title: e.value })
            }}
        />
      </div>
      {data?.isSource&&(<Handle type={data?.isReverse?'target':'source'} position={Position.Right} id="b" />)}
    </>
  )
}

export default WorkBlock