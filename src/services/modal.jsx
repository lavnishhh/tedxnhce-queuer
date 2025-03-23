import { createContext, useContext, useState } from "react";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
    const [modal, setModal] = useState(null);
    const [resolvePromise, setResolvePromise] = useState(null);
  
    const showModal = async (content, dismissable = true) => {
      return new Promise((resolve) => {
        setModal({ content, dismissable });
        setResolvePromise(() => resolve);
      });
    };
  
    const hideModal = (result) => {
      if (modal?.dismissable && resolvePromise) {
        resolvePromise(result); // Resolve the Promise
        setModal(null);
        setResolvePromise(null);
      }
    };

    return (
        <ModalContext.Provider value={{ showModal, hideModal }}>
            {children}
            {modal && <Modal content={modal.content} onClose={hideModal} dismissable={modal.dismissable} />}
        </ModalContext.Provider>
    );
};

const Modal = ({ content, onClose, dismissable }) => {
    return (
        <>
            <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                <div className="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true" />
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                {content}
                            </div>
                            <div className="bg-gray-50 px-4 py-3 flex gap-4">
                                {dismissable && <button onClick={() => onClose(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>}
                                <button onClick={() => onClose(true)} className="px-4 py-2 bg-blue-500 text-white rounded">OK</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};


export const useModal = () => useContext(ModalContext);
