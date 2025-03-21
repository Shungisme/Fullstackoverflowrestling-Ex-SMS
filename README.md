# Student Management System

## Giới thiệu

Hệ thống Quản lý Sinh viên là phần mềm giúp quản lý thông tin sinh viên một cách hiệu quả. Dự án được phát triển với TypeScript và quản lý theo kiến trúc monorepo sử dụng Turborepo.

## Cấu trúc source code

```
student_management/
├── apps/                # Các ứng dụng trong monorepo
│   ├── web/             # Ứng dụng web client
│   │   ├── src/         # Mã nguồn của ứng dụng web
│   │   │    ├── app/    # Cấu hình và khởi tạo ứng dụng
│   │   │    ├── components/ # Các thành phần UI
│   │   │    │    ├── atoms/     # Các thành phần UI nhỏ nhất
│   │   │    │    ├── molecules/ # Các thành phần UI kết hợp từ atoms
│   │   │    │    ├── organisms/ # Các thành phần UI phức tạp hơn
│   │   │    │    ├── pages/     # Các trang của ứng dụng
│   │   │    │    ├── templates/ # Các mẫu giao diện
│   │   │    ├── constants/ # Các hằng số dùng trong ứng dụng
│   │   │    ├── context/   # Các context API
│   │   │    ├── hooks/     # Các custom hooks
│   │   │    ├── pages/     # Các trang của ứng dụng
│   │   │    ├── public/    # Các tài nguyên tĩnh
│   │   │    ├── styles/    # Các file CSS
│   │   │    ├── theme/     # Cấu hình chủ đề giao diện
│   │   │    ├── types/     # Các định nghĩa TypeScript
│   │   │    ├── utils/     # Các tiện ích chung
│   │   └── package.json # Cấu hình package của ứng dụng web
│   └── api/             # API server
│       ├── src/         # Mã nguồn của API server
│       │    ├── modules/ # Các module của API
│       │    │    ├── students/ # Module quản lý sinh viên
│       │    │    │    ├── adapters/ # Các adapter của module
│       │    │    │    │    ├── driven/ # Các adapter driven
│       │    │    │    │    ├── driver/ # Các adapter driver
│       │    │    │    ├── domain/  # Các lớp domain
│       │    │    │    │    ├── dto/ # Các lớp DTO
│       │    │    │    │    ├── port/ # Các cổng giao tiếp
│       │    ├── shared/ # Các thành phần dùng chung
│       ├── test/  # Các bài kiểm thử
│       ├── prisma/ # Cấu hình Prisma ORM
│       └── package.json # Cấu hình package của API server
├── packages/            # Các package dùng chung
│   ├── ui/              # Thư viện UI components dùng chung
│   ├── database/        # Kết nối và mô hình dữ liệu
│   └── config/          # Cấu hình dùng chung
├── turbo.json           # Cấu hình Turborepo
├── package.json         # Cấu hình package gốc
├── pnpm-lock.yaml       # Lock file của pnpm
├── pnpm-workspace.yaml  # Cấu hình workspace của pnpm
└── README.md            # File hướng dẫn này
```

## Hướng dẫn cài đặt & chạy chương trình

### Yêu cầu hệ thống

- **Hệ điều hành:** Windows 10/11, macOS 10.14 trở lên, hoặc Linux (Ubuntu 18.04 trở lên)
- **Node.js:** Phiên bản 16.0.0 trở lên
- **RAM:** Tối thiểu 2GB
- **Dung lượng ổ cứng trống:** 1GB
- **Trình duyệt web:** Chrome, Firefox, Edge hoặc Safari phiên bản mới nhất

### Cài đặt Node.js (nếu chưa có)

1. **Kiểm tra Node.js đã được cài chưa**

   - Mở Command Prompt (Windows) hoặc Terminal (Mac/Linux)
   - Nhập lệnh: `node -v`
   - Nếu hiển thị phiên bản Node.js (ví dụ: v16.15.0), bạn đã cài đặt rồi
   - Nếu báo lỗi, tiếp tục các bước sau

2. **Tải Node.js**

   - Truy cập trang web: https://nodejs.org/
   - Chọn phiên bản LTS (Long Term Support) để tải xuống
   - Nhấp vào nút tải xuống phù hợp với hệ điều hành của bạn và lưu file cài đặt

3. **Cài đặt Node.js**

   - **Windows**:
     - Mở file .msi vừa tải xuống
     - Nhấn "Next" và làm theo hướng dẫn trên màn hình
     - Chọn tất cả các tính năng mặc định và tiếp tục
     - Đợi quá trình cài đặt hoàn tất và nhấn "Finish"
   - **macOS**:
     - Mở file .pkg vừa tải xuống
     - Làm theo các bước trên màn hình để hoàn tất cài đặt
   - **Linux**:
     ```
     curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
     sudo apt-get install -y nodejs
     ```

4. **Kiểm tra lại cài đặt**
   - Mở lại Command Prompt hoặc Terminal
   - Nhập lệnh: `node -v`
   - Nhập lệnh: `npm -v`
   - Nếu cả hai lệnh đều hiển thị phiên bản, cài đặt đã thành công

### Cài đặt pnpm

1. **Mở Command Prompt (Windows) hoặc Terminal (Mac/Linux)**

2. **Cài đặt pnpm** bằng một trong các cách sau:

   - Sử dụng npm:
     ```
     npm install -g pnpm
     ```
   - Hoặc trên Windows với PowerShell:
     ```
     iwr https://get.pnpm.io/install.ps1 -useb | iex
     ```
   - Hoặc trên macOS/Linux:
     ```
     curl -fsSL https://get.pnpm.io/install.sh | sh -
     ```

3. **Kiểm tra cài đặt**:
   ```
   pnpm --version
   ```

### Cài đặt ứng dụng Quản lý Sinh Viên

1. **Tải ứng dụng**

   - **Nếu bạn sử dụng Git**:
     - Mở Command Prompt hoặc Terminal
     - Điều hướng đến thư mục bạn muốn lưu ứng dụng:
       ```
       cd đường-dẫn-đến-thư-mục
       ```
     - Clone repository:
       ```
       git clone https://github.com/Shungisme/Fullstackoverflowrestling-Ex-SMS
       ```
     - Di chuyển vào thư mục dự án:
       ```
       cd Fullstackoverflowrestling-Ex-SMS
       ```
   - **Hoặc tải xuống dưới dạng ZIP**:
     - Tải file ZIP từ đường link: [Link tải ứng dụng]
     - Giải nén vào thư mục bạn muốn lưu ứng dụng
     - Mở Command Prompt hoặc Terminal và điều hướng đến thư mục vừa giải nén

2. **Cài đặt các thư viện phụ thuộc**
   - Mở Command Prompt hoặc Terminal trong thư mục dự án
   - Chạy lệnh:
     ```
     pnpm install
     ```
   - Đợi cho quá trình cài đặt hoàn tất (có thể mất vài phút tùy thuộc vào tốc độ internet)

### Biên dịch và chạy chương trình

#### Bước 1: Thiết lập môi trường cho dự án

1. Bổ sung các file .env
2. Generate Prisma Client
   - Mở Command Prompt hoặc Terminal
   - Điều hướng đến thư mục bạn đã lưu ứng dụng:
     ```
     cd đường-dẫn-đến-thư-mục
     ```
   - Điều hướng đến thư mục chứa mã nguồn backend:
     ```
      cd apps/api
     ```
   - Khởi tạo Prisma Client
     ```
      pnpm prisma generate
     ```

#### Bước 2: Biên dịch dự án

1. Mở Command Prompt hoặc Terminal trong thư mục gốc của dự án
2. Chạy lệnh:
   ```
   pnpm build
   ```
3. Đợi cho quá trình biên dịch hoàn tất. Bạn sẽ thấy thông báo thành công.

#### Bước 3: Chạy ứng dụng

1. Sau khi biên dịch thành công, chạy lệnh:
   ```
   pnpm dev
   ```
2. Truy cập ứng dụng:
   - Mở trình duyệt web
   - Truy cập địa chỉ: `http://localhost:3000`

#### Chế độ phát triển

Nếu bạn muốn phát triển ứng dụng với chế độ tự động tải lại khi code thay đổi:

```
pnpm dev
```

#### Chạy riêng từng ứng dụng

- Chạy ứng dụng web (client):
  ```
  pnpm --filter web dev
  ```
- Chạy API server:
  ```
  pnpm --filter api dev
  ```

### Hướng dẫn sử dụng cơ bản

#### Quản lý sinh viên

1. **Xem danh sách sinh viên**

   - Danh sách sinh viên sẽ hiển thị trong bảng
     ![Dashboard](./images//dashboard.png)

2. **Thêm sinh viên mới**

   - Nhấp vào nút "Thêm sinh viên" phía trên bảng
   - Điền đầy đủ thông tin sinh viên vào biểu mẫu (các trường có dấu \* là bắt buộc)
   - Nhấp nút "Lưu" để hoàn tất
     ![Add Student](./images//add-student.png)

3. **Chỉnh sửa thông tin sinh viên**

   - Tìm sinh viên cần chỉnh sửa trong danh sách
   - Nhấp vào biểu tượng bút chì ở cột "Thao tác"
   - Thay đổi thông tin cần thiết trong biểu mẫu
   - Nhấp nút "Cập nhật" để hoàn tất
     ![Edit Student](./images//edit-student.png)

4. **Xóa sinh viên**

   - Tìm sinh viên cần xóa trong danh sách
   - Nhấp vào biểu tượng thùng rác ở cột "Thao tác"
   - Xác nhận xóa khi hộp thoại hiện lên
     ![Delete Student](./images//delete-student.png)

5. **Tìm kiếm sinh viên**
   - Tìm kiếm sinh viên bằng thanh tìm kiếm trên màn hình
   - Nhập mã số sinh viên hoặc tên sinh viên để tìm kiếm
     ![Search Student](./images//search-student.png)

#### Quản lý khoa

1. **Xem danh sách khoa**

   - Vào mục "Cài đặt"
   - Chọn tab "Khoa"
   - Danh sách khoa sẽ hiển thị trong bảng
     ![Faculty](./images//faculty.png)

2. **Thêm khoa mới**

   - Vào mục "Cài đặt"
   - Chọn tab "Khoa"
   - Nhấp vào nút "Thêm khoa mới" phía trên bảng
   - Điền đầy đủ thông tin khoa vào biểu mẫu
   - Nhấp nút "Lưu" để hoàn tất
     ![Add Faculty](./images//add-faculty.png)

3. **Chỉnh sửa thông tin khoa**

   - Vào mục "Cài đặt"
   - Chọn tab "Khoa"
   - Tìm khoa cần chỉnh sửa trong danh sách
   - Nhấp vào biểu tượng bút chì ở cột "Thao tác"
   - Thay đổi thông tin cần thiết trong biểu mẫu
   - Nhấp nút "Cập nhật" để hoàn tất
     ![Edit Faculty](./images//edit-faculty.png)

4. **Xóa khoa**

   - Vào mục "Cài đặt"
   - Chọn tab "Khoa"
   - Tìm khoa cần xóa trong danh sách
   - Nhấp vào biểu tượng thùng rác ở cột "Thao tác"
   - Xác nhận xóa khi hộp thoại hiện lên
     ![Delete Faculty](./images//delete-faculty.png)
     ![Delete Faculty 2](./images//delete-faculty-2.png)

#### Quản lý chương trình học

1. **Xem danh sách chương trình học**

   - Vào mục "Cài đặt"
   - Chọn tab "Chương trình học"
   - Danh sách chương trình học sẽ hiển thị trong bảng
     ![Program](./images//program.png)

2. **Thêm chương trình học mới**

   - Vào mục "Cài đặt"
   - Chọn tab "Chương trình học"
   - Nhấp vào nút "Thêm chương trình học mới" phía trên bảng
   - Điền đầy đủ thông tin sinh viên vào biểu mẫu
   - Nhấp nút "Lưu" để hoàn tất
     ![Add Program](./images//add-program.png)

3. **Chỉnh sửa thông tin chương trình học**

   - Vào mục "Cài đặt"
   - Chọn tab "Chương trình học"
   - Tìm chương trình học cần chỉnh sửa trong danh sách
   - Nhấp vào biểu tượng bút chì ở cột "Thao tác"
   - Thay đổi thông tin cần thiết trong biểu mẫu
   - Nhấp nút "Cập nhật" để hoàn tất
     ![Edit Program](./images//edit-program.png)

4. **Xóa chương trình học**

   - Vào mục "Cài đặt"
   - Chọn tab "Chương trình học"
   - Tìm chương trình học cần xóa trong danh sách
   - Nhấp vào biểu tượng thùng rác ở cột "Thao tác"
   - Xác nhận xóa khi hộp thoại hiện lên
     ![Delete Program](./images//delete-program.png)
     ![Delete Program 2](./images//delete-program-2.png)

#### Quản lý trạng thái sinh viên

1. **Xem danh sách trạng thái sinh viên**

   - Vào mục "Cài đặt"
   - Chọn tab "Tình trạng sinh viên"
   - Danh sách trạng thái sinh viên sẽ hiển thị trong bảng
     ![Status](./images//status.png)

2. **Thêm trạng thái sinh viên mới**

   - Vào mục "Cài đặt"
   - Chọn tab "Tình trạng sinh viên"
   - Nhấp vào nút "Thêm tình trạng sinh viên mới" phía trên bảng
   - Điền đầy đủ thông tin sinh viên vào biểu mẫu
   - Nhấp nút "Lưu" để hoàn tất
     ![Add Status](./images//add-status.png)

3. **Chỉnh sửa trạng thái sinh viên**

   - Vào mục "Cài đặt"
   - Chọn tab "Tình trạng sinh viên"
   - Tìm tình trạng sinh viên cần chỉnh sửa trong danh sách
   - Nhấp vào biểu tượng bút chì ở cột "Thao tác"
   - Thay đổi thông tin cần thiết trong biểu mẫu
   - Nhấp nút "Cập nhật" để hoàn tất
     ![Edit Status](./images//edit-status.png)

4. **Xóa trạng thái sinh viên**

   - Vào mục "Cài đặt"
   - Chọn tab "Tình trạng sinh viên"
   - Tìm tình trạng sinh viên cần xóa trong danh sách
   - Nhấp vào biểu tượng thùng rác ở cột "Thao tác"
   - Xác nhận xóa khi hộp thoại hiện lên
     ![Delete Status](./images//delete-status.png)

#### Import và export dữ liệu

- Cho phép import/ export dữ liệu danh sách sinh viên dễ dàng, nhanh chóng
- Hỗ trợ JSON và XLSX

##### File mẫu cho import/export dữ liệu

- **File JSON mẫu**:  
   Định dạng JSON cho import/export dữ liệu sinh viên.  
   [Tải file JSON mẫu](./export-import/test.json)

- **File XLSX mẫu**:  
   Định dạng Excel (XLSX) cho import/export dữ liệu sinh viên.  
   [Tải file XLSX mẫu](./export-import/test.xlsx)

#### Cơ chế logging để kiểm tra hoạt động của server trên local và production

- Cho phép hiển thị các hoạt động diễn ra trong server thông qua console
- Cho phép lưu trữ các hoạt động diễn ra trong server vào file log
- Cơ chế dọn dẹp file log bằng giới hạn số ngày log lưu trữ
  ![ERROR-Log](./images//error-log.png)
  ![HTTP-Log](./images//http-log.png)

#### Cơ chế thống kê

- Cho phép hiển thị thống kê của sinh viên phân bố theo trạng thái
- Cho phép hiển thị thống kê của sinh viên phân bố theo khoa
- Cho phéo hiển thị thống kê của sinh viên đang theo học, tốt nghiệp, tỷ lệ tốt nghiệp và tổng số sinh viên
  ![Dashboard](./images//dashboard.png)
  ![Statistic](./images//statistic.png)

### Xử lý sự cố

1. **Lỗi khi cài đặt dependencies**

   - Xóa thư mục node_modules và file pnpm-lock.yaml:
     ```
     rm -rf node_modules
     rm pnpm-lock.yaml
     ```
   - Chạy lại lệnh cài đặt:
     ```
     pnpm install
     ```

2. **Lỗi "Port already in use" (Cổng đã được sử dụng)**

   - Kết thúc tiến trình đang sử dụng cổng đó:
     - Windows:
       ```
       netstat -ano | findstr :3000
       taskkill /PID <PID> /F
       ```
     - macOS/Linux:
       ```
       lsof -i :3000
       kill -9 <PID>
       ```
   - Hoặc thay đổi cổng trong file cấu hình

3. **Ứng dụng không phản hồi**

   - Làm mới trang web (F5)
   - Kiểm tra xem cả hai server (API và Web) đều đang chạy
   - Khởi động lại ứng dụng:
     ```
     pnpm start --reset-cache
     ```

4. **Lỗi TypeScript**
   - Kiểm tra các lỗi TypeScript:
     ```
     pnpm type-check
     ```
   - Sửa các lỗi được báo cáo trong mã nguồn

### Cách phát triển và đóng góp vào dự án

#### Cấu trúc monorepo

Dự án sử dụng kiến trúc monorepo với Turborepo, cho phép quản lý nhiều package và ứng dụng trong một repository:

- **apps/web**: Ứng dụng frontend (Next.js)
- **apps/api**: API server (NestJS)
- **packages/ui**: Thư viện UI components dùng chung
- **packages/database**: Module xử lý kết nối và truy vấn database

#### Quy trình phát triển

1. **Tạo nhánh mới**:

   ```
   git checkout -b feature/ten-tinh-nang
   ```

2. **Chạy trong chế độ phát triển**:

   ```
   pnpm dev
   ```

3. **Kiểm tra code**:

   ```
   pnpm lint
   pnpm test
   ```

4. **Tạo pull request** khi hoàn thành tính năng

### Câu hỏi thường gặp (FAQ)

**Q: Làm cách nào để thay đổi cổng mặc định của ứng dụng?**
A: Chỉnh sửa biến môi trường trong file `.env` tại thư mục gốc hoặc trong thư mục của ứng dụng tương ứng.

**Q: Tôi có thể sử dụng npm thay vì pnpm được không?**
A: Không khuyến khích vì dự án được cấu hình tối ưu cho pnpm và Turborepo. Sử dụng npm có thể gây ra các vấn đề về tương thích.

**Q: Làm thế nào để thêm một package mới vào monorepo?**
A: Sử dụng lệnh sau để tạo package mới:

```
pnpm turbo gen
```

Sau đó làm theo các hướng dẫn trên màn hình.

**Q: Làm thế nào để cài đặt thư viện mới cho một ứng dụng cụ thể?**
A: Sử dụng lệnh:

```
pnpm --filter <app-name> add <package-name>
```

Ví dụ: `pnpm --filter web add react-router-dom`
