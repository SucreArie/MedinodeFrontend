import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#F6FAFB]">
      <Sidebar />
      <div className="pl-64">
        <Topbar />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
