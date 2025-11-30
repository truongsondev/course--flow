import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enHome from "./en/home.json";
import viHome from "./vi/home.json";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      home: enHome,
    },
    vi: {
      home: viHome,
    },
  },
  lng: "en",
  fallbackLng: "vi",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
