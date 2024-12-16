
import { useCallback, useState } from 'react';
import { Handle, Position } from '@xyflow/react';

function CertBlock({
  data
}) {

    const [showTag, setShowTag] = useState(false)

    function getDomain(url) {
        // Use a regular expression to remove protocols and slashes
        return url.replace(/(^\w+:|^)\/\//, '').split('/')[0];
    }

    // console.log(new Date(data?.year+'-01'));
    

  return (
    <>
      {data?.isTarget&&(<Handle type={data?.isReverse?'source':'target'} position={Position.Left} id="a" />)}
      <div className={`border-2 ${data?.isPlaceholder?'opacity-75':'border-teal-500'} p-3 rounded-lg max-w-[300px] bg-white flex flex-col ${data?.isPlaceholder?'flex-col-reverse':''} items-center space-y-1 relative`}>
        {/* {!data?.isPlaceholder&&<span className='text-sm text-white bg-teal-600 rounded-md font-semibold py-1 px-3 absolute -bottom-5 mx-auto'>{new Date(data?.year+'-01')?.getFullYear()}</span>} */}
        <p className={`w-full text-center ${data?.isPlaceholder?'text-gray-700':'text-gray-700'} text-sm`}>{data?.subtitle}</p>
        <p className={`'w-full text-center text-md ${data?.isPlaceholder?'text-gray-600':'text-black'} font-semibold'`}>{data?.title}</p>
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

export default CertBlock