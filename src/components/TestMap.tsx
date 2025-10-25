import { useEffect, useRef } from 'react';

interface TestMapProps {
  className?: string;
}

const TestMap = ({ className = "h-96 w-full rounded-lg" }: TestMapProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('TestMap useEffect - containerRef.current:', containerRef.current);
    
    if (containerRef.current) {
      console.log('TestMap - Conteneur trouvé, dimensions:', {
        offsetWidth: containerRef.current.offsetWidth,
        offsetHeight: containerRef.current.offsetHeight,
        clientWidth: containerRef.current.clientWidth,
        clientHeight: containerRef.current.clientHeight
      });
    }
  }, []);

  return (
    <div className="relative">
      <div 
        ref={containerRef} 
        className={className}
        style={{ 
          backgroundColor: 'lightblue', 
          border: '2px solid red',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          fontWeight: 'bold',
          color: 'darkblue'
        }}
      >
        Test Map Container - {containerRef.current ? 'Avec ref' : 'Sans ref'}
      </div>
    </div>
  );
};

export default TestMap;
