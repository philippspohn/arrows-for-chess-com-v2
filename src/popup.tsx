import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

const Popup = () => {
  const [arrowsEnabled, setArrowsEnabled] = useState(true);
  const [stateInfo, setStateInfo] = useState("");

  const updateStateInfo = () => {
    chrome.storage.sync.get(items => {
      if(items.stateInfo) {
        setStateInfo(items.stateInfo);
      } else {
        setStateInfo("")
      }
    });
  };

  useEffect(() => {
    chrome.storage.sync.get(
      {
        arrowsEnabled: true
      },
      (items) => {
        setArrowsEnabled(items.arrowsEnabled);
      }
    );
  }, []);

  useEffect(() => {
    updateStateInfo();
    setInterval(() => {
      updateStateInfo();
    }, 1000);
  }, []);

  const saveEnabled = (newArrowsEnabled: boolean) => {
    chrome.storage.sync.set(
      {
        arrowsEnabled: newArrowsEnabled
      },
      () => {
        setArrowsEnabled(newArrowsEnabled);
      }
    );
  };

  const stateInfoComp = () => {
    if (stateInfo == "") {
      return null;
    } else {
      return <p>Status: <span style={{color: "red"}}>{stateInfo}</span></p>;
    }
  };

  return (
    <>
      <div style={{ minWidth: "500px" }}>
        <h1 style={{ marginBottom: 0 }}>Arrows for Chess.com {arrowsEnabled ? "🟢" : "🔴"}</h1>
        <h2>How it works</h2>
        <ul>
          <li>Open the analysis tab on a chess.com game</li>
          <li>Make sure that engine lines are activated and visible</li>
          <li><a href="https://www.chess.com/analysis/game/live/63484018909?tab=analysis" target="_blank">(Example
            Game)</a></li>
        </ul>
        {stateInfoComp()}
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
