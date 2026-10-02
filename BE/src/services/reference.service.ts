import type {
  EmploymentTypeRecord,
  PlatformRecord,
  RestaurantRecord,
  ZoneRecord,
} from "../domain/reference";
import type { ListRepository } from "../repositories/list.repository";

export class ReferenceService {
  constructor(
    private readonly platforms: ListRepository<PlatformRecord>,
    private readonly zones: ListRepository<ZoneRecord>,
    private readonly restaurants: ListRepository<RestaurantRecord>,
    private readonly employmentTypes: ListRepository<EmploymentTypeRecord>,
  ) {}

  async listPlatforms() {
    const platforms = await this.platforms.list();
    return { count: platforms.length, platforms };
  }

  async listZones() {
    const zones = await this.zones.list();
    return { count: zones.length, zones };
  }

  async listRestaurants() {
    const restaurants = await this.restaurants.list();
    return { count: restaurants.length, restaurants };
  }

  async listEmploymentTypes() {
    const employmentTypes = await this.employmentTypes.list();
    return { count: employmentTypes.length, employmentTypes };
  }
}
