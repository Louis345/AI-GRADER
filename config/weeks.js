// config/weeks.js - Unified configuration for all weeks

const WEEKS_CONFIG = {
  3: {
    weekNumber: 3,
    name: "Bootstrap Project",
    rubricDescription:
      "This assignment evaluates a Bootstrap website with requirements including multiple pages, navbar, tables, and forms.",
    totalPoints: 80,
    gradingRubric: {
      completion: {
        points: 30,
        description: "Implementation of all required Bootstrap components",
        criteria: [
          "Multiple pages created",
          "Bootstrap navbar implemented",
          "Tables with proper styling",
          "Forms with Bootstrap classes",
          "Responsive design",
        ],
      },
      github: {
        points: 25,
        description: "GitHub repository setup and organization",
        criteria: [
          "Repository properly created",
          "Files organized in logical structure",
          "README file included",
          "Commits show development progress",
        ],
      },
      errors: {
        points: 15,
        description: "Error-free functionality and code quality",
        criteria: [
          "No console errors",
          "All links work properly",
          "Valid HTML/CSS",
          "Bootstrap classes used correctly",
        ],
      },
      video: {
        points: 10,
        description: "Video explanation of project",
        criteria: [
          "Clear explanation of design choices",
          "Demonstration of all features",
          "Discussion of challenges faced",
          "Professional presentation",
        ],
      },
    },
    resubmissionAllowed: true,
  },

  7: {
    weekNumber: 7,
    name: "JS4 - ECMA Script",
    rubricDescription:
      "This assignment focuses on JavaScript ECMA Script features including arrow functions, destructuring, and modern syntax.",
    totalPoints: 400,
    gradingRubric: {
      completion: {
        points: 160,
        description: "Implementation of ECMA Script features",
        criteria: [
          "Arrow functions used appropriately",
          "Destructuring assignments implemented",
          "Template literals utilized",
          "Let/const used instead of var",
          "Modern JavaScript syntax throughout",
        ],
      },
      github: {
        points: 140,
        description: "GitHub repository setup and organization",
        criteria: [
          "Repository properly structured",
          "Code is well-organized",
          "Commit history shows progress",
          "README with project description",
        ],
      },
      errors: {
        points: 70,
        description: "Error-free functionality",
        criteria: [
          "No syntax errors",
          "Code executes without issues",
          "Proper error handling",
          "Functions work as expected",
        ],
      },
      video: {
        points: 30,
        description: "Video explanation",
        criteria: [
          "Explanation of ECMA Script features used",
          "Code walkthrough",
          "Discussion of implementation choices",
        ],
      },
    },
    resubmissionAllowed: true,
  },

  9: {
    weekNumber: 9,
    name: "JavaScript Unit Final Coding Project - WAR Card Game",
    rubricDescription:
      "Students create an automated version of the classic card game WAR using Object-Oriented Programming concepts. The game should use classes like Card, Deck, and Player, deal 26 cards to each player, automatically play through all rounds, track points, and declare a winner. Bonus points for unit testing with Mocha/Chai.",
    totalPoints: 400,
    gradingRubric: {
      completion: {
        points: 160,
        description: "Implementation of WAR card game with OOP concepts",
        criteria: [
          "Uses classes (Card, Deck, Player) or similar OOP structure",
          "Deals 26 cards to each player from 52-card deck",
          "Iterates through all rounds automatically",
          "Awards points to player with higher card",
          "Handles ties appropriately (zero points)",
          "Displays final score and declares winner",
          "Game runs automatically using console.log output",
        ],
      },
      github: {
        points: 140,
        description: "GitHub repository setup and code quality",
        criteria: [
          "Repository properly created and accessible",
          "Code is well-commented explaining functionality",
          "Includes .gitignore file with node_modules",
          "Clean, organized code structure",
          "Meaningful variable and function names",
        ],
      },
      errors: {
        points: 70,
        description: "Error-free functionality and proper implementation",
        criteria: [
          "Game runs without crashes or errors",
          "All 26 rounds play correctly",
          "Card dealing works properly",
          "Point tracking is accurate",
          "No logical errors in game flow",
        ],
      },
      video: {
        points: 30,
        description: "Video explanation and demonstration (max 5 minutes)",
        criteria: [
          "Shows game running from start to finish",
          "Explains how the code works",
          "Demonstrates understanding of OOP concepts used",
          "Clear screen share and voice explanation",
          "Highlights key portions of contributed code",
        ],
      },
    },
    extraCredit: {
      points: 10,
      description: "Unit testing with Mocha and Chai",
      criteria: [
        "Includes at least one unit test",
        "Uses specified Mocha/Chai versions",
        "Test actually validates game functionality",
      ],
    },
    resubmissionAllowed: true,
  },

  12: {
    weekNumber: 12,
    name: "API's and Fetch",
    rubricDescription:
      "This assignment requires students to create a CRUD application using json-server or another API. Students must use fetch and async/await to interact with the API, implement forms to create/post entities, include deletion functionality, and display fetched entities.",
    totalPoints: 400,
    gradingRubric: {
      completion: {
        points: 160,
        description: "CRUD application implementation with API integration",
        criteria: [
          "Fetch API used for data retrieval",
          "Async/await implemented properly",
          "Create (POST) functionality working",
          "Read (GET) functionality displaying data",
          "Delete functionality implemented",
          "Forms properly connected to API",
          "json-server or alternative API used",
        ],
      },
      github: {
        points: 140,
        description: "GitHub repository setup and code organization",
        criteria: [
          "Repository properly created and accessible",
          "File structure is logical and organized",
          "Code is clean and well-commented",
          "README file explains project setup",
          "Commit history shows development progress",
        ],
      },
      errors: {
        points: 70,
        description: "Error-free functionality and proper implementation",
        criteria: [
          "No console errors during operation",
          "All CRUD operations work correctly",
          "Error handling for failed API calls",
          "Proper async/await usage without errors",
          "UI responds correctly to user interactions",
        ],
      },
      video: {
        points: 30,
        description: "Video explanation and demonstration",
        criteria: [
          "Clear explanation of project functionality",
          "Demonstration of all CRUD operations",
          "Discussion of API integration challenges",
          "Code walkthrough showing key components",
        ],
      },
    },
    resubmissionAllowed: true,
  },

  17: {
    weekNumber: 17,
    name: "Final Coding Project",
    rubricDescription:
      "This is the final project where students create a React application that connects to an API and includes CRUD operations.",
    totalPoints: 800,
    gradingRubric: {
      completion: {
        points: 320,
        description: "Implementation of all project requirements",
        pointBreakdown: {
          "All requirements attempted": 320,
          "Did not attempt some (1 or 2) requirements": 220,
          "Did not attempt most (3 or more) requirements": 110,
          "No Code Attempted or No Code Submitted": 0,
        },
        criteria: [
          "All requirements have been attempted",
          "React application created",
          "API connection established",
          "CRUD operations implemented",
          "All specified functionality working",
        ],
      },
      github: {
        points: 280,
        description: "GitHub repository setup and accessibility",
        pointBreakdown: {
          "URL provided, project can be cloned and run": 280,
          "URL provided, but missing full file structure": 180,
          "URL provided, but code is not complete": 80,
          "URL not provided or points to non-existent/empty repository": 0,
        },
        criteria: [
          "GitHub URL provided and accessible",
          "Project can be successfully cloned",
          "Project can be run without issues",
          "Complete file structure present",
          "Repository is properly organized",
        ],
      },
      errors: {
        points: 140,
        description: "Code functionality and error handling",
        pointBreakdown: {
          "Code works as required. No errors": 140,
          "Minor errors: small errors or some features don't work": 70,
          "Major errors: code not implemented correctly or requirements missing": 35,
          "No working project": 0,
        },
        criteria: [
          "Code executes without errors",
          "All features work as required",
          "No broken functionality",
          "Proper error handling implemented",
          "Clean execution",
        ],
      },
      video: {
        points: 60,
        description: "Video explanation and demonstration",
        pointBreakdown: {
          "Video showcases all requirements": 60,
          "Video partially showcases requirements": 30,
          "Video provided but doesn't showcase working project": 15,
          "No video": 0,
        },
        criteria: [
          "Video demonstrates all project requirements",
          "Clear explanation of functionality",
          "Shows running code in action",
          "Professional presentation",
          "Complete project walkthrough",
        ],
      },
    },
    resubmissionAllowed: true,
  },
};

/**
 * Get configuration for a specific week
 * @param {number} weekNumber - Week number
 * @returns {Object} Week configuration
 */
function getWeekConfig(weekNumber) {
  const config = WEEKS_CONFIG[weekNumber];
  if (!config) {
    throw new Error(
      `Week ${weekNumber} configuration not found. Available weeks: ${Object.keys(
        WEEKS_CONFIG
      ).join(", ")}`
    );
  }
  return config;
}

/**
 * Get all available weeks
 * @returns {Array} Array of available week numbers
 */
function getAvailableWeeks() {
  return Object.keys(WEEKS_CONFIG)
    .map((week) => parseInt(week))
    .sort((a, b) => a - b);
}

/**
 * Get available weeks with names for display
 * @returns {Array} Array of objects with week info
 */
function getAvailableWeeksWithNames() {
  return Object.values(WEEKS_CONFIG)
    .map((config) => ({
      number: config.weekNumber,
      name: config.name,
      totalPoints: config.totalPoints,
    }))
    .sort((a, b) => a.number - b.number);
}

module.exports = {
  WEEKS_CONFIG,
  getWeekConfig,
  getAvailableWeeks,
  getAvailableWeeksWithNames,
};
