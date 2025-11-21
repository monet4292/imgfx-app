# Ke hoach: Tinh nang sinh anh Whisk

## Muc tieu
- Sinh anh qua Whisk trong ImageFX, dung chung CookieContext va lich su imgfx_history.
- Giu routing mong: pages mỏng, logic o lib/core, khong tao class moi neu khong can.
- Cung cap toggle chon provider (imagefx | whisk), luu prompt + ket qua vao timeline chung.
- Thoi gian sinh < 8s trong QA thu cong; handle loi API ro rang.

## Rang buoc & gia dinh
- Nguoi dung da nhap GOOGLE_COOKIE hop le; access token lay tu `labs.google/fx/api/auth/session`.
- Khong log token/cookie; chi truyen trong body/fetch header.
- Chi dung module thuong, khong dung TypeScript class; khong dung `any/unknown`.
- Markdown luu duoi `docs/`, file ke hoach nam trong `docs/plan/`.

## Luong API Whisk (tham khao docs/whisk-api-calls.md)
1) POST `v1:checkAppAvailability` (tool PINHOLE).  
2) GET `trpc/general.fetchToolAvailability?tool=BACKBONE`.  
3) GET `api/auth/session` lay token + profile.  
4) GET `trpc/general.fetchFeatureAvailability` cho `WHISK_R2I*`.  
5) GET `trpc/general.fetchUserPreferences` + `fetchUserAcknowledgement`.  
6) POST `v1/whisk:getVideoCreditStatus` lay credit.  
7) POST payload sinh anh → nhan media id.  
8) GET `media/<id>` lay anh PNG base64 + metadata.

## Thiet ke ung dung
- **Domain (src/lib/core)**: ham thuong `createWhiskClient` tra ve `prepareSession`, `generate`, `fetchMedia`; tach constants/header clone tu DefaultHeader.  
- **DTO**: dinh nghia `WhiskGenerationRequest`, `WhiskImageResponse`, `WhiskCreditStatus` ro rang (union/enum, khong any).  
- **API route**: `src/pages/api/whisk-generate.ts` lam shim: nhan prompt/cookie/options, goi client, tra JSON {images, metadata, provider:'whisk'}.  
- **UI**: cap nhat `src/pages/index.tsx` them toggle provider, form options Whisk (style preset neu co), trang thai loading, loi.  
- **History**: mo rong `src/lib/history.ts` them truong provider, workflowId, mediaGenerationId; render badge Whisk trong gallery.

## Cong viec song song
- **A Domain/API**: DTO + client + route `/api/whisk-generate` (mock truoc, that sau).  
- **B UI/UX**: form toggle, submit theo provider, hien thi ket qua, badge.  
- **C Storage/History**: schema moi + migration nhe (giu entry cu), update doc lich su.  
- **D Bao mat/Config**: chan thieu cookie, xu ly 401/429/5xx, timeout 60s, khong retry vo tan.  
- **E QA**: checklist manual, curl mau, kiem network va localStorage.

## Riu ro & giam thieu
- Token het han → catch 401, huong dan nhap lai cookie.  
- Het credit → thong bao ro, khong spam request.  
- Response ~1.5MB → dung Blob/thanh phan base64 ngan han, giai phong bo nho sau khi render.  
- Thay doi tRPC → them validate don gian (zod/guards) truoc khi map sang model.

## Tien do de xuat
- Ngay 1: DTO + client skeleton, stub API route.  
- Ngay 2: UI toggle + ket noi route thuc, handle Blob.  
- Ngay 3: History + QA script + doc cap nhat, san sang demo.

## Cau hoi mo
- Co can luu lich su Whisk giong imgfx_history hay chi hien tai?  
- Toggle o trang chu hay tach route rieng `/whisk`?  
- Giu mac dinh 1 hay 2 anh/luot, co can tuy chon so luong?
