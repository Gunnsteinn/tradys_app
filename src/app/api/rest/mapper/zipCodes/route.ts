import { AxiosAdapter } from "@/lib/adapter/axios.adapter";
import * as fs from "fs";
import path from "path";

const http = new AxiosAdapter();

export async function GET() {
  const filePath = path.join(
    process.cwd(),
    "files",
    "zipcodes",
    "buenos_aires.json"
  );

  let rawData = fs.readFileSync(filePath, "utf8");
  let jsonData = JSON.parse(rawData);
  let response = new Array();
  jsonData = jsonData.map((item: any) => {
    response.push({
      city: item.nombre,
      region: item.partido,
      state: "BUENOS_AIRES",
      zipCode: item.cp,
      lat: +item.latitud,
      lng: +item.longitud,
      createdAt: "--",
      updatedAt: "--",
    });
  });

  return Response.json({ status: "200", data: response });
}
