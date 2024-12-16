
import { useCallback, useState } from 'react';
import { Handle, Position } from '@xyflow/react';

function ProjectBlock({
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
      <div className={`border-2 ${data?.isPlaceholder?'border-dashed':'border-amber-500'} p-3 rounded-lg min-w-[150px] max-w-[300px] bg-white flex flex-col items-center space-y-1 relative`}>
        {!data?.isPlaceholder&&<span className='text-sm text-white bg-amber-600 rounded-md font-semibold py-1 px-3 absolute -bottom-5 mx-auto capitalize'>{(!data?.isTeam?'solo':'team')+' project'}</span>}
        <p className={`w-full text-center text-md ${data?.isPlaceholder?'text-gray-400':'text-black'} font-semibold`}>{data?.title}</p>
        <p className={`w-full text-center ${data?.isPlaceholder?'text-gray-400':'text-gray-700'} text-sm`}>{data?.subtitle}</p>
        {data?.challenge&&(<p onClick={() => setShowTag(!showTag)} className='cursor-pointer w-full text-center text-sm text-medium underline text-red-500'>{showTag?'Hide':'Show'} Challenges</p>)}
        {
          showTag && (
            <>
              <div className='absolute bottom-20 bg-red-100 border-2 border-red-500 rounded-lg py-1 px-2 min-w-[150px] flex items-center justify-center'>
                <p className='text-black text-sm w-full text-center'>{data?.challenge}</p>
              </div>
              {
                data?.subtitle && (
                  <div className='absolute top-20 bg-green-100 border-2 border-green-500 rounded-lg py-1 px-2 min-w-[150px] flex items-center justify-center'>
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

export default ProjectBlock