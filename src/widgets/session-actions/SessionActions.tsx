import { memo } from 'react';
import styles from './SessionActions.module.scss';

type Props = {
    isAuth: boolean;
    selectedCount: number;
    isBusy?: boolean;        // NEW
    errorText?: string;
    onClear: () => void;
    onBook: () => void;
};

export const SessionActions = memo(function SessionActions(prop: Props) {
    const {
        isAuth,
        selectedCount,
        isBusy,
        errorText,
        onClear,
        onBook,
    } = prop;

    const canBook = isAuth && selectedCount > 0 && !isBusy;

    return (
        <div className={styles.container}>
            {errorText && (
                <div role="alert" className={styles.error}>
                    {errorText}
                </div>
            )}

            <button
                type="button"
                className={styles.btn}
                onClick={onClear}
                disabled={selectedCount === 0 || !!isBusy}
            >
                Очистить выбор
            </button>

            <button
                type="button"
                className={`${styles.btn} ${styles.primary}`}
                onClick={onBook}
                disabled={!canBook}
                aria-busy={isBusy ? true : undefined}
                title={!isAuth ? 'Требуется вход' : undefined}
            >
                {isAuth ? (isBusy ? 'Бронируем…' : 'Забронировать') : 'Войти и забронировать'}
            </button>
        </div>
    );
});
