import React from 'react';
import { BaseEdge, EdgeLabelRenderer, EdgeProps, getBezierPath, useReactFlow } from 'reactflow';

export const DeletableEdge: React.FC<EdgeProps> = ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
    label,
}) => {
    const { setEdges } = useReactFlow();
    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    const onEdgeClick = (evt: React.MouseEvent, id: string) => {
        evt.stopPropagation();
        setEdges((edges) => edges.filter((e) => e.id !== id));
    };

    // Determine color and style based on edge properties or label
    let strokeColor = '#94a3b8'; // Default slate-400
    let isAnimated = true;
    let strokeDasharray = '5,5'; // Default dashed

    if (label === 'Approved' || label === 'Success') {
        strokeColor = '#22c55e'; // Green-500
        strokeDasharray = '0'; // Solid
    } else if (label === 'Rejected' || label === 'Error') {
        strokeColor = '#ef4444'; // Red-500
        strokeDasharray = '0'; // Solid
    }

    const finalStyle = {
        ...style,
        stroke: strokeColor,
        strokeWidth: 2,
        strokeDasharray: strokeDasharray,
        animation: isAnimated ? 'dashdraw 0.5s linear infinite' : undefined, // Custom animation class if needed, or rely on React Flow's 'animated' prop
    };

    return (
        <>
            <BaseEdge path={edgePath} markerEnd={markerEnd} style={finalStyle} />
            <EdgeLabelRenderer>
                <div
                    style={{
                        position: 'absolute',
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                        pointerEvents: 'all',
                        zIndex: 10,
                    }}
                    className="nodrag nopan flex flex-col items-center gap-1 group"
                >
                    {/* Label (Branch A, B, C...) */}
                    {label && (
                        <div
                            className="px-2 py-0.5 rounded-lg shadow-sm text-[10px] font-black uppercase tracking-widest border"
                            style={{
                                backgroundColor: 'white',
                                color: strokeColor,
                                borderColor: strokeColor
                            }}
                        >
                            {label}
                        </div>
                    )}

                    {/* Delete Action */}
                    <button
                        className="w-6 h-6 bg-white border border-rose-200 text-rose-500 rounded-full flex items-center justify-center hover:bg-rose-50 hover:border-rose-300 shadow-sm transition-all opacity-0 group-hover:opacity-100"
                        onClick={(event) => onEdgeClick(event, id)} // Fix: ensure id is passed correctly
                        title="Remover conexão"
                    >
                        <span className="material-symbols-outlined text-[14px]">close</span>
                    </button>
                </div>
            </EdgeLabelRenderer>
        </>
    );
};
