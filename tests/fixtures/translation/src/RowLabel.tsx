import { t } from './i18n';

// Translates its own label prop.
export function RowLabel({ label }: { label: string }) {
  return <span>{t(label)}</span>;
}
