'use client';

import { Background, ReactFlow, useEdgesState, useNodesState } from '@xyflow/react'
 
import '@xyflow/react/dist/style.css'
import { useEffect, useMemo } from 'react'
import MainBlock from './roadmap/MainBlock';
import ChallengeBlock from './roadmap/ChallengeBlock';
import EduBlock from './roadmap/EduBlock';
import WorkBlock from './roadmap/WorkBlock';
import CertBlock from './roadmap/CertBlock';
import ProjectBlock from './roadmap/ProjectBlock';

function Roadmap({
    block=[],
    isEmpty=false
}) {

    const [nodes, setNodes, onNodesChange] = useNodesState([])
    const [edges, setEdges, onEdgesChange] = useEdgesState([])

    useEffect(() => {
        if (block?.length) {
            buildNodes()
        }
        return () => {}
    }, [block])

    function buildMainBlock(blck, offsetX=100, offsetY=70, id, title, subtitle=null, isTarget=false, isSource=true, logo=null, isReverse=false) {
        return {
            id: id,
            type: blck?.type === 'education' ? 'eduBlock' : blck?.type==='work' ? 'workBlock' : blck?.type==='certification'? 'certBlock' : blck?.type==='project' ? 'proBlock' :'mainBlock',
            position: { x: offsetX, y: offsetY},
            data: {
                title: title,
                subtitle: subtitle,
                isTarget: isTarget,
                isSource: isSource,
                logo: logo,
                isReverse: isReverse,
                startDate: blck?.start_date || null,
                endDate: blck?.end_date || null,
                provider: blck?.provider || null,
                year: blck?.year || null,
                isTeam: blck?.isTeam || null,
                type: blck?.type,
                challenge: blck?.challenge||null,
                solution: blck?.solution||null
            }
        }
    }

    function buildChallengeBlock(blck, id, offsetX=100, offsetY=90, isTarget=false, isSource=true, isReverse=false) {
        return {
            id: id,
            type: 'challengeBlock',
            position: { x: offsetX, y: offsetY },
            data: {
                isTarget: isTarget,
                isSource: isSource,
                isReverse: isReverse,
                title: blck?.description,
                subtitle: blck?.solution||null
            }
        }
    }

    function getTitleByType(block) {
        if (block.type === 'education') return block.courses?.name
        else if (block.type === 'work') return block.job_title
        else if (block.type === 'project') return block?.name
        else if (block.type === 'certification') return block.name
        else return block?.description
    }

    function getSubTitleByType(block) {
        if (block.type === 'education') {
            return `Attended ${block.degree} degree at ${block.name.name}`
        }
        else if (block.type === 'work') {
            return `${block.job_type} at ${block.name.name}`
        }
        else if (block.type === 'project') {
            return `Project done using ${block?.techUsed}`
        }
        else if (block.type === 'certification') {
            return `Certified by ${block.provider?.name}`
        }
    }

    function buildNodes() {
        let offsetX = 100
        let offsetY = 100
        let result = []
        let steped = false
        block.map((block, index) => {            
            if (offsetX > (window.innerWidth-200) && !steped) {
                offsetY += 150
                offsetX -= 350
                steped = true
            }
            if (steped && offsetX < 0) {
                steped = false
                offsetY += 150
                offsetX += 350
            }
            if (block.type !== 'challenge') {
                result.push(buildMainBlock(block, offsetX, offsetY, `node-${index+1}`, getTitleByType(block), getSubTitleByType(block), index>0, true, block?.url, offsetY===250))
                if (steped) {
                    offsetX -= (getTitleByType(block).length * 4) + 200
                } else {
                    offsetX += (getSubTitleByType(block).length * 4) + 200
                }               
            } else {
                result.push(buildChallengeBlock(block, `node-${index+1}`, offsetX, offsetY, index>0, true, offsetY===250))
                if (steped) {
                    offsetX -=  (getTitleByType(block).length * 4) + 200
                } else {
                    offsetX += (getTitleByType(block).length * 4) + 200
                } 
            }     
        })
        buildEdges(result)
        setNodes(result)
    }

    function buildEdges(nodesBuilt) {
        let result = []
        nodesBuilt.map((_, index) => {
            let edgeId = `edge-${index+1}`
            if (index < nodesBuilt.length-1) {
                result.push({
                    id: edgeId,
                    source: nodesBuilt[index].id,
                    target: nodesBuilt[index+1].id
                })
            }
        })
        setEdges(result)
    }

    const nodeTypes = useMemo(() => ({ mainBlock: MainBlock, challengeBlock: ChallengeBlock, eduBlock: EduBlock, workBlock: WorkBlock, certBlock: CertBlock, proBlock: ProjectBlock }), []);

  return (  
    <div className='w-full h-[100vh] py-4'>
        <ReactFlow 
            nodes={nodes} 
            edges={edges} 
            nodeTypes={nodeTypes} 
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            defaultViewport={isEmpty?{ x: 0, y: 0, zoom: 3 }:{ x: 0, y: 0, zoom: 1 }}
            minZoom={0.5}
            maxZoom={4}
            onNodeClick={(_, node) => {
                if (node?.label?.type === 'challenge') {

                }
            }}
        >
            <Background />
        </ReactFlow>
    </div>
  )
}

export default Roadmap