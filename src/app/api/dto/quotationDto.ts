interface Package {
  length: number;
  width: number;
  height: number;
  weight: number;
  pallet: boolean;
}

interface RequestQuotationBody {
  from: string;
  to: string;
  Packages: Package[];
  loadValue: number;
  withdrawal: boolean;
  delivery: boolean;
}
