import axios from "axios";
import { FormSchema } from "../types/schema";

export async function callSmartSchemaAPI(
  userStory: string,
  schema?: FormSchema
): Promise<FormSchema> {
  try {
    const response = await axios.post(
      "http://localhost:3002/api/smart-schema",
      {
        userContext: userStory,
        schema: schema,
      }
    );
    console.log("Smart Schema API response:", response.data);
    return response.data.schema;
  } catch (error) {
    console.error("Error calling Smart Schema API:", error);
    throw error;
  }
}
