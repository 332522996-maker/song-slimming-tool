import { useState, useEffect } from 'react';
import { Card, CardContent } from '@mui/material';
import { Activity, Scale, Target, Footprints } from 'lucide-react';

export function Dashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [cycleData, setCycleData] = useState({
    type: '计算中...',
    desc: '',
    totalDays: 0,
    cycleDay: 0,
    remainWeight: 0
  });

  useEffect(() => {
    // 1. 去本地仓库抓取我们在 Profile 页面填写的个人真实数据
    const savedData = localStorage.getItem('userProfile');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setProfile(parsed);
      
      // 2. 核心大脑：根据起始日期计算当天的碳水循环阶段
      const start = new Date(parsed.startDate);
      start.setHours(0, 0, 0, 0);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // 计算相差的总天数 (今天减去起始日)
      const diffTime = today.getTime() - start.getTime();
      const diffDays = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
      
      // 采用标准的三天碳水循环模型：0=高碳，1=中碳，2=低碳
      const cycleTypes = [
        { name: '高碳日', desc: '能量补充期：大重量训练，多吃复合碳水' },
        { name: '中碳日', desc: '平稳消耗期：中等强度运动，主食减半' },
        { name: '低碳日', desc: '极限燃脂期：有氧或休息，极简碳水' }
      ];
      
      // 通过取余数，永远精准锁定今天是三天循环里的哪一天
      const currentDayIndex = diffDays % 3;
      
      // 计算距离目标体重的差距
      const remaining = Math.max(0, (parsed.weight - parsed.targetWeight)).toFixed(1);

      setCycleData({
        type: cycleTypes[currentDayIndex].name,
        desc: cycleTypes[currentDayIndex].desc,
        totalDays: diffDays + 1, // 累计坚持的总天数
        cycleDay: currentDayIndex + 1, // 当前小周期的进度 (1, 2, 或 3)
        remainWeight: parseFloat(remaining)
      });
    }
  }, []);

  // 如果没有检测到数据（比如没登录），显示提示信息
  if (!profile) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-[#fafaf9] text-[#757575]">
        <p className="text-sm tracking-widest">请先前往「我的」完成登录与基础配置</p>
      </div>
    );
  }

  const bmi = (profile.weight / ((profile.height / 100) ** 2)).toFixed(1);

  return (
    <div className="h-full overflow-y-auto bg-[#fafaf9] p-6 space-y-4 pb-20">
      
      {/* 顶部：自动推算的今日循环状态 */}
      <Card sx={{ bgcolor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '0.5px solid #e7e5e4', textAlign: 'center', py: 4 }}>
        <CardContent>
          <p className="text-xs text-[#757575] mb-2 tracking-[0.2em]">今日类型</p>
          <h1 className="text-4xl font-serif text-[#2c2c2c] mb-2">{cycleData.type}</h1>
          <p className="text-sm text-gray-500 mb-8">{cycleData.desc}</p>
          
          <div className="flex justify-center items-center gap-12 border-t border-gray-100 pt-6">
            <div>
              <p className="text-xs text-gray-400 mb-1">总坚持天数</p>
              <p className="text-2xl font-medium">{cycleData.totalDays}</p>
            </div>
            <div className="h-10 w-px bg-gray-100"></div>
            <div>
              <p className="text-xs text-gray-400 mb-1">小周期进度</p>
              <p className="text-2xl font-medium">{cycleData.cycleDay} <span className="text-sm text-gray-400">/ 3</span></p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 下方：随档案同步联动的四宫格数据 */}
      <div className="grid grid-cols-2 gap-4">
        <Card sx={{ bgcolor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '0.5px solid #e7e5e4', textAlign: 'center' }}>
          <CardContent className="p-4">
            <Activity size={20} className="mx-auto text-[#757575] mb-2" />
            <p className="text-xs text-gray-400 mb-1">当前 BMI</p>
            <p className="text-xl font-medium text-[#2c2c2c]">{bmi}</p>
          </CardContent>
        </Card>
        
        <Card sx={{ bgcolor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '0.5px solid #e7e5e4', textAlign: 'center' }}>
          <CardContent className="p-4">
            <Scale size={20} className="mx-auto text-[#757575] mb-2" />
            <p className="text-xs text-gray-400 mb-1">当前体重</p>
            <p className="text-xl font-medium text-[#2c2c2c]">{profile.weight} <span className="text-xs text-gray-400">kg</span></p>
          </CardContent>
        </Card>

        <Card sx={{ bgcolor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '0.5px solid #e7e5e4', textAlign: 'center' }}>
          <CardContent className="p-4">
            <Target size={20} className="mx-auto text-[#757575] mb-2" />
            <p className="text-xs text-gray-400 mb-1">距目标还差</p>
            <p className="text-xl font-medium text-[#2c2c2c]">{cycleData.remainWeight} <span className="text-xs text-gray-400">kg</span></p>
          </CardContent>
        </Card>

        <Card sx={{ bgcolor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '0.5px solid #e7e5e4', textAlign: 'center' }}>
          <CardContent className="p-4">
            <Footprints size={20} className="mx-auto text-[#757575] mb-2" />
            <p className="text-xs text-gray-400 mb-1">今日步数</p>
            <p className="text-xl font-medium text-[#2c2c2c]">8.5 <span className="text-xs text-gray-400">k</span></p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
