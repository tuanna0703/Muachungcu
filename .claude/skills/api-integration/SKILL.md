# Skill: api-integration

## Mục đích
Nối Next.js frontend với Laravel backend qua service layer sạch, typed, dễ thay đổi.

## Quy chuẩn
- Tạo `services` cho endpoint groups.
- Tạo `types` cho request/response.
- Tạo `mappers` nếu response không trùng UI model.
- Tạo error normalization.

## Pattern khuyến nghị
- `services/<feature>.service.ts`
- `types/<feature>.ts`
- `mappers/<feature>.mapper.ts`
- `hooks/use<Feature>.ts` nếu có interactive async flow

## Nguyên tắc vàng
- Component không parse raw response.
- Component không xây URL API bằng tay ở nhiều chỗ.
- Token/auth header không copy-paste khắp repo.
- Retry/loading/error phải thống nhất.
