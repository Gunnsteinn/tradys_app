import AreaOfWork from "@/app/models/AreaOfWork";
import {
  IsValidRequestQuotationBody,
  FindRingValue,
  VolumePrice,
  WeightPrice,
  FetchPickUpPrice,
} from "@/app/api/helpers/index";

type Body = {
  from: string;
  to: string;
  packages: Packages;
  loadValue: number;
  withdrawal: boolean;
  delivery: boolean;
};

type Packages = [
  {
    price: number;
    length: number;
    width: number;
    height: number;
    weight: number;
    pallet: boolean;
  }
];

const insurance: number = 1;
const extraFeed: number = 0;

export async function POST(req: Request) {
  let withdrawalPrice = 0;
  let deliveryPrice = 0;
  const body: Body = await req.json();

  // Validate request body against the DTO
  console.log(body);
  if (!IsValidRequestQuotationBody(body)) {
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
    });
  }

  const cityFrom: string = body.from.split(" - ")[0].toUpperCase();
  const stateFrom: string = body.from.split(" - ")[1].toUpperCase();
  const cityTo: string = body.to.split(" - ")[0].toUpperCase();
  const stateTo: string = body.to.split(" - ")[1].toUpperCase();

  // Recoleccion
  if (body.withdrawal && stateFrom != "CORDOBA") {
    withdrawalPrice = await FetchPickUpPrice(body, cityFrom, "WITHDRAWAL");
  }
  console.log("withdrawalPrice", withdrawalPrice);

  // Troncal
  const weightValue: number = await WeightPrice(
    stateFrom,
    stateTo,
    body.packages
  );

  const volumeValue: number = await VolumePrice(
    stateFrom,
    stateTo,
    body.packages
  );

  console.log("weightValue", weightValue);
  console.log("volumeValue", volumeValue);

  // Anillos
  let price: number = weightValue > volumeValue ? weightValue : volumeValue;
  if (stateFrom == "CORDOBA") {
    const areaOfWork: AreaOfWork | null = await AreaOfWork.findOne({
      where: {
        city: cityFrom,
        state: stateFrom,
      },
      raw: true,
    });

    const mutiplicator = FindRingValue(areaOfWork?.areaOfInfluence);
    price += price * (mutiplicator ? mutiplicator : 0);
  } else if (stateTo == "CORDOBA") {
    const areaOfWork: AreaOfWork | null = await AreaOfWork.findOne({
      where: {
        city: cityTo,
        state: stateTo,
      },
      raw: true,
    });

    const mutiplicator = FindRingValue(areaOfWork?.areaOfInfluence);
    price += price * (mutiplicator ? mutiplicator : 0);
  }

  // Entrega
  if (body.delivery && stateTo != "CORDOBA") {
    const splitTo = body.to.split(" - ");
    if (splitTo.length === 2) {
      deliveryPrice = await FetchPickUpPrice(body, cityTo, "DELIVERY");
    }
  }

  // Seguro
  const totalInsurance = body.packages.reduce((accumulator: number, pack) => {
    return accumulator + Number(pack.price);
  }, 0);

  console.log("totalInsurance", totalInsurance);
  console.log("Result: ", {
    price: price * (1 + extraFeed / 100),
    withdrawalPrice: withdrawalPrice * (1 + extraFeed / 100),
    deliveryPrice: deliveryPrice * (1 + extraFeed / 100),
    insurance: (totalInsurance * insurance) / 100,
    total:
      Math.ceil(
        ((price + withdrawalPrice + deliveryPrice) * (1 + extraFeed / 100) +
          (totalInsurance * insurance) / 100) *
          100
      ) / 100,
  });
  return Response.json({
    price: price * (1 + extraFeed / 100),
    withdrawalPrice: withdrawalPrice * (1 + extraFeed / 100),
    deliveryPrice: deliveryPrice * (1 + extraFeed / 100),
    insurance: (totalInsurance * insurance) / 100,
    total:
      Math.ceil(
        ((price + withdrawalPrice + deliveryPrice) * (1 + extraFeed / 100) +
          (totalInsurance * insurance) / 100) *
          100
      ) / 100,
  });
}
