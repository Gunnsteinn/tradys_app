import ZipCodes from "@/app/models/ZipCodes";
import { getPreciseDistance } from "geolib";

type Body = {
  from: { city: string; state: string };
  to: { city: string; state: string };
};

export async function POST(req: Request) {
  const body: Body = await req.json();

  const fromValue: ZipCodes | null = await ZipCodes.findOne({
    where: {
      city: body.from.city,
      state: body.from.state,
    },
    raw: true,
  });

  const toValue: ZipCodes | null = await ZipCodes.findOne({
    where: {
      city: body.to.city,
      state: body.to.state,
    },
    raw: true,
  });

  const latitudeFrom: number = Number(fromValue?.lat);
  const longitudeFrom: number = Number(fromValue?.lng);
  const latitudeTo: number = Number(toValue?.lat);
  const longitudeTo: number = Number(toValue?.lng);

  const distance: number = getPreciseDistance(
    { latitude: latitudeFrom, longitude: longitudeFrom },
    { latitude: latitudeTo, longitude: longitudeTo }
  );
  return Response.json({ distance });
}
