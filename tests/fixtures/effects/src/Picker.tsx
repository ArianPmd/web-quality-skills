import { useEffect } from 'react';
import { save, compute } from './storage';

export function Picker({ open, onMeasure, subscribe, store, pathname }: { open: boolean; onMeasure: () => void; subscribe: () => () => void; store: { subscribe: (f: () => void) => () => void }; pathname: string }) {
  // false positives: braces, cleanup-returning, or a project function with no value return
  useEffect(() => {
    onMeasure();
  }, [open]);
  useEffect(() => () => window.removeEventListener('resize', onMeasure), []);
  useEffect(() => subscribe, [subscribe]);
  useEffect(() => store.subscribe(onMeasure), []);
  useEffect(() => save('cart', open), [open]);
  // true positives
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  useEffect(() => compute(open), [open]);
  // unknown callee: a lead, not a certainty
  useEffect(() => onMeasure(), [open]);
  return null;
}
