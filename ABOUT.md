# SafeIT Front - About

**Descripción corta (campo About de GitHub):** Interfaz web de SafeIT: dominios, hallazgos y reportes de seguridad (Next.js y TypeScript)

## Qué es

Interfaz web de **SafeIT**, una plataforma de reconocimiento y pruebas de seguridad controladas. Desde aquí el usuario registra y verifica sus dominios, lanza escaneos, revisa hallazgos priorizados, descarga reportes y consulta la auditoría.

## Tecnologías

- Next.js 15 (App Router) y React 19
- TypeScript
- Tailwind CSS
- Playwright para pruebas de extremo a extremo
- Despliegue en Vercel

## Qué incluye

- Registro, inicio de sesión y autenticación en dos pasos (MFA)
- Alta de dominios con verificación de propiedad por registro DNS TXT
- Escaneo de reconocimiento y pruebas controladas
- Hallazgos con severidad, CVSS, EPSS y CISA KEV
- Lista de reportes, reporte ejecutivo y descarga en PDF
- Auditoría de acciones y análisis público de un dominio

## Proyecto completo

SafeIT se divide en tres repositorios: [safeit-back](https://github.com/Ilyavosky/safeit-back) (API) y [safeit-bd](https://github.com/Ilyavosky/safeit-bd) (base de datos), además de [safeit-lab](https://github.com/Ilyavosky/safeit-lab), con objetivos de práctica ficticios.

Proyecto de la materia Seguridad Informática (periodo 263), UPCH. Autores: Ilya Cortés Ruiz y Brittany Aurora Hernández Muñoz.

## Más información

- [Arquitectura](ARQUITECTURA.md)
- [README](README.md)
