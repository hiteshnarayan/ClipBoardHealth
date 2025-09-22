import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
} from "@nestjs/common";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();

    let status = 500;
    let body: any = { statusCode: 500, message: "Internal server error" };

    if (exception instanceof BadRequestException) {
      const resp = exception.getResponse() as any;
      const message =
        (resp && (Array.isArray(resp.message) ? resp.message[0] : resp.message)) ||
        exception.message;
      status = 400;
      body = { statusCode: 400, message, error: "Bad Request" };
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const resp = exception.getResponse();
      body = typeof resp === "object" ? resp : { statusCode: status, message: resp };
    }

    res.status(status).json(body);
  }
}
