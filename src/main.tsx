import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import TrackingPage from './app/tracking/page.tsx';
import './index.css';

function RootRouter() {
  const [pathname, setPathname] = useState(() =>
    typeof window !== 'undefined' ? window.location.pathname : '/'
  );

  useEffect(() => {
    const onPopState = () => {
      setPathname(window.location.pathname);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  if (pathname.startsWith('/tracking')) {
    return <TrackingPage />;
  }

  return <App />;
}

createRoot(document.getElementById('root')!).render(<RootRouter />);
