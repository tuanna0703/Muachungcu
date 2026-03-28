# Skill: state-and-chat-flow

## Mục đích
Dùng cho các màn có chat, wizard, multi-panel, modal, history, persistence local.

## Quy tắc state
Tách rõ 5 loại state:
1. UI state: mở modal, tab nào đang active
2. Input state: text input, draft form
3. Async state: loading, success, error
4. Domain state: messages, profile/intelligence data, session data
5. Persisted state: localStorage/sessionStorage/cache

## Không được làm
- Trộn tất cả vào 1 `useState` object khổng lồ nếu feature đã phức tạp.
- Ghi localStorage trực tiếp khắp nơi; phải có wrapper/helper.
- Để component con tự cập nhật nhiều state của cha một cách lộn xộn.

## Với chat-like flow
- Message list là domain state
- Request pipeline là async state riêng
- Share/history/auth là UI state riêng
- Session persistence là persisted state riêng

## Kết quả mong muốn
- Flow dễ debug
- Ít race condition
- Refresh không làm vỡ trải nghiệm quá nhiều
