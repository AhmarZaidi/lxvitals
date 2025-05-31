import { ReactNode, useState } from 'react';
import styles from '../styles/DashboardCard.module.scss';

interface DashboardCardProps {
    title: string;
    children: ReactNode;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
    dragId: string;
    onDragReorder: (newOrder: string[]) => void;
    fullWidth?: boolean;
}

export default function DashboardCard({
    title,
    children,
    isCollapsed,
    onToggleCollapse,
    dragId,
    onDragReorder,
    fullWidth = false
}: DashboardCardProps) {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragStart = (e: React.DragEvent) => {
        e.dataTransfer.setData('text/plain', dragId);
        setIsDragging(true);
    };

    const handleDragEnd = () => {
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const draggedId = e.dataTransfer.getData('text/plain');
        if (draggedId !== dragId) {
            const order = ['cpu', 'gpu', 'memory', 'drives'];
            const draggedIndex = order.indexOf(draggedId);
            const targetIndex = order.indexOf(dragId);

            if (draggedIndex !== -1 && targetIndex !== -1) {
                const newOrder = [...order];
                newOrder.splice(draggedIndex, 1);
                newOrder.splice(targetIndex, 0, draggedId);
                onDragReorder(newOrder);
            }
        }
    };

    return (
        <div
            className={`card ${fullWidth ? 'full-width' : ''} ${isDragging ? 'dragging' : ''} ${isCollapsed ? 'card-collapsed' : ''}`}
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <div className="card-header">
                <h2>{title}</h2>
                <button
                    onClick={onToggleCollapse}
                    className="collapse-toggle"
                >
                    {isCollapsed ?
                        <span>▼</span> :
                        <span>▲</span>
                    }
                </button>
            </div>
            <div className={`card-body ${isCollapsed ? 'hidden' : ''}`}>
                {children}
            </div>
        </div>
    );
}
