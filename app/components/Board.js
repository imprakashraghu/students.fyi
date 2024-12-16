import React, { useRef, useCallback, useMemo, useState, useEffect } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  useReactFlow,
  Background,
  useNodesData,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import Sidebar from './SideBar';
import { useDnD } from './DndContext';
import EduBlock from './simulator/EduBlock';
import EduBlockPlaceholder from './roadmap/EduBlock'
import WrkBlockPlaceholder from './roadmap/WorkBlock'
import CertBlockPlaceholder from './roadmap/CertBlock'
import ProBlockPlaceholder from './roadmap/ProjectBlock'
import ChaPlaceholder from './roadmap/ChallengeBlock'
import supabase from '@/supbase'
import WorkBlock from './roadmap/WorkBlock';
import WrkBlock from './simulator/WrkBlock';
import CertBlock from './simulator/CertBlock';
import ProBlock from './simulator/ProBlock';
import RecBlock from './simulator/RecBlock';
import toast from 'react-hot-toast';
import loadingGif from '../assets/img/loading.gif'

let id = 0;
const getId = () => `dndnode_${id++}`;

export default function Board() {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { screenToFlowPosition, getNode, deleteElements, fitView, zoomTo } = useReactFlow();
  const [type] = useDnD();

  const [currentWorkingNode, setCurrentWorkingNode] = useState(null)
  const [currentWorkingEdge, setCurrentWorkingEdge] = useState(null)
  const [outcomes, setOutcomes] = useState([])

  const [AIResult, setAIResult] = useState([])
  const [aiLoading, setAILoading] = useState(false)

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [],
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    setCurrentWorkingNode(n => ({...n, x:event.clientX,y:event.clientY}))
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      // check if the dropped element is valid
      if (!type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const nowId = getId()
      
      const newNode = {
        id: nowId,
        type: type==='education'?'eduSim':type==='work'?'wrkSim':type==='certification'?'certSim':type==='project'?'proSim':type,
        position,
        data: { block_type: type, title: `${type} node`, isSource: true, isReverse: true },
      };

      setCurrentWorkingNode({id: nowId, x: position.x, y: position.y})

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, type],
  );

  const nodeTypes = useMemo(() => ({ recBlock: RecBlock, eduSim: EduBlock, wrkSim: WrkBlock, certSim: CertBlock, proSim: ProBlock, eduPlaceholder: EduBlockPlaceholder, workPlaceHolder: WrkBlockPlaceholder, certPlaceHolder: CertBlockPlaceholder, projectPlaceHolder: ProBlockPlaceholder, challengePlaceHolder: ChaPlaceholder }), []);

  const handleAllBlockTypes = async(data) => {
    const tCategories = new Set()
    data.map(item => tCategories.add(item.target_category))
    
    tCategories.forEach(async (category) => {
      if (category === 'education') {
        const nextPossibleOutcomes = await getEducationDataById(data.map(d => d.target_id)) 
        const outcomesE = nextPossibleOutcomes.map(npo => ({...npo, block_type: 'education'}))
        setOutcomes(outcomesE)
        showOutcomeNodeWithEdge(outcomesE[0], category)  
      } else if (category === 'work') {
        const nextPossibleOutcomes = await getWorkDataById(data.map(d => d.target_id)) 
        const outcomesW = nextPossibleOutcomes.map(npo => ({...npo, block_type: 'work'}))
        setOutcomes(outcomesW)
        showOutcomeNodeWithEdge(outcomesW[0], category)  
      } else if (category === 'certification') {
        const nextPossibleOutcomes = await getCertificationDataById(data.map(d => d.target_id)) 
        const outcomesC = nextPossibleOutcomes.map(npo => ({...npo, block_type: 'certification'}))
        setOutcomes(outcomesC)
        showOutcomeNodeWithEdge(outcomesC[0], category)  
      } else if (category === 'project') {
        const nextPossibleOutcomes = await getProjectDataById(data.map(d => d.target_id)) 
        const outcomesP = nextPossibleOutcomes.map(npo => ({...npo, block_type: 'project'}))
        setOutcomes(outcomesP)
        showOutcomeNodeWithEdge(outcomesP[0], category)  
      } else if (category === 'challenge') {
        const nextPossibleOutcomes = await getChallengeDataById(data.map(d => d.target_id))
        const outcomeCC = nextPossibleOutcomes.map(npo => ({...npo, block_type: 'challenge'})) 
        setOutcomes(outcomeCC)
        showOutcomeNodeWithEdge(outcomeCC[0], category)  
      }
     }) 
  }
  
  const predictNextOutcome = async (type, query) => {
    if (type === 'education') {
      const eduData = await getEducationData(query?.course, query?.degree, 'id')
      const { error, data } = await supabase.from('transition_orders').select('*').eq('source_category',type).in('source_id', eduData.map(e => e.id))
      if (error) return new Error('error getting edu matches')
      // check for other block types
      handleAllBlockTypes(data)
    } else if (type === 'work') {
      const wrkData = await getWorkData(query?.job_title, query?.job_type, 'id')
      const { error, data } = await supabase.from('transition_orders').select('*').eq('source_category',type).in('source_id', wrkData.map(e => e.id))
      if (error) return new Error('error getting wrk matches')
      // check for other block types
      handleAllBlockTypes(data) 
    } else if (type === 'certification') {
      const certData = await getCertificationData(query?.name, query?.provider, 'id')
      const { error, data } = await supabase.from('transition_orders').select('*').eq('source_category',type).in('source_id', certData.map(e => e.id))
      if (error) return new Error('error getting cert matches')
      // check for other block types
      handleAllBlockTypes(data) 
    } else if (type === 'project') {
      const proData = await getProjectData(query?.techUsed, 'id')
      const { error, data } = await supabase.from('transition_orders').select('*').eq('source_category',type).in('source_id', proData.map(e => e.id))
      if (error) return new Error('error getting project matches')
      // check for other block types
      handleAllBlockTypes(data) 
    }
  }

  function getNodeType(type, accept=false) {
    if (type === 'education') {
      return 'eduPlaceholder'
    } else if (type === 'work') {
      return 'workPlaceHolder'
    } else if (type === 'certification') {
      return 'certPlaceHolder'
    } else if (type === 'project') {
      return 'projectPlaceHolder'
    } else if (type === 'challenge') {
      return 'challengePlaceHolder'
    }
  }

  function getTitleByType(obj) {
    if (obj.block_type === 'education') {
      return `People used to do a ${obj?.degree} in`
    } else if (obj.block_type === 'work') {
      return `People usually do ${obj?.job_type}`
    } else if (obj.block_type === 'certification') {
      return `People usually get ${obj?.name} certificate`
    } else if (obj.block_type === 'project') {
      return `People used to create project like ${obj?.name}`
    } else if (obj.block_type === 'challenge') {
      return `People used to face challenge like ${obj?.description}`
    }
  }

  function getSubtitleByType(obj) {
    if (obj.block_type === 'education') {
      return `${obj?.course?.name}`
    } else if (obj.block_type === 'work') {
      return `as ${obj?.job_title}`
    } else if (obj.block_type === 'certification') {
      return `at ${obj?.provider?.name}`
    } else if (obj.block_type === 'project') {
      return `by using ${obj?.techUsed}`
    } else if (obj.block_type === 'challenge') {
      return obj?.solution?`but sometimes solve by, ${obj?.solution}`:null
    }
  }

  function showOutcomeNodeWithEdge(outcome, type, accept=false) {
    const newId = getId()
    const newNode = {
      id: newId,
      type: getNodeType(type, accept),
      position: { x: currentWorkingNode?.x+400, y: currentWorkingNode?.y },
      data: { block_type: outcome.block_type, data: outcome, title: getTitleByType(outcome), subtitle: getSubtitleByType(outcome), isReverse: true, isPlaceholder: accept?false:true, isTarget: true, isSource: true },
    };
    
    
    const edgeId = getId()
    setCurrentWorkingNode({...currentWorkingNode, targetNodex:currentWorkingNode?.x+400, targetNodey: currentWorkingNode.y,  targetNode: newId})

    const newEdge = {
      id: edgeId,
      target: currentWorkingNode?.id,
      source: newId,
      animated: accept?false:true,
      type: 'default',
    }
    setCurrentWorkingEdge({ id: edgeId, targetId: outcome.id, nodeId: newId })

    setNodes((nds) => nds.concat(newNode));
    setEdges((eds) => eds.concat(newEdge));
  }

  async function getEducationData(course, degree, columns=null) {
    const { error, data } = await supabase.from('education').select(columns||'*').eq('course', course).eq('degree', degree)
    if (error) return new Error('error getting edu data')
    return data || []
  }

  async function getWorkData(job_title, job_type, columns=null) {
    const { error, data } = await supabase.from('work').select(columns||'*').eq('job_type', job_type).eq('job_title', job_title)
    if (error) return new Error('error getting work data')
    return data || []
  }

  async function getCertificationData(name, provider, columns=null) {
    const { error, data } = await supabase.from('certification').select(columns||'*').eq('provider', provider).ilike('name', `%${name}%`)
    if (error) return new Error('error getting certification data')
    return data || []
  }

  async function getProjectData(techUsed, columns=null) {
    const { error, data } = await supabase.from('project').select(columns||'*').contains('techUsed', techUsed?.indexOf(',')===-1?[techUsed.toLowerCase()?.trim()]:techUsed.split(',').map(tech => tech.toLowerCase()?.trim()))
    if (error) return new Error('error getting project data')
    return data || []
  }

  async function getWorkDataById(ids) {
    const { error, data } = await supabase.from('work').select('*').in('id', ids)
    if (error) return new Error('error getting work data')
    return data
  }  

  async function getEducationDataById(ids) {
    const { error, data } = await supabase.from('education').select('*,course(*)').in('id', ids)
    if (error) return new Error('error getting education data')
    return data
  }  

  async function getCertificationDataById(ids) {
    const { error, data } = await supabase.from('certification').select('*,provider(*)').in('id', ids)
    if (error) return new Error('error getting certification data')
    return data
  }  

  async function getProjectDataById(ids) {
    const { error, data } = await supabase.from('project').select('*').in('id', ids)
    if (error) return new Error('error getting project data')
    return data
  }  

  async function getChallengeDataById(ids) {
    const { error, data } = await supabase.from('challenge').select('*').in('id', ids)
    if (error) return new Error('error getting challenge data')
    return data
  }  

  function buildAIRecomendationNodes(arr) {
    const result = []
    const resultE = []
    let yCounter = -200
    arr.map(item => {
      const newId = getId()
      const newNode = {
        id: newId,
        type: 'recBlock',
        position: { x: currentWorkingNode?.targetNodex+320, y: currentWorkingNode?.targetNodey+(yCounter) },
        data: { action: item.action , references: item.course_or_website_references||null, description: item.description||null},
      };
      const newEdge = {
        id: getId(),
        target: currentWorkingNode?.targetNode,
        source: newId
      }
      resultE.push(newEdge)
      result.push(newNode)
      yCounter+=200
    })
    setNodes(nds => nds.concat(result))
    setEdges(eds => eds.concat(resultE))
    setTimeout(() => {
      fitView()
    },2000)
  }

  function getTitleByNodeType(obj) {
    if (obj?.data?.block_type === 'education') {
      return obj?.data?.degree || obj?.data?.data?.degree
    } else if (obj?.data?.block_type === 'work') {
      return obj?.data?.job_type || obj?.data?.data?.job_type
    } else if (obj?.data?.block_type === 'certification') {
      return obj?.data?.name || obj?.data?.data?.name
    } else if (obj?.data?.block_type === 'project') {
      return obj?.data?.name || obj?.data?.data?.name || ''
    }
  }

  function getsubTitleByNodeType(obj) {
    if (obj?.data?.block_type === 'education') {
      return obj?.data?.course || obj?.data?.data?.course
    } else if (obj?.data?.block_type === 'work') {
      return obj?.data?.job_title || obj?.data?.data?.job_title
    } else if (obj?.data?.block_type === 'certification') {
      return obj?.data?.providerName || obj?.data?.data?.provider?.name
    } else if (obj?.data?.block_type === 'project') {
      return obj?.data?.techUsed|| obj?.data?.data?.techUsed?.join(',')
    }
  }

  const handleEnterAndEscPress = (event) => {
    if (event.keyCode === 13) {
      // enter pressed
      if (nodes.length % 2 !== 0 && currentWorkingEdge) {
        setCurrentWorkingEdge(null)
        setOutcomes([])
      } else if (currentWorkingEdge?.id) {
        // next outcome display
        deleteElements({nodes:[{id: currentWorkingEdge?.nodeId}], edges:[{id: currentWorkingEdge?.id}]})
        let newIndex = outcomes.findIndex(val => val?.id === currentWorkingEdge?.targetId)
        if (newIndex < outcomes.length-1) {
            newIndex++
        } else {
            newIndex=0
        }
        
        showOutcomeNodeWithEdge(outcomes[newIndex], outcomes[newIndex]?.block_type)
      } else if (currentWorkingNode?.id) {
        // first outcome display
        const curNode = getNode(currentWorkingNode?.id)

        if (curNode?.type === 'eduSim' && curNode?.data?.degree && curNode?.data?.course) {
          predictNextOutcome('education', { course: curNode?.data?.course, degree: curNode?.data?.degree })
        } else if (curNode?.type === 'wrkSim' && curNode?.data?.job_type && curNode?.data?.job_title) {
          predictNextOutcome('work', { job_title: curNode?.data?.job_title, job_type: curNode?.data?.job_type })
        } else if (curNode?.type === 'certSim' && curNode?.data?.provider && curNode?.data?.name) {
          predictNextOutcome('certification', { provider: curNode?.data?.provider, name: curNode?.data?.name })
        } else if (curNode?.type === 'proSim' && curNode?.data?.techUsed) {
          predictNextOutcome('project', { techUsed: curNode?.data?.techUsed })
        } else if (curNode?.type === 'eduPlaceholder' && curNode?.data?.title && curNode?.data?.subtitle) {
          predictNextOutcome('education', { course: curNode?.data?.title, degree: curNode?.data?.subtitle })
        } else if (curNode?.type === 'workPlaceHolder' && curNode?.data?.title && curNode?.data?.subtitle) {
          predictNextOutcome('work', { job_title: curNode?.data?.title, job_type: curNode?.data?.subtitle })
        } else if (curNode?.type === 'certPlaceHolder' && curNode?.data?.title && curNode?.data?.subtitle) {
          predictNextOutcome('certification', { name: curNode?.data?.title, provider: curNode?.data?.subtitle })
        } else if (curNode?.type === 'projectPlaceHolder' && curNode?.data?.title && curNode?.data?.subtitle) {
          predictNextOutcome('project', { techUsed: curNode?.data?.title })
        }
      } else toast.error('Add a block to start!')
    }
    if (event.keyCode === 27) {
      // esc pressed
      setNodes([])
      setEdges([])
      setCurrentWorkingEdge(null)
      setCurrentWorkingNode(null)
      setOutcomes([])
      toast.success('Platform Reset Successful')
    }
    if (event.keyCode === 32) {
      // spacebar pressed
      if (nodes.length === 1) return
      if (nodes.length == 2) {
        if (nodes[0]?.data?.block_type === 'challenge' || nodes[1]?.data?.block_type === 'challenge') {
          return toast.error("Sorry! AI cannot work with this pathway")
        }
        setAILoading(true)
        fetch('/api/ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify([{block_type: nodes[0]?.data?.block_type, title: getTitleByNodeType(nodes[0]) ,subtitle: getsubTitleByNodeType(nodes[0])},{block_type: nodes[1]?.data?.block_type, title: getTitleByNodeType(nodes[1]) ,subtitle: getsubTitleByNodeType(nodes[1])}])
        }).then(res => res.json())
        .then(response => {
            buildAIRecomendationNodes(response?.data?.result||[])
        })
        .catch(err => {
          console.log(err);
          toast.error(err?.message||'Try Again!')
        }).finally(_ => setAILoading(false))

      } else toast.error('AI is supported only with 2 working pathways')
    }
  }
  
  return (
    <div className="relative w-full h-screen flex flex-col" tabIndex={0} onKeyDown={e => handleEnterAndEscPress(e)}>
      <div className="w-full h-screen" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          maxZoom={4}
          snapToGrid={true}
          defaultViewport={{x:0,y:0,zoom:1}}
        >
          <Background />
          <Controls position='right-bottom' />
        </ReactFlow>
      </div>
      <Sidebar />
      {aiLoading&&(<img
        src={loadingGif.src}
        className='absolute bottom-0 contain w-[200px] h-[300px] mx-auto invert'
      />)}
    </div>
  );
};
