import * as Sentry from "@sentry/react";

Sentry.init({
    dsn: "https://7ea4a9a1171c3539.ingest.de.sentry.io/4508649117179904",
    integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration(),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0, // Capture 100% of transactions in dev, reduce in production
    // Session Replay
    replaysSessionSampleRate: 0.1, // 10% of sessions
    replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors
    environment: import.meta.env.MODE, // 'development' or 'production'
});

export default Sentry;
