import { X } from 'lucide-react'
import { cn } from '../utils/helpers'

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  if (!isOpen) return null

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-[#1D2D35]/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className={cn(
        'relative bg-white rounded-2xl shadow-soft-lg w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col',
        sizes[size]
      )}>
        <div className="flex items-center justify-between p-5 border-b border-[#EAF1F4]">
          <h2 className="font-heading font-semibold text-lg text-[#1D2D35]">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-[#EAF1F4] text-[#5E7480] hover:text-[#1D2D35] transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-5 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  )
}
