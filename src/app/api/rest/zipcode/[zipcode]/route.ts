import AreaOfWork from "@/app/models/AreaOfWork";
import { Op } from "sequelize";

type zipCode = {
  zipcode: string;
};

export async function GET(request: Request, context: { params: zipCode }) {
  const zipCode = context.params.zipcode;
  const locationsByZipcode: AreaOfWork[] = await AreaOfWork.findAll({
    where: {
      zipCode: {
        [Op.like]: `%${zipCode}%`, // Use Op.like for LIKE condition
      },
      areaOfInfluence: {
        [Op.ne]: "Redespacho", // Filter by areaOfWork != 'Redespacho'
      },
    },
    raw: true,
  });
  return Response.json(locationsByZipcode);
}
