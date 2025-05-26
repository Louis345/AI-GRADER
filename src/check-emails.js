require("dotenv").config({
  path: require("path").resolve(__dirname, "../../.env"), // Updated path
});
const puppeteer = require("puppeteer");

// Helper function for delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Test login to Promineo LMS and navigate to course
 */
async function testPromineoLogin() {
  const browser = await puppeteer.launch({
    headless: false, // Set to true in production
    defaultViewport: null,
    args: ["--start-maximized"],
    slowMo: 100, // Add slight delay between actions
  });

  const page = await browser.newPage();

  try {
    console.log("🚀 Starting Promineo LMS login test...");

    // Debug: Check environment variables
    const username = process.env.PROMINEO_USERNAME || "jt125845@gmail.com";
    const password = process.env.PROMINEO_PASSWORD || "Red!2345";

    console.log("📧 Username loaded:", username ? "✅" : "❌");
    console.log("🔑 Password loaded:", password ? "✅" : "❌");

    // Navigate to login page
    console.log("📱 Navigating to login page...");
    await page.goto("https://learn.promineotech.com/login/index.php", {
      waitUntil: "networkidle2",
    });

    console.log("📍 Current URL:", page.url());

    // Wait for login form to be visible
    await page.waitForSelector('input[name="username"]', { timeout: 15000 });
    console.log("✅ Login form found");

    // Take screenshot of login page
    await page.screenshot({ path: "promineo-login-page.png", fullPage: true });
    console.log("📸 Login page screenshot saved");

    // Fill in credentials with better error handling
    console.log("🔐 Entering credentials...");

    // Focus and clear username field
    await page.focus('input[name="username"]');
    await page.keyboard.down("Control");
    await page.keyboard.press("a");
    await page.keyboard.up("Control");
    await page.keyboard.press("Delete");

    // Type username character by character to avoid issues
    for (const char of username) {
      await page.keyboard.type(char);
      await delay(50);
    }

    // Focus and clear password field
    await page.focus('input[name="password"]');
    await page.keyboard.down("Control");
    await page.keyboard.press("a");
    await page.keyboard.up("Control");
    await page.keyboard.press("Delete");

    // Type password character by character
    for (const char of password) {
      await page.keyboard.type(char);
      await delay(50);
    }

    console.log("✅ Credentials entered");

    // Wait a moment before clicking login
    await delay(1000);

    // Click login button with multiple strategies
    console.log("🔑 Clicking login button...");

    try {
      // Strategy 1: Look for button with "Log in" text using evaluate
      const loginButtonClicked = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll("button"));
        const loginBtn = buttons.find((btn) =>
          btn.textContent.includes("Log in")
        );
        if (loginBtn) {
          loginBtn.click();
          return true;
        }
        return false;
      });

      if (loginButtonClicked) {
        console.log("✅ Clicked login button (strategy 1)");
      } else {
        // Strategy 2: Look for input with value "Log in"
        const loginInput = await page.$('input[value="Log in"]');
        if (loginInput) {
          await loginInput.click();
          console.log("✅ Clicked login button (strategy 2)");
        } else {
          // Strategy 3: Press Enter on password field
          await page.focus('input[name="password"]');
          await page.keyboard.press("Enter");
          console.log("✅ Pressed Enter to login (strategy 3)");
        }
      }
    } catch (clickError) {
      console.log("⚠️ Error clicking login button:", clickError.message);
      // Fallback: Press Enter
      await page.keyboard.press("Enter");
    }

    // Wait for navigation after login
    console.log("⏳ Waiting for login to complete...");
    await page.waitForNavigation({
      waitUntil: "networkidle2",
      timeout: 15000,
    });

    console.log("✅ Login completed! Current URL:", page.url());

    // Take screenshot after login
    await page.screenshot({ path: "promineo-after-login.png", fullPage: true });
    console.log("📸 Post-login screenshot saved");

    // Wait a bit for dashboard to load
    await delay(5000);

    // Look for the Front End Software Developer 2024 course
    console.log("🔍 Looking for Front End Software Developer 2024 course...");

    // Try to find course by text content using evaluate
    const courseFound = await page.evaluate(() => {
      // Look for links containing the course name
      const links = Array.from(document.querySelectorAll("a"));
      const courseLink = links.find(
        (link) =>
          link.textContent.includes("Front End Software Developer (2024)") ||
          link.textContent.includes("Front End Software Developer") ||
          link.href.includes("course/view.php?id=154")
      );

      if (courseLink) {
        courseLink.click();
        return {
          found: true,
          text: courseLink.textContent.trim(),
          href: courseLink.href,
        };
      }
      return { found: false };
    });

    if (courseFound.found) {
      console.log(`✅ Found and clicked course: "${courseFound.text}"`);
      console.log(`🔗 Course URL: ${courseFound.href}`);
    } else {
      console.log("❌ Could not find the specific course link");

      // Debug: Get all links on the page
      const allLinks = await page.evaluate(() => {
        return Array.from(document.querySelectorAll("a"))
          .map((link) => ({
            text: link.textContent.trim(),
            href: link.href,
          }))
          .filter((link) => link.text.length > 0);
      });

      console.log("🔍 All links found on page:");
      allLinks.forEach((link, index) => {
        console.log(`${index + 1}. "${link.text}" -> ${link.href}`);
      });

      // Try to click "My courses" tab to see courses
      const myCoursesClicked = await page.evaluate(() => {
        const myCoursesTab = Array.from(document.querySelectorAll("a")).find(
          (link) => link.textContent.includes("My courses")
        );
        if (myCoursesTab) {
          myCoursesTab.click();
          return true;
        }
        return false;
      });

      if (myCoursesClicked) {
        console.log("✅ Clicked 'My courses' tab");
        await delay(3000);

        // Try to find the course again
        const courseFoundAfterTab = await page.evaluate(() => {
          const links = Array.from(document.querySelectorAll("a"));
          const courseLink = links.find(
            (link) =>
              link.textContent.includes(
                "Front End Software Developer (2024)"
              ) ||
              link.textContent.includes("Front End Software Developer") ||
              link.href.includes("course/view.php?id=154")
          );

          if (courseLink) {
            courseLink.click();
            return {
              found: true,
              text: courseLink.textContent.trim(),
              href: courseLink.href,
            };
          }
          return { found: false };
        });

        if (courseFoundAfterTab.found) {
          console.log(
            `✅ Found course after clicking My courses: "${courseFoundAfterTab.text}"`
          );
        }
      }
    }

    // Wait for course page to load if we clicked something
    try {
      await page.waitForNavigation({
        waitUntil: "networkidle2",
        timeout: 10000,
      });
      console.log(
        "✅ Successfully navigated to course! Current URL:",
        page.url()
      );
    } catch (navError) {
      console.log("⚠️ No navigation occurred, might still be on dashboard");
    }

    // Take final screenshot
    await page.screenshot({ path: "promineo-final-state.png", fullPage: true });
    console.log("📸 Final screenshot saved");

    // Keep browser open for manual inspection
    console.log("⏱️ Keeping browser open for 30 seconds for inspection...");
    await delay(30000);
  } catch (error) {
    console.error("❌ Error during Promineo login test:", error.message);
    console.error("📋 Full error:", error);

    // Take error screenshot
    try {
      await page.screenshot({ path: "promineo-error.png", fullPage: true });
      console.log("📸 Error screenshot saved as promineo-error.png");
    } catch (screenshotError) {
      console.log("❌ Could not take error screenshot");
    }
  } finally {
    await browser.close();
    console.log("🔚 Browser closed");
  }
}

// Run the test
if (require.main === module) {
  console.log("🧪 Running Promineo LMS login test...");
  testPromineoLogin();
}

module.exports = { testPromineoLogin };
