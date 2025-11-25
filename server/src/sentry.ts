import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
    dsn: "https://1830aed5d6c67e9f4213bd719c35e1aa@o4510408117125120.ingest.de.sentry.io/4510408130887760",
    integrations: [
        nodeProfilingIntegration(),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0, // Capture 100% of transactions
    // Profiling
    profilesSampleRate: 1.0, // Profile 100% of transactions
    environment: process.env.NODE_ENV || 'development',
});

export default Sentry;
