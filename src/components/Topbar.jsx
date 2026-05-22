import { useState } from 'react'
import {
  Search,
  Bell,
  MessageSquare,
  ChevronDown,
  RefreshCw,
} from 'lucide-react'
import Badge from './Badge'
import { alerts } from '../data/mockData'

export default function Topbar() {
  const [showNotifications, setShowNotifications] = useState(false)

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-md border-b border-[#EAF1F4]">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Search */}
        <div className="flex items-center gap-4 flex-1 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5E7480]" size={18} />
            <input
              type="text"
              placeholder="Rechercher patients, dossiers..."
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-[#F6FAFB] border border-transparent text-sm placeholder:text-[#5E7480]/60 focus:outline-none focus:border-[#3BA7B8] focus:bg-white transition-all duration-200"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Sync Status */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#4FAF8F]/10 mr-2">
            <RefreshCw size={14} className="text-[#4FAF8F] animate-spin" style={{ animationDuration: '3s' }} />
            <span className="text-xs font-medium text-[#4FAF8F]">Synced</span>
          </div>

          {/* Messages */}
          <button className="relative p-2.5 rounded-xl hover:bg-[#EAF1F4] transition-colors">
            <MessageSquare size={20} className="text-[#5E7480]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#3BA7B8] rounded-full" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 rounded-xl hover:bg-[#EAF1F4] transition-colors"
            >
              <Bell size={20} className="text-[#5E7480]" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#D96C6C] rounded-full text-[10px] text-white font-medium flex items-center justify-center">
                {alerts.length}
              </span>
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-soft-lg border border-[#EAF1F4] overflow-hidden animate-fade-in">
                <div className="p-4 border-b border-[#EAF1F4]">
                  <h3 className="font-heading font-semibold text-[#1D2D35]">Notifications</h3>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="p-4 border-b border-[#EAF1F4] last:border-0 hover:bg-[#F6FAFB] transition-colors cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 mt-2 rounded-full ${
                          alert.type === 'critical' ? 'bg-[#D96C6C]' :
                          alert.type === 'warning' ? 'bg-[#F4B860]' : 'bg-[#3BA7B8]'
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm text-[#1D2D35]">{alert.message}</p>
                          <p className="text-xs text-[#5E7480] mt-1">{alert.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-[#EAF1F4]">
                  <button className="w-full py-2 text-sm font-medium text-[#3BA7B8] hover:bg-[#3BA7B8]/10 rounded-lg transition-colors">
                    Voir toutes les notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <button className="flex items-center gap-2 ml-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-[#EAF1F4] transition-colors">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3BA7B8] to-[#58D6C3] flex items-center justify-center text-white font-semibold text-xs">
              DL
            </div>
            <ChevronDown size={16} className="text-[#5E7480]" />
          </button>
        </div>
      </div>
    </header>
  )
}
