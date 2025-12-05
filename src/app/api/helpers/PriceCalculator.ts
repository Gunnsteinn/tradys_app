import Rate from "@/app/models/Rate";
import { NormalizeWord } from "./StringFormat";
import PickUp from "@/app/models/PickUp";
import { FindWeightCategory } from "./MappersTable";

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
    length: number;
    width: number;
    height: number;
    weight: number;
    pallet: boolean;
  }
];

export async function VolumePrice(
  stateFrom: string,
  stateTo: string,
  packages: Packages
): Promise<number> {
  const volume = packages.reduce((accumulator: number, pack) => {
    return accumulator + Number(pack.length * pack.width * pack.height);
  }, 0);

  const rate: Rate | null = await Rate.findOne({
    where: {
      weight: "Volumen - M3",
      from: NormalizeWord(stateFrom),
      to: NormalizeWord(stateTo),
    },
    raw: true,
  });

  // console.log("ACAAAAA", rate);
  if (!rate) {
    return 0;
  }
  const price = (volume / 1000000) * rate.rate_city;
  return price > 5000 ? price : 5000;
}

export async function WeightPrice(
  stateFrom: string,
  stateTo: string,
  packages: Packages
): Promise<number> {
  const rate: Rate | null = await Rate.findOne({
    where: {
      weight: FindWeightCategory(
        packages.reduce((accumulator: number, pack) => {
          return accumulator + Number(pack.weight);
        }, 0)
      ),
      from: NormalizeWord(stateFrom),
      to: NormalizeWord(stateTo),
    },
    raw: true,
  });

  //console.log(rate);
  if (!rate) {
    return 0;
  }
  return rate.rate_city;
}

export async function FetchPickUpPrice(
  body: Body,
  city: string,
  type: string
): Promise<number> {
  let price = 0;
  const pickUp: PickUp | null = await PickUp.findOne({
    where: {
      from: city,
      type: type,
    },
    raw: true,
  });

  if (pickUp == null) {
    return price;
  }

  console.log("pickUp", pickUp);
  const hasPallet = body.packages.some((pack) => pack.pallet);
  if (hasPallet) {
    body.packages.forEach((pack) => {
      if (pack.pallet) {
        price += pickUp.pallet;
      }
    });
  } else {
    const packageCount = body.packages.length;
    console.log("packageCount", packageCount);
    if (packageCount === 1) {
      price = pickUp.package;
    } else if (packageCount > 1 && packageCount <= 5) {
      price = pickUp.package_plus2;
    } else {
      price = pickUp.package_plus5;
    }
  }

  console.log("price", price);
  return price;
}
