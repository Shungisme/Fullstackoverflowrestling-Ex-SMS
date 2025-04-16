import { PrismaClient } from '@prisma/client';
import { facultyData } from './faculty.data';
import { programData } from './program.data';
import { statusData } from './status.data';
import { addressData } from './address.data';
import { identityPaperData } from './identityPaper.data';
import { studentData } from './student.data';
import { subjectData } from './subject.data';
import { semesterData } from './semester.data';
import { classData } from './class.data';
import { subjectPrerequisiteData } from './subjectPrerequisite.data';
import { studentClassEnrollData } from './studentClassEnroll.data';
import { studentClassResultData } from './studentClassResult.data';

const prisma = new PrismaClient();

// Helper interface for tracking created records for rollback
interface CreatedRecord {
  model: string;
  id: string;
}

async function main() {
  console.log('Seeding database...');
  // Track created records for potential rollback
  const createdRecords: CreatedRecord[] = [];

  try {
    // Create faculties with pre-assigned IDs
    const faculties = await Promise.all(
      facultyData.map(async (faculty) => {
        const record = await prisma.faculty.create({
          data: faculty,
        });
        createdRecords.push({ model: 'faculty', id: record.id });
        return record;
      }),
    );
    console.log('Faculty data seeded');

    // Create programs with pre-assigned IDs
    const programs = await Promise.all(
      programData.map(async (program) => {
        const record = await prisma.program.create({
          data: program,
        });
        createdRecords.push({ model: 'program', id: record.id });
        return record;
      }),
    );
    console.log('Program data seeded');

    // Create statuses with pre-assigned IDs
    const statuses = await Promise.all(
      statusData.map(async (status) => {
        const record = await prisma.status.create({
          data: status,
        });
        createdRecords.push({ model: 'status', id: record.id });
        return record;
      }),
    );
    console.log('Status data seeded');

    // Create addresses with pre-assigned IDs
    const addresses = await Promise.all(
      addressData.map(async (address) => {
        const record = await prisma.address.create({
          data: address,
        });
        createdRecords.push({ model: 'address', id: record.id });
        return record;
      }),
    );
    console.log('Address data seeded');

    // Create identity papers with pre-assigned IDs
    const identityPapers = await Promise.all(
      identityPaperData.map(async (identityPaper) => {
        const record = await prisma.identityPaper.create({
          data: identityPaper,
        });
        createdRecords.push({ model: 'identityPaper', id: record.id });
        return record;
      }),
    );
    console.log('Identity paper data seeded');

    // Create students with pre-assigned IDs and relationships
    const students = await Promise.all(
      studentData.map(async (student) => {
        const record = await prisma.student.create({
          data: student,
        });
        createdRecords.push({ model: 'student', id: record.id });
        return record;
      }),
    );
    console.log('Student data seeded');

    // Create subjects with pre-assigned IDs
    const subjects = await Promise.all(
      subjectData.map(async (subject) => {
        const record = await prisma.subject.create({
          data: subject,
        });
        createdRecords.push({ model: 'subject', id: record.id });
        return record;
      }),
    );
    console.log('Subject data seeded');

    // Create semesters with pre-assigned IDs
    const semesters = await Promise.all(
      semesterData.map(async (semester) => {
        const record = await prisma.semester.create({
          data: semester,
        });
        createdRecords.push({ model: 'semester', id: record.id });
        return record;
      }),
    );
    console.log('Semester data seeded');

    // Create classes with pre-assigned IDs
    const classes = await Promise.all(
      classData.map(async (classItem) => {
        const record = await prisma.class.create({
          data: classItem,
        });
        createdRecords.push({ model: 'class', id: record.id });
        return record;
      }),
    );
    console.log('Class data seeded');

    // Create subject prerequisites with pre-assigned relationships
    await Promise.all(
      subjectPrerequisiteData.map(async (prerequisite) => {
        const record = await prisma.subjectPrerequisite.create({
          data: prerequisite,
        });
        createdRecords.push({ model: 'subjectPrerequisite', id: record.id });
        return record;
      }),
    );
    console.log('Subject prerequisite data seeded');

    // Create student class enrollments with pre-assigned relationships
    await Promise.all(
      studentClassEnrollData.map(async (enrollment) => {
        const record = await prisma.studentClassEnroll.create({
          data: enrollment,
        });
        createdRecords.push({ model: 'studentClassEnroll', id: record.id });
        return record;
      }),
    );
    console.log('Student class enrollment data seeded');

    // Create student class results with pre-assigned relationships
    await Promise.all(
      studentClassResultData.map(async (result) => {
        const record = await prisma.studentClassResult.create({
          data: result,
        });
        createdRecords.push({ model: 'studentClassResult', id: record.id });
        return record;
      }),
    );
    console.log('Database seeding completed!');
  } catch (error) {
    console.error('Error during seeding:', error);
    console.log('Rolling back all created records...');

    // Rollback in reverse order (dependencies first)
    for (let i = createdRecords.length - 1; i >= 0; i--) {
      const record = createdRecords[i];
      try {
        console.log(`Rolling back ${record.model} with ID: ${record.id}`);

        switch (record.model) {
          case 'studentClassResult':
            await prisma.studentClassResult.delete({
              where: { id: record.id },
            });
            break;
          case 'studentClassEnroll':
            await prisma.studentClassEnroll.delete({
              where: { id: record.id },
            });
            break;
          case 'subjectPrerequisite':
            await prisma.subjectPrerequisite.delete({
              where: { id: record.id },
            });
            break;
          case 'class':
            await prisma.class.delete({ where: { id: record.id } });
            break;
          case 'semester':
            await prisma.semester.delete({ where: { id: record.id } });
            break;
          case 'subject':
            await prisma.subject.delete({ where: { id: record.id } });
            break;
          case 'student':
            await prisma.student.delete({ where: { id: record.id } });
            break;
          case 'identityPaper':
            await prisma.identityPaper.delete({ where: { id: record.id } });
            break;
          case 'address':
            await prisma.address.delete({ where: { id: record.id } });
            break;
          case 'status':
            await prisma.status.delete({ where: { id: record.id } });
            break;
          case 'program':
            await prisma.program.delete({ where: { id: record.id } });
            break;
          case 'faculty':
            await prisma.faculty.delete({ where: { id: record.id } });
            break;
          default:
            console.warn(`Unknown model type: ${record.model}`);
        }
      } catch (rollbackError) {
        console.error(
          `Error rolling back ${record.model} ${record.id}:`,
          rollbackError,
        );
      }
    }
    console.log('Rollback completed.');
    throw error; // Re-throw the error to indicate the seeding failed
  }
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
