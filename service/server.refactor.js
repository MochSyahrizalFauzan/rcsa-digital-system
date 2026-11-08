import "dotenv/config";
import db from "./config/database.js";
import createApp from "./app.js";

const PORT = process.env.REFACTOR_PORT || 5001;

const startServer = async () => {
  try {
    // 1. Uji koneksi pool database
    await db.query("SELECT 1");
    console.log("[DB] Database connection pool established successfully.");

    // 2. Inisialisasi Express App dengan Modular Monolith
    const app = createApp(db);

    const server = app.listen(PORT, () => {
      console.log(`[MODULAR BACKEND] Server refactor berjalan pada http://localhost:${PORT}`);
      console.log(`[HEALTH] Health check: http://localhost:${PORT}/health`);
    });

    // 3. Graceful Shutdown
    const gracefulShutdown = async (signal) => {
      console.log(`[SHUTDOWN] Menerima ${signal}. Menutup server secara aman...`);
      server.close(async () => {
        try {
          await db.end();
          console.log("[DB] Database connection pool closed.");
          process.exit(0);
        } catch (err) {
          console.error("[DB] Error saat menutup connection pool:", err);
          process.exit(1);
        }
      });
    };

    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  } catch (error) {
    console.error("[FATAL] Gagal menghubungkan ke database atau memulai server:", error);
    process.exit(1);
  }
};

startServer();
