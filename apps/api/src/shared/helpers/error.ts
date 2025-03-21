import { Prisma } from '@prisma/client';

//Trùng dữ liệu
export const isUniqueConstraintPrismaError = (
  error: any,
): error is Prisma.PrismaClientKnownRequestError => {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2002'
  );
};

//Không tìm thấy bản ghi
export const isNotFoundPrismaError = (
  error: any,
): error is Prisma.PrismaClientKnownRequestError => {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2025'
  );
};

//Trường không thể null
export const isNotNullPrismaError = (
  error: any,
): error is Prisma.PrismaClientKnownRequestError => {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2011'
  );
};

//Dữ liệu sai kiểu
export const isInvalidValuePrismaError = (
  error: any,
): error is Prisma.PrismaClientKnownRequestError => {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2005'
  );
};

// Lỗi giá trị NULL không hợp lệ
export const isIncompatibleNullValueError = (
  error: any,
): error is Prisma.PrismaClientKnownRequestError => {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2032'
  );
};

// Lỗi tham chiếu không hợp lệ (P2023)
export const isInvalidReferenceError = (
  error: any,
): error is Prisma.PrismaClientKnownRequestError => {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2023'
  );
};
