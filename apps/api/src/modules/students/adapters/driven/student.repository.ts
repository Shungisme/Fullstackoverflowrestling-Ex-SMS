import { Injectable } from '@nestjs/common';
import { IStudentRepository } from '../../domain/port/output/IStudentRepository';
import { PrismaService } from 'src/shared/services/database/prisma.service';
import { SearchStudent } from './types/search-type';
import { Student, StudentResponse } from './types/student-type';
import { CreateStudentWithAddressDTO } from '../../domain/dto/create-student-dto';
import { BusinessRulesConfig } from 'src/config/business-rules.config';

const studentSelect = {
  id: true,
  studentId: true,
  name: true,
  dateOfBirth: true,
  gender: true,
  course: true,
  email: true,
  phone: true,
  nationality: true,
  faculty: { select: { id: true, title: true } },
  mailingAddress: {
    select: {
      id: true,
      number: true,
      street: true,
      district: true,
      city: true,
      country: true,
    },
  },
  permanentAddress: {
    select: {
      id: true,
      number: true,
      street: true,
      district: true,
      city: true,
      country: true,
    },
  },
  temporaryAddress: {
    select: {
      id: true,
      number: true,
      street: true,
      district: true,
      city: true,
      country: true,
    },
  },
  program: { select: { id: true, title: true } },
  status: { select: { id: true, title: true } },
  identityPaper: {
    select: {
      id: true,
      type: true,
      number: true,
      issueDate: true,
      expirationDate: true,
      placeOfIssue: true,
      hasChip: true,
      issuingCountry: true,
      notes: true,
    },
  },
};

@Injectable()
export class StudentRepository implements IStudentRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async updateStudentField(
    studentId: string,
    field: keyof Student,
    value: any,
  ): Promise<StudentResponse | null> {
    return this.prismaService.student.update({
      select: studentSelect,
      where: { studentId },
      data: { [field]: value },
    });
  }

  async createMany(students: Student[]): Promise<number> {
    const result = await this.prismaService.student.createMany({
      data: students,
    });
    return result.count;
  }

  async count(): Promise<number> {
    return this.prismaService.student.count();
  }

  async create(student: CreateStudentWithAddressDTO): Promise<StudentResponse> {
    return this.prismaService.$transaction(async (tx) => {
      const mailingAddressData = await tx.address.create({
        data: student.mailingAddress,
        select: { id: true },
      });

      const identityPaperData = await tx.identityPaper.create({
        data: student.identityPaper,
        select: { id: true },
      });

      const permanentAddressData = student.permanentAddress
        ? await tx.address.create({
            data: student.permanentAddress,
            select: { id: true },
          })
        : null;

      const temporaryAddressData = student.temporaryAddress
        ? await tx.address.create({
            data: student.temporaryAddress,
            select: { id: true },
          })
        : null;

      const {
        mailingAddress,
        temporaryAddress,
        permanentAddress,
        identityPaper,
        ...studentData
      } = student;

      return tx.student.create({
        select: studentSelect,
        data: {
          ...studentData,
          mailingAddressId: mailingAddressData.id,
          identityPaperId: identityPaperData.id,
          temporaryAddressId: temporaryAddressData?.id,
          permanentAddressId: permanentAddressData?.id,
        },
      });
    });
  }

  async delete(studentId: string): Promise<StudentResponse> {
    return this.prismaService.student.delete({
      select: studentSelect,
      where: { studentId },
    });
  }

  async update(student: Partial<Student>): Promise<StudentResponse> {
    const { studentId, ...data } = student;

    if (data.statusId) {
      const newStatus = await this.prismaService.status.findUnique({
        where: { id: data.statusId },
      });

      if (!newStatus) throw new Error('Invalid status');

      const currentStudent = await this.prismaService.student.findUnique({
        where: { studentId },
      });

      const currentStatus = await this.prismaService.status.findUnique({
        where: { id: currentStudent?.statusId },
      });

      const businessRulesConfig = new BusinessRulesConfig();
      const studentStatusRules = businessRulesConfig.get('studentStatusRules');

      if (
        newStatus.title &&
        currentStatus?.title &&
        studentStatusRules[currentStatus.title]?.includes(newStatus?.title)
      ) {
        throw new Error('Invalid status');
      }
    }

    return this.prismaService.student.update({
      select: studentSelect,
      where: { studentId },
      data,
    });
  }

  async getAll(): Promise<StudentResponse[] | null> {
    return this.prismaService.student.findMany({ select: studentSelect });
  }

  async findById(studentId: string): Promise<StudentResponse | null> {
    return this.prismaService.student.findUnique({
      select: studentSelect,
      where: { studentId },
    });
  }

  async search(query: SearchStudent): Promise<StudentResponse[]> {
    const { key, limit = 5, page = 1, faculty } = query;

    const whereCondition: any = {};

    if (key) {
      whereCondition.OR = [
        { name: { contains: key, mode: 'insensitive' } },
        { studentId: { contains: key, mode: 'insensitive' } },
      ];
    }

    if (faculty) {
      whereCondition.faculty = {
        title: { contains: faculty, mode: 'insensitive' },
      };
    }

    return this.prismaService.student.findMany({
      select: studentSelect,
      where: whereCondition,
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async getStudentResults(studentId: string): Promise<any[]> {
    // Lấy tất cả kết quả của sinh viên
    const rawResults = await this.prismaService.studentClassResult.findMany({
      where: { studentId },
      include: {
        class: {
          include: {
            subject: true,
          },
        },
      },
    });

    // Nhóm kết quả theo classCode và tính điểm tổng kết
    const groupedResults: { [key: string]: any } = {};

    rawResults.forEach((result) => {
      const classCode = result.classCode;
      if (!groupedResults[classCode]) {
        groupedResults[classCode] = {
          class: result.class,
          scores: [],
          totalScore: 0,
          totalFactor: 0,
        };
      }
      groupedResults[classCode].scores.push({
        type: result.type,
        score: result.score,
        factor: result.factor,
      });
      groupedResults[classCode].totalScore += result.score * result.factor;
      groupedResults[classCode].totalFactor += result.factor;
    });

    // Chuyển đổi dữ liệu thành mảng kết quả
    return Object.values(groupedResults).map((group) => ({
      class: group.class,
      score:
        group.totalFactor > 0
          ? (group.totalScore / group.totalFactor).toFixed(2)
          : 0, // Điểm tổng kết
    }));
  }
}
