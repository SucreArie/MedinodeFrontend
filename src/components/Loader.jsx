export default function Loader({ size = 'default', className = '' }) {
  const sizes = {
    small: 'w-5 h-5 border-2',
    default: 'w-8 h-8 border-3',
    large: 'w-12 h-12 border-4',
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizes[size]} border-[#EAF1F4] border-t-[#3BA7B8] rounded-full animate-spin`}
      />
    </div>
  )
}
