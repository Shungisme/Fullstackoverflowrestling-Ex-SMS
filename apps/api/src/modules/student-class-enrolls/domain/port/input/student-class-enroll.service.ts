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

@Injectable()
export class StudentClassEnrollService implements IStudentClassEnrollService {
  constructor(
    @Inject(STUDENT_CLASS_ENROLL_REPOSITORY)
    private studentClassEnrollRepository: IStudentClassEnrollRepository,
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
}
