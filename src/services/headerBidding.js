import { TIMEOUT, BIDDERS } from "../config/prebidConfig";

class HeaderBiddingService {
  constructor() {
    this.pbjs = window.pbjs || {};
    this.pbjs.que = this.pbjs.que || [];
  }

  initializePrebid() {
    return new Promise((resolve) => {
      this.pbjs.que.push(() => {
        this.pbjs.setConfig({
          debug: true,
          enableSendAllBids: true,
          bidderTimeout: TIMEOUT,
          publisherDomain: window.location.origin,
          userSync: {
            filterSettings: {
              iframe: {
                bidders: "*",
                filter: "include",
              },
            },
          },
        });
        resolve();
      });
    });
  }

  requestBids(adUnit) {
    return new Promise((resolve) => {
      this.pbjs.que.push(() => {
        this.pbjs.addAdUnits(adUnit);
        this.pbjs.requestBids({
          adUnits: [adUnit],
          bidsBackHandler: (bidResponses) => {
            const responses = bidResponses[adUnit.code]?.bids || [];
            this.pbjs.removeAdUnit(adUnit.code);
            resolve(responses);
          },
          timeout: TIMEOUT,
        });
      });
    });
  }

  getAnalytics(bids) {
    return {
      bidCount: bids.length,
      averageCpm: this.calculateAverageCpm(bids),
      averageTimeToRespond: this.calculateAverageTime(bids),
      winningBid: this.getWinningBid(bids),
    };
  }

  calculateAverageCpm(bids) {
    if (bids.length === 0) return 0;
    const total = bids.reduce((sum, bid) => sum + (bid.cpm || 0), 0);
    return (total / bids.length).toFixed(2);
  }

  calculateAverageTime(bids) {
    if (bids.length === 0) return 0;
    const total = bids.reduce((sum, bid) => sum + (bid.timeToRespond || 0), 0);
    return Math.round(total / bids.length);
  }

  getWinningBid(bids) {
    return bids.reduce(
      (winner, bid) => (!winner || bid.cpm > winner.cpm ? bid : winner),
      null
    );
  }
}

export default new HeaderBiddingService();
