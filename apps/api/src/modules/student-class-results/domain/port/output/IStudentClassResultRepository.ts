import { CreateStudentClassResultDTO } from '../../dto/create-student-class-result.dto';
import { StudentClassResultDto } from '../../dto/student-class-result.dto';
import { UpdateStudentClassResultDTO } from '../../dto/update-student-class-result.dto';

export interface IStudentClassResultRepository {
  create(result: CreateStudentClassResultDTO): Promise<StudentClassResultDto>;

  update(
    resultId: string,
    data: UpdateStudentClassResultDTO,
  ): Promise<StudentClassResultDto>;

  delete(resultId: string): Promise<StudentClassResultDto>;

  findById(resultId: string): Promise<StudentClassResultDto>;

  findByStudentAndClass(
    studentId: string,
    classCode: string,
  ): Promise<StudentClassResultDto[]>;

  findByStudent(
    studentId: string,
    page: number,
    limit: number,
  ): Promise<StudentClassResultDto[]>;

  findByClass(
    classCode: string,
    page: number,
    limit: number,
  ): Promise<StudentClassResultDto[]>;

  // findByStudentAndSubjectCode(
  //   studentId: string,
  //   subjectId: string,
  // ): Promise<StudentClassResultDto[]>;

  findAll(page: number, limit: number): Promise<StudentClassResultDto[]>;

  count(whereOptions: any): Promise<number>;
}

export const STUDENT_CLASS_RESULT_REPOSITORY = Symbol(
  'IStudentClassResultRepository',
);
