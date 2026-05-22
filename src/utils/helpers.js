export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function getStatusColor(status) {
  const colors = {
    stable: 'bg-[#4FAF8F]',
    critical: 'bg-[#D96C6C]',
    monitoring: 'bg-[#F4B860]',
    synced: 'bg-[#4FAF8F]',
    syncing: 'bg-[#F4B860]',
    error: 'bg-[#D96C6C]',
  }
  return colors[status] || 'bg-[#5E7480]'
}

export function getStatusTextColor(status) {
  const colors = {
    stable: 'text-[#4FAF8F]',
    critical: 'text-[#D96C6C]',
    monitoring: 'text-[#F4B860]',
    synced: 'text-[#4FAF8F]',
    syncing: 'text-[#F4B860]',
    error: 'text-[#D96C6C]',
  }
  return colors[status] || 'text-[#5E7480]'
}
