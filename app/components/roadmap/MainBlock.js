import { useCallback } from 'react';
import { Handle, Position } from '@xyflow/react';
 
const handleStyle = { left: 10 };

function MainBlock({
  data
}) {

  function getDomain(url) {
    // Use a regular expression to remove protocols and slashes
    return url.replace(/(^\w+:|^)\/\//, '').split('/')[0];
  }

  return (
    <>
      {data?.isTarget&&(<Handle type={data?.isReverse?'source':'target'} position={Position.Left} id="a" />)}
      <div className='border-2 p-3 rounded-lg min-w-[200px] bg-white flex flex-col items-center space-y-2'>
        {
          data?.logo && false && (
            <img className='contain h-8 rounded-md' src={`https://img.logo.dev/${getDomain(data?.logo)}?token=pk_VnN61RuTS9ixac-W9EsxHA`} />
          )
        }
        <p className='w-full text-center text-md text-black font-semibold'>{data?.title}</p>
        <div className='w-full rounded-md bg-black flex flex-row items-center justify-between space-x-2 px-2 py-1'>
            <p className='w-full text-center text-white text-sm'>{data?.subtitle}</p>
        </div>
      </div>
      {data?.isSource&&(<Handle type={data?.isReverse?'target':'source'} position={Position.Right} id="b" />)}
    </>
  )
}

export default MainBlock