import { AuthController } from "./controllers/auth.controller";
import { DelayController } from "./controllers/delay.controller";
import { DocumentController } from "./controllers/document.controller";
import { EquipmentController } from "./controllers/equipment.controller";
import { IncidentController } from "./controllers/incident.controller";
import { OrderController } from "./controllers/order.controller";
import { PayrollController } from "./controllers/payroll.controller";
import { ReportController } from "./controllers/report.controller";
import { ReferenceController } from "./controllers/reference.controller";
import { RiderController } from "./controllers/rider.controller";
import { UserController } from "./controllers/user.controller";
import { env } from "./config/env";
import { createRequireAuth } from "./middleware/requireAuth";
import { DelayOrderModel, RestaurantWaitModel } from "./models/delay.model";
import { DocumentModel } from "./models/document.model";
import { EquipmentStockModel } from "./models/equipmentStock.model";
import { IncidentModel } from "./models/incident.model";
import { OrderModel } from "./models/order.model";
import { PayrollLineModel, PayrollRunModel } from "./models/payroll.model";
import { VehicleModel } from "./models/vehicle.model";
import {
  EmploymentTypeModel,
  PlatformModel,
  RestaurantModel,
  ZoneModel,
} from "./models/reference.model";
import { RiderModel } from "./models/rider.model";
import { SessionModel } from "./models/session.model";
import { UserModel } from "./models/user.model";
import {
  MongoListRepository,
  toEmploymentType,
  toPlatform,
  toRestaurant,
  toZone,
} from "./repositories/mongoList.repository";
import { MongoDelayRepository } from "./repositories/mongoDelay.repository";
import { MongoDocumentRepository } from "./repositories/mongoDocument.repository";
import { MongoEquipmentStockRepository } from "./repositories/mongoEquipmentStock.repository";
import { MongoIncidentRepository } from "./repositories/mongoIncident.repository";
import { MongoOrderRepository } from "./repositories/mongoOrder.repository";
import { MongoPayrollRepository } from "./repositories/mongoPayroll.repository";
import { MongoVehicleRepository } from "./repositories/mongoVehicle.repository";
import { MongoRiderRepository } from "./repositories/mongoRider.repository";
import { MongoSessionRepository } from "./repositories/mongoSession.repository";
import { MongoUserRepository } from "./repositories/mongoUser.repository";
import { AuthService } from "./services/auth.service";
import { DelayService } from "./services/delay.service";
import { DocumentService } from "./services/document.service";
import { EquipmentService } from "./services/equipment.service";
import { IncidentService } from "./services/incident.service";
import { OrderService } from "./services/order.service";
import { PayrollService } from "./services/payroll.service";
import { ReportService } from "./services/report.service";
import { ReferenceService } from "./services/reference.service";
import { RiderService } from "./services/rider.service";
import { UserService } from "./services/user.service";

export const userRepository = new MongoUserRepository(UserModel);
export const userService = new UserService(userRepository);
export const userController = new UserController(userService);

export const sessionRepository = new MongoSessionRepository(SessionModel);
export const authService = new AuthService(userService, sessionRepository, env.sessionTtlMs);
export const authController = new AuthController(authService);
export const requireAuth = createRequireAuth(sessionRepository, userService);

export const riderRepository = new MongoRiderRepository(RiderModel);

export const delayRepository = new MongoDelayRepository(DelayOrderModel, RestaurantWaitModel);

export const documentRepository = new MongoDocumentRepository(DocumentModel);
export const documentService = new DocumentService(documentRepository);
export const documentController = new DocumentController(documentService);

export const incidentRepository = new MongoIncidentRepository(IncidentModel);
export const incidentService = new IncidentService(incidentRepository);
export const incidentController = new IncidentController(incidentService);

export const vehicleRepository = new MongoVehicleRepository(VehicleModel);
export const equipmentStockRepository = new MongoEquipmentStockRepository(EquipmentStockModel);
export const equipmentService = new EquipmentService(vehicleRepository, equipmentStockRepository);
export const equipmentController = new EquipmentController(equipmentService);

export const orderRepository = new MongoOrderRepository(OrderModel);
export const orderService = new OrderService(orderRepository);
export const orderController = new OrderController(orderService);

export const payrollRepository = new MongoPayrollRepository(PayrollRunModel, PayrollLineModel);
export const payrollService = new PayrollService(payrollRepository);
export const payrollController = new PayrollController(payrollService);

export const riderService = new RiderService(riderRepository, documentRepository, payrollRepository);
export const riderController = new RiderController(riderService);

export const platformRepository = new MongoListRepository(PlatformModel, toPlatform);
export const reportService = new ReportService(
  orderRepository,
  delayRepository,
  riderRepository,
  platformRepository,
);
export const reportController = new ReportController(reportService);
export const zoneRepository = new MongoListRepository(ZoneModel, toZone);
export const restaurantRepository = new MongoListRepository(RestaurantModel, toRestaurant);
export const employmentTypeRepository = new MongoListRepository(EmploymentTypeModel, toEmploymentType);

export const delayService = new DelayService(delayRepository, orderRepository, restaurantRepository);
export const delayController = new DelayController(delayService);
export const referenceService = new ReferenceService(
  platformRepository,
  zoneRepository,
  restaurantRepository,
  employmentTypeRepository,
);
export const referenceController = new ReferenceController(referenceService);
