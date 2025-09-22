import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
} from "@nestjs/common";
import { Request } from "express";
import { nextLink, omitShard, PaginationPage } from "../shared/pagination";
import {
  type Page,
  PaginatedResponse,
  type Response,
} from "../shared/shared.types";
import { ShiftDTO } from "../shifts/shifts.schemas";
import {
  type CreateWorker,
  createWorkerSchema,
  WorkerDTO,
} from "./workers.schemas";
import { WorkersService } from "./workers.service";

@Controller("workers")
export class WorkersController {
  constructor(private readonly service: WorkersService) {}

  @Post()
  async create(@Body() data: unknown): Promise<Response<WorkerDTO>> {
    const result = createWorkerSchema.safeParse(data);
    if (!result.success) {
      const issue = result.error.issues[0];
      throw new BadRequestException(
        issue ? `${issue.message}: '${issue.path.join(".")}'` : "Validation failed",
      );
    }
    return { data: await this.service.create(result.data) };
  }

  @Get("/claims")
  async getClaims(
    @Req() request: Request,
    @Query("workerId", ParseIntPipe) id: number,
    @PaginationPage() page: Page,
  ): Promise<PaginatedResponse<ShiftDTO>> {
    const { data, nextPage } = await this.service.getClaims({ id, page });

    return {
      data: data.map(omitShard),
      links: { next: nextLink({ nextPage, request }) },
    };
  }

  @Get("/:id")
  async getById(
    @Param("id") idParam: string,
  ): Promise<Response<WorkerDTO>> {
    if (!/^\d+$/.test(idParam)) {
      throw new BadRequestException(
        "Validation failed (numeric string is expected)",
      );
    }
    const id = parseInt(idParam, 10);
    const data = await this.service.getById(id);
    if (!data) {
      throw new Error(`ID ${id} not found.`);
    }

    return { data: omitShard(data) };
  }

  @Get()
  async get(
    @Req() request: Request,
    @PaginationPage() page: Page,
  ): Promise<PaginatedResponse<WorkerDTO>> {
    const { data, nextPage } = await this.service.get({ page });

    return {
      data: data.map(omitShard),
      links: { next: nextLink({ nextPage, request }) },
    };
  }
}
