import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enLang from "./locales/en/en.json";
import zhhkLang from "./locales/zhhk/zhhk.json";
import zhtwLang from "./locales/zhtw/zhtw.json";
import zhcnLang from "./locales/zhcn/zhcn.json";
import jpLang from "./locales/jp/jp.json";
import krLang from "./locales/kr/kr.json";

// the translations
const resources = {
    en: {
        translation: enLang
    },
    hk: {
        translation: zhhkLang
    },
    tw: {
        translation: zhtwLang
    },
    cn: {
        translation: zhcnLang
    },
    jp: {
        translation: jpLang
    },
    kr: {
        translation: krLang
    },
};

const getInitialLanguage = () => {
    const saved = localStorage.getItem("preferredLanguage");
    if (saved && ["en", "hk" /* add others */].includes(saved)) {
        return saved;
    }

    const browser = navigator.language || navigator.languages?.[0] || "en";
    if (browser.startsWith("zh-HK") || browser.startsWith("zh-Hant-HK")) return "hk";
    return "en";
};

i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources,
        fallbackLng: "en",
        lng: getInitialLanguage(), // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
        // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
        // if you're using a language detector, do not define the lng option

        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });

export default i18n;