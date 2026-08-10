---
company: Source Meridian
role: Frontend Developer
location: Cartagena, Colombia
start: 2025-05-01
end: 2026-08-01
resume: full
stack:
  - Angular
  - Nx
  - Module Federation
  - TypeScript
  - Vitest
  - GitHub Actions
  - Kubernetes (GKE)
  - React
  - Next.js
caseStudy:
  problem: >-
    PL-Reports (Purple Labs Reportr) was a large-scale Nx monorepo running Angular 17 behind a
    Module Federation setup. Its CI test stage took approximately 45 minutes, which put a hard
    floor under how fast anything could reach production.
  decision: >-
    I led the upgrade to Angular 21 across the whole federated setup — migrating Angular Material,
    Radix-NG, ag-Grid and ApexCharts along with it — and rebuilt the CI test stage around Nx task
    parallelization rather than throwing more runners at it: each project and library got its own
    execution thread, and the two heaviest modules, admin-center and agile-report-retriever, were
    subdivided into groups of 2 and 4 threads. Separately, I moved the suite off Jest and onto
    Vitest to align with Angular's official direction.
  result: >-
    The test stage went from approximately 45 minutes to approximately 2 minutes, a reduction
    of around 95%, with the Vitest migration contributing a further 20-30% on top.
# Kept to roughly one printed line each: a resume bullet that wraps is a bullet that
highlights:
  - Led the Angular 17 to 21 upgrade of a large-scale Nx monorepo built on Module Federation.
  - Cut the CI test stage from ~45 min to ~2 min (~95%) via Nx task parallelization in GitHub Actions.
  - Migrated the full unit test suite from Jest to Vitest, reducing pipeline time a further 20-30%.
  - Enabled strictTemplates project-wide, moving template type errors from production to development.
  - Built a custom Looker visualization in vanilla JavaScript, rendered inside the reporting platform.
---
