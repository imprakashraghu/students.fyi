import { useCallback, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
 
const handleStyle = { left: 10 };

function ChallengeBlock({
  data
}) {

  const [showTag, setShowTag] = useState(data?.isPlaceholder||false)

  return (
    <>
      {data?.isTarget&&(<Handle type={data?.isReverse?'source':'target'} position={Position.Left} id="a" />)}
      <div onClick={() => setShowTag(!showTag)} className={`relative border-2 ${data?.isPlaceholder?'opacity-50 border-dashed':'bg-red-100 border-red-500'} p-2 w-[50px] h-[50px] rounded-full  flex flex-col items-center justify-center space-y-2`}>
        <p className='w-full text-center text-xl text-black font-medium'>🤯</p>
        {
          showTag && (
            <>
              <div className='absolute bottom-14 bg-red-100 border-2 border-red-500 rounded-lg py-1 px-2 min-w-[150px] flex items-center justify-center'>
                <p className='text-black text-sm w-full text-center'>{data?.title}</p>
              </div>
              {
                data?.subtitle && (
                  <div className='absolute top-12 bg-green-100 border-2 border-green-500 rounded-lg py-1 px-2 min-w-[150px] flex items-center justify-center'>
                    <p className='text-black text-sm w-full text-center'>{data?.subtitle}</p>
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

export default ChallengeBlock