// src/config/promineo-weeks.js
// Maps Promineo LMS navigation to your existing week configs

const path = require("path");

const PROMINEO_WEEK_MAPPING = {
  3: {
    // Your existing week config (reused!)
    aiGraderConfig: require("../../config/weeks/week3.json"),

    // Promineo-specific navigation
    sidebarSelector: "Week 3: Bootstrap",
    projectSelector: "Bootstrap Coding Project",

    // Expected text patterns to find in the LMS
    sidebarTextPatterns: ["Week 3: Bootstrap", "Bootstrap", "Week 3"],

    projectTextPatterns: [
      "Bootstrap Coding Project",
      "Bootstrap Project",
      "Coding Project",
    ],
  },

  7: {
    aiGraderConfig: require("../../config/weeks/week7.json"),
    sidebarSelector: "Week 7: JS4",
    projectSelector: "JS4 Coding Assignment",
    sidebarTextPatterns: ["Week 7", "JS4", "ECMA"],
    projectTextPatterns: ["JS4", "Coding Assignment", "JavaScript"],
  },

  9: {
    aiGraderConfig: require("../../config/weeks/week9.json"),
    sidebarSelector: "Week 9: JS6",
    projectSelector: "DevTools Coding Project",
    sidebarTextPatterns: ["Week 9", "JS6", "DevTools"],
    projectTextPatterns: ["DevTools", "Debugging", "Coding Project"],
  },

  12: {
    aiGraderConfig: require("../../config/weeks/week12.json"),
    sidebarSelector: "Week 12: API",
    projectSelector: "API Coding Project",
    sidebarTextPatterns: ["Week 12", "API", "Fetch"],
    projectTextPatterns: ["API", "Fetch", "Coding Project"],
  },

  17: {
    aiGraderConfig: require("../../config/weeks/week17.json"),
    sidebarSelector: "Week 17: Final",
    projectSelector: "Final Coding Project",
    sidebarTextPatterns: ["Week 17", "Final", "React"],
    projectTextPatterns: ["Final", "React", "Coding Project"],
  },
};

/**
 * Get Promineo navigation config for a specific week
 * @param {number} weekNumber - Week number (3, 7, 9, 12, 17)
 * @returns {Object} Navigation and AI config for the week
 */
function getPromineoWeekConfig(weekNumber) {
  const config = PROMINEO_WEEK_MAPPING[weekNumber];
  if (!config) {
    throw new Error(`Week ${weekNumber} not configured for Promineo LMS`);
  }
  return config;
}

/**
 * Get list of available Promineo weeks
 * @returns {Array} Available week numbers
 */
function getAvailablePromineoWeeks() {
  return Object.keys(PROMINEO_WEEK_MAPPING).map((week) => parseInt(week));
}

module.exports = {
  PROMINEO_WEEK_MAPPING,
  getPromineoWeekConfig,
  getAvailablePromineoWeeks,
};
