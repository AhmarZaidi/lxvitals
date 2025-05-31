interface ProgressBarProps {
  percentage: number | null;
  type?: 'success' | 'warning' | 'danger';
}

export default function ProgressBar({ percentage, type = 'success' }: ProgressBarProps) {
  // Ensure percentage is between 0 and 100
  const safePercentage = percentage ? Math.min(Math.max(0, percentage), 100) : 0;
  
  return (
    <div className="progress">
      <div 
        className={`progress-bar ${type}`} 
        style={{ width: `${safePercentage}%` }}
      ></div>
    </div>
  );
}