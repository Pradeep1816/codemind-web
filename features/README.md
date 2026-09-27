# Feature boundaries

Product functionality belongs in `features/<feature-name>`. Add a feature only
when its first working route or use case is implemented.

Each feature may contain:

- `api/` for endpoint functions and TanStack Query options
- `components/` for feature-owned UI
- `hooks/` for interactive orchestration
- `schemas/` for Zod input and response boundaries
- `types/` for feature-specific contracts

Dependency direction is:

```text
app routes -> features -> components/lib/stores/types
```

Shared infrastructure must not import from a feature. Features should consume
another feature only through its public exports rather than its internal files.
TanStack Query owns API/server state; Zustand is reserved for durable client UI
preferences and must not duplicate API responses.
