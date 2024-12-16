
import { useCallback, useEffect, useState } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import Select from 'react-select'
import supabase from '@/supbase'
import toast from 'react-hot-toast';

function CertBlock({
    id,
    data
}) {

    const [providers, setProviders] = useState([])
    const { updateNodeData } = useReactFlow()

    function getDomain(url) {
        // Use a regular expression to remove protocols and slashes
        return url.replace(/(^\w+:|^)\/\//, '').split('/')[0];
    }

    useEffect(() => {
        async function getProviders() {
            const { error, data } = await supabase.from('cert_providers').select('*')
            if (error) return toast.error(error?.message)
            setProviders(data||[])
        }
        getProviders()
    },[])


  return (
    <>
      {data?.isTarget&&(<Handle type={data?.isReverse?'source':'target'} position={Position.Left} id="a" />)}
      <div className='border-2 border-teal-500 p-3 rounded-lg max-w-[300px] bg-white flex flex-col items-center space-y-1 relative'>
       <p className='w-full text-center text-sm text-black font-semibold'>Certification</p>
       <input
            placeholder='Enter Certification'
            className='rounded-lg border px-2 py-2 outline-teal-500 text-black text-sm min-w-[200px] max-w-[250px] nodrag'
            value={data?.name||''}
            onChange={e => {
                updateNodeData(id, { name: e.target.value })
            }}
        />
        <Select
            placeholder='Select Provider'
            className='text-sm min-w-[200px] max-w-[250px] nodrag'
            options={providers.map(pro => ({label: pro.name, value: pro.id}))}
            defaultValue={data?.provider||null}
            onChange={e => {
              updateNodeData(id, { provider: e.value, providerName: providers.filter(p => p.id === e.value)[0]?.name })
            }}
        />
      </div>
      {data?.isSource&&(<Handle type={data?.isReverse?'target':'source'} position={Position.Right} id="b" />)}
    </>
  )
}

export default CertBlock