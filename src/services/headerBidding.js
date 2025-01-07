import { TIMEOUT } from "../config/prebidConfig";

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
          floors: {
            enforcement: {
              floorDeals: true,
              bidAdjustment: true,
            },
            data: {
              currency: "USD",
              skipRate: 20,
              floorsSchemaVersion: 2,
              modelGroups: [
                {
                  modelWeight: 25,
                  modelVersion: "Model1",
                  schema: {
                    fields: ["domain", "gptSlot", "mediaType", "size"],
                  },
                  values: {
                    "example.com|/1111/home/leaderboard|banner|728x90": 1.2,
                    "example.com|/1111/home/rectangle|banner|300x250": 1.0,
                    "example.com|*|*|*": 0.5,
                  },
                  default: 0.75,
                },
                {
                  modelWeight: 25,
                  modelVersion: "Model2",
                  schema: {
                    fields: ["domain", "mediaType", "size"],
                  },
                  values: {
                    "example.com|banner|728x90": 1.3,
                    "example.com|banner|300x250": 0.9,
                    "example.com|*|*": 0.6,
                  },
                  default: 0.7,
                },
                {
                  modelWeight: 50,
                  modelVersion: "Model3",
                  schema: {
                    fields: ["gptSlot", "mediaType", "size"],
                  },
                  values: {
                    "/1111/home/leaderboard|banner|728x90": 1.1,
                    "/1111/home/rectangle|banner|300x250": 1.0,
                    "*|banner|*": 0.7,
                  },
                  default: 0.65,
                },
              ],
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
            resolve(this.getValidBids(responses));
          },
          timeout: TIMEOUT,
        });
      });
    });
  }

  getValidBids(bids) {
    return bids.filter((bid) => bid.cpm > 0);
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
