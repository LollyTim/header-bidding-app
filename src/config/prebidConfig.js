export const TIMEOUT = 1000;

export const BIDDERS = [
  {
    bidder: "appnexus",
    params: {
      placementId: "13144370",
      test: true,
    },
  },
  {
    bidder: "rubicon",
    params: {
      accountId: "14062",
      siteId: "70608",
      zoneId: "335918",
      test: true,
    },
  },
];

export const AD_UNITS = {
  leaderboard: {
    code: "leaderboard-ad-1",
    mediaTypes: {
      banner: {
        sizes: [
          [728, 90], // Desktop
          [320, 50], // Mobile
        ],
      },
    },
    bids: BIDDERS,
  },
  rectangle: {
    code: "rectangle-ad-1",
    mediaTypes: {
      banner: {
        sizes: [
          [300, 250], // Desktop
          [300, 250], // Mobile
        ],
      },
    },
    bids: BIDDERS,
  },
  mobile: {
    code: "mobile-ad-1",
    mediaTypes: {
      banner: {
        sizes: [
          [320, 50], // Mobile
        ],
      },
    },
    bids: BIDDERS,
  },
};
