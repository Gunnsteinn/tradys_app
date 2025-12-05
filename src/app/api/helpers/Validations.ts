export function IsValidRequestQuotationBody(
  body: any
): body is RequestQuotationBody {
  if (
    typeof body.from !== "string" ||
    typeof body.to !== "string" ||
    !Array.isArray(body.packages) ||
    body.packages.some(
      (pkg: any) =>
        typeof pkg.length !== "string" ||
        typeof pkg.width !== "string" ||
        typeof pkg.height !== "string" ||
        typeof pkg.weight !== "string"
    ) ||
    typeof body.loadValue !== "number" ||
    typeof body.withdrawal !== "boolean" ||
    typeof body.delivery !== "boolean"
  ) {
    return false;
  }
  return true;
}
