import Link from 'next/link';

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <p>
          <Link href="/about">About</Link>
          {' • '}
          <span>© {new Date().getFullYear()} Samba Vitals</span>
        </p>
      </div>
    </footer>
  );
}