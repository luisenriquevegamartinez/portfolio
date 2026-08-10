---
company: Babel
role:
  en: Software Engineer, Front-End
  es: Ingeniero de Software, Front-End
location:
  en: Colombia (remote)
  es: Colombia (remoto)
start: 2023-09-01
end: 2025-05-01
resume: full
stack:
  - Angular
  - Nx
  - Module Federation
  - RxJS
  - React
  - Ionic
  - Angular Material
  - ngx-translate
  - .NET
caseStudy:
  en:
    problem: >-
      Insurance platforms for Spanish clients — Línea Directa, ING and DKV — needed features
      delivered against direct client feedback, across a codebase where the same logic kept being
      reimplemented and state was synchronized ad hoc.
    decision: >-
      I designed a lightweight state architecture inspired by NgRx — an immutable store, actions,
      pure reducers, selectors and effects built on RxJS operators — instead of adopting the full
      library, and refactored duplicated logic into reusable services. This was the project where
      I applied RxJS most intensively. I also migrated business logic for a Banco Popular project
      in Costa Rica from SQL Server stored procedures to .NET/C# on a queue-based architecture.
    result: >-
      I built ING's entire insurance purchase flow from scratch, maintained and improved the DKV
      platform, and delivered a React microfrontend platform for Línea Directa with independently
      versioned libraries. Accessibility was validated against WCAG using WAVE.
  es:
    problem: >-
      Las plataformas de seguros de clientes españoles —Línea Directa, ING y DKV— requerían
      features entregadas con feedback directo del cliente, sobre una base de código donde la
      misma lógica se reimplementaba una y otra vez y el estado se sincronizaba de forma ad hoc.
    decision: >-
      Diseñé una arquitectura de manejo de estado ligera inspirada en NgRx —store inmutable,
      actions, reducers puros, selectors y effects construidos sobre operadores de RxJS— en lugar
      de adoptar la librería completa, y refactoricé la lógica duplicada en servicios reutilizables.
      Fue el proyecto donde apliqué RxJS de forma más intensiva. También migré la lógica de negocio
      de un proyecto de Banco Popular (Costa Rica) desde procedimientos almacenados en SQL Server
      hacia .NET/C# con una arquitectura basada en colas.
    result: >-
      Construí desde cero el flujo completo de contratación de seguros de ING, mantuve y mejoré la
      plataforma de DKV, y entregué una plataforma de microfrontends en React para Línea Directa
      con librerías versionadas de forma independiente. La accesibilidad se validó contra WCAG
      con WAVE.
highlights:
  en:
    - Built ING's complete insurance purchase flow from scratch and maintained the DKV platform.
    - Designed a lightweight NgRx-inspired state architecture on RxJS - store, reducers, selectors, effects.
    - Delivered a React and Module Federation microfrontend platform for Línea Directa in a multirepo setup.
    - Integrated microfrontends into hybrid Android apps with Ionic, bridging to native Java code.
    - Ensured WCAG accessibility, validated with WAVE, and multi-language support with ngx-translate.
  es:
    - Construí desde cero el flujo completo de contratación de seguros de ING y mantuve la plataforma de DKV.
    - Diseñé una arquitectura de estado ligera inspirada en NgRx sobre RxJS - store, reducers, selectors, effects.
    - Entregué una plataforma de microfrontends en React y Module Federation para Línea Directa en multirepo.
    - Integré microfrontends en aplicaciones Android híbridas con Ionic, comunicando con código nativo Java.
    - Aseguré el cumplimiento de accesibilidad WCAG, validado con WAVE, y soporte multi-idioma con ngx-translate.
---
