import styles from './CinemaInfo.module.scss';

type Props = {
  name?: string;
  address?: string;
  network?: string;
  loading?: boolean;
  error?: string;
};

export function CinemaInfo({ name, address, network, loading, error }: Props) {
  if (error)   return <div className={styles.error}>{error}</div>;
  if (loading) return <div className={styles.skeleton}>Загрузка кинотеатра…</div>;
  if (!name)   return null;

  return (
    <aside className={styles.info}>
      <h1 className={styles.title}>{name}</h1>
      {address && <div className={styles.address}>{address}</div>}
      {network && <div className={styles.network}>{network}</div>}
    </aside>
  );
}
