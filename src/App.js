import React from "react";
import AdUnit from "./components/AdUnit";
import { AD_UNITS } from "./config/prebidConfig";

function App() {
  return (
    <div className="app max-w-6xl mx-auto p-4">
      <header className="bg-blue-600 text-white p-6 rounded-lg mb-8">
        <h1 className="text-2xl font-bold">Header Bidding Implementation</h1>
        <p className="mt-2 text-blue-100">
          Testing with AppNexus and Rubicon adapters
        </p>
      </header>

      <div className="grid gap-8">
        {Object.entries(AD_UNITS).map(([key, config]) => (
          <section key={key}>
            <h2 className="text-xl font-bold mb-4">
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </h2>
            <AdUnit adUnitConfig={config} />
          </section>
        ))}
      </div>
    </div>
  );
}

export default App;
