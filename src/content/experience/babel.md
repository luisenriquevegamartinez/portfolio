---
company: Babel
role:
  en: Frontend Software Engineer
  es: Ingeniero de Software Frontend
location:
  en: Colombia (remote)
  es: Colombia (remoto)
start: 2023-10-01
end: 2025-05-23
resume: full
stack:
  - Angular
  - Nx
  - Module Federation
  - RxJS
  - React
  - Angular Material
  - PrimeNG
  - ngx-translate
  - Docker
  - NGINX
  - .NET
  - Azure Service Bus
caseStudy:
  en:
    problem: >-
      Insurance platforms for Spanish clients — Línea Directa, ING and DKV — needed features
      delivered against direct client feedback, across a codebase where the same logic kept being
      reimplemented and state was synchronized ad hoc.
    decision: >-
      For ING's insurance purchase application I built the state layer from scratch: a lightweight
      architecture inspired by NgRx — an immutable store, actions, pure reducers, selectors and
      effects built on RxJS operators — instead of adopting the full library. The state was
      partitioned by domain, with the insured parties' identity documents, the customer's data and
      the selected product each held as their own slice, and a service exposed the operations that
      advanced them through the purchase. This was the project where I applied RxJS most
      intensively. I also refactored duplicated logic into reusable services. On a Banco Popular
      project in Costa Rica, which moved business logic out of SQL Server stored procedures into
      C#/.NET 8 microservices integrated over Azure Service Bus, I built the scheduled background
      job for customer risk calculation: it processed the queued actions, verifying and integrating
      them customer by customer, triggered by events from several microservices, to recalculate
      customers' risk levels in bulk.
    result: >-
      ING's purchase application ran its whole client-side state through that layer, each domain
      advanced by its own exposed operations rather than synchronized ad hoc between components.
      Alongside it I took part in maintaining DKV's platform and in developing Línea Directa's
      React microfrontend platform, with independently versioned libraries, and accessibility
      was validated against WCAG using WAVE.
  es:
    problem: >-
      Las plataformas de seguros de clientes españoles —Línea Directa, ING y DKV— requerían
      features entregadas con feedback directo del cliente, sobre una base de código donde la
      misma lógica se reimplementaba una y otra vez y el estado se sincronizaba de forma ad hoc.
    decision: >-
      Para la aplicación de contratación de seguros de ING construí desde cero la capa de estado:
      una arquitectura ligera inspirada en NgRx —store inmutable, actions, reducers puros,
      selectors y effects construidos sobre operadores de RxJS— en lugar de adoptar la librería
      completa. El estado quedó particionado por dominio, con los documentos de identidad de los
      asegurados, los datos del cliente y el producto adquirido cada uno como su propia porción, y
      un servicio exponía las operaciones que los iban actualizando a lo largo de la contratación.
      Fue el proyecto donde apliqué RxJS de forma más intensiva. También refactoricé la lógica
      duplicada en servicios reutilizables. En un proyecto de Banco Popular (Costa Rica), que
      trasladó la lógica de negocio desde procedimientos almacenados en SQL Server hacia
      microservicios en C#/.NET 8 integrados con Azure Service Bus, desarrollé el proceso
      programado de cálculo de riesgo: procesaba las acciones acumuladas en cola, verificándolas e
      integrándolas cliente por cliente, disparado por eventos de distintos microservicios, para
      recalcular de forma masiva el nivel de riesgo de los clientes.
    result: >-
      La aplicación de contratación de ING pasó a manejar todo su estado de cliente a través de esa
      capa, con cada dominio actualizado por sus propias operaciones expuestas en lugar de
      sincronizarse de forma ad hoc entre componentes. En paralelo participé en el mantenimiento
      de la plataforma de DKV y en el desarrollo de la plataforma de microfrontends en React de
      Línea Directa, con librerías versionadas de forma independiente, y la accesibilidad se
      validó contra WCAG con WAVE.
highlights:
  en:
    - "Built from scratch the state layer of ING's insurance purchase app: an NgRx-inspired store on RxJS."
    - Split that state by domain (insured parties, customer data and product) over actions, reducers and effects.
    - Took part in developing Línea Directa's microfrontend platform (React + Module Federation) and in maintaining DKV's.
    - At DKV and ING, worked with Docker and NGINX as a reverse proxy, serving front end and API under one domain with security headers to the backend.
    - Diagnosed and fixed a communication failure between a native Android app (Java) and an Angular microfrontend loaded in a WebView, analyzing the Java and TypeScript code side by side.
    - For Banco Popular (Costa Rica), developed a scheduled background job in C#/.NET 8 and Azure Service Bus that recalculated customer risk levels in bulk, during a SQL Server stored procedure-to-microservices migration.
    - Built responsive interfaces with PrimeNG and SCSS, with WCAG accessibility validated with WAVE and multi-language support with ngx-translate.
  es:
    - "Construí desde cero la capa de estado de la app de contratación de ING: un store inspirado en NgRx sobre RxJS."
    - Particioné ese estado por dominio (asegurados, datos del cliente y producto) sobre actions, reducers y effects.
    - Participé en el desarrollo de la plataforma de microfrontends de Línea Directa (React + Module Federation) y en el mantenimiento de la de DKV.
    - En DKV e ING trabajé con Docker y NGINX como proxy inverso, exponiendo front y API bajo un mismo dominio con cabeceras de seguridad hacia el backend.
    - Diagnostiqué y corregí un fallo de comunicación entre una app Android nativa (Java) y un microfrontend Angular cargado en WebView, analizando en paralelo el código Java y TypeScript.
    - Para Banco Popular (Costa Rica) desarrollé un proceso programado en C#/.NET 8 y Azure Service Bus que recalculaba de forma masiva el nivel de riesgo de los clientes, durante la migración de stored procedures de SQL Server a microservicios.
    - Construí interfaces responsive con PrimeNG y SCSS, con accesibilidad WCAG validada con WAVE y soporte multi-idioma con ngx-translate.
---
