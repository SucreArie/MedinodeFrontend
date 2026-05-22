import { cn } from '../utils/helpers'

export default function Charts({ data, type = 'bar', height = 200 }) {
  const maxValue = Math.max(...data.map(d => d.value || d.visits || d.count || 0))

  if (type === 'bar') {
    return (
      <div className="flex items-end justify-between gap-2" style={{ height }}>
        {data.map((item, index) => {
          const value = item.value || item.visits || item.count || 0
          const percentage = (value / maxValue) * 100
          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full relative flex-1 flex items-end">
                <div 
                  className="w-full bg-gradient-to-t from-[#0F4C5C] to-[#3BA7B8] rounded-t-lg transition-all duration-500 hover:from-[#3BA7B8] hover:to-[#58D6C3]"
                  style={{ height: `${percentage}%`, minHeight: '4px' }}
                />
              </div>
              <span className="text-xs text-[#5E7480] font-medium">{item.day || item.label || item.type}</span>
            </div>
          )
        })}
      </div>
    )
  }

  if (type === 'donut') {
    const total = data.reduce((sum, d) => sum + (d.count || d.value || 0), 0)
    const colors = ['#0F4C5C', '#3BA7B8', '#58D6C3', '#4FAF8F', '#F4B860']
    let currentAngle = 0

    return (
      <div className="flex items-center gap-6">
        <div className="relative" style={{ width: height, height }}>
          <svg viewBox="0 0 100 100" className="transform -rotate-90">
            {data.map((item, index) => {
              const value = item.count || item.value || 0
              const percentage = (value / total) * 100
              const angle = (percentage / 100) * 360
              const startAngle = currentAngle
              currentAngle += angle

              const startRad = (startAngle * Math.PI) / 180
              const endRad = ((startAngle + angle) * Math.PI) / 180
              const largeArc = angle > 180 ? 1 : 0

              const x1 = 50 + 40 * Math.cos(startRad)
              const y1 = 50 + 40 * Math.sin(startRad)
              const x2 = 50 + 40 * Math.cos(endRad)
              const y2 = 50 + 40 * Math.sin(endRad)

              return (
                <path
                  key={index}
                  d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
                  fill={colors[index % colors.length]}
                  className="transition-all duration-300 hover:opacity-80"
                />
              )
            })}
            <circle cx="50" cy="50" r="25" fill="white" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold text-[#1D2D35]">{total}</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <span className="text-sm text-[#5E7480]">{item.type || item.label}</span>
              <span className="text-sm font-semibold text-[#1D2D35]">{item.count || item.value}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return null
}
