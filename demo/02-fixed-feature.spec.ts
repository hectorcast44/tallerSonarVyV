import { Test, TestingModule } from '@nestjs/testing';
import { TaskPriorityService } from './task-priority.service';

describe('TaskPriorityService', () => {
  let service: TaskPriorityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskPriorityService],
    }).compile();

    service = module.get<TaskPriorityService>(TaskPriorityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('calculatePriorityScore', () => {
    it('calculates score for HIGH urgency, CRITICAL importance with VIP and <2 days', () => {
      const score = service.calculatePriorityScore('HIGH', 'CRITICAL', 1, true);
      // Base: 70 + DaysBonus: 20 + VipBonus: 10 = 100
      expect(score).toBe(100);
    });

    it('calculates score with 2-4 days bonus', () => {
      const score = service.calculatePriorityScore('HIGH', 'CRITICAL', 3, false);
      // Base: 70 + DaysBonus: 10 + Vip: 0 = 80
      expect(score).toBe(80);
    });

    it('calculates score with >= 5 days (no days bonus)', () => {
      const score = service.calculatePriorityScore('MEDIUM', 'MEDIUM', 10, false);
      // Base: 40
      expect(score).toBe(40);
    });

    it('caps maximum score at 100', () => {
      const score = service.calculatePriorityScore('HIGH', 'CRITICAL', 0, true);
      expect(score).toBeLessThanOrEqual(100);
    });

    it('handles LOW urgency and LOW importance', () => {
      const score = service.calculatePriorityScore('LOW', 'LOW', 10, false);
      expect(score).toBe(10);
    });
  });

  describe('generateSecureVerificationToken', () => {
    it('generates a 48-character hex string', () => {
      const token = service.generateSecureVerificationToken();
      expect(token).toBeDefined();
      expect(token).toHaveLength(48);
    });
  });

  describe('hasConfiguredApiKey', () => {
    it('returns boolean status of api key', () => {
      const result = service.hasConfiguredApiKey();
      expect(typeof result).toBe('boolean');
    });
  });
});
