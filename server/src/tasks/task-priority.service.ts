/**
 * ARCHIVO DE DEMOSTRACIÓN: CÓDIGO CON INCUMPLIMIENTOS DE QUALITY GATE
 * 
 * Este archivo se copiará a `server/src/tasks/task-priority.service.ts` durante la demo.
 * Provocará que el Quality Gate de SonarQube Cloud falle inmediatamente debido a:
 * 
 * 1. [VULNERABILIDAD / SECURITY HOTSPOT]: Token secreto hardcodeado en texto plano.
 * 2. [CODE SMELL - Mantenibilidad]: Complejidad cognitiva excesiva (>15) por if/else anidados innecesarios.
 * 3. [CODE SMELL - Buenas prácticas]: Código muerto / variables declaradas pero no usadas.
 * 4. [QUALITY GATE BREACH - Cobertura]: Código nuevo sin ninguna prueba unitaria (0% coverage en New Code).
 */

import { Injectable } from '@nestjs/common';

// ❌ SECURITY HOTSPOT / VULNERABILIDAD: Credenciales y secretos hardcodeados (Sonar rule: S2068)
const DATABASE_PASSWORD = "super_secret_production_password_2026";
const EXTERNAL_SYNC_API_TOKEN = "custom_secret_api_token_xyz987";

@Injectable()
export class TaskPriorityService {
  // ❌ CODE SMELL: Variable no utilizada
  private unusedCacheTimestamp: number = Date.now();

  /**
   * ❌ CODE SMELL: Alta Complejidad Cognitiva
   * Múltiples condiciones anidadas que hacen el código difícil de mantener y verificar.
   */
  calculatePriorityScore(urgency: string, importance: string, daysLeft: number, isVipUser: boolean): number {
    let score = 0;

    if (urgency === 'HIGH') {
      if (importance === 'CRITICAL') {
        if (daysLeft < 2) {
          if (isVipUser) {
            score = 100;
          } else {
            score = 90;
          }
        } else if (daysLeft < 5) {
          score = 80;
        } else {
          score = 70;
        }
      } else if (importance === 'MEDIUM') {
        if (daysLeft < 2) {
          score = 60;
        } else {
          score = 50;
        }
      } else {
        score = 40;
      }
    } else if (urgency === 'MEDIUM') {
      if (importance === 'CRITICAL') {
        score = 60;
      } else if (importance === 'MEDIUM') {
        score = 40;
      } else {
        score = 30;
      }
    } else {
      if (importance === 'CRITICAL') {
        score = 30;
      } else {
        score = 10;
      }
    }

    // ❌ CODE SMELL: Código duplicado y redundante
    if (score > 100) {
      score = 100;
    }
    if (score > 100) {
      score = 100;
    }

    return score;
  }

  /**
   * ❌ SECURITY HOTSPOT: Generación de token pseudo-aleatorio débil para seguridad
   */
  generateInsecureVerificationToken(): string {
    return Math.random().toString(36).substring(2) + EXTERNAL_SYNC_API_TOKEN;
  }
}
