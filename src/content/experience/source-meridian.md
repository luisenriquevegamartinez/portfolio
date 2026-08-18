---
company: Source Meridian
role:
  en: Frontend Developer
  es: Desarrollador Frontend
location:
  en: Medellín, Colombia (remote)
  es: Medellín, Colombia (remoto)
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
  en:
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
  es:
    problem: >-
      PL-Reports (Purple Labs Reportr) era un monorepo Nx de gran escala sobre Angular 17 con una
      arquitectura de Module Federation. Su stage de pruebas en CI tardaba aproximadamente 45
      minutos, lo que imponía un piso duro a la velocidad con la que cualquier cambio llegaba a
      producción.
    decision: >-
      Lideré la actualización a Angular 21 en todo el setup federado —migrando en el proceso
      Angular Material, Radix-NG, ag-Grid y ApexCharts— y reconstruí el stage de pruebas alrededor
      de la paralelización de tareas con Nx en lugar de sumar más runners: cada proyecto y librería
      recibió su propio hilo de ejecución, y los dos módulos más pesados, admin-center y
      agile-report-retriever, se subdividieron en grupos de 2 y 4 hilos. Por separado, migré la
      suite de Jest a Vitest para alinearla con la dirección oficial de Angular.
    result: >-
      El stage de pruebas pasó de aproximadamente 45 minutos a aproximadamente 2 minutos, una
      reducción cercana al 95%, con la migración a Vitest aportando un 20-30% adicional.
# Kept to roughly one printed line each. The long-form version is the case study above.
highlights:
  en:
    - Led the Angular 17 to 21 upgrade of a large-scale Nx monorepo built on Module Federation.
    - Cut the CI test stage from ~45 min to ~2 min (~95%) via Nx task parallelization in GitHub Actions.
    - Migrated the full unit test suite from Jest to Vitest, reducing pipeline time a further 20-30%.
    - Enabled strictTemplates project-wide, moving template type errors from production to development.
    - Built a custom Looker visualization in vanilla JavaScript, rendered inside the reporting platform.
  es:
    - Lideré la actualización de Angular 17 a 21 en un monorepo Nx de gran escala con Module Federation.
    - Reduje el stage de pruebas en CI de ~45 min a ~2 min (~95%) paralelizando tareas con Nx en GitHub Actions.
    - Migré la suite completa de pruebas unitarias de Jest a Vitest, reduciendo el pipeline un 20-30% adicional.
    - Habilité strictTemplates en todo el proyecto, llevando los errores de tipado de producción a desarrollo.
    - Desarrollé una visualización personalizada de Looker en JavaScript nativo, integrada en la plataforma.
---
