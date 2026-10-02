import type { EmploymentTypeRecord, PlatformRecord, RestaurantRecord, ZoneRecord } from "../domain/reference";
import type { ListRepository } from "../repositories/list.repository";
import employmentTypesJson from "./portalEmploymentTypes.json";
import platformsJson from "./portalPlatforms.json";
import restaurantsJson from "./portalRestaurants.json";
import zonesJson from "./portalZones.json";

const platforms = platformsJson as PlatformRecord[];
const zones = zonesJson as ZoneRecord[];
const restaurants = restaurantsJson as RestaurantRecord[];
const employmentTypes = employmentTypesJson as EmploymentTypeRecord[];

async function seedList<T>(repository: ListRepository<T>, rows: T[]): Promise<number> {
  if ((await repository.count()) > 0) return 0;
  return repository.insertMany(rows);
}

export function seedPlatforms(repository: ListRepository<PlatformRecord>): Promise<number> {
  return seedList(repository, platforms);
}

export function seedZones(repository: ListRepository<ZoneRecord>): Promise<number> {
  return seedList(repository, zones);
}

export function seedRestaurants(repository: ListRepository<RestaurantRecord>): Promise<number> {
  return seedList(repository, restaurants);
}

export function seedEmploymentTypes(repository: ListRepository<EmploymentTypeRecord>): Promise<number> {
  return seedList(repository, employmentTypes);
}
