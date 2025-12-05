import { AxiosAdapter } from "@/lib/adapter/axios.adapter";
import * as fs from "fs";
import path from "path";

const http = new AxiosAdapter();

export async function GET() {
  const filePath = path.join(
    process.cwd(),
    "files",
    "areaOfWork",
    "city-all.csv"
  );

  try {
    // Read the raw data from the file
    let rawData = fs.readFileSync(filePath, "utf8");

    // Split the raw data into rows
    const rows = rawData.split("\n");

    // Initialize an array to store the parsed data
    const parsedData = [];

    // Iterate over each row
    for (const row of rows) {
      // Split the row into values
      const values = row.split(",");

      // Extract the values and create an object
      const dataObject = {
        deposit: values[0],
        areaOfInfluence: values[1],
        city: values[3],
        state: values[4].trim(),
        zipCode: values[2],
        lat: null,
        lng: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Push the object into the parsedData array
      parsedData.push(dataObject);
    }

    // Return the parsed data as JSON response
    return Response.json({ status: "200", data: parsedData });
  } catch (error) {
    // Handle any errors
    console.error("Error reading file:", error);
    return Response.json({ status: "500", error: error });
  }
}
