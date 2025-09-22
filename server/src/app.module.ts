import "reflect-metadata";
import { Global, Module } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";

import { PrismaModule } from "./modules/prisma/prisma.module";
import { ShiftsModule } from "./modules/shifts/shifts.module";
import { WorkersModule } from "./modules/workers/workers.module";
import { WorkplacesModule } from "./modules/workplaces/workplaces.module";
import { AllExceptionsFilter } from "./filters/all-exceptions.filter";

@Global()
@Module({
  imports: [PrismaModule, ShiftsModule, WorkersModule, WorkplacesModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
