import { Request } from "express";

declare module "express" {
  export interface Request {
    user?: {
      id: string;
      role: "user" | "admin";
    };
  }
}

export {};
