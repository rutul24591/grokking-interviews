function planDirectionSwitch({ locale, iconIsDirectional, includesMixedIds, hasSideNav }) {
  const rtlLocales = ["ar", "he", "fa"];
  const isRtl = rtlLocales.includes(locale);
  return {
    locale,
    direction: isRtl ? "rtl" : "ltr",
    mirrorIcon: isRtl && iconIsDirectional,
    isolateMixedIds: isRtl && includesMixedIds,
    moveSideNav: isRtl && hasSideNav
  };
}

console.log([
  { locale: "ar", iconIsDirectional: true, includesMixedIds: true, hasSideNav: true },
  { locale: "en", iconIsDirectional: true, includesMixedIds: false, hasSideNav: true },
  { locale: "he", iconIsDirectional: false, includesMixedIds: true, hasSideNav: false }
].map(planDirectionSwitch));
