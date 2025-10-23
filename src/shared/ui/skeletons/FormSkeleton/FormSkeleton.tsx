import s from './FormSkeleton.module.scss';

export function FormSkeleton({ height = 280 }: { height?: number }) {
  return (
    <div style={{ minHeight: height }} className={s.formSkeleton}>
      <div className={s.formSkeletonLine} />
      <div className={s.formSkeletonInput} />
      <div className={s.formSkeletonLine} />
      <div className={s.formSkeletonInput} />
      <div className={s.formSkeletonActions} />
    </div>
  );
}

export default FormSkeleton;
