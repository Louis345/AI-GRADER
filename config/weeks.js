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

  // Updated config/weeks.js - Week 12 section with stricter grading criteria

  12: {
    weekNumber: 12,
    name: "API's and Fetch",
    rubricDescription:
      "This assignment REQUIRES students to create a FUNCTIONAL CRUD application using REAL API calls (json-server or another API). Students MUST use fetch/axios with async/await to interact with an ACTUAL API endpoint. Hardcoded data arrays are NOT acceptable and will result in failure of the completion criteria.",
    totalPoints: 400,
    gradingRubric: {
      completion: {
        points: 160,
        description: "FUNCTIONAL CRUD application with REAL API integration",
        pointBreakdown: {
          "All CRUD operations working with real API": 160,
          "Most CRUD operations (3 of 4) with real API": 120,
          "Some CRUD operations (2 of 4) with real API": 80,
          "Minimal API integration (1 operation only)": 40,
          "No real API calls or only hardcoded data": 0,
        },
        criteria: [
          "MUST use real fetch/axios calls to an actual API endpoint",
          "MUST NOT use hardcoded data arrays as primary data source",
          "Create (POST) functionality actually sends data to API",
          "Read (GET) functionality retrieves data from API",
          "Delete functionality removes data via API",
          "Update functionality (optional but recommended)",
          "Forms properly connected to POST requests",
          "Async/await or promises used correctly",
          "Data from API is displayed in the UI",
        ],
      },
      github: {
        points: 140,
        description: "GitHub repository setup and code organization",
        pointBreakdown: {
          "Complete, well-organized repository": 140,
          "Repository exists with most files": 100,
          "Repository exists but poorly organized": 70,
          "Repository missing or major issues": 0,
        },
        criteria: [
          "Repository properly created and accessible",
          "All necessary files included",
          "File structure is logical",
          "Code is clean and commented",
          "README explains API setup and usage",
          "Commit history shows iterative development",
          ".gitignore excludes node_modules and sensitive data",
        ],
      },
      errors: {
        points: 70,
        description: "Code functionality and error handling",
        pointBreakdown: {
          "No errors, all features work": 70,
          "Minor errors, most features work": 50,
          "Major errors, some features work": 30,
          "Critical errors, barely functional": 10,
          "Code doesn't run or meet requirements": 0,
        },
        criteria: [
          "Code executes without console errors",
          "All CRUD operations function correctly",
          "Proper error handling for failed API calls",
          "Try/catch blocks or .catch() for promises",
          "Graceful handling of network failures",
          "User feedback for operations (success/error messages)",
        ],
      },
      video: {
        points: 30,
        description: "Video demonstration of working application",
        pointBreakdown: {
          "Complete demonstration of all features": 30,
          "Partial demonstration": 15,
          "Video submitted but inadequate": 5,
          "No video": 0,
        },
        criteria: [
          "Demonstrates all CRUD operations working",
          "Shows actual API calls in network tab",
          "Explains code implementation",
          "Discusses challenges and solutions",
          "Clear audio and screen recording",
        ],
      },
    },
    // Add validation rules for AI grader
    validationRules: {
      requiredPatterns: ["fetch(", "async", "await", ".then("],
      forbiddenPatterns: [
        // Patterns that indicate hardcoded data instead of API
        {
          pattern: "const.*=.*\\[.*{.*id:.*title:.*description:",
          message: "Hardcoded data array detected - not using real API",
        },
      ],
      requiredFunctionality: [
        "API endpoint URL",
        "POST request",
        "DELETE request",
        "GET request",
      ],
    },
    extraCredit: {
      points: 10,
      description: "Implementation of UPDATE functionality",
      criteria: [
        "Full CRUD including UPDATE/PUT",
        "Edit forms that update existing entries",
        "Proper PUT/PATCH requests to API",
      ],
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
