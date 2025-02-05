const fs = require("fs");
const https = require("https");

const filePath = "./last_joke_date.txt";
const apiURL = "https://v2.jokeapi.dev/joke/Any?type=single";

function getTodayDate() {
  return new Date().toISOString().split("T")[0]; // Returns YYYY-MM-DD
}

function tellJoke() {
  https.get(apiURL, (res) => {
    let data = "";

    res.on("data", (chunk) => {
      data += chunk;
    });

    res.on("end", () => {
      const joke = JSON.parse(data).joke || "No joke available today!";
      console.log(`Today's joke: ${joke}`);
    });
  }).on("error", (err) => {
    console.error("Error fetching joke:", err.message);
  });

  // Save today's date to file
  fs.writeFileSync(filePath, getTodayDate(), "utf8");
}

function isNewDay() {
  if (!fs.existsSync(filePath)) return true; // First run
  const lastJokeDate = fs.readFileSync(filePath, "utf8");
  return getTodayDate() !== lastJokeDate;
}

if (isNewDay()) {
  tellJoke();
} else {
  console.log("You already got today's joke!");
}
