# CLAUDE.md

## Mục tiêu dự án
- Frontend: Next.js, ưu tiên App Router, TypeScript, component hóa rõ ràng.
- Backend: Laravel API, frontend chỉ tiêu thụ API qua contract rõ ràng.
- Không được phá vỡ cấu trúc thông tin, luồng màn hình, responsive behavior, hoặc semantic của UI đã chốt theo layout tham chiếu.
- Mọi thay đổi phải ưu tiên: ổn định > dễ đọc > dễ mở rộng > đẹp.

## Nguồn sự thật
1. UI/UX flow và information architecture lấy từ file layout tham chiếu.
2. API contract lấy từ backend Laravel hoặc tài liệu API hiện hành.
3. Nếu UI mock khác với API thật, phải tạo adapter layer ở frontend. Không được sửa UI bừa, không được bẻ API response trong component.

## Luật bất di bất dịch
1. Không tự ý đổi kiến trúc thư mục đã chốt.
2. Không nhét toàn bộ logic vào 1 page/component lớn.
3. Không gọi API trực tiếp lung tung trong UI leaf components.
4. Không hardcode dữ liệu production vào UI.
5. Không đổi tên props, hooks, service, DTO, route segment nếu chưa grep toàn repo.
6. Không làm custom pattern khi Next.js/Laravel đã có pattern chuẩn.
7. Không refactor lớn nếu chưa chỉ ra phạm vi ảnh hưởng.
8. Không sửa để “trông xịn hơn” nhưng làm lệch layout business đã duyệt.
9. Không tạo duplicate state giữa URL params, local state, global state nếu không có lý do rõ ràng.
10. Không merge UI state, API state và persisted state thành một cục hỗn loạn.

## Quy tắc triển khai frontend
- Dùng App Router.
- Tách rõ:
  - `app/` cho route
  - `components/` cho UI
  - `features/` cho business modules
  - `lib/` cho helper, api client, constants
  - `types/` cho types dùng chung
- Ưu tiên server component; chỉ dùng `use client` khi thật sự cần cho tương tác.
- Mọi state phức tạp phải ở feature-level hooks hoặc state modules, không vứt rải rác.
- Modal, drawer, tab, chat, history panel phải tách component.
- Design tokens đi qua theme/tokens/constants; không lặp lại magic numbers quá nhiều.
- Responsive phải theo breakpoint rõ ràng, không vá linh tinh từng chỗ.

## Quy tắc triển khai backend integration
- Mọi request đi qua `lib/api` hoặc `features/*/services`.
- Phải có request/response types.
- Mapping từ API -> UI model đặt trong adapter/mapper.
- Có xử lý loading, empty, error, retry.
- Không parse response inline trong JSX.
- Không giữ business rules quan trọng chỉ ở frontend nếu backend mới là source of truth.

## Quy tắc refactor
Trước khi sửa file, luôn trả lời ngầm 4 câu:
1. File này thuộc layer nào?
2. Sửa xong ảnh hưởng component/page nào?
3. Có đụng API contract không?
4. Có làm lệch layout tham chiếu không?

Nếu refactor:
- Ưu tiên refactor nhỏ, từng bước.
- Mỗi bước phải chạy được.
- Không đổi cả structure + naming + state flow cùng lúc.

## Definition of Done
Chỉ được xem là xong khi đủ hết:
- Build pass
- Lint pass
- Typecheck pass
- Không vỡ responsive mobile/tablet/desktop
- Không vỡ flow chính
- Không có hardcode mock lẫn vào production path
- Component mới đúng role, đúng layer
- Có note ngắn nêu file nào đã sửa, vì sao sửa, rủi ro còn lại

## Cách làm việc mặc định
Khi nhận task:
1. Xác định layer: route / feature / component / api / state.
2. Đọc file liên quan trước khi viết.
3. Giữ nguyên behavior cũ trừ khi task yêu cầu thay đổi behavior.
4. Nếu cần thêm file mới, đặt đúng module thay vì nhét vào shared lung tung.
5. Output phải theo kiểu codebase-ready, không demo-style.

## Khi đụng vào UI từ layout tham chiếu
- Giữ nguyên tinh thần sản phẩm, cấu trúc khối, thứ bậc thông tin, trạng thái màn hình.
- Có thể tối ưu để fit Next.js production, nhưng không được biến nó thành UI khác.
- Nếu tách component, phải giữ parity với layout gốc trước rồi mới tối ưu tiếp.

## Agent routing
- Kiến trúc route + module lớn: dùng `frontend-architect`
- Dựng page/component theo layout: dùng `ui-implementer`
- Kiểm soát App Router/boundary/state: dùng `nextjs-guard`
- Kiểm soát API contract với Laravel: dùng `laravel-api-contract-guard`
- Nối flow FE-BE: dùng `integration-engineer`
- Review cuối, bắt lỗi phá cấu trúc: dùng `qa-reviewer`

## Skills bắt buộc
- `nextjs-app-router`
- `ui-from-layout`
- `api-integration`
- `state-and-chat-flow`
- `refactor-without-breaking`
