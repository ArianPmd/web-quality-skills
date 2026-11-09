import { t } from './i18n';
import { RowLabel } from './RowLabel';
import { Card } from './Card';

export function Page() {
  return (
    <main>
      {/* false positives: known to the dictionary, or translated by RowLabel, or a brand */}
      <RowLabel label="Active today" />
      <RowLabel label="Total points" />
      <img alt="Acme Notes" src="/logo.svg" />
      <span title="Redeem Code">{t('Redeem Code')}</span>
      {/* true positives */}
      <Card title="Weekly summary" />
      <p>Nothing here yet</p>
    </main>
  );
}
