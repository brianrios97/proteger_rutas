// src/utils/modal.ts
export function showModal(title: string, message: string, alertMode: boolean = false): Promise<boolean> {
    return new Promise((resolve) => {
        const modal = document.getElementById('custom-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalMsg = document.getElementById('modal-message');
        const modalCancel = document.getElementById('modal-btn-cancel');
        const modalConfirm = document.getElementById('modal-btn-confirm');

        if (!modal || !modalTitle || !modalMsg || !modalCancel || !modalConfirm) return resolve(false);

        modalTitle.textContent = title;
        modalMsg.textContent = message;
        modal.classList.remove('hidden');

        // Modo alerta: solo botón aceptar
        modalCancel.style.display = alertMode ? 'none' : 'inline-block';

        const handleCancel = () => { modal.classList.add('hidden'); cleanup(); resolve(false); };
        const handleConfirm = () => { modal.classList.add('hidden'); cleanup(); resolve(true); };

        const cleanup = () => {
            modalCancel.removeEventListener('click', handleCancel);
            modalConfirm.removeEventListener('click', handleConfirm);
        };

        modalCancel.addEventListener('click', handleCancel);
        modalConfirm.addEventListener('click', handleConfirm);
    });
}