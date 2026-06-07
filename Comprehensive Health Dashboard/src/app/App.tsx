import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Dashboard } from './components/Dashboard';
import { CheckIn } from './components/CheckIn';
import { MealPlans } from './components/MealPlans';
import { Education } from './components/Education';
import { AICounselor } from './components/AICounselor';
import { Profile } from './components/Profile';
import { Home, Calendar, UtensilsCrossed, BookOpen, MessageCircle, User } from 'lucide-react';
import '../styles/song-aesthetics.css';

function Navigation() {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: '仪表盘' },
    { path: '/checkin', icon: Calendar, label: '打卡' },
    { path: '/meals', icon: UtensilsCrossed, label: '食谱' },
    { path: '/education', icon: BookOpen, label: '科普' },
    { path: '/ai', icon: MessageCircle, label: 'AI顾问' },
    { path: '/profile', icon: User, label: '我的' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#fafaf9]/95 backdrop-blur-sm border-t border-[#e7e5e4] px-3 py-3 flex justify-around items-center z-50">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center gap-1.5 px-3 py-2 transition-all duration-500 ${
              isActive
                ? 'text-[#2c2c2c]'
                : 'text-[#757575] hover:text-[#4a4a4a]'
            }`}
          >
            <div className={`relative ${isActive ? 'scale-110' : ''} transition-transform duration-300`}>
              <Icon size={20} strokeWidth={1.5} />
              {isActive && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#2c2c2c]" />
              )}
            </div>
            <span className={`text-[0.625rem] tracking-wider ${isActive ? 'font-medium' : 'font-light'}`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

function AppContent() {
  return (
    <div className="size-full bg-[#fafaf9] pb-20">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/checkin" element={<CheckIn />} />
        <Route path="/meals" element={<MealPlans />} />
        <Route path="/education" element={<Education />} />
        <Route path="/ai" element={<AICounselor />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <Navigation />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
