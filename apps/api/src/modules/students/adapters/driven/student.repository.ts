import { Injectable } from '@nestjs/common';
import { IStudentRepository } from '../../domain/port/output/IStudentRepository';
import { PrismaService } from 'src/shared/services/database/prisma.service';
import { SearchStudent } from './types/search-type';
import { Student, StudentResponse } from './types/student-type';

@Injectable()
export class StudentRepository implements IStudentRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async count(): Promise<number> {
    return this.prismaService.student.count();
  }

  async create(student: Student): Promise<StudentResponse> {
    const response = await this.prismaService.student.create({
      select: {
        studentId: true,
        name: true,
        dateOfBirth: true,
        gender: true,
        course: true,
        email: true,
        phone: true,
        nationality: true,

        faculty: {
          select: {
            id: true,
            title: true,
          },
        },

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

        program: {
          select: {
            id: true,
            title: true,
          },
        },

        status: {
          select: {
            id: true,
            title: true,
          },
        },

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
      },
      data: student,
    });

    return response;
  }
  async delete(studentId: string): Promise<StudentResponse> {
    return await this.prismaService.student.delete({
      select: {
        studentId: true,
        name: true,
        dateOfBirth: true,
        gender: true,
        course: true,
        email: true,
        phone: true,
        nationality: true,

        faculty: {
          select: {
            id: true,
            title: true,
          },
        },

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

        program: {
          select: {
            id: true,
            title: true,
          },
        },

        status: {
          select: {
            id: true,
            title: true,
          },
        },

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
      },
      where: {
        studentId: studentId,
      },
    });
  }

  async update(student: Student): Promise<StudentResponse> {
    const { studentId, ...data } = student;
    return await this.prismaService.student.update({
      select: {
        studentId: true,
        name: true,
        dateOfBirth: true,
        gender: true,
        course: true,
        email: true,
        phone: true,
        nationality: true,

        faculty: {
          select: {
            id: true,
            title: true,
          },
        },

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

        program: {
          select: {
            id: true,
            title: true,
          },
        },

        status: {
          select: {
            id: true,
            title: true,
          },
        },

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
      },
      where: {
        studentId: studentId,
      },
      data: data,
    });
  }
  async findById(studentId: string): Promise<StudentResponse | null> {
    const response = await this.prismaService.student.findUnique({
      select: {
        studentId: true,
        name: true,
        dateOfBirth: true,
        gender: true,
        course: true,
        email: true,
        phone: true,
        nationality: true,

        faculty: {
          select: {
            id: true,
            title: true,
          },
        },

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

        program: {
          select: {
            id: true,
            title: true,
          },
        },

        status: {
          select: {
            id: true,
            title: true,
          },
        },

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
      },
      where: {
        studentId: studentId,
      },
    });

    return response;
  }

  async search(query: SearchStudent): Promise<StudentResponse[]> {
    const { key, limit, page, faculty } = query;
    return this.prismaService.student.findMany({
      select: {
        studentId: true,
        name: true,
        dateOfBirth: true,
        gender: true,
        course: true,
        email: true,
        phone: true,
        nationality: true,

        faculty: {
          select: {
            id: true,
            title: true,
          },
        },

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

        program: {
          select: {
            id: true,
            title: true,
          },
        },

        status: {
          select: {
            id: true,
            title: true,
          },
        },

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
      },
      where: {
        OR: [
          { name: { contains: key, mode: 'insensitive' } },
          { studentId: key },
          {
            faculty: {
              title: faculty,
            },
          },
        ],
      },
      skip: Number((page - 1) * limit),
      take: Number(limit),
    });
  }
}
