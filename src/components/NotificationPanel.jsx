import { useState, useEffect } from 'react'
import { Bell, X, AlertTriangle, CheckCircle2, Info, AlertCircle, RefreshCw } from 'lucide-react'
import { cn } from '../utils/helpers'
import { useNotifications } from '../context/NotificationContext'
import api from '../services/api'

export default function NotificationPanel({ onClose }) {
  const { dismissNotification, clearAll } = useNotifications()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const res = await api.get('/notifications/latest')
      setNotifications(res.data)
    } catch (err) {
      console.error("Erreur notifications", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])
  
  const typeConfig = {
    critical: { icon: AlertTriangle, color: 'text-[#D96C6C]', bg: 'bg-[#D96C6C]/10' },
    warning: { icon: AlertCircle, color: 'text-[#F4B860]', bg: 'bg-[#F4B860]/10' },
    success: { icon: CheckCircle2, color: 'text-[#4FAF8F]', bg: 'bg-[#4FAF8F]/10' },
    info: { icon: Info, color: 'text-[#3BA7B8]', bg: 'bg-[#3BA7B8]/10' },
  }

  return (
    <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-soft-lg border border-[#EAF1F4] overflow-hidden z-50">
      <div className="flex items-center justify-between p-4 border-b border-[#EAF1F4] bg-[#F6FAFB]/50">
        <div className="flex items-center gap-2">
          <Bell size={18} className="text-[#0F4C5C]" />
          <h3 className="font-heading font-semibold text-[#1D2D35]">Notifications</h3>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={fetchNotifications}
            className={cn("p-1.5 rounded-lg hover:bg-white text-[#5E7480] transition-all", loading && "animate-spin")}
          >
            <RefreshCw size={14} />
          </button>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white text-[#5E7480] transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>
      
      <div className="max-h-80 overflow-y-auto">
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-6 h-6 border-2 border-[#3BA7B8] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-[#5E7480]">Chargement...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-[#5E7480]">
            Aucune notification
          </div>
        ) : (
          notifications.map((notification) => {
            const config = typeConfig[notification.type] || typeConfig.info
            const Icon = config.icon
            return (
              <div 
                key={notification.id}
                className="p-4 border-b border-[#EAF1F4] last:border-0 hover:bg-[#F6FAFB] transition-colors"
              >
                <div className="flex gap-3">
                  <div className={cn('p-2 rounded-xl shrink-0', config.bg)}>
                    <Icon size={16} className={config.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#1D2D35] line-clamp-2">{notification.message}</p>
                    <p className="text-xs text-[#5E7480] mt-1">{notification.time}</p>
                  </div>
                  <button 
                    onClick={() => dismissNotification(notification.id)}
                    className="p-1 rounded-lg hover:bg-[#EAF1F4] text-[#5E7480] shrink-0"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>

      {notifications.length > 0 && (
        <div className="p-3 border-t border-[#EAF1F4]">
          <button 
            onClick={clearAll}
            className="w-full text-center text-sm font-medium text-[#D96C6C] hover:opacity-80 transition-colors"
          >
            Effacer tout
          </button>
        </div>
      )}
    </div>
  )
}
