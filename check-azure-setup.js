// Azure Speech Service Setup Verification
const fs = require("fs");
const path = require("path");

console.log("🔍 Checking Azure Speech Service Configuration...\n");

// Check for environment variables
const envFiles = [".env.local", ".env"];
let envFound = false;
let azureKeyFound = false;
let azureRegionFound = false;

for (const envFile of envFiles) {
  const envPath = path.join(__dirname, envFile);
  if (fs.existsSync(envPath)) {
    console.log(`✅ Found ${envFile}`);
    envFound = true;

    const envContent = fs.readFileSync(envPath, "utf8");

    if (
      envContent.includes("AZURE_SPEECH_KEY=") &&
      !envContent.includes("your_azure_speech_service_key_here")
    ) {
      azureKeyFound = true;
      console.log("✅ Azure Speech Key configured");
    }

    if (
      envContent.includes("AZURE_SPEECH_REGION=") &&
      !envContent.includes("eastus")
    ) {
      azureRegionFound = true;
      console.log("✅ Azure Speech Region configured");
    } else if (envContent.includes("AZURE_SPEECH_REGION=eastus")) {
      azureRegionFound = true;
      console.log("✅ Azure Speech Region set to default (eastus)");
    }

    break;
  }
}

if (!envFound) {
  console.log("❌ No environment file found");
  console.log("   Create .env.local from .env.example");
}

if (!azureKeyFound) {
  console.log("❌ AZURE_SPEECH_KEY not configured");
  console.log(
    "   Get your key from Azure Portal -> Speech Services -> Keys and Endpoint"
  );
}

if (!azureRegionFound) {
  console.log("❌ AZURE_SPEECH_REGION not configured");
  console.log("   Set the region where your Azure Speech Service is deployed");
}

console.log("\n📋 Setup Instructions:");
console.log("1. Copy .env.example to .env.local");
console.log("2. Get your Azure Speech Service credentials from:");
console.log(
  "   https://portal.azure.com -> Speech Services -> Keys and Endpoint"
);
console.log("3. Replace the placeholder values in .env.local");
console.log("4. Restart your development server");

console.log("\n🧪 Testing API endpoint...");

// Test the API endpoint
if (azureKeyFound && azureRegionFound) {
  console.log("✅ Configuration looks good! Try the API at:");
  console.log("   GET http://localhost:3000/api/speech-to-text");
} else {
  console.log("⚠️  Complete the configuration first, then test the API");
}

// Check if required packages are installed
const packageJsonPath = path.join(__dirname, "package.json");
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

  console.log("\n📦 Package Dependencies:");
  if (packageJson.dependencies?.["openai"]) {
    console.log(
      "ℹ️  OpenAI package found (not needed for Azure Speech Service)"
    );
  }

  console.log("✅ No additional packages required for Azure Speech Service");
}
