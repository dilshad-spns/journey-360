import { ApiConfig, FieldOption } from "../types/schema";

/**
 * API Service for fetching dropdown options and submitting form data
 */
export class ApiService {
  /**
   * Fetch dropdown options from an external API
   * @param apiConfig - Configuration for the API call
   * @returns Array of field options
   */
  static async fetchDropdownOptions(
    apiConfig: ApiConfig
  ): Promise<FieldOption[]> {
    try {
      const {
        url,
        method = "GET",
        headers = {},
        params,
        dataPath,
        labelKey = "label",
        valueKey = "value",
      } = apiConfig;

      // Build URL with query parameters for GET requests
      let fetchUrl = url;
      if (method === "GET" && params) {
        const queryString = new URLSearchParams(params).toString();
        fetchUrl = `${url}${url.includes("?") ? "&" : "?"}${queryString}`;
      }

      // Prepare fetch options
      const fetchOptions: RequestInit = {
        method,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
      };

      // Add body for POST requests
      if (method === "POST" && params) {
        fetchOptions.body = JSON.stringify(params);
      }

      // Make the API call
      const response = await fetch(fetchUrl, fetchOptions);

      if (!response.ok) {
        throw new Error(
          `API request failed: ${response.status} ${response.statusText}`
        );
      }

      let data = await response.json();

      // Extract data from nested path if specified (e.g., "data.countries")
      if (dataPath) {
        const pathParts = dataPath.split(".");
        for (const part of pathParts) {
          data = data?.[part];
        }
      }

      // Ensure data is an array
      if (!Array.isArray(data)) {
        console.error("API response is not an array:", data);
        return [];
      }

      // Map the response to FieldOption format
      return data.map((item: any) => ({
        label: item[labelKey] || item.label || item.name || String(item),
        value: item[valueKey] || item.value || item.id || String(item),
      }));
    } catch (error) {
      console.error("Error fetching dropdown options:", error);
      // Return empty array on error - component will show placeholder
      return [];
    }
  }

  /**
   * Submit form data to an external server
   * @param submitUrl - The endpoint URL to submit to
   * @param formData - The form data to submit
   * @param options - Additional fetch options (headers, method, etc.)
   * @returns Response data from the server
   */
  static async submitFormData(
    submitUrl: string,
    formData: Record<string, any>,
    options?: {
      method?: "POST" | "PUT";
      headers?: Record<string, string>;
      transformData?: (data: Record<string, any>) => any;
    }
  ): Promise<any> {
    try {
      const { method = "POST", headers = {}, transformData } = options || {};

      // Transform data if a transformer function is provided
      const dataToSend = transformData ? transformData(formData) : formData;

      const response = await fetch(submitUrl, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Server error: ${response.status} ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error submitting form data:", error);
      throw error;
    }
  }

  /**
   * Check if a URL is accessible (health check)
   * @param url - The URL to check
   * @returns true if accessible, false otherwise
   */
  static async checkEndpointHealth(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, {
        method: "HEAD",
        mode: "no-cors", // Allow checking cross-origin endpoints
      });
      return response.ok || response.type === "opaque";
    } catch (error) {
      console.error("Endpoint health check failed:", error);
      return false;
    }
  }

  /**
   * Mock API for development/testing
   * Simulates API responses for dropdown options
   */
  static async mockFetchDropdownOptions(
    fieldName: string
  ): Promise<FieldOption[]> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const mockData: Record<string, FieldOption[]> = {
      country: [
        { label: "United States", value: "us" },
        { label: "United Kingdom", value: "uk" },
        { label: "Canada", value: "ca" },
        { label: "Australia", value: "au" },
        { label: "Germany", value: "de" },
        { label: "France", value: "fr" },
        { label: "India", value: "in" },
        { label: "Japan", value: "jp" },
        { label: "Singapore", value: "sg" },
      ],
      nationality: [
        { label: "American", value: "us" },
        { label: "British", value: "uk" },
        { label: "Canadian", value: "ca" },
        { label: "Australian", value: "au" },
        { label: "Indian", value: "in" },
        { label: "Chinese", value: "cn" },
        { label: "Japanese", value: "jp" },
      ],
      destination: [
        { label: "Worldwide", value: "worldwide" },
        { label: "Europe", value: "europe" },
        { label: "Asia", value: "asia" },
        { label: "North America", value: "north_america" },
        { label: "South America", value: "south_america" },
        { label: "Africa", value: "africa" },
        { label: "Oceania", value: "oceania" },
      ],
    };

    return mockData[fieldName] || [];
  }
}
