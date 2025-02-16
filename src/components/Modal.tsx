import { ReactNode } from "react";
import { createPortal } from "react-dom";

interface IProps {
    isOpen: boolean
    onClose: any
    onConfirm: any
    children?: ReactNode
    confirmText?: string
    title: string
}

export default function Modal({ children, isOpen, onClose, onConfirm, confirmText = 'Confirmar', title }: IProps) {

    if (!isOpen) return null

    return createPortal(
        <div className="w-screen h-screen fixed top-0 left-0 bg-black bg-opacity-70 flex items-center justify-center">
            <div className="bg-white rounded text-black p-4 flex flex-col gap-4 items-center">
                <h1 className="text-2xl">{title}</h1>
                {children}
                <div className="flex gap-2 text-white">
                    <button onClick={onClose} className="p-2 rounded bg-red-500">Fechar</button>
                    <button onClick={onConfirm} className="p-2 rounded bg-blue-800">{confirmText}</button>
                </div>
            </div>
        </div>
        , document.body
    )
}