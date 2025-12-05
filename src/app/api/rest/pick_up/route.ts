import PickUp from "@/app/models/PickUp";
import { AxiosAdapter } from "@/lib/adapter/axios.adapter";

const http = new AxiosAdapter();

export async function GET() {
  const pickups = await PickUp.findAll();
  return Response.json({ status: "200", data: pickups });
}
