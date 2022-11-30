import { updateArrows } from "./update_arrows";
import { removeArrows } from "./arrows/arrows";
import React from "react";
import { isBoardAvailable } from "./scraper/board_state_scraper";
import { getEngineLines } from "./scraper/engine_line_scraper";

let enabled = true;

window.setInterval(() => {
  if (enabled && isBoardAvailable() && getEngineLines()) {
    updateArrows();
  } else {
    removeArrows();
  }
}, 100);
window.setInterval(() => {
  let stateInfo = ""

  if(!isBoardAvailable()) {
    stateInfo = "No board detected!"
  } else if(!getEngineLines()) {
    stateInfo = "No engine lines detected!"
  }

  chrome.storage.sync.set({
    stateInfo
  }, () => {});
}, 1000);

chrome.storage.sync.get(items => {
  if(items.arrowsEnabled) {
    enabled = items.arrowsEnabled
  }
})

chrome.storage.onChanged.addListener(function(changes) {
  for (let key in changes) {
    if (key == "arrowsEnabled") {
      let newVal = changes.arrowsEnabled.newValue;
      if (enabled && !newVal) {
        removeArrows();
      }
      enabled = newVal;
    }
  }
});
