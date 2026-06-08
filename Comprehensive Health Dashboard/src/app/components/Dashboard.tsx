// @ts-nocheck
import { useState, useEffect } from 'react';
import { Card, CardContent, Box, Typography } from '@mui/material';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';

// 默认基础数据（对齐你截图里的初始形态，确保100%美观）
const DEFAULT_DATA = {
  name: "演示用户",
  age: 28,
  height: 175, 
  weight: 80.6, 
  targetWeight: 75,
  region: 'east',
  startDate: '2026-06-08'
};

export function Dashboard() {
  const [data, setData] = useState(DEFAULT_DATA);

  const loadDashboardData = async (currentUser) => {
    if (currentUser) {
      if (currentUser.uid === "mock_user_123") {
        // 核心：如果处于沙盒模式，强制读取你在档案页改过的数据
        const localData = localStorage.getItem('user_data_mock');
        if (localData) setData(JSON.parse(localData));
      } else {
        try {
          const snap = await getDoc(doc(db, 'users', currentUser.uid));
          if (snap.exists()) setData(snap.data());
        } catch (e) {
          console.error(e);
        }
      }
    } else {
      setData(DEFAULT_DATA);
    }
  };

  useEffect(() => {
    // 1. 初始化加载
    const localMock = localStorage.getItem('mock_user');
    if (localMock) {
      loadDashboardData({ uid: "mock_user_123" });
    }

    // 2. 监听真实 Firebase 登录状态
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!localStorage.getItem('mock_user')) {
        loadDashboardData(currentUser);
      }
    });

    // 3. 核心机制：死死盯住 Profile 档案页的“确认保存”广播
    const handleDataBroadcast = () => {
      const hasMock = localStorage.getItem('mock_user');
      loadDashboardData(hasMock ? { uid: "mock_user_123" } : auth.currentUser);
    };

    window.addEventListener('user_data_updated', handleDataBroadcast);
    return () => {
      unsubscribe();
      window.removeEventListener('user_data_updated', handleDataBroadcast);
    };
  }, []);

  // --- 自动化核心测算引擎 ---
  
  // 1. 动态测算碳水循环日与坚持天数 (基于 startDate)
  const calculatePlanMetrics = () => {
    const start = new Date(data.startDate || '2026-06-08');
    const today = new Date();
    const diffTime = today.getTime() - start.getTime();
    const diffDays = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
    
    const cycles = [
      { type: "高碳日", desc: "能量补充期：大重量训练，多吃复合碳水", progress: "1 / 3" },
      { type: "中碳日", desc: "高效燃脂期：抗阻训练，适量优质碳水", progress: "2 / 3" },
      { type: "低碳日", desc: "极限减脂期：纯有氧/休息，严格断糖控碳", progress: "3 / 3" }
    ];
    
    const currentCycle = cycles[diffDays % 3];
    return {
      cycleTitle: currentCycle.type,
      cycleDesc: currentCycle.desc,
      cycleProgress: currentCycle.progress,
      totalDays: diffDays + 1 // 包含今天
    };
  };

  const metrics = calculatePlanMetrics();

  // 2. 动态计算 BMI = 体重(kg) / 身高(m)平方
  const bmi = (data.weight / Math.pow((data.height || 175) / 100, 2)).toFixed(1);

  // 3. 动态计算距目标差值
  const weightGap = Math.max(0, data.weight - data.targetWeight).toFixed(1);

  return (
    <div className="h-full overflow-y-auto bg-[#fafaf9] min-h-screen pb-24">
      
      {/* 顶部中央：今日类型板块 (像素级还原截图) */}
      <div className="text-center py-10 bg-white border-b border-gray-100">
        <p className="text-xs text-gray-400 tracking-widest mb-2">今日类型</p>
        <h1 className="text-4xl font-serif text-[#2c2c2c] tracking-widest mb-3 font-normal">{metrics.cycleTitle}</h1>
        <p className="text-xs text-gray-400 tracking-wider">{metrics.cycleDesc}</p>
      </div>

      {/* 中间核心计数器行 */}
      <div className="grid grid-cols-2 divide-x divide-gray-100 bg-white border-b border-gray-100 py-6 text-center">
        <div>
          <p className="text-[10px] text-gray-400 mb-1 tracking-wider">总坚持天数</p>
          <p className="text-2xl font-light text-[#2c2c2c]">{metrics.totalDays}</p>
        </div>
        <div>
          <p className="text-[10px] text-gray-400 mb-1 tracking-wider">小周期进度</p>
          <p className="text-2xl font-light text-[#2c2c2c]">{metrics.cycleProgress}</p>
        </div>
      </div>

      {/* 下方四宫格网格数据区 */}
      <div className="grid grid-cols-2 gap-px bg-gray-100 mt-4 border-t border-b border-gray-100">
        
        {/* 卡片 1: 当前 BMI */}
        <div className="bg-white p-6 text-center flex flex-col justify-center min-h-[120px]">
          <p className="text-[10px] text-gray-400 mb-2 tracking-wider">当前 BMI</p>
          <p className="text-2xl font-light text-[#2c2c2c]">{bmi}</p>
        </div>

        {/* 卡片 2: 当前体重 */}
        <div className="bg-white p-6 text-center flex flex-col justify-center min-h-[120px]">
          <p className="text-[10px] text-gray-400 mb-2 tracking-wider">当前体重</p>
          <p className="text-2xl font-light text-[#2c2c2c]">{data.weight} <span className="text-xs text-gray-400">key</span></p>
        </div>

        {/* 卡片 3: 距目标还差 */}
        <div className="bg-white p-6 text-center flex flex-col justify-center min-h-[120px]">
          <p className="text-[10px] text-gray-400 mb-2 tracking-wider">距目标还差</p>
          <p className="text-2xl font-light text-[#2c2c2c]">{weightGap} <span className="text-xs text-gray-400">kg</span></p>
        </div>

        {/* 卡片 4: 今日步数 */}
        <div className="bg-white p-6 text-center flex flex-col justify-center min-h-[120px]">
          <p className="text-[10px] text-gray-400 mb-2 tracking-wider">今日步数</p>
          <p className="text-2xl font-light text-[#2c2c2c]">8.5 <span className="text-xs text-gray-400">k</span></p>
        </div>

      </div>
    </div>
  );
}
