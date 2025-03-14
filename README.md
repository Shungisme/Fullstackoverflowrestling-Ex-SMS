# Student Management System

## Giới thiệu

Hệ thống Quản lý Học Sinh là phần mềm giúp quản lý thông tin học sinh, điểm số, lớp học, và các hoạt động học tập một cách hiệu quả. Dự án được phát triển với TypeScript và quản lý theo kiến trúc monorepo sử dụng Turborepo.

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
│       │    │    ├── students/ # Module quản lý học sinh
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

### Cài đặt ứng dụng Quản lý Học Sinh

1. **Tải ứng dụng**

   - **Nếu bạn sử dụng Git**:
     - Mở Command Prompt hoặc Terminal
     - Điều hướng đến thư mục bạn muốn lưu ứng dụng:
       ```
       cd đường-dẫn-đến-thư-mục
       ```
     - Clone repository:
       ```
       git clone https://github.com/your-username/student-management.git
       ```
     - Di chuyển vào thư mục dự án:
       ```
       cd student-management
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

#### Bước 1: Biên dịch dự án

1. Mở Command Prompt hoặc Terminal trong thư mục gốc của dự án
2. Chạy lệnh:
   ```
   pnpm build
   ```
3. Đợi cho quá trình biên dịch hoàn tất. Bạn sẽ thấy thông báo thành công.

#### Bước 2: Chạy ứng dụng

1. Sau khi biên dịch thành công, chạy lệnh:
   ```
   pnpm start
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

#### Quản lý học sinh

1. **Xem danh sách học sinh**

   - Nhấp vào mục "Học sinh" trên thanh điều hướng
   - Danh sách học sinh sẽ hiển thị trong bảng

2. **Thêm học sinh mới**

   - Nhấp vào nút "Thêm học sinh mới" phía trên bảng
   - Điền đầy đủ thông tin học sinh vào biểu mẫu (các trường có dấu \* là bắt buộc)
   - Nhấp nút "Lưu" để hoàn tất

3. **Chỉnh sửa thông tin học sinh**

   - Tìm học sinh cần chỉnh sửa trong danh sách
   - Nhấp vào biểu tượng bút chì ở cột "Thao tác"
   - Thay đổi thông tin cần thiết trong biểu mẫu
   - Nhấp nút "Cập nhật" để hoàn tất

4. **Xóa học sinh**
   - Tìm học sinh cần xóa trong danh sách
   - Nhấp vào biểu tượng thùng rác ở cột "Thao tác"
   - Xác nhận xóa khi hộp thoại hiện lên

#### Quản lý lớp học

1. **Xem danh sách lớp**

   - Nhấp vào mục "Lớp học" trên thanh điều hướng
   - Danh sách lớp học sẽ hiển thị trong bảng

2. **Tạo lớp mới**

   - Nhấp vào nút "Tạo lớp mới"
   - Điền thông tin lớp học vào biểu mẫu
   - Nhấp nút "Lưu" để hoàn tất

3. **Thêm học sinh vào lớp**
   - Nhấp vào tên lớp học trong danh sách để xem chi tiết
   - Nhấp vào tab "Học sinh" trong trang chi tiết lớp học
   - Nhấp vào nút "Thêm học sinh"
   - Tìm và chọn học sinh từ danh sách được hiển thị
   - Nhấp "Thêm" để hoàn tất

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
