import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { clearToken } from '../utils/auth'

interface LayoutProps {
  children: ReactNode
  onLogout: () => void
}

const Layout = ({ children, onLogout }: LayoutProps) => {
  const location = useLocation()

  const navItems = [
    { path: '/', label: '首页', icon: '🏠' },
    { path: '/teams', label: '团队管理', icon: '👥' },
    { path: '/users', label: '用户管理', icon: '👤' },
    { path: '/communications', label: '沟通记录', icon: '💬' },
  ]

  const handleLogout = () => {
    clearToken()
    onLogout()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 侧边栏 */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-primary-600">🦊 FoxChat</h1>
          <p className="text-sm text-gray-500 mt-1">团队沟通协作平台</p>
        </div>
        
        <nav className="mt-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? 'bg-primary-50 text-primary-600 border-r-2 border-primary-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <span className="mr-3">🚪</span>
            退出登录
          </button>
        </div>
      </aside>

      {/* 主内容区 */}
      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  )
}

export default Layout
