# 🎓 Guía Docente y Plan Maestro del Taller: SonarQube Cloud en GitHub Actions

> **Materia:** Verificación y Validación de Software (V&V)  
> **Stack:** React + NestJS (Monorepo con NPM Workspaces)  
> **Herramientas:** GitHub Actions, SonarQube Cloud, Jest, Vitest, Git  
> **Enfoque Pedagógico:** *Shift-Left Quality* y Puertas de Calidad Automatizadas (*Quality Gates*)

---

## 📌 1. Fundamentos de V&V para la Introducción (5 minutos)

Antes de abrir la terminal o la consola web, abre con esta distinción clave para conectar el taller con la materia:

* **¿Por qué GitHub Actions solo no es suficiente?**  
  El equipo anterior nos enseñó a armar un pipeline de CI que corre `npm test`. Si los tests unitarios pasan, el pipeline da ✅ **verde**. Pero, ¿qué pasa si el desarrollador no escribió tests para la nueva funcionalidad? ¿O si escribió código con secretos expuestos, inyección SQL o duplicación masiva? **El pipeline tradicional seguiría en verde.**
* **Verificación con SonarQube Cloud (Shift-Left Quality):**  
  Sonar actúa como un auditor estático automatizado en cada Pull Request. Responde a la pregunta de verificación: *¿Estamos construyendo el software con los estándares de calidad, seguridad y mantenibilidad correctos antes de mezclarlo a producción?*
* **El paradigma "Clean as You Code":**  
  No intentamos arreglar 10 años de código legado de golpe. Nos enfocamos en una regla estricta: **el código nuevo (*New Code*) debe ser impecable**.

---

## 🛠️ 2. Parte 1: Cómo Enseñar a Instalar SonarQube Cloud en un Repositorio (Paso a Paso)

Muestra esta secuencia en tu pantalla mientras explicas a tus compañeros cómo replicarlo en sus propios proyectos.

### Paso 1.1: Inicio de Sesión y Creación de Organización
1. Entrar a [sonarcloud.io](https://sonarcloud.io).
2. Hacer click en **Log in with GitHub**.
3. Aceptar los permisos de lectura de repositorios.
4. En la esquina superior derecha, click en **`+` (Analyze new project)**.
5. Seleccionar la organización personal y elegir el repositorio (debe ser **PÚBLICO** para ser 100% gratuito).

### Paso 1.2: El Error #1 de la Industria — Desactivar Automatic Analysis ⚠️
> **Explicación para la clase:** *Por defecto, SonarCloud intenta escanear el repositorio en sus propios servidores en la nube sin ejecutar tus tests. Para que lea la cobertura de nuestras pruebas y use nuestro pipeline de GitHub Actions, debemos desactivar el análisis automático.*

1. Una vez importado el proyecto, ir a:  
   `Project Settings` ➔ `Administration` ➔ `Analysis Method`.
2. Desactivar el interruptor **Automatic Analysis** (debe quedar en **OFF**).
3. Seleccionar la tarjeta **GitHub Actions Tutorial** (Sonar mostrará las instrucciones que nosotros ya tenemos automatizadas en este repo).

### Paso 1.3: Generación de Credenciales Seguras (Secrets)
1. En SonarCloud, ir a tu avatar (esquina superior derecha) ➔ **My Account** ➔ pestaña **Security**.
2. En *Generate Token*:
   * **Name:** `GITHUB_ACTIONS_TOKEN`
   * **Type:** `User Token`
   * Click en **Generate** y copiar el valor.
3. En tu repositorio de GitHub:
   * Ir a **Settings** ➔ **Secrets and variables** ➔ **Actions**.
   * Click en **New repository secret**.
   * **Name:** `SONAR_TOKEN`
   * **Value:** *(Pegar el token copiado)*.
   * Click en **Add secret**.

### Paso 1.4: Configuración en el Repositorio
Mostrar a la clase los dos archivos clave en este proyecto:
1. **`sonar-project.properties` (en la raíz):**
   * Contiene la organización, projectKey, rutas de fuentes (`client/src,server/src`) y las rutas de los reportes de cobertura LCOV (`client/coverage/lcov.info,server/coverage/lcov.info`).
2. **`.github/workflows/ci.yml`:**
   * Destacar el parámetro obligatorio:
     ```yaml
     - uses: actions/checkout@v4
       with:
         fetch-depth: 0 # OBLIGATORIO: Historial completo para New Code y Blame
     ```
   * Destacar la ejecución de pruebas con cobertura:
     ```yaml
     - run: npm run test:cov # Genera los lcov.info en cliente y servidor
     ```
   * Destacar la acción oficial de escaneo:
     ```yaml
     - uses: SonarSource/sonarqube-scan-action@v5
       env:
         GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
         SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
     ```

---

## 🔒 3. Parte 2: Configurar GitHub para BLOQUEAR el PR si Falla el Quality Gate

Esta configuración es la que convierte a Sonar en un verdadero mecanismo de control de calidad obligatorio en el equipo:

1. En el repositorio de GitHub, ir a **Settings** ➔ **Branches**.
2. En *Branch protection rules*, click en **Add rule** (o crear un *Ruleset*):
   * **Branch name pattern:** `main`
   * Marcar la casilla: ☑️ **Require a pull request before merging**.
   * Marcar la casilla: ☑️ **Require status checks to pass before merging**.
   * En la barra de búsqueda de checks, buscar y seleccionar:  
     🔍 **`SonarCloud Code Analysis`**
   * (Opcional recomendado) Marcar: ☑️ **Do not allow bypassing the above settings**.
3. Guardar cambios (**Save changes**).

> **Efecto V&V:** A partir de este momento, **ningún desarrollador puede hacer merge a `main` si SonarQube Cloud reporta que el Quality Gate ha fallado.**

---

## 🎭 4. Parte 3: El Guion de la Demostración en Vivo ("Live PR Demo")

Sigue este guion paso a paso frente a la clase.

### Acto 1: La Rama Limpia (Base)
1. Muestra en pantalla que la rama `main` tiene el pipeline en verde en GitHub Actions y el proyecto en SonarQube Cloud muestra **Quality Gate: PASSED**.
2. Explica que la app consiste en un frontend React y un backend NestJS que gestionan tareas, con pruebas unitarias que cubren el 90%+ del código.

### Acto 2: El Desarrollador Despreocupado (Inyección de Smells)
1. Abre tu terminal y crea una rama:
   ```bash
   git checkout -b feat/task-priority
   ```
2. Inyecta el código defectuoso preparado:
   ```bash
   cp demo/01-bad-code-feature.ts server/src/tasks/task-priority.service.ts
   ```
3. Muestra el código en el editor y señala los problemas a la clase:
   * *"Miren la línea 11: dejamos una API Key de producción hardcodeada."*
   * *"Miren la función calculatePriorityScore: 5 niveles de if/else anidados, complejidad cognitiva altísima."*
   * *"Y lo más importante en V&V: agregamos 70 líneas de código nuevo sin una sola prueba unitaria."*
4. Haz commit y push:
   ```bash
   git add server/src/tasks/task-priority.service.ts
   git commit -m "feat(tasks): add priority calculation service with external sync"
   git push -u origin feat/task-priority
   ```
5. Ve a GitHub y abre el Pull Request hacia `main`.

### Acto 3: El Bloqueo del Quality Gate (El Momento "Aha!")
1. Muestra en vivo la pestaña **Actions**: el pipeline se ejecuta normalmente, compila y corre los tests existentes.
2. Al terminar el paso de SonarQube, vuelve al Pull Request en GitHub:
   * **SonarCloud PR Bot ha comentado automáticamente en el PR.**
   * Aparece en rojo: ❌ **Quality Gate Failed**.
   * **Métricas mostradas:**
     * `0.0% Coverage on New Code` (Requerido: $\ge 80\%$).
     * `1 Security Hotspot` detectado.
     * `1 Code Smell` (Mantenibilidad B o C).
   * Muestra la parte inferior del PR: **El botón verde de "Merge pull request" está en GRIS/BLOQUEADO** con el mensaje:  
     `Required status check "SonarCloud Code Analysis" has failed`.
3. Haz click en el enlace de SonarQube Cloud para ver el dashboard del PR:
   * Muestra cómo Sonar resalta exactamente las líneas culpables y explica cómo solucionarlo.

### Acto 4: La Solución Shift-Left (Desbloqueo y Merge)
1. En tu terminal, reemplaza el archivo por el código limpio y agrega su suite de pruebas:
   ```bash
   cp demo/02-fixed-feature.ts server/src/tasks/task-priority.service.ts
   cp demo/02-fixed-feature.spec.ts server/src/tasks/task-priority.service.spec.ts
   ```
2. Ejecuta las pruebas en local para verificar:
   ```bash
   npm run test:cov
   ```
   *(Muestra cómo ambos reportes LCOV se actualizan al 100% de cobertura).*
3. Sube la corrección al mismo PR:
   ```bash
   git add server/src/tasks/
   git commit -m "fix(tasks): clean architecture, secure token, 100% test coverage"
   git push
   ```
4. Observa en GitHub cómo el workflow se re-ejecuta automáticamente:
   * El comentario de SonarCloud en el PR se actualiza a **Quality Gate: PASSED ✅**.
   * 0 Vulnerabilidades, 0 Smells, 100% Cobertura en New Code.
   * El botón de **Merge pull request** se vuelve **VERDE**.
5. Haz click en **Merge** y cierra la demostración.

---

## ❓ 5. Preguntas Frecuentes y Troubleshooting en Vivo

| Situación / Pregunta | Causa Raíz | Solución Rápida |
| :--- | :--- | :--- |
| **"El pipeline da verde, pero en SonarCloud no se actualiza nada"** | El proyecto tiene activado el *Automatic Analysis*. | Ir a `Project Settings` ➔ `Administration` ➔ `Analysis Method` y apagar *Automatic Analysis*. |
| **"Sonar reporta 0.0% de cobertura a pesar de tener tests"** | La ruta de los reportes LCOV está mal escrita o las pruebas no se corrieron antes de Sonar. | Revisar que en `sonar-project.properties` esté `sonar.javascript.lcov.reportPaths=client/coverage/lcov.info,server/coverage/lcov.info` y que en el YAML el paso de test vaya antes. |
| **"Error: Shallow clone detected during git analysis"** | La acción de checkout no descargó el historial de Git. | Añadir `fetch-depth: 0` al paso `actions/checkout@v4`. |
| **"Sonar falla con HTTP 401 Unauthorized"** | El secreto `SONAR_TOKEN` no coincide o tiene un espacio en blanco. | Volver a generar el User Token en Sonar y guardarlo con cuidado en GitHub Secrets. |
| **"¿Por qué no usamos SonarQube Community Edition en Docker?"** | SonarQube Cloud es SaaS, no consume RAM en el servidor local de los alumnos y se integra con 0 configuración de red con GitHub Actions. | Excelente argumento para defender la elección en clase. |
