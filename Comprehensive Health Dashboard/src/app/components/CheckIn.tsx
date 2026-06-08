import { useState, useEffect } from 'react';
import { Card, CardContent, Button } from '@mui/material';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';

export function CheckIn() {
  const [profile, setProfile] = useState({ startDate: '2026-06-08', weight: 75 });
  const [checkedInDates, setCheckedInDates] = useState<string[]>([]);
  
  // 真实日期计算引擎
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const firstDayOfWeek = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
  const emptySlots = Array(firstDayOfWeek).fill(null);
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const loadData = async (uid?: string) => {
    const localProfile = localStorage.getItem('user_data_mock');
    if (localProfile) setProfile(JSON.parse(localProfile));
    
    const localCheckIns = localStorage.getItem('checkin_history_mock');
    if (localCheckIns) setCheckedInDates(JSON.parse(localCheckIns));

    if (uid && uid !== 'mock_user_123') {
      try {
        const snap = await getDoc(doc(db, 'users', uid));
        if (snap.exists()) {
          const data = snap.data();
          if (data.startDate) setProfile(data as any);
          if (data.checkIns) setCheckedInDates(data.checkIns);
        }
      } catch (e) {}
    }
  };

  useEffect(() => {
    loadData(localStorage.getItem('mock_user') ? 'mock_user_123' : auth.currentUser?.uid);
    const handleUpdate = () => loadData(localStorage.getItem('mock_user') ? 'mock_user_123' : auth.currentUser?.uid);
    window.addEventListener('user_data_updated', handleUpdate);
    return () => window.removeEventListener('user_data_updated', handleUpdate);
  }, []);

  // 严格对齐仪表盘的日期逻辑
  const diffDays = Math.max(0, Math.floor((today.getTime() - new Date(profile.startDate).getTime()) / (1000 * 60 * 60 * 24)));
  const cycleDay = (diffDays % 12) + 1;
  const isCheckedInToday = checkedInDates.includes(todayStr);

  const handleCheckIn = async () => {
    if (isCheckedInToday) return;
    const newDates = [...checkedInDates, todayStr];
    setCheckedInDates(newDates);
    
    const uid = localStorage.getItem('mock_user') ? 'mock_user_123' : auth.currentUser?.uid;
    if (uid === 'mock_user_123') {
      localStorage.setItem('checkin_history_mock', JSON.stringify(newDates));
    } else if (uid) {
      await setDoc(doc(db, 'users', uid), { checkIns: newDates }, { merge: true });
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-[#fafaf9] p-4 pb-24 space-y-4">
      <div className="pt-4 pb-2">
        <h1 className="text-xl font-serif text-[#2c2c2c] tracking-widest mb-1">每日打卡</h1>
        <p className="text-xs text-gray-400">坚持记录，见证改变</p>
      </div>

      <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.02)', borderRadius: '12px' }}>
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{cycleDay % 3 === 1 ? '🔥' : cycleDay % 3 === 2 ? '⚡' : '🌟'}</div>
              <div>
                <p className="text-base font-bold text-[#2c2c2c]">{cycleDay % 3 === 1 ? '高碳日' : cycleDay % 3 === 2 ? '中碳日' : '低碳/恢复日'}</p>
                <p className="text-[10px] text-gray-400">系统已同步：循环第 {cycleDay} 天</p>
              </div>
            </div>
            <Button 
              variant="contained" 
              onClick={handleCheckIn}
              disabled={isCheckedInToday}
              sx={{ bgcolor: isCheckedInToday ? '#e0e0e0' : '#4285F4', color: isCheckedInToday ? '#9e9e9e' : '#fff', borderRadius: '8px', boxShadow: 'none' }}
            >
              {isCheckedInToday ? '已打卡' : '立即打卡'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-2">
        <Card sx={{ borderRadius: '12px' }}><CardContent className="p-4 text-center"><span className="text-red-500 text-lg mb-1 block">🔥</span><p className="text-xl font-medium">{checkedInDates.length}</p><p className="text-[9px] text-gray-400">连续天数</p></CardContent></Card>
        <Card sx={{ borderRadius: '12px' }}><CardContent className="p-4 text-center"><span className="text-yellow-500 text-lg mb-1 block">⭐</span><p className="text-xl font-medium">{checkedInDates.length * 50}</p><p className="text-[9px] text-gray-400">积分</p></CardContent></Card>
        <Card sx={{ borderRadius: '12px' }}><CardContent className="p-4 text-center"><span className="text-purple-500 text-lg mb-1 block">🏆</span><p className="text-xl font-medium">{checkedInDates.length}</p><p className="text-[9px] text-gray-400">总打卡</p></CardContent></Card>
      </div>

      <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.02)', borderRadius: '12px' }}>
        <CardContent className="p-4">
          <p className="text-xs text-[#2c2c2c] font-medium mb-4">本月记录</p>
          <div className="grid grid-cols-7 text-center mb-2">
            {['日', '一', '二', '三', '四', '五', '六'].map(day => <span key={day} className="text-[10px] text-gray-400">{day}</span>)}
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {emptySlots.map((_, i) => <div key={`empty-${i}`} />)}
            {monthDays.map(day => {
              const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const isChecked = checkedInDates.includes(dateStr);
              const isToday = day === today.getDate();
              
              return (
                <div key={day} className={`aspect-square flex items-center justify-center rounded-lg text-xs 
                  ${isToday ? 'border-2 border-blue-400 font-bold' : ''} 
                  ${isChecked ? 'bg-blue-50 text-blue-500' : 'bg-gray-50 text-gray-400'}`}>
                  {day}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
