import { Inject, Injectable } from '@nestjs/common';
import { CreateStudentClassEnrollDTO } from '../../dto/create-student-class-enroll.dto';
import { UpdateStudentClassEnrollDTO } from '../../dto/update-student-class-enroll.dto';
import {
  STUDENT_CLASS_ENROLL_REPOSITORY,
  IStudentClassEnrollRepository,
} from '../output/IStudentClassEnrollRepository';
import { IStudentClassEnrollService } from './IStudentClassEnrollService';
import { PaginatedResponse } from 'src/shared/types/PaginatedResponse';
import { StudentClassEnrollDto } from '../../dto/student-class-enroll.dto';
import { EnrollEnum } from '@prisma/client';
import {
  ISubjectPrerequisiteRepository,
  SUBJECT_PREREQUISITE_REPOSITORY,
} from 'src/modules/subject-prerequisites/domain/port/output/ISubjectPrerequisiteRepository';
import {
  IStudentClassResultRepository,
  STUDENT_CLASS_RESULT_REPOSITORY,
} from 'src/modules/student-class-results/domain/port/output/IStudentClassResultRepository';
import {
  ISemesterRepository,
  SEMESTER_REPOSITORY,
} from 'src/modules/semesters/domain/port/output/ISemesterRepository';
import {
  CLASSES_REPOSITORY,
  IClassesRepository,
} from 'src/modules/classes/domain/port/output/IClassesRepository';

@Injectable()
export class StudentClassEnrollService implements IStudentClassEnrollService {
  constructor(
    @Inject(STUDENT_CLASS_ENROLL_REPOSITORY)
    private studentClassEnrollRepository: IStudentClassEnrollRepository,

    @Inject(SUBJECT_PREREQUISITE_REPOSITORY)
    private subjectPrerequisiteRepository: ISubjectPrerequisiteRepository,

    @Inject(STUDENT_CLASS_RESULT_REPOSITORY)
    private studentClassResultRepository: IStudentClassResultRepository,

    @Inject(SEMESTER_REPOSITORY)
    private semesterRepository: ISemesterRepository,

    @Inject(CLASSES_REPOSITORY)
    private classesRepository: IClassesRepository,
  ) {}

  async count(whereOptions: any): Promise<number> {
    try {
      return await this.studentClassEnrollRepository.count(whereOptions);
    } catch (error) {
      throw new Error(
        `Error counting student class enrollments: ${error.message}`,
      );
    }
  }

  async create(enroll: CreateStudentClassEnrollDTO) {
    try {
      // const subjectPrerequisites =
      //   await this.subjectPrerequisiteRepository.findByClassCode(
      //     enroll.classCode,
      //   );

      // subjectPrerequisites.map((subjectPrerequisite) => {
      //   const studentClassResults =
      //     this.studentClassResultRepository.findByStudentAndSubject(
      //       enroll.studentId,
      //       subjectPrerequisite.subjectId,
      //     );

      //   if (studentClassResults.length === 0) {
      //     throw new Error(
      //       `Student ${enroll.studentId} does not have the required prerequisite ${subjectPrerequisite.subjectId} for class ${enroll.classCode}`,
      //     );
      //   }
      // });

      const currentClass = await this.classesRepository.findByCode(
        enroll.classCode,
      );

      const count = await this.studentClassEnrollRepository.count({
        classCode: enroll.classCode,
        type: EnrollEnum.COMPLETE,
      });

      if (count > currentClass.maximumQuantity)
        throw new Error(
          `Cannot enroll student ${enroll.studentId} in class ${enroll.classCode} because it exceeds the maximum quantity of ${currentClass.maximumQuantity}`,
        );

      return await this.studentClassEnrollRepository.create(enroll);
    } catch (error) {
      throw new Error(
        `Error creating student class enrollment: ${error.message}`,
      );
    }
  }

  async delete(enrollId: string) {
    try {
      return await this.studentClassEnrollRepository.delete(enrollId);
    } catch (error) {
      throw new Error(
        `Error deleting student class enrollment with ID ${enrollId}: ${error.message}`,
      );
    }
  }

  async findAll(
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<StudentClassEnrollDto>> {
    try {
      const enrollments = await this.studentClassEnrollRepository.findAll(
        page,
        limit,
      );
      const totalEnrollments = await this.count({});

      return {
        data: enrollments,
        page,
        totalPage: Math.ceil(totalEnrollments / limit),
        limit,
        total: totalEnrollments,
      };
    } catch (error) {
      throw new Error(
        `Error finding all student class enrollments: ${error.message}`,
      );
    }
  }

  async findById(enrollId: string) {
    try {
      return await this.studentClassEnrollRepository.findById(enrollId);
    } catch (error) {
      throw new Error(
        `Error finding student class enrollment with ID ${enrollId}: ${error.message}`,
      );
    }
  }

  async findByStudentAndClass(studentId: string, classCode: string) {
    try {
      return await this.studentClassEnrollRepository.findByStudentAndClass(
        studentId,
        classCode,
      );
    } catch (error) {
      throw new Error(
        `Error finding enrollment for student ${studentId} and class ${classCode}: ${error.message}`,
      );
    }
  }

  async updateTypeByStudentAndClass(
    studentId: string,
    classCode: string,
    type: EnrollEnum,
  ) {
    try {
      const studentClassEnroll =
        await this.studentClassEnrollRepository.findByStudentAndClass(
          studentId,
          classCode,
        );

      if (!studentClassEnroll) {
        throw new Error(
          `Enrollment not found for student ${studentId} and class ${classCode}`,
        );
      }

      if (!studentClassEnroll.id) {
        throw new Error('Enrollment ID is undefined.');
      }

      studentClassEnroll.type = type;

      const updateData = new UpdateStudentClassEnrollDTO();
      updateData.type = studentClassEnroll.type;

      return await this.studentClassEnrollRepository.update(
        studentClassEnroll.id,
        updateData,
      );
    } catch (error) {
      throw new Error(
        `Error finding enrollment for student ${studentId} and class ${classCode}: ${error.message}`,
      );
    }
  }

  async findByStudent(
    studentId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<StudentClassEnrollDto>> {
    try {
      const enrollments = await this.studentClassEnrollRepository.findByStudent(
        studentId,
        page,
        limit,
      );
      const totalEnrollments = await this.count({ studentId });

      return {
        data: enrollments,
        page,
        totalPage: Math.ceil(totalEnrollments / limit),
        limit,
        total: totalEnrollments,
      };
    } catch (error) {
      throw new Error(
        `Error finding enrollments for student ${studentId}: ${error.message}`,
      );
    }
  }

  async findByClass(
    classCode: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<StudentClassEnrollDto>> {
    try {
      const enrollments = await this.studentClassEnrollRepository.findByClass(
        classCode,
        page,
        limit,
      );
      const totalEnrollments = await this.count({ classCode });

      return {
        data: enrollments,
        page,
        totalPage: Math.ceil(totalEnrollments / limit),
        limit,
        total: totalEnrollments,
      };
    } catch (error) {
      throw new Error(
        `Error finding enrollments for class ${classCode}: ${error.message}`,
      );
    }
  }

  async update(enrollId: string, data: UpdateStudentClassEnrollDTO) {
    try {
      return await this.studentClassEnrollRepository.update(enrollId, data);
    } catch (error) {
      throw new Error(
        `Error updating student class enrollment with ID ${enrollId}: ${error.message}`,
      );
    }
  }

  async dropEnroll(
    studentId: string,
    classCode: string,
  ): Promise<StudentClassEnrollDto> {
    try {
      const currentDate = new Date();
      const currentClass = await this.classesRepository.findByCode(classCode);

      const semester = await this.semesterRepository.findById(
        currentClass.semesterId,
      );

      if (!semester) {
        throw new Error(`Semester not found for class ${classCode}`);
      }

      const startedAt = new Date(semester.startedAt);
      if (currentDate > startedAt) {
        throw new Error(
          `Cannot drop enrollment for class ${classCode} after the start date ${startedAt}`,
        );
      }

      const enrollment = new CreateStudentClassEnrollDTO();
      enrollment.studentId = studentId;
      enrollment.classCode = classCode;
      enrollment.type = EnrollEnum.DROP;

      return await this.studentClassEnrollRepository.create(enrollment);
    } catch (error) {
      throw new Error(
        `Error drop an enroll of student ${studentId} from class ${classCode}: ${error.message}`,
      );
    }
  }
}
