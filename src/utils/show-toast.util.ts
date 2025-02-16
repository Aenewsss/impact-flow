import { Bounce, toast } from "react-toastify";

type TToastType = 'info' | 'warning' | 'error' | 'success'

export function showToast(message: string, type: TToastType = 'info') {

    toast[type](message, {
        pauseOnHover: false,
        transition: Bounce,
        theme:'dark',
    })
}