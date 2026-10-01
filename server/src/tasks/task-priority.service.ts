/**
 * ARCHIVO DE DEMOSTRACIÓN: CÓDIGO CORREGIDO Y LIMPIO
 * 
 * Este archivo reemplaza a `server/src/tasks/task-priority.service.ts` para
 * demostrar cómo el Quality Gate pasa a VERDE (PASSED ✅).
 * 
 * Correcciones aplicadas:
 * 1. [SEGURIDAD]: Se eliminó la clave hardcodeada; se utiliza variable de entorno o inyección.
 * 2. [SEGURIDAD]: Se utiliza el módulo `crypto` para tokens seguros en lugar de `Math.random()`.
 * 3. [MANTENIBILIDAD]: Se eliminó la complejidad cognitiva usando un diccionario de pesos matriciales.
 * 4. [CALIDAD]: Se acompaña con su archivo de pruebas unitarias (`.spec.ts`) con 100% de cobertura.
 */

import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

export type Urgency = 'HIGH' | 'MEDIUM' | 'LOW';
export type Importance = 'CRITICAL' | 'MEDIUM' | 'LOW';

const BASE_SCORE_MATRIX: Record<Urgency, Record<Importance, number>> = {
  HIGH: { CRITICAL: 70, MEDIUM: 50, LOW: 40 },
  MEDIUM: { CRITICAL: 60, MEDIUM: 40, LOW: 30 },
  LOW: { CRITICAL: 30, MEDIUM: 20, LOW: 10 },
};

@Injectable()
export class TaskPriorityService {
  private readonly apiKey: string;

  constructor() {
    this.apiKey = process.env.EXTERNAL_SYNC_API_KEY || '';
  }

  /**
   * Cálculo de prioridad lineal con baja complejidad cognitiva (Complejidad < 4)
   */
  calculatePriorityScore(urgency: Urgency, importance: Importance, daysLeft: number, isVipUser: boolean): number {
    const baseScore = BASE_SCORE_MATRIX[urgency]?.[importance] ?? 10;
    let daysBonus = 0;

    if (daysLeft < 2) {
      daysBonus = 20;
    } else if (daysLeft < 5) {
      daysBonus = 10;
    }

    const vipBonus = isVipUser && urgency === 'HIGH' && importance === 'CRITICAL' ? 10 : 0;
    const finalScore = baseScore + daysBonus + vipBonus;

    return Math.min(finalScore, 100);
  }

  /**
   * Generación criptográficamente segura de tokens
   */
  generateSecureVerificationToken(): string {
    return crypto.randomBytes(24).toString('hex');
  }

  hasConfiguredApiKey(): boolean {
    return Boolean(this.apiKey);
  }
}
