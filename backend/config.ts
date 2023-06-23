import { join } from "path"

const { env } = process

export default {

    // The port to listen on
    port: env.PORT || 5005,

    // The host to listen on
    host: env.HOST || "0.0.0.0",

    // Change this in production
    // To generate one run `require("bcryptjs").genSaltSync(10)`
    salt: env.SALT || "$2a$10$ZyXp2reLAbPDwNIIqzurIu",

    authDelay: env.NODE_ENV === "test" ? 0 : 1000,

    jobsDir: join(__dirname, env.NODE_ENV === "test" ? "jobs/test-data" : "jobs/data"),

    // How often to check export status (in milliseconds)
    statusCheckInterval: +(env.STATUS_CHECK_INTERVAL || 5000),

    // Keep approved jobs for how long (minutes since approval)?
    approvedJobMaxLifetimeMinutes: +(env.APPROVED_JOBS_LIFETIME_MINUTES || 60)
}
