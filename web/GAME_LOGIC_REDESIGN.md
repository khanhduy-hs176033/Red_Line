# THIẾT KẾ LẠI LOGIC GAME - START-UP: Lối Thoát Mê Cung

## ĐIỂM XUẤT PHÁT
- **Vốn (Runway)**: 24 tháng
- **Năng lượng (Morale)**: 100%
- **Tiến độ (Progress)**: 0%
- **Cảnh giác (Awareness)**: 0%
- **Điểm Tồn Tại (Survival Points)**: 100

---

## NGUYÊN TẮC THIẾT KẾ

### 1. Cân Bằng Tài Nguyên
- Mỗi lựa chọn phải có trade-off rõ ràng
- Không có lựa chọn "miễn phí" hoàn toàn
- Đảm bảo có ít nhất 1 đường đi khả thi đến cuối game

### 2. Burn Rate (Vốn Tự Động Giảm)
- **Level 1**: -1 tháng/lượt
- **Level 2**: -2 tháng/lượt  
- **Level 3**: -3 tháng/lượt
- **Level 4**: -3 tháng/lượt

### 3. Doanh Thu Tự Động (Progress Milestones)
- **25% Progress**: +4 Vốn
- **50% Progress**: +6 Vốn
- **75% Progress**: +8 Vốn

### 4. Cơ Chế Morale
- **Hưng phấn (>= 100%)**: Progress tăng thêm 10%
- **Rệu rã (< 50%)**: Progress giảm 20%
- **Vốn < 6 tháng**: Tự động -5% Morale mỗi lượt có thay đổi Vốn

---

## LEVEL 1: NGÃ RẼ VỐN

### Mục tiêu: Đạt 15-20% Progress, giữ Vốn > 15 tháng

#### 1. 💰 Tự Có Vốn (AN TOÀN)
- **Vốn**: +4 tháng (24 → 28, sau burn -1 = 27)
- **Năng lượng**: +5% (100 → 105%)
- **Tiến độ**: +8% (0 → 8%)
- **Cảnh giác**: 0%
- **Đánh giá**: Lựa chọn an toàn, ổn định

#### 2. 🏦 Vay Ngân Hàng (RỦI RO CAO)
- **Rủi ro**: 50% thua (giảm từ 60%)
- **Nếu thành công**:
  - **Vốn**: +8 tháng (24 → 32, sau burn -1 = 31)
  - **Năng lượng**: -10% (100 → 90%)
  - **Tiến độ**: +8% (0 → 8%)
  - **Cảnh giác**: +5%
- **Nếu thất bại**: GAME OVER
- **Đánh giá**: Rủi ro cao nhưng phần thưởng tốt

#### 3. 📞 Gọi Vốn Nhà Đầu Tư (CÂN BẰNG)
- **Vốn**: +5 tháng (24 → 29, sau burn -1 = 28)
- **Năng lượng**: -5% (100 → 95%)
- **Tiến độ**: +10% (0 → 10%)
- **Cảnh giác**: +5%
- **Sự kiện phụ**: Đàm Phán Với Nhà Đầu Tư
  - ✅ Chấp Nhận 60% Cổ Phần:
    - **Vốn**: +8 tháng
    - **Năng lượng**: -15%
    - **Tiến độ**: +12%
    - **Cảnh giác**: +5%
    - **Kết quả**: Vốn 36, Năng lượng 80%, Tiến độ 22%, Cảnh giác 10%
  - ❌ Từ Chối (Rủi ro 40%):
    - **Thành công**: Vốn +4, Năng lượng -3%, Tiến độ +8%, Cảnh giác +3%
    - **Thất bại**: GAME OVER
- **Đánh giá**: Cân bằng giữa rủi ro và phần thưởng

#### 4. 🤝 Liên Doanh (RỦI RO TRUNG BÌNH)
- **Vốn**: +6 tháng (24 → 30, sau burn -1 = 29)
- **Năng lượng**: -8% (100 → 92%)
- **Tiến độ**: +12% (0 → 12%)
- **Cảnh giác**: +8%
- **Sự kiện phụ**: Quyết Định Liên Doanh
  - 🤝 Tiếp Tục (Rủi ro 35%):
    - **Thành công**: Vốn +5, Năng lượng -5%, Tiến độ +10%, Cảnh giác +5%
    - **Thất bại**: GAME OVER
  - 🚪 Rút Lui (Rủi ro 40%):
    - **Thành công**: Vốn +2, Năng lượng -3%, Tiến độ +6%, Cảnh giác +2%
    - **Thất bại**: GAME OVER
- **Đánh giá**: Tiến độ cao nhưng rủi ro

---

## LEVEL 1.5: CHIẾN LƯỢC SẢN PHẨM

### Mục tiêu: Đạt 25-30% Progress, quyết định Technical Debt

#### 1. ⚡ Ra Mắt Nhanh (NGẮN HẠN)
- **Vốn**: -1 tháng (sau burn -1 = -2 tổng)
- **Năng lượng**: -8% (giảm từ -10%)
- **Tiến độ**: +12% (tăng từ +10%)
- **Cảnh giác**: +8% (giảm từ +10%)
- **Technical Debt**: Kích hoạt
- **Survival Points**: -8 (giảm từ -10)
- **Đánh giá**: Nhanh nhưng có hậu quả

#### 2. ✨ Hoàn Thiện Sản Phẩm (DÀI HẠN)
- **Vốn**: -3 tháng (giảm từ -4, sau burn -1 = -4 tổng)
- **Năng lượng**: +12% (giảm từ +15%)
- **Tiến độ**: +8% (tăng từ +5%)
- **Cảnh giác**: +25% (giữ nguyên)
- **Survival Points**: +12 (giảm từ +15)
- **Đánh giá**: Đầu tư dài hạn, ổn định

---

## EVENT: NỢ KỸ THUẬT (Trigger: technicalDebt = true)

### Mục tiêu: Giải quyết Technical Debt hoặc chấp nhận rủi ro

#### 1. ✅ Thú Nhận & Sửa Chữa (ĐẠO ĐỨC)
- **Vốn**: -5 tháng (giảm từ -6, sau burn -2 = -7 tổng)
- **Năng lượng**: +12% (giảm từ +15%)
- **Tiến độ**: -8% (giảm từ -10%)
- **Technical Debt**: Giải quyết (false)
- **Survival Points**: +18 (giảm từ +20)
- **Đánh giá**: Tốn kém nhưng đạo đức

#### 2. 🤐 Xử Lý Nội Bộ (HẮC ÁM)
- **Vốn**: -1 tháng (giảm từ -2, sau burn -2 = -3 tổng)
- **Năng lượng**: -25% (tự động từ darkChoices)
- **Dark Choices**: +1
- **Survival Points**: -18 (giảm từ -20)
- **Rủi ro**: 25% (tăng từ 20%)
- **Đánh giá**: Rẻ nhưng rủi ro cao

---

## LEVEL 2: CHIẾN LƯỢC BÁN HÀNG

### Mục tiêu: Đạt 45-55% Progress, quyết định chiến lược thị trường

#### 1. 🎯 Thị Trường Ngách (AN TOÀN)
- **Vốn**: -1 tháng (giảm từ -2, sau burn -2 = -3 tổng)
- **Năng lượng**: +8% (tăng từ +5%)
- **Tiến độ**: +18% (giảm từ +20%)
- **Cảnh giác**: +8% (giảm từ +10%)
- **Survival Points**: +12 (giảm từ +15)
- **Niche**: true
- **Đánh giá**: An toàn, ổn định

#### 2. 📢 Quảng Cáo (RỦI RO)
- **Vốn**: -5 tháng (giảm từ -6, sau burn -2 = -7 tổng)
- **Năng lượng**: -8% (giảm từ -10%)
- **Tiến độ**: +22% (giảm từ +25%)
- **Cảnh giác**: +35% (giảm từ +40%)
- **Survival Points**: -3 (giảm từ -5)
- **Rủi ro**: 25% (tăng từ 20%)
- **Đánh giá**: Tiến độ cao nhưng Awareness tăng mạnh

#### 3. ⭐ Chất Lượng (CÂN BẰNG)
- **Vốn**: -3 tháng (giảm từ -4, sau burn -2 = -5 tổng)
- **Năng lượng**: +8% (tăng từ +5%)
- **Tiến độ**: +15% (giữ nguyên)
- **Cảnh giác**: +20% (giảm từ +25%)
- **Survival Points**: +10 (giữ nguyên)
- **Quality**: true
- **Đặc biệt**: Bỏ qua Level 2.5
- **Đánh giá**: Cân bằng, bỏ qua một level

---

## LEVEL 2.5: CUỘC CHIẾN NHÂN TÀI

### Mục tiêu: Giữ chân nhân tài, duy trì Morale > 50%

#### 1. ❤️ Văn Hóa & ESOP (TỐT NHẤT)
- **Vốn**: -3 tháng (giảm từ -4, sau burn -2 = -5 tổng)
- **Năng lượng**: +20% (giảm từ +25%)
- **Tiến độ**: +18% (giảm từ +20%)
- **Cảnh giác**: +3% (giảm từ +5%)
- **Đánh giá**: Tốt nhất, tăng Morale mạnh

#### 2. 📋 Cấm Cạnh Tranh (TRUNG BÌNH)
- **Vốn**: -1 tháng (giảm từ -2, sau burn -2 = -3 tổng)
- **Năng lượng**: -15% (giảm từ -20%)
- **Tiến độ**: +5% (giữ nguyên)
- **Cảnh giác**: 0%
- **Đánh giá**: Rẻ nhưng giảm Morale

#### 3. ⚖️ Ràng Buộc Pháp Lý (HẮC ÁM)
- **Vốn**: 0 (tăng từ -1, sau burn -2 = -2 tổng)
- **Năng lượng**: -25% (tự động từ darkChoices)
- **Tiến độ**: +5% (giữ nguyên)
- **Dark Choices**: +1
- **Survival Points**: -18 (giảm từ -20)
- **Đánh giá**: Rẻ nhất nhưng Hắc Ám

**Điều kiện**: Nếu Morale < 50% → Event Xung Đột Nội Bộ

---

## EVENT: XUNG ĐỘT NỘI BỘ (Trigger: morale < 50%)

### Mục tiêu: Giải quyết xung đột, phục hồi Morale

#### 1. 🤝 Dung Hòa (ĐẠO ĐỨC)
- **Vốn**: -1 tháng (giảm từ -2, sau burn -2 = -3 tổng)
- **Năng lượng**: +18% (giảm từ +20%)
- **Tiến độ**: -3% (giảm từ -5%)
- **Đánh giá**: Tốn ít, phục hồi Morale tốt

#### 2. ⚡ Quyết Định Nhanh (HẮC ÁM)
- **Vốn**: 0 (giữ nguyên, sau burn -2 = -2 tổng)
- **Năng lượng**: -35% (giảm từ -40%, sau darkChoices -25% = -60% tổng)
- **Dark Choices**: +1
- **Survival Points**: -18 (giảm từ -20)
- **Đánh giá**: Rẻ nhưng giảm Morale mạnh

---

## LEVEL 3: NGUỒN CUNG ỨNG

### Mục tiêu: Đạt 70-80% Progress, tránh Awareness quá cao

#### 1. 🏭 Tự Sản Xuất (TỐN KÉM)
- **Vốn**: -4 tháng (giảm từ -5, sau burn -3 = -7 tổng)
- **Năng lượng**: -8% (giảm từ -10%)
- **Tiến độ**: +22% (giảm từ +25%)
- **Survival Points**: -3 (giảm từ -5)
- **Đánh giá**: Tốn kém nhưng tiến độ cao

#### 2. 🌍 Nhập Khẩu (CÂN BẰNG)
- **Vốn**: -2 tháng (giảm từ -3, sau burn -3 = -5 tổng)
- **Năng lượng**: +5% (giữ nguyên)
- **Tiến độ**: +10% (giữ nguyên)
- **Survival Points**: +5 (giữ nguyên)
- **Rủi ro**: 25% (giảm từ 30%)
- **Đánh giá**: Cân bằng, rủi ro thấp

#### 3. 🤝 Thương Lượng (THÔNG MINH)
- **Nếu Awareness < 30%**:
  - **Vốn**: 0 (tăng từ -1, sau burn -3 = -3 tổng)
  - **Năng lượng**: +5% (giữ nguyên)
  - **Tiến độ**: +10% (tăng từ +8%)
  - **Survival Points**: +5 (giữ nguyên)
- **Nếu Awareness >= 30%**: GĐQ phát hiện → Sub-choices:
  - ⚖️ Kiện: Vốn -1, Năng lượng +10%, Tiến độ +15%, Survival Points +20
  - 🏳️ Bỏ Cuộc: GAME OVER
  - 💣 Thâu Tóm (Hắc Ám): Vốn -3, Năng lượng -25%, Tiến độ +12%, Dark Choices +1, Survival Points -18
- **Đánh giá**: Tốt nếu Awareness thấp

#### 4. 💣 Thâu Tóm Nhà Cung Cấp (HẮC ÁM) - Chỉ khi Awareness >= 30%
- **Vốn**: -3 tháng (giảm từ -4, sau burn -3 = -6 tổng)
- **Năng lượng**: -25% (tự động từ darkChoices)
- **Tiến độ**: +12% (giữ nguyên)
- **Dark Choices**: +1
- **Survival Points**: -18 (giảm từ -20)
- **Đánh giá**: Hắc Ám nhưng hiệu quả

**Điều kiện**: Nếu Progress > 50% → Level 3.2

---

## LEVEL 3.2: KHỦNG HOẢNG MỞ RỘNG

### Mục tiêu: Xử lý khủng hoảng, tránh Awareness = 100%

#### 1. 🔧 Nâng Cấp Hệ Thống (AN TOÀN)
- **Vốn**: -5 tháng (giảm từ -6, sau burn -3 = -8 tổng)
- **Năng lượng**: -3% (giảm từ -5%)
- **Tiến độ**: -8% (giảm từ -10%)
- **Đánh giá**: Tốn kém nhưng an toàn

#### 2. 💼 Thuê Dịch Vụ Cloud (BẪY)
- **Vốn**: -1 tháng (giảm từ -2, sau burn -3 = -4 tổng)
- **Năng lượng**: +10% (giữ nguyên)
- **Tiến độ**: +15% (giữ nguyên)
- **Cảnh giác**: +100% → GAME OVER ở Level 4
- **Đánh giá**: BẪY - Awareness = 100%

#### 3. ⏸️ Tạm Dừng Mở Rộng (CÂN BẰNG)
- **Vốn**: -2 tháng (giảm từ -3, sau burn -3 = -5 tổng)
- **Năng lượng**: -8% (giảm từ -10%)
- **Tiến độ**: -3% (giảm từ -5%)
- **Đánh giá**: Cân bằng, ít rủi ro

---

## LEVEL 3.5: LỜI ĐỀ NGHỊ MUA LẠI

### Mục tiêu: Từ chối, quyết định đường đi cuối

#### ❌ Từ Chối Thẳng Thừng
- **Vốn**: -3 tháng (giảm từ -4, sau burn -3 = -6 tổng)
- **Năng lượng**: +10% (giữ nguyên)
- **Tiến độ**: +5% (giữ nguyên)
- **Survival Points**: +20 (giảm từ +25)
- **Điều kiện**: 
  - darkChoices >= 2 → Level 4 Boss Battle
  - darkChoices < 2 → Level 4 Government

---

## LEVEL 4: END GAME

### Government Path (darkChoices < 2)

#### 1. 📄 Gửi Hồ Sơ Cục Cạnh Tranh
- **Vốn**: -1 tháng (giảm từ -2)
- **Năng lượng**: +10% (giữ nguyên)
- **Tiến độ**: +100% (đặt trực tiếp)
- **Ending**: Official

#### 2. 🤝 Liên Kết Doanh Nghiệp Nhỏ
- **Vốn**: -2 tháng (giảm từ -3)
- **Năng lượng**: +15% (+10% nếu điều kiện đạt)
- **Tiến độ**: +40% (+20% nếu điều kiện đạt → 100%)
- **Cảnh giác**: +8% (giảm từ +10%)
- **Điều kiện thắng**: Runway > 3 và Morale > 30
- **Ending**: Alliance

#### 3. 📢 Kêu Gọi Báo Chí
- **Vốn**: -3 tháng (giảm từ -4)
- **Năng lượng**: -8% (+10% nếu thành công)
- **Tiến độ**: +30% (+40% nếu thành công → 100%)
- **Cảnh giác**: +25% (giảm từ +30%)
- **Rủi ro**: 50% (giữ nguyên)
- **Ending**: Media

### Boss Battle Path (darkChoices >= 2)
- Sử dụng Dominance thay vì Progress
- 3 hiệp đấu với sát thương vào Điểm Tồn Tại (Trận đấu)
- Điều kiện thắng: Dominance >= 80%

---

## TỔNG KẾT CÂN BẰNG

### Điểm Mạnh của Thiết Kế Mới:
1. **Giảm chi phí Vốn** ở hầu hết lựa chọn để game dễ chơi hơn
2. **Tăng phần thưởng Morale** ở các lựa chọn tốt
3. **Cân bằng Progress** để đảm bảo đạt được milestones
4. **Giảm Awareness** ở một số lựa chọn để tránh GAME OVER sớm
5. **Điều chỉnh Survival Points** để cân bằng hơn

### Đường Đi Khả Thi:
- **Path 1 (An toàn)**: Tự Có Vốn → Hoàn Thiện → Ngách → Văn Hóa & ESOP → Nhập Khẩu → Tạm Dừng → Từ Chối → Government
- **Path 2 (Cân bằng)**: Gọi Vốn → Hoàn Thiện → Chất Lượng → Nhập Khẩu → Nâng Cấp → Từ Chối → Government
- **Path 3 (Rủi ro)**: Liên Doanh → Ra Mắt Nhanh → Quảng Cáo → Văn Hóa & ESOP → Thương Lượng → Nâng Cấp → Từ Chối → Government/Boss




