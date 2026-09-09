'use client';

import { useEffect } from 'react';

type AdBannerProps = {
  dataAdSlot: string;
  dataAdFormat?: string;
  dataFullWidthResponsive?: boolean;
};

export default function AdBanner({
  dataAdSlot,
  dataAdFormat = 'auto',
  dataFullWidthResponsive = true,
}: AdBannerProps) {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense error', err);
    }
  }, []);

  return (
    <div className="w-full my-6 flex justify-center overflow-hidden bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded text-center p-2">
      {/* 
        NOTE: You must replace 'ca-pub-XXXXXXXXXXXXXXXX' with your actual Google AdSense Publisher ID 
      */}
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%' }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" 
        data-ad-slot={dataAdSlot}
        data-ad-format={dataAdFormat}
        data-full-width-responsive={dataFullWidthResponsive.toString()}
      />
    </div>
  );
}
