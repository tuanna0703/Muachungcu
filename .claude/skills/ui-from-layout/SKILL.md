# Skill: ui-from-layout

## Mục đích
Convert layout tham chiếu thành UI production-ready mà không phá business layout.

## Đầu vào cần đọc
- File layout tham chiếu
- Các design tokens / theme hiện có trong repo
- Component conventions hiện có

## Phương pháp
1. Xác định khối lớn: shell, header, main panes, footer, nav.
2. Xác định component trung bình: card, list item, modal, panel, toolbar, tabs.
3. Xác định component nhỏ: button, badge, input, avatar, empty state.
4. Tách interaction state khỏi purely presentational parts.

## Ưu tiên bảo toàn
- Information architecture
- Visual hierarchy
- Responsive behavior
- Scroll regions
- Stateful flows: loading / empty / error / success

## Không được làm
- Tự ý đổi bố cục business
- Xóa bớt trạng thái chỉ vì chưa kịp code
- Nhồi hết vào 1 component để “cho nhanh”
