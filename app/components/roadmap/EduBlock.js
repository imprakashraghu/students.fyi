import { useCallback, useState } from 'react';
import { Handle, Position } from '@xyflow/react';

function EduBlock({
  data
}) {

  const [showTag, setShowTag] = useState(false)

  function getDomain(url) {
    // Use a regular expression to remove protocols and slashes
    return url.replace(/(^\w+:|^)\/\//, '').split('/')[0];
  }

  return (
    <>
      {data?.isTarget&&(<Handle type={data?.isReverse?'source':'target'} position={Position.Left} id="a" />)}
      <div className={`border-2 ${data?.isPlaceholder?'border-dashed':'border-blue-500'} p-3 rounded-lg min-w-[200px] max-w-[300px] bg-white flex flex-col items-center space-y-1 relative`}>
        {
          data?.logo && (
            <img className='contain h-8 rounded-md' src={`https://img.logo.dev/${getDomain(data?.logo)}?token=pk_VnN61RuTS9ixac-W9EsxHA`} />
          )
        }
        <p className={`w-full text-center text-md ${data?.isPlaceholder?'text-gray-400':'text-black font-semibold'}`}>{data?.title}</p>
        <p className='w-full text-center text-gray-700 text-sm'>{data?.subtitle}</p>
        {data?.challenge&&(<p onClick={() => setShowTag(!showTag)} className='cursor-pointer w-full text-center text-sm text-medium underline text-red-500'>{showTag?'Hide':'Show'} Challenges</p>)}
        {
          showTag && (
            <>
              <div className='absolute bottom-[170px] bg-red-100 border-2 border-red-500 rounded-lg py-1 px-2 min-w-[150px] flex items-center justify-center'>
                <p className='text-black text-sm w-full text-center'>{data?.challenge}</p>
              </div>
              {
                data?.subtitle && (
                  <div className='absolute top-[170px] bg-green-100 border-2 border-green-500 rounded-lg py-1 px-2 min-w-[150px] flex items-center justify-center'>
                    <p className='text-black text-sm w-full text-center'>{data?.solution}</p>
                  </div>
                )
              }
            </>
          )
        }
      </div>
      {data?.isSource&&(<Handle type={data?.isReverse?'target':'source'} position={Position.Right} id="b" />)}
    </>
  )
}

export default EduBlock