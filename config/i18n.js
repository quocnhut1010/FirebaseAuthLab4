// config/i18n.js
import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';

// Import các file dịch bạn vừa tạo
import en from './translations/en.json';
import vi from './translations/vi.json';

// Khởi tạo instance I18n với các bản dịch
const i18n = new I18n({
  en, // Bản dịch tiếng Anh
  vi, // Bản dịch tiếng Việt
});

// Lấy ngôn ngữ hiện tại của thiết bị
// Localization.getLocales() trả về một mảng các đối tượng locale,
// chúng ta lấy cái đầu tiên và mã ngôn ngữ của nó (ví dụ: 'en-US', 'vi-VN')
const deviceLocale = Localization.getLocales()[0]?.languageTag || 'en';

// Thiết lập ngôn ngữ mặc định cho ứng dụng
// Nếu không tìm thấy bản dịch cho ngôn ngữ hiện tại của thiết bị,
// ứng dụng sẽ sử dụng ngôn ngữ này.
i18n.defaultLocale = 'en';

// Thiết lập ngôn ngữ hiện tại cho i18n

i18n.locale = deviceLocale.startsWith('vi') ? 'vi' : 'en';

// Bật chế độ fallback
// Nếu một key dịch không được tìm thấy trong ngôn ngữ hiện tại (i18n.locale),
// i18n-js sẽ thử tìm key đó trong ngôn ngữ mặc định (i18n.defaultLocale).
i18n.enableFallback = true;

// (Tùy chọn) Tạo một hàm helper để dễ dàng gọi hàm dịch
// export const translate = (key, options) => i18n.t(key, options);

// Export instance i18n để có thể sử dụng ở nơi khác
export default i18n;