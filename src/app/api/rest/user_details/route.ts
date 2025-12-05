import UserDetail from "@/app/models/UserDetails";

type Body = {
  orderDetail: {
    totalPrice: 0;
    name: string;
    lastName: string;
    document: string;
    email: string;
    phone: string;
    cellPhone: string;
  };
  data: {
    from: string;
    to: string;
    packages: [
      {
        length: number;
        width: number;
        height: number;
        weight: number;
        pallet: boolean;
      }
    ];
    loadValue: number;
    withdrawal: boolean;
    delivery: boolean;
  };
  quotationResponse: {
    price: number;
    withdrawalPrice: number;
    deliveryPrice: number;
    insurance: number;
    total: number;
  };
  ordenNumber: number;
};

export async function POST(req: Request) {
  const body: Body = await req.json();

  const detail: string = body.data.packages
    .map((pkg, index) => {
      if (pkg.pallet) {
        return `Pallet ${index + 1}: Length: ${pkg.length}, Width: ${
          pkg.width
        }, Height: ${pkg.height}, Weight: ${pkg.weight}`;
      }
      return `Package ${index + 1}: Length: ${pkg.length}, Width: ${
        pkg.width
      }, Height: ${pkg.height}, Weight: ${pkg.weight}`;
    })
    .join("\n");

  const userDetail: UserDetail | null = await UserDetail.create({
    name: body.orderDetail.name,
    ordenNumber: body.ordenNumber,
    lastName: body.orderDetail.lastName,
    document: body.orderDetail.document,
    email: body.orderDetail.email,
    phone: body.orderDetail.phone,
    cellPhone: body.orderDetail.cellPhone,
    description: detail,
    total: body.quotationResponse.total,
    createdAt: Date(),
    updatedAt: Date(),
  });

  return Response.json({ userDetail });
}
