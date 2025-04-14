import { Request, Response, NextFunction } from "express";

interface ErrorOptions {
  message: any;
  status?: number;
  errorType?: string;
}

export function globalErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const errorPath = err.stack?.split("\n")[1]?.trim() || "Unknown path";
  console.error("[ERROR]", err.message || err, "\nAt:", errorPath);

  res.status(err.status || 500).json({
    message: err.message || "Something went wrong",
    errorType: err.errorType || "UNKNOWN_ERROR",
    path: errorPath,
  });
}

export function throwError(options: ErrorOptions) {
  const error = new Error(options.message);
  (error as any).status = options.status || 500;
  (error as any).errorType = options.errorType || "UNKNOWN_ERROR";
  throw error;
}
