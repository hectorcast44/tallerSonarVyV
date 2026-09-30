# ⚡ CheatSheet de la Demo en Vivo (3 Minutos)

Esta guía rápida resume los comandos exactos que debes ejecutar en la terminal durante la presentación en clase.

---

## 🟢 Paso 1: Estado Inicial (Rama `main`)
Asegúrate de que estás en la rama `main` y todo está limpio y en verde en GitHub Actions y SonarQube Cloud:
```bash
git checkout main
git status
```

---

## 🔴 Paso 2: Crear el PR con Smells y Vulnerabilidades

1. **Crear una rama nueva:**
   ```bash
   git checkout -b feat/task-priority
   ```

2. **Inyectar el código defectuoso:**
   ```bash
   cp demo/01-bad-code-feature.ts server/src/tasks/task-priority.service.ts
   ```

3. **Hacer commit y push:**
   ```bash
   git add server/src/tasks/task-priority.service.ts
   git commit -m "feat(tasks): add priority calculation service with external sync"
   git push -u origin feat/task-priority
   ```

4. **Abrir el Pull Request en GitHub:**
   - Título: `feat: Add task priority calculation service`
   - Base: `main` ⬅️ Compare: `feat/task-priority`

5. **Explicar a la clase lo que ocurre:**
   - El workflow de GitHub Actions se ejecuta automáticamente.
   - SonarQube Cloud analiza los cambios del Pull Request (*PR Decoration*).
   - **Resultado:**
     - ❌ **Quality Gate: FAILED**
     - 1 Security Hotspot (API Key hardcodeada + token débil).
     - 1 Code Smell (Alta complejidad cognitiva + código muerto).
     - 0.0% Coverage en New Code (se requieren $\ge 80\%$).
     - **El botón de Merge queda BLOQUEADO** por la regla de protección de rama de GitHub.

---

## 🟢 Paso 3: Corregir el Código y Desbloquear el PR

1. **Reemplazar por el código limpio y añadir sus pruebas unitarias:**
   ```bash
   cp demo/02-fixed-feature.ts server/src/tasks/task-priority.service.ts
   cp demo/02-fixed-feature.spec.ts server/src/tasks/task-priority.service.spec.ts
   ```

2. **Verificar localmente que las pruebas pasen con cobertura:**
   ```bash
   npm run test:cov
   ```

3. **Hacer commit y push a la misma rama:**
   ```bash
   git add server/src/tasks/
   git commit -m "fix(tasks): refactor priority calculation, remove hardcoded secret, add unit tests"
   git push
   ```

4. **Mostrar el resultado en GitHub y SonarQube Cloud:**
   - GitHub Actions se vuelve a ejecutar.
   - SonarQube Cloud actualiza el comentario del PR a **Quality Gate: PASSED ✅**.
   - 0 Bugs, 0 Vulnerabilities, 0 Hotspots, 100% Coverage en New Code.
   - **El botón de Merge se DESBLOQUEA automáticamente en GitHub**.
   - Haces click en **Merge Pull Request** y cierras la demo con aplausos. 👏
