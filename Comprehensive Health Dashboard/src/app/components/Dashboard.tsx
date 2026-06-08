import { useState, useEffect } from 'react';
import { Card, CardContent } from '@mui/material';
import { CheckCircle2, Circle } from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';

const DEFAULT_DATA = { weight: 75, targetWeight: 65, height: 170, startDate: '2026-06-08' };

export function Dashboard() {
  const [data, setData] = useState(DEFAULT_DATA);

  const loadData = async (uid?: string) => {
    const local = localStorage.getItem('user_data_mock');
    if (local) {
      setData(JSON.parse(local));
      return;
    }
    if (uid && uid !== 'mock_user_123') {
      try {
        const snap = await getDoc(doc(db, 'users', uid));
        if (snap.exists()) setData(snap.data() as any);
      } catch (e) {}
    }
  };

  useEffect(() => {
    const localMock = localStorage.getItem('mock_user');
    if (localMock) loadData('mock_user_123');

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!localStorage.getItem('mock_user') && user) loadData(user.uid);
    });

    const handleUpdate = () => loadData(localStorage.getItem('mock_user') ? 'mock_user_123' : auth.currentUser?.uid);
    window.addEventListener('user_data_updated', handleUpdate);
    return () => {
      unsubscribe();
      window.removeEventListener('user_data_updated', handleUpdate);
    };
  }, []);

  const bmi = (data.weight / Math.pow((data.height || 170) / 100, 2)).toFixed(1);
  const diffDays = Math.max(0, Math.floor((new Date().getTime() - new Date(data.startDate).getTime()) / (1000 * 60 * 60 * 24)));
  const cycleDay = (diffDays % 12) + 1;
  const completed = Math.floor(diffDays / 12);

  // 模拟折线图数据点 (基于当前体重向上推演)
  const chartPoints = [
    data.weight + 5, data.weight + 3.5, data.weight + 2, 
    data.weight + 1, data.weight + 0.5, data.weight
  ];

  return (
    <div className="h-full overflow-y-auto bg-[#fafaf9] min-h-screen pb-24">
      {/* 顶部标题区 */}
      <div className="text-center pt-8 pb-6">
        <h1 className="text-xl font-serif text-[#2c2c2c] tracking-widest mb-1">健康管理</h1>
        <div className="w-12 h-px bg-gray-300 mx-auto mb-2"></div>
        <p className="text-xs text-gray-400">2026年6月8日</p>
      </div>

      <div className="px-4 space-y-4">
        {/* 今日类型卡片 */}
        <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.02)', borderRadius: '12px' }}>
          <CardContent className="text-center py-8">
            <p className="text-xs text-gray-400 tracking-widest mb-3">今日类型</p>
            <h2 className="text-4xl font-serif text-[#2c2c2c] tracking-widest mb-4">高碳日</h2>
            <p className="text-xs text-gray-400 tracking-wider mb-8">能量补充期</p>
            
            <div className="flex justify-center items-center gap-12">
              <div>
                <p className="text-[10px] text-gray-400 mb-1">循环日</p>
                <p className="text-3xl font-light">{cycleDay}</p>
              </div>
              <div className="w-px h-8 bg-gray-200"></div>
              <div>
                <p className="text-[10px] text-gray-400 mb-1">已完成</p>
                <p className="text-3xl font-light">{completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 数据四宫格 */}
        <div className="grid grid-cols-2 gap-4">
          <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.02)', borderRadius: '12px' }}>
            <CardContent className="text-center p-6">
              <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center mx-auto mb-3">
                <span className="text-gray-400 text-xs">📉</span>
              </div>
              <p className="text-[10px] text-gray-400 mb-1">BMI</p>
              <p className="text-2xl font-light text-[#2c2c2c]">{bmi}</p>
              <p className="text-[9px] text-gray-400 mt-1">18.5 - 24 正常</p>
            </CardContent>
          </Card>
          
          <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.02)', borderRadius: '12px' }}>
            <CardContent className="text-center p-6">
              <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center mx-auto mb-3">
                <span className="text-gray-400 text-xs">⚖️</span>
              </div>
              <p className="text-[10px] text-gray-400 mb-1">体重</p>
              <p className="text-2xl font-light text-[#2c2c2c]">{data.weight}<span className="text-sm">kg</span></p>
              <p className="text-[9px] text-gray-400 mt-1">目标 {data.targetWeight}kg</p>
            </CardContent>
          </Card>
        </div>

        {/* 核心：体重趋势折线图 */}
        <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.02)', borderRadius: '12px' }}>
          <CardContent className="p-6">
            <p className="text-xs text-gray-400 text-center mb-6 tracking-widest">体重趋势</p>
            <div className="relative h-32 w-full">
              {/* 简易原生 SVG 折线图 */}
              <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible">
                <polyline 
                  points={`0,${40 - (chartPoints[0]-data.targetWeight)} 20,${40 - (chartPoints[1]-data.targetWeight)} 40,${40 - (chartPoints[2]-data.targetWeight)} 60,${40 - (chartPoints[3]-data.targetWeight)} 80,${40 - (chartPoints[4]-data.targetWeight)} 100,${40 - (chartPoints[5]-data.targetWeight)}`} 
                  fill="none" stroke="#2c2c2c" strokeWidth="0.5" 
                />
                {chartPoints.map((pt, i) => (
                  <circle key={i} cx={i * 20} cy={40 - (pt - data.targetWeight)} r="1.5" fill="#2c2c2c" />
                ))}
              </svg>
              <div className="flex justify-between text-[9px] text-gray-400 mt-2">
                <span>第1周</span><span>第2周</span><span>第3周</span><span>第4周</span><span>第5周</span><span>第6周</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 本周训练 */}
        <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.02)', borderRadius: '12px' }}>
          <CardContent className="p-6">
            <p className="text-xs text-gray-400 text-center mb-6 tracking-widest">本周训练</p>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <CheckCircle2 size={20} className="text-[#2c2c2c]" />
                <div><p className="text-sm font-medium">周一</p><p className="text-[10px] text-gray-400">力量训练</p></div>
              </div>
              <div className="flex items-center gap-4">
                <CheckCircle2 size={20} className="text-[#2c2c2c]" />
                <div><p className="text-sm font-medium">周二</p><p className="text-[10px] text-gray-400">有氧运动</p></div>
              </div>
              <div className="flex items-center gap-4">
                <Circle size={20} className="text-gray-300" />
                <div><p className="text-sm font-medium text-gray-500">周三</p><p className="text-[10px] text-gray-400">休息恢复</p></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
