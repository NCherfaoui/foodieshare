import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";
import { Counter, Registry } from 'prom-client';

// Initialisation du registre Prometheus
export const register = new Registry();

// Définition des métriques Prometheus
export const httpRequestsTotal = new Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status'],
    registers: [register]
});

export const httpRequestDurationSeconds = new Counter({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route'],
    registers: [register]
});

// Initialisation de Sentry avec plus d'options
export const initializeSentry = () => {
    Sentry.init({
        dsn: process.env.SENTRY_DSN || "https://281aae1e345fbc980d7351f90e920136@o4507720667103232.ingest.de.sentry.io/4508237477249104",
        integrations: [
            nodeProfilingIntegration(),
        ],
        tracesSampleRate: 1.0,
        profilesSampleRate: 1.0,
        environment: process.env.NODE_ENV || 'development',
        debug: process.env.NODE_ENV !== 'production',
        beforeSend(event) {
            if (process.env.NODE_ENV !== 'production') {
                console.log('Sentry Event:', event);
            }
            return event;
        },
        attachStacktrace: true,
    });

    // Configuration supplémentaire de Sentry
    const scope = new Sentry.Scope();
    scope.setTag("service", "backend-api");
    scope.setLevel("error");
    Sentry.setTag("service", "backend-api");
};

// Fonction utilitaire pour le monitoring
export const recordMetrics = (method: string, route: string, status: number, duration: number) => {
    httpRequestsTotal.labels(method, route, status.toString()).inc();
    httpRequestDurationSeconds.labels(method, route).inc(duration);
};

// Initialisation
initializeSentry();
