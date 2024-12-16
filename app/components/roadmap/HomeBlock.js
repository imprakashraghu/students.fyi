import { useCallback } from 'react';
import { Handle, Position } from '@xyflow/react';

function HomeBlock({
  data
}) {
  return (
    <>
      {data?.isTarget&&(<Handle type={data?.isReverse?'source':'target'} position={Position[data?.isTDirection||'Left']} id="a" />)}
      <div className='cursor-pointer'>
        <p className=''>{data?.title}</p>
      </div>
      {data?.isSource&&(<Handle type={data?.isReverse?'target':'source'} position={Position[data?.isSDirection||'Right']} id="b" />)}
    </>
  )
}

export default HomeBlock