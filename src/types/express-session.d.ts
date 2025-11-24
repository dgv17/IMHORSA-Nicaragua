import "express-session";

declare module "express-session" {
  interface SessionData {
    user?: {
      id: number;
      username: string;
      rol: number;
    };
    restoreToken?: string;
  }
}
