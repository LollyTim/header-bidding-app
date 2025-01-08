import React, { useEffect, useRef, useState } from "react";
import headerBiddingService from "../services/headerBidding";

const AdUnit = ({ adUnitConfig }) => {
  const adRef = useRef(null);
  const [error, setError] = useState(null);
  const [analytics, setAnalytics] = useState(null);

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
      const analyticsData = headerBiddingService.getAnalytics(bids);
      setAnalytics(analyticsData);

      // Send analytics to Google Analytics
      window.gtag("event", "bidding_results", {
        event_category: "Header Bidding",
        event_label: adUnitConfig.code,
        bid_count: analyticsData.bidCount,
        average_cpm: analyticsData.averageCpm,
        average_response_time: analyticsData.averageTimeToRespond,
        winning_cpm: analyticsData.winningBid
          ? analyticsData.winningBid.cpm
          : 0,
      });

      if (analyticsData.winningBid) {
        adRef.current.innerHTML = analyticsData.winningBid.ad;
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
      <span>No Ad Available</span>
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

      {analytics && (
        <div className="analytics bg-gray-100 p-4 rounded text-sm">
          <h4 className="font-bold mb-2">
            Bid Analytics for {adUnitConfig.code}:
          </h4>
          <p>Total Bids: {analytics.bidCount}</p>
          <p>Average CPM: ${analytics.averageCpm}</p>
          <p>Average Response Time: {analytics.averageTimeToRespond}ms</p>
          {analytics.winningBid && (
            <div className="winning-bid mt-2">
              <p>Winning Bid:</p>
              <p>Bidder: {analytics.winningBid.bidder}</p>
              <p>CPM: ${analytics.winningBid.cpm}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdUnit;
