import { HeaderBar } from '@/widgets/header-bar/ui/HeaderBar';
import { Outlet } from 'react-router-dom';
import styles from './MainLayout.module.scss';


export function MainLayout() {
    return (
        <div className={styles.root}>
            <HeaderBar />
            <main className={styles.rootMain}>
                <Outlet />
            </main>
        </div>
    );
}