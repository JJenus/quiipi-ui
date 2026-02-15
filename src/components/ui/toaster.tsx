import { useUIStore } from "@/store/uiStore"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { notifications } = useUIStore()

  return (
    <ToastProvider>
      {notifications.map(({ id, type, message }) => (
        <Toast key={id} variant={type === 'error' ? 'destructive' : 'default'}>
          <div className="grid gap-1">
            <ToastTitle>
              {type === 'success' && 'Success'}
              {type === 'error' && 'Error'}
              {type === 'warning' && 'Warning'}
              {type === 'info' && 'Info'}
            </ToastTitle>
            <ToastDescription>{message}</ToastDescription>
          </div>
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  )
}
