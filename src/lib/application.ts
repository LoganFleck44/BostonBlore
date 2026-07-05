import { packages } from "@/lib/site";

export const applicationPlans = packages.filter((pkg) => pkg.name !== "In-Person 1:1");

export function isValidApplicationPlan(plan: string | null | undefined) {
  return applicationPlans.some((pkg) => pkg.name === plan);
}
