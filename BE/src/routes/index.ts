import { Router } from "express";
import { authRouter } from "./auth.routes";
import { delayRouter } from "./delay.routes";
import { documentRouter } from "./document.routes";
import { equipmentRouter } from "./equipment.routes";
import { healthRouter } from "./health.routes";
import { incidentRouter } from "./incident.routes";
import { orderRouter } from "./order.routes";
import { payrollRouter } from "./payroll.routes";
import { reportRouter } from "./report.routes";
import {
  employmentTypeRouter,
  platformRouter,
  restaurantRouter,
  zoneRouter,
} from "./reference.routes";
import { riderRouter } from "./rider.routes";
import { userRouter } from "./user.routes";

export const apiRouter = Router();

apiRouter.use(healthRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/riders", riderRouter);
apiRouter.use("/documents", documentRouter);
apiRouter.use("/delays", delayRouter);
apiRouter.use("/incidents", incidentRouter);
apiRouter.use("/orders", orderRouter);
apiRouter.use("/payroll", payrollRouter);
apiRouter.use("/reports", reportRouter);
apiRouter.use("/equipment", equipmentRouter);
apiRouter.use("/platforms", platformRouter);
apiRouter.use("/zones", zoneRouter);
apiRouter.use("/restaurants", restaurantRouter);
apiRouter.use("/employment-types", employmentTypeRouter);
