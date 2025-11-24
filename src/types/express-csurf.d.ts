import "express";

declare module "express-serve-static-core" {
  interface Request {
    csrfToken(): string;
  }
}
declare module "express" {
  interface Request {
    csrfToken(): string;
  }
}
