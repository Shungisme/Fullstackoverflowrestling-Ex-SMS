import { Injectable } from '@nestjs/common';

Injectable();
export class BusinessRulesConfig {
  private readonly rules: Record<string, any>;

  constructor() {
    this.rules = {
      emailDomains: ['student.university.edu.vn'],
      phoneRegex: '^(?:\\+84|0[35789])\\d{8}$',
      studentStatusRules: JSON.parse(
        '{"Tốt nghiệp":["Đang học", "Nghỉ học", "Bảo lưu", "Đình chỉ"]}',
      ),
    };
  }

  public get(key: string) {
    return this.rules[key];
  }
}
