'use client';
import React, { useRef, useCallback } from 'react';
import {
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import Header from '../components/Header'
import { DnDProvider } from '../components/DndContext';
import Board from '../components/Board';

export default function Simulator() {

  return (
    <div className='w-full h-screen relative'>
        <Header />
        <div
            className='w-full h-screen bg-white relative'
        >
            <ReactFlowProvider>
                <DnDProvider>
                    <Board />
                </DnDProvider>
            </ReactFlowProvider>
        </div>
    </div>
  )
}