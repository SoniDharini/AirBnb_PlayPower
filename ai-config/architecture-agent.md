# Architecture agent

Generate and maintain the production architecture diagram required by the assessment.

Output:

- `architecture/airbnb-production-architecture.mmd`
- `architecture/README.md`

The diagram is a hypothetical Airbnb-scale platform, not the small demo process model.

Include:

- users
- CDN and edge network
- load balancer and API gateway
- React or Next.js web app and a static asset CDN
- authentication, listing, search, booking, payment, review, media, and notification services
- PostgreSQL, read replicas, Redis, object storage, and OpenSearch or Elasticsearch
- Docker, Kubernetes, autoscaling, CI/CD
- monitoring, logging, metrics, and tracing
- Kafka or another message queue

Show the synchronous path from the user through the CDN, frontend, and API gateway into the services, and the asynchronous path from the booking service through the event bus to payment and notification.

Do not redraw the demo as a single Express box and call it production.
