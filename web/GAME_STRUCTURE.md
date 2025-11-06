# Cấu Trúc Game - START-UP: Lối Thoát Mê Cung

## Luồng Game Chính

### **Cấp 1: Nguồn Vốn**
- **File**: `level1.html`, `js/level1.js`
- **Lựa chọn**:
  - 💰 Tự Có Vốn: Tốt nhất (+tài nguyên)
  - 🏦 Vay Ngân Hàng: **GAME OVER (Bẫy)**
  - 📞 Gọi Vốn: Rủi ro 60% thua
  - 🤝 Liên Doanh: Rủi ro 50% thua
- **Chuyển đến**: Level 1.5 (khi progress >= 30)

### **Cấp 1.5: Chiến Lược Sản Phẩm**
- **File**: `level1-5.html`, `js/level1-5.js`
- **Lựa chọn**:
  - ⚡ Ra Mắt Nhanh: technicalDebt = true
  - ✨ Hoàn Thiện: Tốn vốn, tăng cảnh giác
- **Chuyển đến**: Level 2

### **Cấp 2: Chiến Lược Bán Hàng**
- **File**: `level2.html`, `js/level2.js`
- **Lựa chọn**:
  - 💰 Giảm Giá: **GAME OVER (Bẫy)**
  - 🎯 Thị Trường Ngách: An toàn
  - 📢 Quảng Cáo: Rủi ro cao
  - ⭐ Chất Lượng: Tốt, bỏ qua Cấp 2.5
- **Chuyển đến**: 
  - Nếu technicalDebt = true → Event Technical Debt
  - Nếu skipLevel25 → Level 3
  - Ngược lại → Level 2.5

### **Sự Kiện: Nợ Kỹ Thuật** (Trigger: technicalDebt = true)
- **File**: `event-technical-debt.html`, `js/event-technical-debt.js`
- **Lựa chọn**:
  - ✅ Thú Nhận: Tốn vốn, giảm tiến độ, tăng Morale
  - 🤐 Im Lặng (Hắc Ám): Rủi ro 50% bị lộ → Game Over

### **Cấp 2.5: Cuộc Chiến Nhân Tài**
- **File**: `level2-5.html`, `js/level2-5.js`
- **Lựa chọn**:
  - 🚫 Bị Săn Trộm: **GAME OVER (Bẫy)**
  - ❤️ Văn Hóa & ESOP: Tốt nhất
  - 📋 Cấm Cạnh Tranh: Giảm mạnh Morale
- **Chuyển đến**: 
  - Nếu morale < 50% → Event Xung Đột Nội Bộ
  - Ngược lại → Level 3

### **Sự Kiện: Xung Đột Nội Bộ** (Trigger: morale < 50%)
- **File**: `event-internal-conflict.html`, `js/event-internal-conflict.js`
- **Lựa chọn**:
  - 🤝 Dung Hòa: Tốn vốn, tăng Morale
  - ⚡ Áp Đặt (Hắc Ám): darkChoices +1

### **Cấp 3: Nguồn Cung Ứng**
- **File**: `level3.html`, `js/level3.js`
- **Lưu ý**: Nếu awareness >= 50%, lựa chọn Thương lượng → GĐQ tấn công
- **Chuyển đến**: Level 3.2 (nếu progress > 50%)

### **Cấp 3.2: Khủng Hoảng Mở Rộng** (Trigger: progress > 50%)
- **File**: `level3-2.html`, `js/level3-2.js`
- **Lựa chọn**:
  - 🔧 Nâng Cấp: Tốn vốn, giảm tiến độ
  - 💼 Thuê GĐQ (Bẫy): awareness = 100% → Game Over ở Cấp 4
- **Chuyển đến**: Level 3.5

### **Cấp 3.5: Lời Đề Nghị Mua Lại**
- **File**: `level3-5.html`, `js/level3-5.js`
- **Lựa chọn**:
  - 💰 Bán Đứt/Sáp Nhập: **GAME OVER (Bẫy)**
  - ❌ Từ Chối: Tiếp tục
- **Chuyển đến**: 
  - Nếu darkChoices >= 2 → Cấp 3.6 & 3.7
  - Ngược lại → Level 4

### **Cấp 3.6 & 3.7: Cuộc Chiến Pháp Lý & PR**
- **File**: `level3-6-7.html`, `js/level3-6-7.js`
- **Nội dung**: GĐQ kiện bạn và bôi nhọ truyền thông
- **Chuyển đến**: Level 4 (Boss Battle)

### **Cấp 4: End Game**

#### **Ngã Rẽ A: darkChoices < 2 (Người chơi "Tốt")**
- **File**: `level4-government.html`, `js/level4-government.js`
- **Nội dung**: Văn Phòng Chính Phủ
- **Lựa chọn**: Gửi hồ sơ, Liên kết, Báo chí (50/50), Quốc tế

#### **Ngã Rẽ B: darkChoices >= 2 (Kẻ Kế Vị)**
- **File**: `level4-boss.html`, `js/level4-boss.js`
- **Nội dung**: CUỘC CHIẾN KẾ VỊ (Boss Battle)
- **3 vòng đấu**: Nguồn cung, Nhân tài, Tài chính
- **Yêu cầu**: Ít nhất 2 lựa chọn Hắc Ám để thắng
- **Kết thúc**: KẾT THÚC BÍ MẬT: KẺ KẾ VỊ

## Hệ Thống Chỉ Số

### 4 Chỉ Số Chính:
- 💰 **Runway (Vốn)**: Bắt đầu 24 tháng, tự giảm -2/cấp
- 🔥 **Morale (Năng lượng)**: Bắt đầu 100%
- 📈 **Progress (Tiến độ)**: Bắt đầu 0%, cần 100% để thắng
- 👁️ **Awareness (Cảnh giác)**: Bắt đầu 0%

### Chỉ Số Đặc Biệt:
- **SurvivalPoints**: Bắt đầu 100
- **DarkChoices**: Bắt đầu 0 (quyết định ngã rẽ cuối)
- **TechnicalDebt**: false (kích hoạt ở Cấp 1.5 nếu chọn Ra mắt nhanh)

## Điều Kiện Thắng/Thua

### Thắng:
- Progress >= 100% AND Runway > 0 AND Morale > 0

### Thua:
- Runway <= 0 OR Morale <= 0 OR SurvivalPoints <= 0
- Chọn các "Bẫy Chết Người"

## Các Bẫy Chết Người:
1. Vay Ngân Hàng (Cấp 1)
2. Giảm Giá (Cấp 2)
3. Bị Săn Trộm (Cấp 2.5)
4. Bán Đứt/Sáp Nhập (Cấp 3.5)







