# Skill: nextjs-app-router

## Mục đích
Dùng khi dựng hoặc refactor frontend Next.js để giữ đúng chuẩn App Router và tránh phá structure.

## Nguyên tắc
- Route nằm trong `app/`.
- Mỗi route chỉ giữ orchestration ở mức cần thiết.
- UI lớn tách sang `features/...` hoặc `components/...`.
- Server component mặc định; client component chỉ cho interactive UI.
- Browser APIs (`localStorage`, `window`, `navigator`) chỉ ở client boundary.

## Cấu trúc khuyến nghị
- `app/(marketing)/...` hoặc `app/(app)/...` nếu cần route groups
- `features/<feature-name>/components`
- `features/<feature-name>/hooks`
- `features/<feature-name>/services`
- `features/<feature-name>/types`
- `lib/api`
- `lib/utils`
- `types`

## Luật refactor
- Không chuyển mọi thứ thành client component cho dễ code.
- Không fetch data ở 3 nơi cho cùng một màn.
- Không đưa state route/search params và component state vào 2 nguồn riêng mà không sync strategy.

## Done khi
- Route rõ ràng
- Boundary rõ ràng
- Không có lỗi server/client mismatch obvious
