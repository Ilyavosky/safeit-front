# SafeIT Front - Arquitectura

```mermaid
flowchart LR
    U["Usuario"] --> MW["middleware.ts<br/>protege las rutas con sesión"]
    MW --> A["App Router<br/>src/app"]
    A --> G["(auth)<br/>login, registro y MFA"]
    A --> P["(app)<br/>dashboard, dominios, activos,<br/>hallazgos, reportes, auditoría,<br/>análisis público y configuración"]
    P --> C["Componentes<br/>src/components"]
    C --> H["Hooks<br/>src/hooks"]
    H --> L["Cliente API tipado<br/>src/lib/api"]
    G --> L
    L -->|"/api/* (rewrite de Next)"| B["API SafeIT<br/>FastAPI en Railway"]
```

El front nunca llama al backend directamente. Todas las peticiones van a `/api/*` y Next las reenvía a la API definida en `API_URL`, así la cookie de refresh es del mismo origen y no hace falta CORS. El archivo `middleware.ts` protege las rutas del grupo `(app)` y el cliente de `src/lib/api` está tipado a partir del `openapi.json` del backend.

## Más información

- [About](ABOUT.md)
- [README](README.md)
