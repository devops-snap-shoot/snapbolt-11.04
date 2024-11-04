import React, { useEffect, useRef, useState } from 'react';

interface AdBannerProps {
  dataAdSlot: string;
  dataAdFormat?: 'auto' | 'fluid' | 'rectangle';
  dataFullWidthResponsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const AdBanner = ({
  dataAdSlot,
  dataAdFormat = 'auto',
  dataFullWidthResponsive = true,
  className,
  style
}: AdBannerProps) => {
  const adRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);
  const [adFailed, setAdFailed] = useState(false);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    // Check if AdSense is blocked or failed to connect
    const checkConnection = () => {
      const script = document.querySelector('script[src*="adsbygoogle"]');
      if (script) {
        script.addEventListener('error', () => {
          setIsConnected(false);
          setAdFailed(true);
        });
      }
    };

    // Initialize AdSense
    const initAd = () => {
      if (!initialized.current && adRef.current) {
        initialized.current = true;
        try {
          if (!(window as any).adsbygoogle) {
            setIsConnected(false);
            setAdFailed(true);
            return;
          }
          ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        } catch (error) {
          console.error('AdBanner initialization error:', error);
          setAdFailed(true);
        }
      }
    };

    checkConnection();

    // Run initialization with a timeout
    const timer = setTimeout(() => {
      if (!isConnected) {
        setAdFailed(true);
        return;
      }
      initAd();
    }, 1000); // Give more time for connection

    // Set a timeout to check if ad loaded
    const loadTimeout = setTimeout(() => {
      if (adRef.current && !adRef.current.querySelector('iframe')) {
        setAdFailed(true);
      }
    }, 5000); // 5 seconds timeout for ad to load

    return () => {
      clearTimeout(timer);
      clearTimeout(loadTimeout);
      initialized.current = false;
    };
  }, [isConnected]);

  // Don't render anything if ad failed or connection failed
  if (adFailed || !isConnected) {
    return null;
  }

  return (
    <div 
      ref={adRef} 
      className={className}
      style={{ 
        minHeight: style?.minHeight,
        display: adFailed ? 'none' : 'block'
      }}
    >
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          minWidth: '300px',
          ...style
        }}
        data-ad-client={`ca-pub-${import.meta.env.VITE_ADSENSE_PUB_ID}`}
        data-ad-slot={dataAdSlot}
        data-ad-format={dataAdFormat}
        data-full-width-responsive={dataFullWidthResponsive.toString()}
      />
    </div>
  );
};

export default AdBanner;