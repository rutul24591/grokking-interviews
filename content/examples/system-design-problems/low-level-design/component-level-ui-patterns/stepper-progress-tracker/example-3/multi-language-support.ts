/**
 * Stepper — Staff-Level Multi-Language Support.
 *
 * Staff differentiator: i18n step labels, RTL layout support, locale-aware
 * number formatting for step indicators, and translated validation messages.
 */

export interface StepperI18nConfig {
  locale: string;
  direction: 'ltr' | 'rtl';
  translations: {
    step: string; // "Step" label
    of: string; // "of" label
    next: string;
    back: string;
    submit: string;
    skip: string;
    validationErrors: string;
  };
  numberFormat: {
    useWesternArabic: boolean; // true: 1,2,3 — false: ١,٢,٣
  };
}

/**
 * Formats step numbers according to locale conventions.
 */
export function formatStepNumber(step: number, total: number, config: StepperI18nConfig): string {
  const { locale, translations } = config;

  // Use Intl.NumberFormat for locale-aware number formatting
  const formatter = new Intl.NumberFormat(locale, {
    useGrouping: false,
  });

  return `${translations.step} ${formatter.format(step)} ${translations.of} ${formatter.format(total)}`;
}

/**
 * Generates RTL-aware stepper styles.
 */
export function getStepperStyles(direction: 'ltr' | 'rtl'): React.CSSProperties {
  return {
    direction,
    flexDirection: direction === 'rtl' ? 'row-reverse' as const : 'row' as const,
  };
}

/**
 * Pre-built locale configurations for common languages.
 */
export const STEPPER_LOCALES: Record<string, StepperI18nConfig> = {
  'en-US': {
    locale: 'en-US',
    direction: 'ltr',
    translations: { step: 'Step', of: 'of', next: 'Next', back: 'Back', submit: 'Submit', skip: 'Skip', validationErrors: 'Please fix the errors below' },
    numberFormat: { useWesternArabic: true },
  },
  'ar-SA': {
    locale: 'ar-SA',
    direction: 'rtl',
    translations: { step: 'الخطوة', of: 'من', next: 'التالي', back: 'السابق', submit: 'إرسال', skip: 'تخطي', validationErrors: 'يرجى تصحيح الأخطاء أدناه' },
    numberFormat: { useWesternArabic: false },
  },
  'zh-CN': {
    locale: 'zh-CN',
    direction: 'ltr',
    translations: { step: '步骤', of: '/', next: '下一步', back: '上一步', submit: '提交', skip: '跳过', validationErrors: '请修复以下错误' },
    numberFormat: { useWesternArabic: true },
  },
};
