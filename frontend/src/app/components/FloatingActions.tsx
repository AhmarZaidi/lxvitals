import Link from 'next/link';

interface FloatingActionsProps {
//   fetchData: () => void;
//   loading: boolean;
}

export default function FloatingActions({}: FloatingActionsProps) {
  return (
    <div className="fixed-actions">
          <Link 
            href="/settings"
            className="button secondary"
          >
            ⚙️ Settings
          </Link>
          <button
            type="button"
            className="button primary"
            // disabled={loading}
          >
            {/* {loading ? 'Refreshing...' : '🔄 Refresh'} */}
            {'🔄 Refresh'}
          </button>
    </div>
  );
}