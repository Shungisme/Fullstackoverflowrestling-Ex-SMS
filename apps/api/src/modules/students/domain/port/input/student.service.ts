import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { IStudentService } from './IStudentService';
import {
  IStudentRepository,
  STUDENT_REPOSITORY,
} from '../output/IStudentRepository';
import { UpdateStudentRequestDTO } from '../../dto/student-dto';
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
  StudentResponse,
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
import { CreateStudentWithAddressDTO } from '../../dto/create-student-dto';
import { calculateGPA } from 'src/shared/utils/calculate-gpa';
import { TranslationService } from 'src/modules/translations/domain/port/input/translation.service';

@Injectable()
export class StudentService implements IStudentService {
  private readonly logger = new Logger(StudentService.name);
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
    private readonly translationService: TranslationService,
  ) {}

  async exportTranscript(studentId: string, res: Response): Promise<void> {
    const student = await this.studentRepository.findById(studentId);
    if (!student) {
      throw new Error(`Sinh viên với mã ${studentId} không tồn tại`);
    }

    const results = await this.studentRepository.getStudentResults(studentId);

    const gpa = calculateGPA(results);

    const workbook = XLSX.utils.book_new();
    const worksheetData: (string | number)[][] = [];

    worksheetData.push(['BẢNG ĐIỂM CHÍNH THỨC']);
    worksheetData.push([]);

    worksheetData.push(['Mã Sinh Viên:', student.studentId]);
    worksheetData.push(['Họ Tên:', student.name]);
    worksheetData.push(['Khoa:', student.faculty.title]);
    worksheetData.push(['Chương Trình:', student.program.title]);
    worksheetData.push([]);

    worksheetData.push(['Mã Môn', 'Tên Môn', 'Số Tín Chỉ', 'Điểm', 'Kết Quả']);

    results.forEach((result) => {
      const score = parseFloat(result.score);
      worksheetData.push([
        result.class.subject.code,
        result.class.subject.title,
        result.class.subject.credit,
        score,
        score >= 5 ? 'Đạt' : 'Không Đạt',
      ]);
    });

    // Thêm GPA
    worksheetData.push([]); // Dòng trống
    worksheetData.push(['GPA:', gpa.toFixed(2)]);

    // Tạo worksheet từ dữ liệu
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Merge cell cho tiêu đề
    worksheet['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }];

    // Định dạng tiêu đề
    worksheet['A1'].s = {
      font: { bold: true, sz: 16 },
      alignment: { horizontal: 'center' },
    };

    worksheet['!cols'] = [
      { wch: 15 }, // Mã Môn
      { wch: 30 }, // Tên Môn
      { wch: 15 }, // Số Tín Chỉ
      { wch: 10 }, // Điểm
      { wch: 15 }, // Kết Quả
    ];

    // Thêm worksheet vào workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Bảng Điểm');

    // Tạo buffer cho file Excel
    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

    // Thiết lập header để tải file
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=transcript-${studentId}.xlsx`,
    );

    res.end(buffer);
  }

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
              student.studentId!,
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
      const { limit, page, lang } = query; // Lấy tham số lang từ query
      const students = await this.studentRepository.search(query);
      const total = await this.studentRepository.count();

      // Áp dụng translation nếu có tham số lang
      if (lang && students.length > 0) {
        await this.applyTranslationsToList(students, lang);
      }

      return {
        data: students,
        page,
        totalPage: Math.ceil(total / limit),
        limit,
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
      const existed = await this.studentRepository.findById(student.studentId);

      if (existed) {
        throw new ConflictException(
          `Student with ID ${student.studentId} already exists`,
        );
      }

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
      // Lấy thông tin sinh viên trước khi xóa để có thể xóa các bản dịch liên quan
      const student = await this.studentRepository.findById(studentId);

      if (!student) {
        throw new NotFoundException(`Student with ID ${studentId} not found`);
      }

      // Xóa các bản dịch liên quan đến sinh viên
      try {
        // 1. Xóa bản dịch của chính sinh viên
        const studentTranslations =
          await this.translationService.getAllTranslations(
            'Student',
            student.id,
          );

        if (studentTranslations.length > 0) {
          this.logger.log(
            `Deleting ${studentTranslations.length} translations for student ${student.id}`,
          );

          const deletedCount = await this.translationService[
            'translationRepository'
          ].deleteMany('Student', student.id);

          this.logger.log(
            `Successfully deleted ${deletedCount} translations for student ${student.id}`,
          );
        }

        // 2. Xóa bản dịch của các địa chỉ liên quan
        if (student.permanentAddress && student.permanentAddress.id) {
          const addressTranslations =
            await this.translationService.getAllTranslations(
              'Address',
              student.permanentAddress.id,
            );

          if (addressTranslations.length > 0) {
            this.logger.log(
              `Deleting ${addressTranslations.length} translations for permanent address ${student.permanentAddress.id}`,
            );

            await this.translationService['translationRepository'].deleteMany(
              'Address',
              student.permanentAddress.id,
            );
          }
        }

        if (student.temporaryAddress && student.temporaryAddress.id) {
          const addressTranslations =
            await this.translationService.getAllTranslations(
              'Address',
              student.temporaryAddress.id,
            );

          if (addressTranslations.length > 0) {
            this.logger.log(
              `Deleting ${addressTranslations.length} translations for temporary address ${student.temporaryAddress.id}`,
            );

            await this.translationService['translationRepository'].deleteMany(
              'Address',
              student.temporaryAddress.id,
            );
          }
        }

        if (student.mailingAddress && student.mailingAddress.id) {
          const addressTranslations =
            await this.translationService.getAllTranslations(
              'Address',
              student.mailingAddress.id,
            );

          if (addressTranslations.length > 0) {
            this.logger.log(
              `Deleting ${addressTranslations.length} translations for mailing address ${student.mailingAddress.id}`,
            );

            await this.translationService['translationRepository'].deleteMany(
              'Address',
              student.mailingAddress.id,
            );
          }
        }

        // 3. Xóa bản dịch của giấy tờ tùy thân
        if (student.identityPaper && student.identityPaper.id) {
          const identityTranslations =
            await this.translationService.getAllTranslations(
              'IdentityPaper',
              student.identityPaper.id,
            );

          if (identityTranslations.length > 0) {
            this.logger.log(
              `Deleting ${identityTranslations.length} translations for identity paper ${student.identityPaper.id}`,
            );

            await this.translationService['translationRepository'].deleteMany(
              'IdentityPaper',
              student.identityPaper.id,
            );
          }
        }
      } catch (translationError) {
        this.logger.error(
          `Error deleting translations for student ${studentId}: ${translationError.message}`,
        );
      }

      // Xóa sinh viên
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
      const existingStudent = await this.studentRepository.findById(
        student.studentId!,
      );

      if (!existingStudent) {
        throw new NotFoundException(
          `Student with ID ${student.studentId} not found`,
        );
      }

      // Xóa các bản dịch liên quan đến sinh viên
      try {
        // 1. Xóa bản dịch của chính sinh viên
        const studentTranslations =
          await this.translationService.getAllTranslations(
            'Student',
            existingStudent.id,
          );

        if (studentTranslations.length > 0) {
          this.logger.log(
            `Deleting ${studentTranslations.length} translations for student ${existingStudent.id}`,
          );

          await this.translationService['translationRepository'].deleteMany(
            'Student',
            existingStudent.id,
          );

          this.logger.log(
            `Successfully deleted translations for student ${existingStudent.id}`,
          );
        }

        if (existingStudent.permanentAddress?.id) {
          const addressTranslations =
            await this.translationService.getAllTranslations(
              'Address',
              existingStudent.permanentAddress.id,
            );

          if (addressTranslations.length > 0) {
            this.logger.log(
              `Deleting translations for permanent address ${existingStudent.permanentAddress.id}`,
            );

            await this.translationService['translationRepository'].deleteMany(
              'Address',
              existingStudent.permanentAddress.id,
            );
          }
        }

        if (existingStudent.temporaryAddress?.id) {
          const addressTranslations =
            await this.translationService.getAllTranslations(
              'Address',
              existingStudent.temporaryAddress.id,
            );

          if (addressTranslations.length > 0) {
            this.logger.log(
              `Deleting translations for temporary address ${existingStudent.temporaryAddress.id}`,
            );

            await this.translationService['translationRepository'].deleteMany(
              'Address',
              existingStudent.temporaryAddress.id,
            );
          }
        }

        if (existingStudent.mailingAddress?.id) {
          const addressTranslations =
            await this.translationService.getAllTranslations(
              'Address',
              existingStudent.mailingAddress.id,
            );

          if (addressTranslations.length > 0) {
            this.logger.log(
              `Deleting translations for mailing address ${existingStudent.mailingAddress.id}`,
            );

            await this.translationService['translationRepository'].deleteMany(
              'Address',
              existingStudent.mailingAddress.id,
            );
          }
        }

        if (existingStudent.identityPaper?.id) {
          const identityTranslations =
            await this.translationService.getAllTranslations(
              'IdentityPaper',
              existingStudent.identityPaper.id,
            );

          if (identityTranslations.length > 0) {
            this.logger.log(
              `Deleting translations for identity paper ${existingStudent.identityPaper.id}`,
            );

            await this.translationService['translationRepository'].deleteMany(
              'IdentityPaper',
              existingStudent.identityPaper.id,
            );
          }
        }
      } catch (translationError) {
        this.logger.error(
          `Error deleting translations for student ${student.studentId}: ${translationError.message}`,
        );
      }

      const updatedStudent = await this.studentRepository.update(student);

      return updatedStudent;
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

  /**
   * Áp dụng bản dịch cho một đối tượng sinh viên và tất cả đối tượng liên quan
   * @param student Đối tượng sinh viên cần dịch
   * @param lang Mã ngôn ngữ cần dịch (vd: 'en', 'vi', 'fr')
   */
  private async applyTranslation(
    student: StudentResponse,
    lang: string,
  ): Promise<void> {
    try {
      // 1. Dịch các trường của sinh viên
      const studentTranslations =
        await this.translationService.getAllTranslations(
          'Student',
          student.id,
          undefined,
          lang,
        );

      if (studentTranslations.length > 0) {
        // Áp dụng các bản dịch vào đối tượng sinh viên
        for (const translation of studentTranslations) {
          if (student[translation.field] !== undefined) {
            student[translation.field] = translation.value;
            this.logger.debug(
              `Applied student ${translation.field} translation: ${translation.value}`,
            );
          }
        }
      }

      // 2. Dịch faculty nếu có
      if (student.faculty && student.faculty.id) {
        const facultyTranslations =
          await this.translationService.getAllTranslations(
            'Faculty',
            student.faculty.id,
            undefined,
            lang,
          );

        if (facultyTranslations.length > 0) {
          // Áp dụng các bản dịch vào đối tượng faculty
          for (const translation of facultyTranslations) {
            if (translation.field === 'title' && student.faculty.title) {
              student.faculty.title = translation.value;
              this.logger.debug(
                `Applied faculty title translation: ${translation.value}`,
              );
            }
          }
        }
      }

      // 3. Dịch program nếu có
      if (student.program && student.program.id) {
        const programTranslations =
          await this.translationService.getAllTranslations(
            'Program',
            student.program.id,
            undefined,
            lang,
          );

        if (programTranslations.length > 0) {
          // Áp dụng các bản dịch vào đối tượng program
          for (const translation of programTranslations) {
            if (translation.field === 'title' && student.program.title) {
              student.program.title = translation.value;
              this.logger.debug(
                `Applied program title translation: ${translation.value}`,
              );
            }
          }
        }
      }

      // 4. Dịch status nếu có
      if (student.status && student.status.id) {
        const statusTranslations =
          await this.translationService.getAllTranslations(
            'Status',
            student.status.id,
            undefined,
            lang,
          );

        if (statusTranslations.length > 0) {
          // Áp dụng các bản dịch vào đối tượng status
          for (const translation of statusTranslations) {
            if (translation.field === 'title' && student.status.title) {
              student.status.title = translation.value;
              this.logger.debug(
                `Applied status title translation: ${translation.value}`,
              );
            }
          }
        }
      }

      // 5. Dịch permanentAddress nếu có
      if (student.permanentAddress && student.permanentAddress.id) {
        const addressTranslations =
          await this.translationService.getAllTranslations(
            'Address',
            student.permanentAddress.id,
            undefined,
            lang,
          );

        if (addressTranslations.length > 0) {
          // Áp dụng các bản dịch vào đối tượng địa chỉ
          for (const translation of addressTranslations) {
            if (
              ['street', 'district', 'city', 'country'].includes(
                translation.field,
              ) &&
              student.permanentAddress[translation.field]
            ) {
              student.permanentAddress[translation.field] = translation.value;
              this.logger.debug(
                `Applied permanentAddress ${translation.field} translation: ${translation.value}`,
              );
            }
          }
        }
      }

      // 6. Dịch temporaryAddress nếu có
      if (student.temporaryAddress && student.temporaryAddress.id) {
        const addressTranslations =
          await this.translationService.getAllTranslations(
            'Address',
            student.temporaryAddress.id,
            undefined,
            lang,
          );

        if (addressTranslations.length > 0) {
          // Áp dụng các bản dịch vào đối tượng địa chỉ
          for (const translation of addressTranslations) {
            if (
              ['street', 'district', 'city', 'country'].includes(
                translation.field,
              ) &&
              student.temporaryAddress[translation.field]
            ) {
              student.temporaryAddress[translation.field] = translation.value;
              this.logger.debug(
                `Applied temporaryAddress ${translation.field} translation: ${translation.value}`,
              );
            }
          }
        }
      }

      // 7. Dịch mailingAddress nếu có
      if (student.mailingAddress && student.mailingAddress.id) {
        const addressTranslations =
          await this.translationService.getAllTranslations(
            'Address',
            student.mailingAddress.id,
            undefined,
            lang,
          );

        if (addressTranslations.length > 0) {
          // Áp dụng các bản dịch vào đối tượng địa chỉ
          for (const translation of addressTranslations) {
            if (
              ['street', 'district', 'city', 'country'].includes(
                translation.field,
              ) &&
              student.mailingAddress[translation.field]
            ) {
              student.mailingAddress[translation.field] = translation.value;
              this.logger.debug(
                `Applied mailingAddress ${translation.field} translation: ${translation.value}`,
              );
            }
          }
        }
      }

      // 8. Dịch identityPaper nếu có (các trường như placeOfIssue, issuingCountry)
      if (student.identityPaper && student.identityPaper.id) {
        const identityTranslations =
          await this.translationService.getAllTranslations(
            'IdentityPaper',
            student.identityPaper.id,
            undefined,
            lang,
          );

        if (identityTranslations.length > 0) {
          // Áp dụng các bản dịch vào đối tượng giấy tờ
          for (const translation of identityTranslations) {
            if (
              ['placeOfIssue', 'issuingCountry', 'notes', 'type'].includes(
                translation.field,
              ) &&
              student.identityPaper[translation.field]
            ) {
              student.identityPaper[translation.field] = translation.value;
              this.logger.debug(
                `Applied identityPaper ${translation.field} translation: ${translation.value}`,
              );
            }
          }
        }
      }
    } catch (error) {
      this.logger.error(
        `Error applying translations to student ${student.id}: ${error.message}`,
      );
      this.logger.debug(error.stack);
    }
  }

  /**
   * Áp dụng bản dịch cho danh sách sinh viên
   * @param students Danh sách sinh viên cần dịch
   * @param lang Mã ngôn ngữ cần dịch
   */
  private async applyTranslationsToList(
    students: StudentResponse[],
    lang: string,
  ): Promise<void> {
    try {
      await Promise.all(
        students.map((student) => this.applyTranslation(student, lang)),
      );
    } catch (error) {
      this.logger.error(
        `Error applying translations to student list: ${error.message}`,
      );
      this.logger.debug(error.stack);
    }
  }
}
