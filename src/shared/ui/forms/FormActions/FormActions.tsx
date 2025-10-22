import s from './FormActions.module.scss';

type Props = {
  submitLabel: string;
  loading?: boolean;
  disabled?: boolean;
  hint?: string | React.ReactNode;
};

export function FormActions({ submitLabel, loading, disabled, hint }: Props) {
  return (
    <div className={s.actions}>
      <button
        type="submit"
        className={s.actionsButton}
        disabled={loading || disabled}
      >
        {loading ? 'Подождите…' : submitLabel}
      </button>
      {hint && <div className={s.actionsHint}>{hint}</div>}
    </div>
  );
}
