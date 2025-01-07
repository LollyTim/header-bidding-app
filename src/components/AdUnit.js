import React, { useEffect, useRef, useState } from "react";
import headerBiddingService from "../services/headerBidding";

const AdUnit = ({ adUnitConfig }) => {
  const adRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadAd();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (adRef.current) observer.observe(adRef.current);

    return () => observer.disconnect();
  }, [adUnitConfig]);

  const loadAd = async () => {
    try {
      await headerBiddingService.initializePrebid();
      const bids = await headerBiddingService.requestBids(adUnitConfig);

      if (bids.length > 0) {
        const winningBid = headerBiddingService.getWinningBid(bids);
        if (winningBid) {
          adRef.current.innerHTML = winningBid.ad;
        } else {
          adRef.current.innerHTML = createFallbackAd(
            adUnitConfig.mediaTypes.banner.sizes[0]
          );
        }
      } else {
        adRef.current.innerHTML = createFallbackAd(
          adUnitConfig.mediaTypes.banner.sizes[0]
        );
      }
    } catch (err) {
      console.error("Prebid Error:", err);
      setError(err.message);
      adRef.current.innerHTML = createFallbackAd(
        adUnitConfig.mediaTypes.banner.sizes[0]
      );
    }
  };

  const createFallbackAd = ([width, height]) => `
    <div style="width: ${width}px; height: ${height}px; background: #f0f0f0; 
                display: flex; align-items: center; justify-content: center; 
                border: 1px solid #ccc;">
      <span>Fallback Ad</span>
    </div>
  `;

  return (
    <div className="ad-container p-4">
      <div ref={adRef} id={adUnitConfig.code} className="ad-slot mb-4" />

      {error && (
        <div className="error-message bg-red-100 p-2 rounded">
          Error: {error}
        </div>
      )}
    </div>
  );
};

export default AdUnit;
