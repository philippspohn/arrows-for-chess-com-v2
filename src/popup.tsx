import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

const Popup = () => {
  const [arrowsEnabled, setArrowsEnabled] = useState(true);

  useEffect(() => {
    chrome.storage.sync.get(
      {
        arrowsEnabled: true,
      },
      (items) => {
        setArrowsEnabled(items.arrowsEnabled);
      }
    );
  }, []);


  const saveEnabled = (newArrowsEnabled: boolean) => {
    chrome.storage.sync.set(
      {
        arrowsEnabled: newArrowsEnabled
      },
      () => {
        setArrowsEnabled(newArrowsEnabled)
      }
    );
  };

  return (
    <>
      <div style={{minWidth: "500px"}}>
        <h1 style={{marginBottom: 0}}>Arrows for Chess.com {arrowsEnabled ? "🟢" : "🔴"}</h1>
        <h2>How it works</h2>
        <ul>
          <li>Open the analysis tab on a chess.com game</li>
          <li><a href="https://www.chess.com/analysis/game/live/63484018909?tab=analysis" target="_blank">(Example Game)</a></li>
        </ul>
        <button
          onClick={() => saveEnabled(!arrowsEnabled)}
          style={{ marginRight: "5px" }}
        >
          {arrowsEnabled ? "Disable" : "Enable"}
        </button>
      </div>
    </>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById("root")
);
