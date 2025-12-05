import Rate from "@/app/models/Rate";
import { AxiosAdapter } from "@/lib/adapter/axios.adapter";

const http = new AxiosAdapter();

export async function GET() {
  const rates = await Rate.findAll();
  return Response.json({ status: "200", data: rates });
}
