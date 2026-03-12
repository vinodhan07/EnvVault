// src/components/layout/Layout.jsx
import { motion } from 'framer-motion'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

export default function Layout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden bg-vault-bg text-vault-textMain selection:bg-vault-neonLime selection:text-black">
      {/* Decorative ambient glow */}
      <div className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] bg-vault-neonCyan/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-vault-neonMagenta/5 rounded-full blur-[150px] pointer-events-none z-0" />
      
      <Sidebar />
      <div className="flex-1 flex flex-col relative z-10 w-full overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 w-full max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
}
