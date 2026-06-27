'use client';

import { useReducer, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import GlobalLoader from './GlobalLoader';

export default function PageLoader({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [loaderState, dispatch] = useReducer(
        (_state: { isLoading: boolean }, nextLoading: boolean) => ({ isLoading: nextLoading }),
        { isLoading: true }
    );
    const { isLoading } = loaderState;

    useEffect(() => {
        dispatch(true);

        const timer = requestAnimationFrame(() => {
            const images = Array.from(document.querySelectorAll('main img')) as HTMLImageElement[];

            if (images.length === 0) {
                setTimeout(() => dispatch(false), 300);
                return;
            }

            let loadedCount = 0;
            const totalImages = images.length;

            const checkAllLoaded = () => {
                loadedCount++;
                if (loadedCount >= totalImages) {
                    dispatch(false);
                }
            };

            images.forEach((img) => {
                if (img.complete && img.naturalHeight !== 0) {
                    checkAllLoaded();
                } else {
                    img.addEventListener('load', checkAllLoaded, { once: true });
                    img.addEventListener('error', checkAllLoaded, { once: true });
                }
            });

            setTimeout(() => dispatch(false), 5000);
        });

        return () => cancelAnimationFrame(timer);
    }, [pathname]);

    return (
        <>
            {isLoading && (
                <div className="fixed inset-0 z-[9999]" style={{ backgroundColor: '#C9CBA3' }}>
                    <GlobalLoader />
                </div>
            )}
            <div style={{ visibility: isLoading ? 'hidden' : 'visible' }}>
                {children}
            </div>
        </>
    );
}
