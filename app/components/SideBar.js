import React from 'react';
import { useDnD } from './DndContext';
import enterIcon from '../assets/img/enter.png' 
import escIcon from '../assets/img/esc.png' 
import deleteIcon from '../assets/img/delete.png' 
import spaceIcon from '../assets/img/space.png' 

export default () => {
  const [_, setType] = useDnD();

  const onDragStart = (event, nodeType) => {
    setType(nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className='border-2 bg-white rounded-lg absolute top-[100px] left-[40px] p-3 max-w-[300px]'>
      <h2 className='w-full text-left font-bold tracking-tighter text-black text-4xl py-1'>
        find What's Next for you 🤔
      </h2> 
      <div className="w-full text-left text-sm text-gray-600 py-2">Drag pathway to the pane on the right.</div>
      <div className="cursor-pointer rounded-lg border-2 border-blue-500 py-1 my-2 flex flex-row items-center justify-center space-x-2" onDragStart={(event) => onDragStart(event, 'education')} draggable>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
        </svg>
        <span className='text-sm text-black text-left'>Education</span>
      </div>
      <div className="cursor-pointer rounded-lg border-2 border-black py-1 my-2 flex flex-row items-center justify-center space-x-2" onDragStart={(event) => onDragStart(event, 'work')} draggable>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
        </svg>
        <span className='text-sm text-black text-left'>Work</span>
      </div>
      <div className="cursor-pointer rounded-lg border-2 border-teal-500 py-1 my-2 flex flex-row items-center justify-center space-x-2" onDragStart={(event) => onDragStart(event, 'certification')} draggable>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" />
        </svg>
        <span className='text-sm text-black text-left'>Certification</span>
      </div>
      <div className="cursor-pointer rounded-lg border-2 border-amber-500 py-1 my-2 flex flex-row items-center justify-center space-x-2" onDragStart={(event) => onDragStart(event, 'project')} draggable>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776" />
        </svg>
        <span className='text-sm text-black text-left'>Project</span>
      </div>
      <div className='w-full py-2 flex flex-col items-center border-t-2 pt-4 my-2 space-y-2'>
        <div className='w-full flex flex-row items-center space-x-2'>
          <span className='text-sm text-black'>Press</span>
          <img 
            className='contain h-[30px]'
            src={enterIcon.src}
          />
          <p className='text-sm text-left'>to see what's next</p>
        </div>
        <div className='w-full flex flex-row items-center space-x-2'>
          <span className='text-sm text-black'>Press</span>
          <img 
            className='contain h-[30px]'
            src={escIcon.src}
          />
          <p className='text-sm text-left'>to reset</p>
        </div>
        <div className='w-full flex flex-row items-center space-x-2'>
          <span className='text-sm text-black'>Press</span>
          <img 
            className='contain h-[30px]'
            src={spaceIcon.src}
          />
          <p className='text-sm text-left'>to use AI</p>
        </div>
        <div className='w-full flex flex-row items-center space-x-2'>
          <span className='text-sm text-black'>Press</span>
          <img 
            className='contain h-[30px]'
            src={deleteIcon.src}
          />
          <p className='text-sm text-left'>to delete</p>
        </div>
      </div>
    </aside>
  );
};
