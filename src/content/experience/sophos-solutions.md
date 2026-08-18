---
company: Sophos Solutions
role:
  en: Solutions Consultant I
  es: Solutions Consultant I
location:
  en: Colombia (remote)
  es: Colombia (remoto)
start: 2021-10-01
end: 2023-02-01
resume: full
# One role, two clients — Mi Cuenta SU+ (Oct 2021 – Mar 2022) then Plink (Mar 2022 – Feb 2023).
# Written as a single set of bullets with the client named inside each one, which is the same
# shape babel.md uses for Línea Directa, ING, DKV and Banco Popular.
stack:
  - Angular
  - Module Federation
  - Microfrontends
  - TypeScript
  - Node.js
  - Express
  - Sequelize
  - PostgreSQL
  - AWS
  - Jest
# Mi Cuenta SU+ answers 403 to automated requests — it runs anti-bot challenges — but
# loads normally in a browser, so this repo's automated link check always reports it as
# failing. That is expected.
links:
  - label: Plink
    url: https://comercios.plink.com.co/sign_in
  - label: Mi Cuenta SU+
    url: https://micuenta.mundosumas.com/auth/login?steep=1
caseStudy:
  en:
    problem: >-
      Two clients under one role, with opposite problems. Mi Cuenta SU+ needed every one of its
      modules absorbed into a single architecture, and adding a new microfrontend was a manual,
      repetitive job that cost roughly two hours each time. On Plink, Bancolombia's merchant
      platform, ten backend endpoints ran on untyped JavaScript.
    decision: >-
      For Mi Cuenta SU+ I implemented a microfrontend-based architecture to take on the full
      module set, wrote a Node.js script that automated each microfrontend's build inside the
      deployment process, and built a generator that scaffolded a whole microfrontend from its
      name alone. For Plink I migrated the ten endpoints to TypeScript on a clean-architecture
      microservices setup — Node.js, Express and Sequelize over PostgreSQL on AWS — refactoring
      them against SOLID and writing their unit tests alongside the migration rather than after it.
    result: >-
      The architecture absorbed 100% of Mi Cuenta SU+'s modules and the time to add a
      microfrontend dropped from 2 hours to 1 minute. All ten Plink endpoints shipped typed and
      refactored, with 100% of them covered by unit tests at 100% code coverage.
  es:
    problem: >-
      Dos clientes bajo un mismo rol, con problemas opuestos. Mi Cuenta SU+ necesitaba asimilar
      la totalidad de sus módulos en una sola arquitectura, y agregar un microfrontend nuevo era
      una tarea manual y repetitiva que costaba alrededor de dos horas cada vez. En Plink, la
      plataforma de comercios de Bancolombia, diez endpoints de backend corrían sobre JavaScript
      sin tipar.
    decision: >-
      Para Mi Cuenta SU+ implementé una arquitectura basada en microfrontends que absorbiera el
      conjunto completo de módulos, escribí un script de Node.js que automatizaba la compilación
      de cada microfrontend dentro del despliegue, y construí un generador que creaba un
      microfrontend entero a partir de su nombre. Para Plink migré los diez endpoints a
      TypeScript sobre una arquitectura limpia basada en microservicios —Node.js, Express y
      Sequelize sobre PostgreSQL en AWS—, refactorizándolos con principios SOLID y escribiendo
      sus pruebas unitarias junto a la migración en lugar de después.
    result: >-
      La arquitectura asimiló el 100% de los módulos de Mi Cuenta SU+ y el tiempo para agregar un
      microfrontend bajó de 2 horas a 1 minuto. Los diez endpoints de Plink quedaron tipados y
      refactorizados, con el 100% de ellos cubierto por pruebas unitarias al 100% de cobertura.
# The Plink migration and its SOLID/coverage work share one line here; the full version is
# in the case study above, which only the website renders.
highlights:
  en:
    - Migrated 10 Plink (Bancolombia) endpoints to TypeScript on clean-architecture microservices, refactored against SOLID.
    - Covered 100% of those endpoints with Jest unit tests, at 100% code coverage.
    - Cut the time to add a new microfrontend from 2 hours to 1 minute with a Node.js generator.
  es:
    - Migré 10 endpoints de Plink (Bancolombia) a TypeScript sobre microservicios con arquitectura limpia y SOLID.
    - Cubrí el 100% de esos endpoints con pruebas unitarias en Jest, al 100% de cobertura.
    - Reduje de 2 horas a 1 minuto el tiempo para agregar un microfrontend con un generador en Node.js.
---
