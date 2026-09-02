export {};

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: "admin" | "management" | "engine" | "limbah";
    };
  }
}
