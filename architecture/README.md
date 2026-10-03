# Production architecture

This note describes a hypothetical Airbnb-scale platform. The Candolim listing demo is a small original clone: one React app and one Express API backed by a JSON document. The diagram in `airbnb-production-architecture.mmd` is the target shape if that product had to serve global traffic.

## Request path

A guest hits the edge first. The CDN serves HTML shells, JavaScript, CSS, and transformed images. Dynamic calls go through a load balancer and API gateway, which authenticates the request and routes it to a stateless service.

```
User → CDN → Web app → API gateway → Microservices → Databases / cache / search
```

Booking is not a single synchronous write. The booking service publishes an event. Payment and notification services consume it independently.

```
Booking service → event bus → payment
                            → notification
```

## Frontend scaling

- Ship the web app as static assets behind a CDN, with long-lived hashed filenames.
- Cache HTML at the edge with a short TTL, and cache images and scripts aggressively.
- Code-split heavy views such as the photo tour and lightbox.
- Use responsive image variants generated ahead of time, not original camera files.

## API scaling

- Keep services stateless so any replica can handle a request.
- Put a load balancer in front of each service and scale on CPU and queue depth.
- Reject invalid stays at the edge of the booking service before a row is written.
- Use idempotency keys on reservation creates so retries do not double-book.

## Database scaling

- PostgreSQL is the system of record for listings, reservations, and reviews.
- A primary accepts writes. Read replicas serve listing pages and review lists.
- Partition booking and review tables by time or region once a single table becomes the bottleneck.
- Pool connections at the service, not one connection per request.

## Search

- Listing search does not scan PostgreSQL.
- An indexer consumes listing-change events and writes documents to OpenSearch or Elasticsearch.
- Availability filters can be cached in Redis and refreshed when a reservation is confirmed or cancelled.

## Cache

- Redis holds hot listing payloads, quote results for a few minutes, and session or rate-limit counters.
- Cache keys are explicit (`listing:{id}`) so a listing update can delete one key.

## Media

- Original photos live in object storage.
- A media service writes resized, compressed derivatives.
- The image CDN is the only public path to those files.

## Deployment

- Each service is a Docker image built in CI.
- Kubernetes runs multiple replicas per service and autoscales them.
- CI/CD runs tests, builds images, and rolls out with health checks.
- Database migrations are a separate, reviewed step from application deploys.

## Observability

- Services write structured logs to a central store.
- Traces follow a request from the gateway through booking and the event bus.
- Metrics cover latency, error rate, saturation, and booking success.
- Alerts page on error spikes, replica lag, queue backlog, and failed payments.
