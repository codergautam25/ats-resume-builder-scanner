import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

export async function bootstrapServer() {
  // Import root server setup dynamically or directly
  await import("../server.ts");
}

if (require.main === module || process.argv[1]?.endsWith("server/index.ts")) {
  bootstrapServer();
}
