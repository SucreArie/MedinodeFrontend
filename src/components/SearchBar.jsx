import { Search } from 'lucide-react'
import { cn } from '../utils/helpers'

export default function SearchBar({ 
  value, 
  onChange, 
  placeholder = 'Rechercher...', 
  className = '' 
}) {
  return (
    <div className={cn('relative', className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5E7480]" size={18} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EAF1F4] bg-white text-[#1D2D35] placeholder:text-[#5E7480] focus:outline-none focus:ring-2 focus:ring-[#3BA7B8]/20 focus:border-[#3BA7B8] transition-all"
      />
    </div>
  )
}
