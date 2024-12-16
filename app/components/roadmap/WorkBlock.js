
import { useCallback, useState } from 'react';
import { Handle, Position } from '@xyflow/react';

function WorkBlock({
  data
}) {

  const [showTag, setShowTag] = useState(false)

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

  return (
    <>
      {data?.isTarget&&(<Handle type={data?.isReverse?'source':'target'} position={Position.Left} id="a" />)}
      <div className={`border-2 ${!data?.isPlaceholder&&'border-black'} p-3 rounded-lg min-w-[200px] max-w-[300px] bg-white flex flex-col items-center space-y-1 relative'`}>
        {(!data?.isPlaceholder&&data?.startDate)&&(<span className='text-sm text-white bg-black rounded-md font-semibold p-1 absolute -top-3 -right-2'>{dateDifference(data?.startDate, data?.endDate)}</span>)}
        {
          data?.logo && (
            <img className='contain h-8 rounded-md' src={`https://img.logo.dev/${getDomain(data?.logo)}?token=pk_VnN61RuTS9ixac-W9EsxHA`} />
          )
        }
        <p className={`w-full text-center text-md ${data.isPlaceholder?'text-gray-400':'text-black'} font-semibold`}>{data?.title}</p>
        <p className={`w-full text-center ${data.isPlaceholder?'text-gray-400':'text-gray-700'} text-sm`}>{data?.subtitle}</p>
        {data?.challenge && (<p onClick={() => setShowTag(!showTag)} className='cursor-pointer w-full text-center text-sm text-medium underline text-red-500'>{showTag?'Hide':'Show'} Challenges</p>)}
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

export default WorkBlock