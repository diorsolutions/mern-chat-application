import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        "Type a message...": "Type a message...",
        "Search users": "Search users",
        "Settings": "Settings",
        "Profile": "Profile",
        "Logout": "Logout",
      },
    },
    ru: {
      translation: {
        "Type a message...": "Напишите сообщение...",
        "Search users": "Поиск пользователей",
        "Settings": "Настройки",
        "Profile": "Профиль",
        "Logout": "Выйти",
      },
    },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;