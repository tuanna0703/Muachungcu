# Skill: refactor-without-breaking

## Mục đích
Refactor mà không phá layout, flow, API contract, responsive, hoặc state behavior.

## Quy trình 7 bước
1. Chụp lại boundary hiện tại của feature.
2. Xác định behavior phải giữ nguyên.
3. Tách 1 phần nhỏ trước: component / hook / service.
4. Giữ public interface cũ nếu có thể.
5. Chạy lại toàn luồng.
6. Soát mobile/tablet/desktop.
7. Ghi chú phần nào còn debt.

## Red flags
- Đổi tên hàng loạt mà không grep
- Đổi state shape ở nhiều tầng cùng lúc
- Gộp nhiều responsibility vào 1 hook/service
- Refactor xong nhưng behavior ngầm thay đổi

## Mục tiêu cuối
Người dùng không thấy app “biến thành app khác”, nhưng codebase sạch hơn và scale được hơn.
