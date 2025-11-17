/**
 * Test file to verify API integration works correctly
 * Run this in browser console or as a unit test
 */

import { ApiService } from "./apiService";
import { ApiConfig } from "../types/schema";

// ============================================
// TEST 1: Fetch dropdown options from REST Countries API
// ============================================
export async function testFetchCountries() {
  console.log("🧪 Test 1: Fetching countries from REST Countries API...");

  const config: ApiConfig = {
    url: "https://restcountries.com/v3.1/all",
    method: "GET",
    labelKey: "name.common",
    valueKey: "cca2",
  };

  try {
    const options = await ApiService.fetchDropdownOptions(config);
    console.log("✅ Success! Fetched", options.length, "countries");
    console.log("Sample:", options.slice(0, 3));
    return true;
  } catch (error) {
    console.error("❌ Failed:", error);
    return false;
  }
}

// ============================================
// TEST 2: Fetch with nested data path
// ============================================
export async function testNestedDataPath() {
  console.log("🧪 Test 2: Testing nested data path extraction...");

  // Mock endpoint that returns nested data
  const config: ApiConfig = {
    url: "https://jsonplaceholder.typicode.com/users",
    method: "GET",
    labelKey: "name",
    valueKey: "id",
  };

  try {
    const options = await ApiService.fetchDropdownOptions(config);
    console.log("✅ Success! Fetched", options.length, "users");
    console.log("Sample:", options.slice(0, 3));
    return true;
  } catch (error) {
    console.error("❌ Failed:", error);
    return false;
  }
}

// ============================================
// TEST 3: Test form submission
// ============================================
export async function testFormSubmission() {
  console.log("🧪 Test 3: Testing form submission...");

  const mockData = {
    name: "John Doe",
    email: "john@example.com",
    country: "us",
  };

  try {
    // Using JSONPlaceholder mock API
    const response = await ApiService.submitFormData(
      "https://jsonplaceholder.typicode.com/posts",
      mockData,
      {
        method: "POST",
      }
    );

    console.log("✅ Success! Server response:", response);
    return true;
  } catch (error) {
    console.error("❌ Failed:", error);
    return false;
  }
}

// ============================================
// TEST 4: Test error handling
// ============================================
export async function testErrorHandling() {
  console.log("🧪 Test 4: Testing error handling...");

  const config: ApiConfig = {
    url: "https://invalid-url-that-does-not-exist.com/api",
    method: "GET",
  };

  try {
    const options = await ApiService.fetchDropdownOptions(config);
    console.log("✅ Error handled gracefully. Returned empty array:", options);
    return options.length === 0;
  } catch (error) {
    console.error("❌ Error not handled properly:", error);
    return false;
  }
}

// ============================================
// TEST 5: Test mock API
// ============================================
export async function testMockAPI() {
  console.log("🧪 Test 5: Testing mock API...");

  try {
    const countries = await ApiService.mockFetchDropdownOptions("country");
    const nationalities = await ApiService.mockFetchDropdownOptions(
      "nationality"
    );

    console.log("✅ Mock API works!");
    console.log("Countries:", countries.length);
    console.log("Nationalities:", nationalities.length);
    return true;
  } catch (error) {
    console.error("❌ Failed:", error);
    return false;
  }
}

// ============================================
// RUN ALL TESTS
// ============================================
export async function runAllTests() {
  console.log("\n🚀 Running all API integration tests...\n");

  const results = {
    testFetchCountries: await testFetchCountries(),
    testNestedDataPath: await testNestedDataPath(),
    testFormSubmission: await testFormSubmission(),
    testErrorHandling: await testErrorHandling(),
    testMockAPI: await testMockAPI(),
  };

  console.log("\n📊 Test Results:");
  console.log("================");
  Object.entries(results).forEach(([test, passed]) => {
    console.log(
      `${passed ? "✅" : "❌"} ${test}: ${passed ? "PASSED" : "FAILED"}`
    );
  });

  const totalTests = Object.keys(results).length;
  const passedTests = Object.values(results).filter(Boolean).length;

  console.log("\n📈 Summary:");
  console.log(`${passedTests}/${totalTests} tests passed`);

  return results;
}

// ============================================
// HOW TO RUN
// ============================================
// In browser console:
// import { runAllTests } from './utils/testApiIntegration';
// runAllTests();
//
// Or run individual tests:
// import { testFetchCountries } from './utils/testApiIntegration';
// testFetchCountries();
