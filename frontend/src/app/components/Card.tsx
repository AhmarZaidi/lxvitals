import styles from '../styles/DashboardCard.module.scss';

interface CardProps {
    title: string;
    children: ReactNode;
}

export default function Card({
    title,
    children,
}: CardProps) {
    return (
        <div className="general-card">
            <div className="general-card-header">
                <h2>{title}</h2>
            </div>
            <div className="general-card-body">
                {children}
            </div>
        </div>
    );
}
