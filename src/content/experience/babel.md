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
      For ING's insurance purchase application I built the state layer from scratch: a lightweight
      architecture inspired by NgRx — an immutable store, actions, pure reducers, selectors and
      effects built on RxJS operators — instead of adopting the full library. The state was
      partitioned by domain, with the insured parties' identity documents, the customer's data and
      the selected product each held as their own slice, and a service exposed the operations that
      advanced them through the purchase. This was the project where I applied RxJS most
      intensively. I also refactored duplicated logic into reusable services, and migrated business
      logic for a Banco Popular project in Costa Rica from SQL Server stored procedures to .NET/C#
      on a queue-based architecture.
    result: >-
      ING's purchase application ran its whole client-side state through that layer, each domain
      advanced by its own exposed operations rather than synchronized ad hoc between components.
      The DKV platform was maintained and improved alongside it, a React microfrontend platform
      with independently versioned libraries was delivered for Línea Directa, and accessibility
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
      duplicada en servicios reutilizables y migré la lógica de negocio de un proyecto de Banco
      Popular (Costa Rica) desde procedimientos almacenados en SQL Server hacia .NET/C# con una
      arquitectura basada en colas.
    result: >-
      La aplicación de contratación de ING pasó a manejar todo su estado de cliente a través de esa
      capa, con cada dominio actualizado por sus propias operaciones expuestas en lugar de
      sincronizarse de forma ad hoc entre componentes. En paralelo se mantuvo y mejoró la
      plataforma de DKV, se entregó una plataforma de microfrontends en React con librerías
      versionadas de forma independiente para Línea Directa, y la accesibilidad se validó contra
      WCAG con WAVE.
highlights:
  en:
    - "Built from scratch the state layer of ING's insurance purchase app: an NgRx-inspired store on RxJS."
    - Split that state by domain — insured parties, customer data, product — over actions, reducers and effects.
    - Delivered a React and Module Federation microfrontend platform for Línea Directa, and maintained DKV's.
    - Integrated microfrontends into hybrid Android apps with Ionic, bridging to native Java code.
    - Ensured WCAG accessibility, validated with WAVE, and multi-language support with ngx-translate.
  es:
    - "Construí desde cero la capa de estado de la app de contratación de ING: un store inspirado en NgRx sobre RxJS."
    - Particioné ese estado por dominio —asegurados, datos del cliente y producto— sobre actions, reducers y effects.
    - Entregué una plataforma de microfrontends en React y Module Federation para Línea Directa, y mantuve la de DKV.
    - Integré microfrontends en aplicaciones Android híbridas con Ionic, comunicando con código nativo Java.
    - Aseguré el cumplimiento de accesibilidad WCAG, validado con WAVE, y soporte multi-idioma con ngx-translate.
---
