# 🚀 Taller de Verificación y Validación: SonarQube Cloud + GitHub Actions

Este repositorio contiene una aplicación completa **React (Frontend) + NestJS (Backend)** configurada como monorepo con NPM Workspaces, diseñada específicamente para el taller práctico de **Verificación y Validación de Software**.

---

## 📁 Estructura del Proyecto

* **`client/`**: Aplicación React con TypeScript y Vitest, con pruebas unitarias y generación de reportes de cobertura LCOV.
* **`server/`**: API REST en NestJS con Jest, con pruebas unitarias de controladores y servicios, y reporte de cobertura LCOV.
* **`.github/workflows/ci.yml`**: Pipeline automatizado de CI que compila, ejecuta pruebas y analiza el código en SonarQube Cloud.
* **`sonar-project.properties`**: Configuración centralizada de SonarQube Cloud con soporte para escaneo dual y cobertura unificada.
* **`demo/`**: Archivos y scripts para la demostración en vivo (código con smells/vulnerabilidades y código corregido).
* **`GUIA_TALLER_DOCENTE.md`**: Guía paso a paso para dar la clase, configurar SonarCloud, proteger ramas en GitHub y ejecutar la demo.

---

## ⚡ Comandos Rápidos

### Instalación de dependencias
```bash
npm install
```

### Ejecutar todas las pruebas unitarias
```bash
npm test
```

### Ejecutar pruebas con reporte de cobertura LCOV
```bash
npm run test:cov
```
*Genera los archivos `client/coverage/lcov.info` y `server/coverage/lcov.info` requeridos por SonarQube Cloud.*

### Compilar ambas aplicaciones
```bash
npm run build
```

---

## 📖 Material de Lectura y Guía de la Demo
* Consulta la [Guía Docente Completa](GUIA_TALLER_DOCENTE.md) para ver la preparación de SonarCloud y la dinámica de la clase.
* Consulta el [CheatSheet de la Demo](demo/DEMO_CHEATSHEET.md) para ver los comandos de terminal en vivo.
