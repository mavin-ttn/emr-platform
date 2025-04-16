import { createProxyMiddleware } from "http-proxy-middleware";
import { Express } from "express";
import { proxyRoutes } from "../constants";

export const registerProxyRoutes = (app: Express) => {
  proxyRoutes.forEach(({ path, target }) => {
    app.use(
      path,
      createProxyMiddleware({
        target,
        changeOrigin: true,
      })
    );
  });
};
