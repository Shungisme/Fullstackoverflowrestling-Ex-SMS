import { STUDENT_CONSTANT } from "../../../api/src/shared/constants/student.constant";
import { ClassResult } from "../types/course";

export const EngVietFalcutyMap = {
  [STUDENT_CONSTANT.FACULTY.LAW]: "Khoa Luật",
  [STUDENT_CONSTANT.FACULTY.FRENCH_LANGUAGE]: "Khoa Tiếng Pháp",
  [STUDENT_CONSTANT.FACULTY.BUSSINESS_ENGLISH]: "Khoa Tiếng Anh thương mại",
  [STUDENT_CONSTANT.FACULTY.JAPANESE_LANGUAGE]: "Khoa Tiếng Nhật",
};

export const EngVietStatusMap = {
  [STUDENT_CONSTANT.STATUS.STUDYING]: "Đang học",
  [STUDENT_CONSTANT.STATUS.GRADUATED]: "Đã tốt nghiệp",
  [STUDENT_CONSTANT.STATUS.DISCONTINUED]: "Đã thôi học",
  [STUDENT_CONSTANT.STATUS.TEMPORARY_SUSPENSION]: "Tạm dừng học",
};

export const EngVietGenderMap = {
  [STUDENT_CONSTANT.GENDER.MALE]: "Nam",
  [STUDENT_CONSTANT.GENDER.FEMALE]: "Nữ",
};

export const mapScoreTypeToLabel = (type: ClassResult["type"]): string => {
    switch (type) {
        case "MIDTERM":
            return "Giữa kỳ";
        case "FINALTERM":
            return "Cuối kỳ";
        case "OTHER":
            return "Khác";
        default:
            return "Không xác định";
    }
}

