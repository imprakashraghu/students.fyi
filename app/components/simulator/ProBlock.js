
import { useCallback, useEffect, useState } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import Select from 'react-select'
import supabase from '@/supbase'
import toast from 'react-hot-toast';

function CertBlock({
    id,
    data
}) {

    const { updateNodeData } = useReactFlow()

    function getDomain(url) {
        // Use a regular expression to remove protocols and slashes
        return url.replace(/(^\w+:|^)\/\//, '').split('/')[0];
    }

  return (
    <>
      {data?.isTarget&&(<Handle type={data?.isReverse?'source':'target'} position={Position.Left} id="a" />)}
      <div className='border-2 border-amber-500 p-3 rounded-lg max-w-[350px] bg-white flex flex-col items-center space-y-1 relative'>
       <p className='w-full text-center text-sm text-black font-semibold'>Project</p>
       <input
            placeholder='Technologies used separated by comma'
            className='rounded-lg border px-2 py-2 outline-amber-500 text-black text-sm min-w-[300px] max-w-[350px] nodrag'
            value={data?.techUsed||''}
            onChange={e => {
                updateNodeData(id, { techUsed: e.target.value })
            }}
        />
      </div>
      {data?.isSource&&(<Handle type={data?.isReverse?'target':'source'} position={Position.Right} id="b" />)}
    </>
  )
}

export default CertBlock