# Kế hoạch: Tính năng tạo nhạc qua MusicFX

## Mục tiêu / phạm vi
- Cho phép người dùng nhập prompt và nhận 1-2 bản nhạc 30s từ MusicFX.
- Lưu và phát lại kết quả trong app (không lưu trữ server-side).
- Không mở rộng sang chỉnh sửa/trim audio (YAGNI).

## Luồng người dùng
1) Nhập prompt + tùy chọn (số bản nhạc 1-2, thời lượng cố định 30s, loop off).  
2) Nhấn Generate → hiển thị trạng thái “generating”.  
3) Nhận audio → cung cấp nút Play/Download, hiển thị meta (model, thời lượng).  
4) Ghi log sự kiện (tương tự `IM_FEELING_LUCKY`) để theo dõi sử dụng.

## Tích hợp API
- Endpoint chính: `POST https://aisandbox-pa.googleapis.com/v1:soundDemo` (payload như trong `docs/music-fx-api-calls.md`).  
- Preflight CORS tự động.  
- Header bắt buộc: `Authorization: Bearer {GOOGLE_COOKIE token}`, `Content-Type: text/plain;charset=UTF-8`, `Referer: https://labs.google/`.  
- Ghi log: `POST https://labs.google/fx/api/trpc/general.submitBatchLog` với event `IM_FEELING_LUCKY` (sử dụng sessionId chung của trang).

## Thiết kế ứng dụng (Next.js Pages)
- UI mỏng tại `src/pages/index.tsx` (hoặc `music.tsx` nếu tách route) → chuyển logic gọi API xuống hook/service.
- Domain/service: hàm thuần `callMusicFx(payload, auth)` trong `src/lib/core/MusicFx.ts` (module thường, không class).  
- Hook UI: `useMusicFxGenerate` trong `src/hooks/` để quản lý state (loading, result, error).  
- Storage: giữ kết quả trong state/optional localStorage (nếu cần lịch sử ngắn) — mặc định không lưu để giảm rủi ro quyền riêng tư.

## Kiến trúc dữ liệu
- Input type:
  ```ts
  type MusicFxRequest = {
    prompt: string;
    generationCount: 1 | 2;
    soundLengthSeconds: 30;
    loop: boolean; // mặc định false
    model: 'DEFAULT';
    sessionId: string;
  };
  ```
- Output (tối giản):
  ```ts
  type MusicFxClip = {
    url: string;       // blob/object URL sau khi giải mã
    mimeType: string;
    durationSec: number;
    model: string;
    receivedAt: string; // ISO
  };
  ```

## Bảo mật & cấu hình
- Không lưu `Authorization` vào log hay UI; lấy từ `CookieContext` (định dạng giống luồng Whisk).  
- Chặn gửi request nếu thiếu token; hiển thị hướng dẫn người dùng nhập cookie trong Settings hiện có.  
- Thời gian chờ: 60s; retry không tự động để tránh spam API rate-limit.

## UX tối thiểu
- Form: prompt (textarea), select 1-2 outputs.  
- Nút Generate disabled khi thiếu prompt hoặc đang chạy.  
- Trạng thái: spinner + progress text “Generating music…”.  
- Kết quả: danh sách clip với Play, Download, Copy prompt; hiển thị info model/duration.  
- Lỗi: banner ngắn, gợi ý kiểm tra cookie hoặc thử lại.

## Theo dõi / logging
- Gửi `general.submitBatchLog` sau khi gọi `soundDemo` (thành công hoặc thất bại).  
- Ghi console warn nhẹ nếu thiếu cookie; không log token.

## Rủi ro chính
- Token hết hạn → cần thông báo rõ, không tự refresh.  
- CORS/Referer thay đổi từ Google → cần flag để tắt tính năng nếu 4xx lặp lại.  
- Kích thước response (~17 MB gzip) → cần stream/Blob xử lý trong browser, tránh giữ nhiều bản song song.

## Tiến độ đề xuất (MVP trước, mở rộng sau)
1) Tạo service `MusicFx.ts` + hook `useMusicFxGenerate` (mock response đầu tiên).  
2) Gắn UI tối thiểu ở trang chính, wiring prompt → hook.  
3) Thử thật với cookie, xử lý Blob và playback.  
4) Thêm log tRPC, thông báo lỗi UX.  
5) (Tùy chọn) Lưu lịch sử cục bộ + trạng thái download.

## Câu hỏi mở
- Có cần lưu lịch sử nhạc giống `imgfx_history` không?  
- Số bản nhạc tối đa có muốn >2 nếu API cho phép?  
- Có cần route riêng `/music` hay giữ chung trang chính? 
