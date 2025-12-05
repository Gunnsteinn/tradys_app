export function FindWeightCategory(weight: number): string {
  const weightTable: { [key: string]: number } = {
    "Mínimo - 1": 1,
    "5": 5,
    "10": 10,
    "20": 20,
    "30": 30,
    "40": 40,
    "50": 50,
    "60": 60,
    "70": 70,
    "80": 80,
    "90": 90,
    "100": 100,
    "150": 150,
    "200": 200,
    "250": 250,
    "300": 300,
    "350": 350,
    "400": 400,
    "450": 450,
    "500": 500,
    "600": 600,
    "700": 700,
    "800": 800,
    "900": 900,
    "1000": 1000,
  };

  let category = "Mínimo - 1"; // Default to "Mínimo - 1" if weight is less than 1
  const sortedWeights = Object.entries(weightTable).sort((a, b) => a[1] - b[1]);

  for (const [key, categoryWeight] of sortedWeights) {
    if (weight <= categoryWeight) {
      category = key;
      break;
    }
  }

  return category;
}

export function FindRingValue(areaOfInfluence?: string): number | null {
  if (!areaOfInfluence) {
    return null;
  }

  const ringTable: { [key: string]: number } = {
    "0.Cabecera": 0,
    "1.Hasta 50 Kms": 0.4,
    "2.Entre 50 y 150 Kms": 0.6,
    "3.Mas de 150 Kms": 0.8,
    Interior: 0,
  };

  return ringTable[areaOfInfluence] ?? null;
}
