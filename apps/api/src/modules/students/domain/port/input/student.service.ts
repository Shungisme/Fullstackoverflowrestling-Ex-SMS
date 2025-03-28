import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IStudentService } from './IStudentService';
import {
  IStudentRepository,
  STUDENT_REPOSITORY,
} from '../output/IStudentRepository';
import {
  StudentRequestDTO,
  UpdateStudentRequestDTO,
} from '../../dto/student-dto';
import { SearchRequestDTO } from '../../dto/search-dto';
import { DeleteStudentResponseDTO } from '../../dto/delete-dto';
import {
  isIncompatibleNullValueError,
  isInvalidReferenceError,
  isInvalidValuePrismaError,
  isNotFoundPrismaError,
  isNotNullPrismaError,
  isUniqueConstraintPrismaError,
} from 'src/shared/helpers/error';
import {
  StudentResponseDTO,
  StudentsResponseDTO,
} from '../../dto/student-response-dto';
import {
  IProgramsRepository,
  PROGRAM_REPOSITORY,
} from 'src/modules/programs/domain/port/output/IProgramsRepository';
import {
  IStatusesRepository,
  STATUS_REPOSITORY,
} from 'src/modules/statuses/domain/port/output/IStatusesRepository';
import {
  FACULTIES_REPOSITORY,
  IFacultiesRepository,
} from 'src/modules/faculties/domain/port/output/IFacultiesRepository';
import { Student } from 'src/modules/students/adapters/driven/types/student-type';
import {
  formatAddress,
  formatIdentityPaper,
  parseAddress,
} from 'src/shared/utils/parse-adress';
import {
  ADDRESSES_REPOSITORY,
  IAddressesRepository,
} from 'src/modules/addresses/domain/port/output/IAddressesRepository';
import { Gender } from '@prisma/client';
import {
  IDENTITY_REPOSITORY,
  IIdentityPapersRepository,
} from 'src/modules/identity-papers/domain/port/output/IIdentityPapersRepository';
import { writeFileSync } from 'fs';
import * as XLSX from 'xlsx';
import { Response } from 'express';
import { CreateAddressDTO } from '../../dto/address-dto';
import { CreateStudentWithAddressDTO } from '../../dto/create-student-dto';

@Injectable()
export class StudentService implements IStudentService {
  constructor(
    @Inject(STUDENT_REPOSITORY)
    private readonly studentRepository: IStudentRepository,
    @Inject(PROGRAM_REPOSITORY)
    private readonly programRepository: IProgramsRepository,
    @Inject(STATUS_REPOSITORY)
    private readonly statusesRepository: IStatusesRepository,
    @Inject(FACULTIES_REPOSITORY)
    private readonly facultiesRepository: IFacultiesRepository,
    @Inject(ADDRESSES_REPOSITORY)
    private readonly addressesRepository: IAddressesRepository,
    @Inject(IDENTITY_REPOSITORY)
    private readonly identityRepository: IIdentityPapersRepository,
  ) {}

  async exportFile(type: string, res: Response): Promise<any> {
    try {
      const students = await this.studentRepository.getAll();
      if (!students) {
        throw new NotFoundException('Students are not existed');
      }

      let filePath = '';
      let fileName = '';

      switch (type) {
        case 'json': {
          const formattedStudents = students.map((student) => ({
            studentId: student.studentId,
            name: student.name,
            dateOfBirth:
              student.dateOfBirth instanceof Date
                ? student.dateOfBirth.toISOString().split('T')[0]
                : student.dateOfBirth,
            gender: student.gender,
            course: student.course,
            email: student.email,
            phone: student.phone,
            nationality: student.nationality,
            faculty: student.faculty?.title || '',
            permanentAddress: student.permanentAddress
              ? {
                  number: student.permanentAddress.number,
                  street: student.permanentAddress.street,
                  district: student.permanentAddress.district,
                  city: student.permanentAddress.city,
                  country: student.permanentAddress.country,
                }
              : null,
            temporaryAddress: student.temporaryAddress
              ? {
                  number: student.temporaryAddress.number,
                  street: student.temporaryAddress.street,
                  district: student.temporaryAddress.district,
                  city: student.temporaryAddress.city,
                  country: student.temporaryAddress.country,
                }
              : null,
            mailingAddress: student.mailingAddress
              ? {
                  number: student.mailingAddress.number,
                  street: student.mailingAddress.street,
                  district: student.mailingAddress.district,
                  city: student.mailingAddress.city,
                  country: student.mailingAddress.country,
                }
              : null,
            program: student.program?.title || '',
            status: student.status?.title || '',
            identityPaper: student.identityPaper
              ? {
                  type: student.identityPaper.type,
                  number: student.identityPaper.number,
                  issueDate:
                    student.identityPaper.issueDate instanceof Date
                      ? student.identityPaper.issueDate
                          .toISOString()
                          .split('T')[0]
                      : student.identityPaper.issueDate,
                  expirationDate:
                    student.identityPaper.expirationDate instanceof Date
                      ? student.identityPaper.expirationDate
                          .toISOString()
                          .split('T')[0]
                      : student.identityPaper.expirationDate,
                  placeOfIssue: student.identityPaper.placeOfIssue,
                  hasChip: student.identityPaper.hasChip,
                  issuingCountry: student.identityPaper.issuingCountry,
                  notes: student.identityPaper.notes,
                }
              : null,
          }));

          fileName = 'students.json';
          filePath = `./${fileName}`;
          writeFileSync(filePath, JSON.stringify(formattedStudents, null, 2));
          break;
        }
        case 'excel': {
          fileName = 'students.xlsx';
          filePath = `./${fileName}`;
          const wsData = [
            [
              'studentId',
              'name',
              'dateOfBirth',
              'gender',
              'course',
              'email',
              'phone',
              'nationality',
              'faculty',
              'permanentAddress',
              'temporaryAddress',
              'mailingAddress',
              'program',
              'status',
              'identityPaper',
            ],
            ...students.map((student) => [
              student.studentId,
              student.name,
              student.dateOfBirth,
              student.gender,
              student.course,
              student.email,
              student.phone,
              student.nationality,
              student.faculty?.title || '',
              student.permanentAddress
                ? formatAddress(student.permanentAddress)
                : '',
              student.temporaryAddress
                ? formatAddress(student.temporaryAddress)
                : '',
              student.mailingAddress
                ? formatAddress(student.mailingAddress)
                : '',
              student.program?.title || '',
              student.status?.title || '',
              student.identityPaper
                ? formatIdentityPaper(student.identityPaper)
                : '',
            ]),
          ];
          const ws = XLSX.utils.aoa_to_sheet(wsData);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Students');
          XLSX.writeFile(wb, filePath);
          break;
        }
        default:
          throw new BadRequestException('File type not supported');
      }

      res.download(filePath, fileName, (err) => {
        if (err) {
          throw new Error('File download failed');
        }
      });

      return {
        isDownload: true,
        message: 'Download successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async upload(
    file: Express.Multer.File,
  ): Promise<{ isCreated: boolean; message: string }> {
    try {
      const fileExt = file.originalname.split('.').pop()?.toLowerCase();
      const mimeType = file.mimetype;
      let rawStudents: any[] = [];
      let students: Student[] = [];

      if (fileExt === 'json' || mimeType === 'application/json') {
        const jsonString = file.buffer.toString('utf-8');
        rawStudents = JSON.parse(jsonString);
        students = await Promise.all(
          rawStudents.map(async (rawStudent) => {
            const student = await this.studentRepository.findById(
              rawStudent.studentId,
            );
            if (student) {
              throw new ConflictException(
                `Student with id ${rawStudent.studentId} is existed`,
              );
            }

            const permanentAddress = rawStudent.permanentAddress
              ? await this.addressesRepository.create(
                  rawStudent.permanentAddress,
                )
              : null;

            const temporaryAddress = rawStudent.temporaryAddress
              ? await this.addressesRepository.create(
                  rawStudent.temporaryAddress,
                )
              : null;

            const mailingAddress = await this.addressesRepository.create(
              rawStudent.mailingAddress,
            );

            const faculty = await this.facultiesRepository.findByName(
              rawStudent.faculty,
            );

            const program = await this.programRepository.findByName(
              rawStudent.program,
            );

            const status = await this.statusesRepository.findByName(
              rawStudent.status,
            );

            const gender = rawStudent.gender as Gender;

            const identity = await this.identityRepository.findByTypeAndNumber(
              rawStudent.identityPaper.type,
              rawStudent.identityPaper.number,
            );

            let newIdentity: any = null;
            if (!identity) {
              const formattedIdentity = {
                ...rawStudent.identityPaper,
                issueDate: new Date(rawStudent.identityPaper.issueDate),
                expirationDate: new Date(
                  rawStudent.identityPaper.expirationDate,
                ),
              };

              newIdentity =
                await this.identityRepository.create(formattedIdentity);
            }

            return new Student({
              studentId: String(rawStudent.studentId),
              name: rawStudent.name.trim(),
              dateOfBirth: new Date(rawStudent.dateOfBirth),
              gender,
              course: parseInt(rawStudent.course, 10),
              email: rawStudent.email.trim(),
              phone: String(rawStudent.phone),
              nationality: rawStudent.nationality.trim(),
              facultyId: faculty.id,
              permanentAddressId: permanentAddress?.id,
              temporaryAddressId: temporaryAddress?.id,
              mailingAddressId: mailingAddress?.id,
              programId: program.id,
              statusId: status.id,
              identityPaperId: newIdentity.id,
            });
          }),
        );
      } else if (
        fileExt === 'xlsx' ||
        fileExt === 'xls' ||
        mimeType.includes('spreadsheet') ||
        mimeType === 'application/vnd.ms-excel'
      ) {
        const workbook = XLSX.read(file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        rawStudents = jsonData;

        students = await Promise.all(
          rawStudents.map(async (rawStudent) => {
            const student = await this.studentRepository.findById(
              rawStudent.studentId,
            );
            if (student) {
              throw new ConflictException(
                `Student with id ${rawStudent.studentId} is existed`,
              );
            }

            const permanentAddress = rawStudent.permanentAddress
              ? await this.addressesRepository.create(
                  parseAddress(rawStudent.permanentAddress),
                )
              : null;

            const temporaryAddress = rawStudent.temporaryAddress
              ? await this.addressesRepository.create(
                  parseAddress(rawStudent.temporaryAddress),
                )
              : null;

            const mailingAddress = await this.addressesRepository.create(
              parseAddress(rawStudent.mailingAddress),
            );

            const identityPaperParts = rawStudent.identityPaper.split(',');

            const faculty = await this.facultiesRepository.findByName(
              rawStudent.faculty,
            );

            const program = await this.programRepository.findByName(
              rawStudent.program,
            );

            const status = await this.statusesRepository.findByName(
              rawStudent.status,
            );

            const gender = rawStudent.gender as Gender;

            await this.identityRepository.findByTypeAndNumber(
              identityPaperParts[0].trim(),
              identityPaperParts[1].trim(),
            );

            const identityPaper = await this.identityRepository.create({
              type: identityPaperParts[0].trim(),
              number: identityPaperParts[1].trim(),
              issueDate: new Date(identityPaperParts[2].trim()),
              expirationDate: new Date(identityPaperParts[3].trim()),
              placeOfIssue: identityPaperParts[4].trim(),
            });

            return new Student({
              studentId: String(rawStudent.studentId),
              name: rawStudent.name.trim(),
              dateOfBirth: new Date(rawStudent.dateOfBirth),
              gender,
              course: parseInt(rawStudent.course, 10),
              email: rawStudent.email.trim(),
              phone: String(rawStudent.phone),
              nationality: rawStudent.nationality.trim(),
              facultyId: faculty.id,
              permanentAddressId: permanentAddress?.id,
              temporaryAddressId: temporaryAddress?.id,
              mailingAddressId: mailingAddress?.id,
              programId: program.id,
              statusId: status.id,
              identityPaperId: identityPaper.id,
            });
          }),
        );
      } else {
        throw new BadRequestException('Unsupported file format');
      }

      const count = await this.studentRepository.createMany(students);
      return {
        isCreated: true,
        message: `Created: ${count ?? 0} students`,
      };
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw new ConflictException(error.message);
      }

      if (isNotFoundPrismaError(error)) {
        throw new NotFoundException(error.message);
      }

      if (isNotNullPrismaError(error)) {
        throw new BadRequestException(error.message);
      }

      if (isInvalidValuePrismaError(error)) {
        throw new BadRequestException(error.message);
      }

      if (isIncompatibleNullValueError(error)) {
        throw new BadRequestException(error.message);
      }

      if (isInvalidReferenceError(error)) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }

  async search(query: SearchRequestDTO): Promise<StudentsResponseDTO> {
    try {
      const students = await this.studentRepository.search(query);
      const total = await this.studentRepository.count();
      return {
        students: students,
        total: total,
      };
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw new NotFoundException('No students found matching the criteria');
      }

      if (isNotNullPrismaError(error)) {
        throw new BadRequestException(
          `Missing required field:  ${error.message}`,
        );
      }

      if (isIncompatibleNullValueError(error)) {
        throw new BadRequestException(
          `Null value found for a required field:  ${error.message}`,
        );
      }
      throw error;
    }
  }

  async create(
    student: CreateStudentWithAddressDTO,
  ): Promise<StudentResponseDTO> {
    try {
      return this.studentRepository.create(student);
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw new ConflictException(
          `Student with ID ${student.studentId} already exists: ${error.message}`,
        );
      }
      if (isNotNullPrismaError(error)) {
        throw new BadRequestException(
          `Missing required field:  ${error.message}`,
        );
      }

      if (isIncompatibleNullValueError(error)) {
        throw new BadRequestException(
          `Null value found for a required field:  ${error.message}`,
        );
      }

      throw error;
    }
  }

  async delete(studentId: string): Promise<DeleteStudentResponseDTO> {
    try {
      await this.studentRepository.delete(studentId);

      return {
        isDeleted: true,
        message: 'Delete successfully',
      };
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw new NotFoundException(
          `Student with ID ${studentId} not found: ${error.message}`,
        );
      }
      throw error;
    }
  }

  async update(student: UpdateStudentRequestDTO): Promise<StudentResponseDTO> {
    try {
      return await this.studentRepository.update(student);
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw new NotFoundException(
          `Student with ID ${student.studentId} not found: ${error.message}`,
        );
      }
      throw error;
    }
  }

  async findById(studentId: string): Promise<StudentResponseDTO> {
    const student = await this.studentRepository.findById(studentId);
    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found: `);
    }
    return student;
  }
}
