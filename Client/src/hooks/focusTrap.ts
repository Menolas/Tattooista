import { useEffect } from 'react';

export const useFocusTrap = (modalRef: React.RefObject<HTMLElement>) => {
    useEffect(() => {
        const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        const firstFocusableElement = modalRef.current?.querySelectorAll(focusableElements)[0] as HTMLElement;
        const focusableContent = modalRef.current?.querySelectorAll(focusableElements);
        const lastFocusableElement = focusableContent?.[focusableContent.length - 1] as HTMLElement;

        const handleKeydown = (e: KeyboardEvent) => {
            if (e.key !== 'Tab') return;

            if (e.shiftKey) /* shift + tab */ {
                console.log("in hook first if!!!")
                if (document.activeElement === firstFocusableElement) {
                    lastFocusableElement?.focus();
                    e.preventDefault();
                }
            } else /* tab */ {
                console.log("in hook else if!!!")
                if (document.activeElement === lastFocusableElement) {
                    firstFocusableElement?.focus();
                    e.preventDefault();
                }
            }
        };

        document.addEventListener('keydown', handleKeydown);

        return () => {
            document.removeEventListener('keydown', handleKeydown);
        };
    }, [modalRef]);
};
