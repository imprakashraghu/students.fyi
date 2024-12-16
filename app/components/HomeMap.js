import { ReactFlow,
  Background,
  Controls,
  MiniMap,
  useReactFlow,
  useNodesState, } from '@xyflow/react'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import '@xyflow/react/dist/style.css'
import HomeBlock from './roadmap/HomeBlock';
import supabase from '@/supbase'
import toast from 'react-hot-toast';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

function HomeMap({
    keyword=null
}) {

    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const initialNodes = [
        {
            id: 'node-1',
            position: { x: 200, y: 200 },
            // type: 'homeBlock',
            data: {
                label: 'Full Stack Developer',
                isSource: true,
                isTarget: true,
                isTDirection: 'Top',
                isSDirection: 'Bottom'
            }
        },
        {
            id: 'node-2',
            position: { x: 500, y: 100 },
            // type: 'homeBlock',
            data: {
                label: 'Backend Developer',
                isSource: true,
                isTarget: true,
                isTDirection: 'Top',
                isSDirection: 'Bottom'
            },
            style: {
                width: 100,
                height: 50
            }
        },
        {
            id: 'node-3',
            position: { x: 750, y: 300 },
            // type: 'homeBlock',
            data: {
                label: 'Front End Developer',
                isSource: true,
                isTarget: true,
                isTDirection: 'Top',
                isSDirection: 'Bottom'
            }
        },
        {
            id: 'node-4',
            position: { x: 750, y: 150 },
            // type: 'homeBlock',
            data: {
                label: 'Data Engineer',
                isSource: true,
                isTarget: true,
                isTDirection: 'Top',
                isSDirection: 'Bottom'
            }
        },
        {
            id: 'node-5',
            position: { x: 260, y: 500 },
            // type: 'homeBlock',
            data: {
                label: 'Data Analyst',
                isSource: true,
                isTarget: true,
                isTDirection: 'Top',
                isSDirection: 'Bottom'
            }
        },
        {
            id: 'node-6',
            position: { x: 200, y: 350 },
            // type: 'homeBlock',
            data: {
                label: 'Machine Learning Engineer',
                isSource: true,
                isTarget: true,
                isTDirection: 'Top',
                isSDirection: 'Bottom'
            }
        },
        {
            id: 'node-7',
            position: { x: 1000, y: 350 },
            // type: 'homeBlock',
            data: {
                label: 'DevOps Engineer',
                isSource: true,
                isTarget: true,
                isTDirection: 'Top',
                isSDirection: 'Bottom'
            }
        }
    ]

    const nodeTypes = useMemo(() => ({ homeBlock: HomeBlock }), []);
    const [focusId, setFocusId] = useState(null)

    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const { getNodes, getIntersectingNodes, fitView } = useReactFlow();

    const onNodeDrag = useCallback((_, node) => {
        const intersections = getIntersectingNodes(node).map((n) => n.id);
            setNodes((ns) =>
                ns.map((n) => ({
                    ...n,
                    className: intersections.includes(n.id) ? 'highlight' : '',
                })),
            );
    }, []);

    useEffect(() => {
        if (keyword && pathname === '/') {
            setFocusId('node-'+keyword)
        } else if (searchParams?.get('key')) {
            setTimeout(() => setFocusId('node-'+searchParams?.get('key')), 1000)
        }
    }, [keyword, pathname, searchParams])
    

    function generateRandomPositions(windowWidth, windowHeight, numPositions, distance = 100) {
        const positions = [];
        const centerX = windowWidth / 2;
        const centerY = windowHeight / 2;

        for (let i = 0; i < numPositions; i++) {
            let x, y, isValid;

            do {
            // Generate random x and y positions within window width
            x = Math.floor(Math.random() * (windowWidth - 500)) + 50; // Adjusting to keep positions within bounds
            y = Math.floor(Math.random() * (windowWidth - 100)) + 50;

            // Check distance from all other positions
            isValid = positions.every(([px, py]) => {
                return Math.sqrt((px - x) ** 2 + (py - y) ** 2) >= distance;
            });

            } while (!isValid);

            // Add position to array after validation
            positions.push([x, y]);
        }

        return positions;
    }

    function generateRandomSize(textLength) {
     // Calculate width and height within range of 100 to 200 based on text length
        const width = Math.floor(100 + Math.random() * Math.min(100, textLength * 100));
        const height = Math.floor(100 + Math.random());

        return { width, height };
    }

    useEffect(() => {
        async function getProfessions() {
            const { error, data } = await supabase.from('professions').select('*')
            if (error) return toast.error(error.message)
            const positions = generateRandomPositions(window.innerWidth, window.innerHeight, data.length)
        // alert(data.length)
            buildNodes(data, positions)
        }
        getProfessions()
    }, [])

    useEffect(() => {
        if (focusId) {
            fitView({ nodes: [{ id: focusId }], maxZoom: 3, duration: 600 })
            setFocusId(null);
        }
    }, [focusId, fitView]);

    function buildNodes(arr, positions) {
        let result = []
        arr.map((item, index) => {
            const sizes = generateRandomSize(item.name.length)
            const positionForNode = positions[index]
            let node = {
                id: 'node-'+item.id,
                position: { x: 0 || positionForNode[0], y:   0||positionForNode[1] },
                // type: 'homeBlock',
                data: {
                    label: item.name
                },
                style: {
                    width: sizes.width,
                    height: 55
                }
            }
            result.push(node)
        })
        setNodes(result)
    }

  return (
    <div className='w-full h-screen bg-white'>
       <ReactFlow
            defaultViewport={{ x: 0, y: 0, zoom: 2  }}
            nodes={nodes}
            edges={[]}
            onNodeClick={(_,node) => {  
                router.push('/view/'+node?.data?.label?.replace(/ /g,'-'))
            }}
            onNodesChange={(changes) => {
                // call the actual change handler to apply the node changes to your nodes
                onNodesChange(changes);

                // loop through the changes and check for a dimensions change that relates to the node we want to focus
                changes.forEach((change) => {  
                    
                    if (
                        change.type === "dimensions" &&
                        focusId === change.id &&
                        change.dimensions &&
                        change.dimensions.height > 0 &&
                        change.dimensions.width > 0
                    ) {
                        fitView({
                            nodes: [{ id: focusId, }],
                            duration: 500
                        });

                        // reset the focus id so we don't retrigger fit view when the dimensions of this node happen to change
                        setFocusId(null);
                    }
                });
            }}
            onNodeDrag={onNodeDrag}
            className="intersection-flow"
            minZoom={0.5}
            maxZoom={4}
            zoomOnPinch={true}
            selectNodesOnDrag={false}
        >
            <Background />
        </ReactFlow>
    </div>
  )
}

export default HomeMap