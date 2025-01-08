# Header Bidding Project

Here is the live link: https://header-bidding-app.vercel.app/

## Overview

This project is a demonstration of a simplified header bidding system developed for an interview. The primary goal is to showcase my ability to implement a real-time bidding (RTB) solution using Prebid.js, optimizing ad revenue for a publisher's website.

## Technologies Used

- **Frontend:**

  - React.js for building the user interface.
  - Tailwindcss for styling 

- **Ad Tech:**

  - **Prebid.js** for managing header bidding auctions.

- **Development Tools:**
  - Node.js and npm for managing project dependencies.
  - Git for version control.

## Key Features

- **Prebid.js Integration:** Configured to work with multiple Supply-Side Platforms (SSPs) for competitive bidding.
- **Responsive Ad Units:** Configured ad slots to adapt to both desktop and mobile views.
- **Dynamic Floor Pricing:** Implemented with multiple models for strategic pricing based on ad characteristics.
- **Bid Validation:** Ensures only valid bids according to OpenRTB standards are accepted.
- **Lazy Loading:** Ads are loaded only when they enter the viewport, enhancing performance.
- **Error Handling:** Logs errors and provides fallback ads when bidding fails.

## Preparation

To run this project, follow these steps:

1. Install Node.js and npm if you haven't already.
2. Clone this repository.
3. Navigate to the project directory in your terminal.
4. Run `npm install` to install the project dependencies.
5. Run `npm start` to start the development server.
6. Open your web browser and navigate to `http://localhost:3000` to view the project
