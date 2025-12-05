import AreaOfWork from "@/app/models/AreaOfWork";
import { Op } from "sequelize";

type Location = {
  location: string;
};

export async function GET(request: Request, context: { params: Location }) {
  const location = context.params.location;
  const locations: AreaOfWork[] = await AreaOfWork.findAll({
    where: {
      city: {
        [Op.like]: `%${location.toUpperCase()}%`, // Use Op.like for LIKE condition
      },
      areaOfInfluence: {
        [Op.ne]: "Redespacho", // Filter by areaOfWork != 'Redespacho'
      },
    },
    raw: true,
  });
  return Response.json(locations);
}
