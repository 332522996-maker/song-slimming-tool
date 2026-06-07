import { useState, useEffect } from 'react';
import { Card, CardContent } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, TrendingDown, Target, Droplets } from 'lucide-react';
import { motion } from 'motion/react';

interface UserData {
  age: number;
  weight: number;
  height: number;
  targetWeight: number;
  startWeight: number;
  steps: number;
  cycleCount: number;
  currentCycleDay: number;
  startDate: string;
}

export function Dashboard() {
  const [userData, setUserData] = useState<UserData>(() => {
    const saved = localStorage.getItem('userData');
    return saved ? JSON.parse(saved) : {
      age: 28,
      weight: 75,
      height: 170,
      targetWeight: 65,
      startWeight: 80,
      steps: 8500,
      cycleCount: 3,
      currentCycleDay: 12,
      startDate: '2026-05-01'
    };
  });

  const bmi = (userData.weight / ((userData.height / 100) ** 2)).toFixed(1);
  const totalLoss = userData.startWeight - userData.weight;
  const remainingLoss = userData.weight - userData.targetWeight;
  const progressPercent = ((totalLoss / (userData.startWeight - userData.targetWeight)) * 100).toFixed(0);

  const weightData = [
    { date: '第1周', weight: 80 },
    { date: '第2周', weight: 78.5 },
    { date: '第3周', weight: 77.2 },
    { date: '第4周', weight: 76.8 },
    { date: '第5周', weight: 75.5 },
    { date: '第6周', weight: 75 },
  ];

  const getCurrentCycleStatus = () => {
    const dayInCycle = userData.currentCycleDay % 21;
    if (dayInCycle >= 1 && dayInCycle <= 5) return { type: '低碳日', desc: '脂肪燃烧模式' };
    if (dayInCycle >= 6 && dayInCycle <= 10) return { type: '中碳日', desc: '代谢平衡期' };
    if (dayInCycle >= 11 && dayInCycle <= 15) return { type: '高碳日', desc: '能量补充期' };
    return { type: '恢复日', desc: '身心调整期' };
  };

  const cycleStatus = getCurrentCycleStatus();
  const daysUntilReport = 21 - (userData.currentCycleDay % 21);

  return (
    <div className="h-full overflow-y-auto bg-[#fafaf9]">
      {/* 顶部留白 */}
      <div className="h-6" />

      <div className="px-6 space-y-8 pb-6">
        {/* 标题区 - 极简 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center pt-4"
        >
          <h1 className="text-2xl font-light text-[#2c2c2c] tracking-[0.3em] mb-2">
            健康管理
          </h1>
          <div className="w-16 h-px bg-[#2c2c2c] mx-auto mb-3" />
          <p className="text-xs text-[#757575] tracking-wider font-light">
            {new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </motion.div>

        {/* 今日状态 - 宋式卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card sx={{ bgcolor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '0.5px solid #e7e5e4', borderRadius: '2px' }}>
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <p className="text-xs text-[#757575] tracking-[0.2em] mb-4 font-light">今日类型</p>
                <h2 className="text-3xl font-light text-[#2c2c2c] tracking-[0.15em] mb-2">
                  {cycleStatus.type}
                </h2>
                <div className="w-12 h-px bg-[#d4d4d4] mx-auto my-3" />
                <p className="text-sm text-[#757575] tracking-wide font-light">{cycleStatus.desc}</p>
              </div>

              <div className="flex justify-center items-center gap-12 pt-4">
                <div className="text-center">
                  <p className="text-xs text-[#a8a8a8] mb-2 tracking-wider">循环日</p>
                  <p className="text-4xl font-light text-[#2c2c2c]">{userData.currentCycleDay % 21 || 21}</p>
                </div>
                <div className="w-px h-12 bg-[#e7e5e4]" />
                <div className="text-center">
                  <p className="text-xs text-[#a8a8a8] mb-2 tracking-wider">已完成</p>
                  <p className="text-4xl font-light text-[#2c2c2c]">{userData.cycleCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 核心指标 - 四宫格 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 gap-4"
        >
          {/* BMI */}
          <Card sx={{ bgcolor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '0.5px solid #e7e5e4', borderRadius: '2px' }}>
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full border border-[#e7e5e4] flex items-center justify-center mb-3">
                  <Activity size={20} strokeWidth={1.5} className="text-[#4a4a4a]" />
                </div>
                <p className="text-xs text-[#a8a8a8] tracking-wider mb-2 font-light">BMI</p>
                <p className="text-3xl font-light text-[#2c2c2c] mb-1">{bmi}</p>
                <p className="text-[0.625rem] text-[#a8a8a8] tracking-wide">18.5 - 24</p>
              </div>
            </CardContent>
          </Card>

          {/* 体重 */}
          <Card sx={{ bgcolor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '0.5px solid #e7e5e4', borderRadius: '2px' }}>
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full border border-[#e7e5e4] flex items-center justify-center mb-3">
                  <TrendingDown size={20} strokeWidth={1.5} className="text-[#4a4a4a]" />
                </div>
                <p className="text-xs text-[#a8a8a8] tracking-wider mb-2 font-light">体重</p>
                <p className="text-3xl font-light text-[#2c2c2c] mb-1">{userData.weight}<span className="text-lg">kg</span></p>
                <p className="text-[0.625rem] text-[#a8a8a8] tracking-wide">目标 {userData.targetWeight}kg</p>
              </div>
            </CardContent>
          </Card>

          {/* 减脂 */}
          <Card sx={{ bgcolor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '0.5px solid #e7e5e4', borderRadius: '2px' }}>
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full border border-[#e7e5e4] flex items-center justify-center mb-3">
                  <Target size={20} strokeWidth={1.5} className="text-[#4a4a4a]" />
                </div>
                <p className="text-xs text-[#a8a8a8] tracking-wider mb-2 font-light">已减</p>
                <p className="text-3xl font-light text-[#2c2c2c] mb-1">{totalLoss.toFixed(1)}<span className="text-lg">kg</span></p>
                <p className="text-[0.625rem] text-[#a8a8a8] tracking-wide">余 {remainingLoss.toFixed(1)}kg</p>
              </div>
            </CardContent>
          </Card>

          {/* 步数 */}
          <Card sx={{ bgcolor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '0.5px solid #e7e5e4', borderRadius: '2px' }}>
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full border border-[#e7e5e4] flex items-center justify-center mb-3">
                  <Droplets size={20} strokeWidth={1.5} className="text-[#4a4a4a]" />
                </div>
                <p className="text-xs text-[#a8a8a8] tracking-wider mb-2 font-light">步数</p>
                <p className="text-3xl font-light text-[#2c2c2c] mb-1">{(userData.steps / 1000).toFixed(1)}<span className="text-lg">k</span></p>
                <p className="text-[0.625rem] text-[#a8a8a8] tracking-wide">目标 10k</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 进度展示 - 极简风格 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card sx={{ bgcolor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '0.5px solid #e7e5e4', borderRadius: '2px' }}>
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <p className="text-xs text-[#757575] tracking-[0.2em] mb-2 font-light">整体进度</p>
                <p className="text-5xl font-light text-[#2c2c2c] tracking-wider">{progressPercent}<span className="text-2xl">%</span></p>
              </div>

              <div className="relative mb-6">
                <div className="w-full h-px bg-[#e7e5e4] mb-1">
                  <motion.div
                    className="h-px bg-[#2c2c2c]"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                  />
                </div>
                <div className="flex justify-between text-[0.625rem] text-[#a8a8a8] tracking-wide">
                  <span>{userData.startWeight}kg</span>
                  <span>{userData.weight}kg</span>
                  <span>{userData.targetWeight}kg</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#f5f5f4]">
                <div className="text-center">
                  <p className="text-[0.625rem] text-[#a8a8a8] tracking-wider mb-1">起始</p>
                  <p className="text-lg font-light text-[#4a4a4a]">{userData.startWeight}</p>
                </div>
                <div className="text-center">
                  <p className="text-[0.625rem] text-[#a8a8a8] tracking-wider mb-1">当前</p>
                  <p className="text-lg font-light text-[#2c2c2c]">{userData.weight}</p>
                </div>
                <div className="text-center">
                  <p className="text-[0.625rem] text-[#a8a8a8] tracking-wider mb-1">目标</p>
                  <p className="text-lg font-light text-[#4a4a4a]">{userData.targetWeight}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 体重趋势 - 水墨图表 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card sx={{ bgcolor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '0.5px solid #e7e5e4', borderRadius: '2px' }}>
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <p className="text-xs text-[#757575] tracking-[0.2em] font-light">体重趋势</p>
                <div className="w-12 h-px bg-[#d4d4d4] mx-auto mt-3" />
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={weightData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: '#a8a8a8' }}
                    axisLine={{ stroke: '#e7e5e4' }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[60, 85]}
                    tick={{ fontSize: 11, fill: '#a8a8a8' }}
                    axisLine={{ stroke: '#e7e5e4' }}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '0.5px solid #e7e5e4',
                      borderRadius: '2px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#2c2c2c"
                    strokeWidth={1.5}
                    dot={{ fill: '#2c2c2c', r: 3, strokeWidth: 0 }}
                    activeDot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* 训练计划 - 列表式 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card sx={{ bgcolor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '0.5px solid #e7e5e4', borderRadius: '2px' }}>
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <p className="text-xs text-[#757575] tracking-[0.2em] font-light">本周训练</p>
                <div className="w-12 h-px bg-[#d4d4d4] mx-auto mt-3" />
              </div>
              <div className="space-y-3">
                {[
                  { day: '周一', type: '力量训练', completed: true },
                  { day: '周二', type: '有氧运动', completed: true },
                  { day: '周三', type: '休息恢复', completed: true },
                  { day: '周四', type: '力量训练', completed: false },
                  { day: '周五', type: '有氧运动', completed: false },
                  { day: '周六', type: 'HIIT训练', completed: false },
                  { day: '周日', type: '休息恢复', completed: false },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.6 + index * 0.05 }}
                    className={`flex items-center justify-between py-3 px-4 border-b border-[#f5f5f4] last:border-0 ${
                      item.completed ? 'opacity-60' : ''
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                        item.completed ? 'border-[#2c2c2c] bg-[#2c2c2c]' : 'border-[#d4d4d4]'
                      }`}>
                        {item.completed && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <p className="text-xs text-[#2c2c2c] tracking-wide">{item.day}</p>
                        <p className="text-[0.625rem] text-[#a8a8a8] tracking-wider">{item.type}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 底部留白 */}
        <div className="h-4" />
      </div>
    </div>
  );
}
