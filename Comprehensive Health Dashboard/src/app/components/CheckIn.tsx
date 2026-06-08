import { useState, useEffect } from 'react';
import { Card, CardContent, Button, Grid, Checkbox, FormControlLabel } from '@mui/material';
import { Flame, Trophy, Award, CheckCircle2, Dumbbell, Utensils } from 'lucide-react';

export function CheckIn() {
  const [profile, setProfile] = useState<any>(null);
  const [todayType, setTodayType] = useState('高碳日');
  
  // 打卡状态管理
  const [dietChecked, setDietChecked] = useState(false);
  const [exerciseChecked, setExerciseChecked] = useState(false);
  
  // 积分与成就系统状态（数据同步本地缓存）
  const [stats, setStats] = useState({
    streak: 0,
    points: 0,
    totalCount: 0,
  });

  useEffect(() => {
    // 1. 读取档案数据
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setProfile(parsed);

      // 2. 算日子（保持与仪表盘绝对同步）
      const start = new Date(parsed.startDate);
      start.setHours(0,0,0,0);
      const today = new Date();
      today.setHours(0,0,0,0);
      
      const diffDays = Math.max(0, Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
      const cycleTypes = ['高碳日', '中碳日', '低碳日'];
      setTodayType(cycleTypes[diffDays % 3]);
    }

    // 3. 读取历史打卡成就数据
    const savedStats = localStorage.getItem('checkInStats');
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }

    // 4. 检查今天是否已经打过卡
    const todayStr = new Date().toISOString().split('T')[0];
    const dietStatus = localStorage.getItem(`diet_${todayStr}`) === 'true';
    const exeStatus = localStorage.getItem(`exe_${todayStr}`) === 'true';
    setDietChecked(dietStatus);
    setExerciseChecked(exeStatus);
  }, []);

  // 执行打卡核心逻辑
  const handleToggleCheck = (type: 'diet' | 'exe') => {
    const todayStr = new Date().toISOString().split('T')[0];
    let newDiet = dietChecked;
    let newExe = exerciseChecked;

    if (type === 'diet') {
      newDiet = !dietChecked;
      setDietChecked(newDiet);
      localStorage.setItem(`diet_${todayStr}`, String(newDiet));
    } else {
      newExe = !exerciseChecked;
      setExerciseChecked(newExe);
      localStorage.setItem(`exe_${todayStr}`, String(newExe));
    }

    // 动态计算增减的积分和次数
    const isActionChecked = type === 'diet' ? newDiet : newExe;
    let pointsBonus = isActionChecked ? 10 : -10; // 打卡+10分，取消-10分
    let countBonus = isActionChecked ? 1 : -1;

    const updatedStats = {
      streak: isActionChecked && stats.streak === 0 ? 1 : stats.streak, // 简化连续天数逻辑
      points: Math.max(0, stats.points + pointsBonus),
      totalCount: Math.max(0, stats.totalCount + countBonus)
    };

    setStats(updatedStats);
    localStorage.setItem('checkInStats', JSON.stringify(updatedStats));
  };

  if (!profile) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-[#fafaf9] text-[#757575]">
        <p className="text-sm tracking-widest">请先前往「我的」完成登录与基础配置</p>
      </div>
    );
  }

  // 根据今天不同的循环日子，动态输出当天的定制化任务指南
  const getTodayTasks = () => {
    switch (todayType) {
      case '高碳日':
        return {
          dietTask: '补充优质复合碳水（如意面、燕麦饭），确保肌肉糖原充盈。',
          exeTask: '安排力量大重量突破训练，高效利用碳水能量冲峰。'
        };
      case '中碳日':
        return {
          dietTask: '标准控碳饮食，主食分量减半，重点保证每餐高质量蛋白质摄入。',
          exeTask: '中等强度运动（如抗阻训练抗初老 + 20分钟有氧慢跑）。'
        };
      case '低碳日':
      default:
        return {
          dietTask: '严格切断几乎所有精制主食，多补充绿叶蔬菜与优质脂肪。',
          exeTask: '纯刷脂有氧日，安排 40-50 分钟慢跑或椭圆机，全面激活脂肪燃烧。'
        };
    }
  };

  const tasks = getTodayTasks();

  return (
    <div className="h-full overflow-y-auto bg-[#fafaf9] p-6 space-y-4 pb-20">
      
      {/* 顶部：今日状态面板 */}
      <Card sx={{ bgcolor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '0.5px solid #e7e5e4', textAlign: 'center', py: 3 }}>
        <CardContent>
          <div className="flex justify-center items-center gap-2 text-amber-600 mb-1">
            <Award size={18} />
            <span className="text-xs tracking-wider font-medium">今日标准化打卡 SOP</span>
          </div>
          <h1 className="text-3xl font-serif text-[#2c2c2c] mb-1">{todayType}</h1>
          <p className="text-xs text-gray-400">系统已根据您的计划起始日期自动锁定今日方案</p>
        </CardContent>
      </Card>

      {/* 核心数据激励看板 */}
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Card sx={{ bgcolor: '#ffffff', border: '0.5px solid #e7e5e4', textAlign: 'center', boxShadow: 'none' }}>
            <CardContent className="p-3">
              <Flame size={16} className="mx-auto text-orange-500 mb-1" />
              <p className="text-[10px] text-gray-400">连续天数</p>
              <p className="text-lg font-bold text-[#2c2c2c]">{stats.streak} 天</p>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card sx={{ bgcolor: '#ffffff', border: '0.5px solid #e7e5e4', textAlign: 'center', boxShadow: 'none' }}>
            <CardContent className="p-3">
              <Trophy size={16} className="mx-auto text-yellow-500 mb-1" />
              <p className="text-[10px] text-gray-400">当前积分</p>
              <p className="text-lg font-bold text-[#2c2c2c]">{stats.points}</p>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card sx={{ bgcolor: '#ffffff', border: '0.5px solid #e7e5e4', textAlign: 'center', boxShadow: 'none' }}>
            <CardContent className="p-3">
              <CheckCircle2 size={16} className="mx-auto text-green-500 mb-1" />
              <p className="text-[10px] text-gray-400">总打卡数</p>
              <p className="text-lg font-bold text-[#2c2c2c]">{stats.totalCount} 次</p>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 动态互动打卡任务卡片 */}
      <Card sx={{ bgcolor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '0.5px solid #e7e5e4' }}>
        <CardContent className="p-5 space-y-4">
          <p className="text-xs text-[#757575] tracking-[0.2em] font-light border-b border-gray-100 pb-2">今日应尽合规指标</p>
          
          {/* 饮食行为打卡 */}
          <div className={`p-4 rounded-lg border transition ${dietChecked ? 'bg-green-50/40 border-green-200' : 'bg-[#fcfcfc] border-gray-100'}`}>
            <div className="flex items-start gap-3">
              <Utensils size={18} className={dietChecked ? 'text-green-600 mt-1' : 'text-gray-400 mt-1'} />
              <div className="flex-1">
                <p className={`text-sm font-bold ${dietChecked ? 'text-green-800 line-through' : 'text-[#2c2c2c]'}`}>标准化餐饮 SOP 执行</p>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{tasks.dietTask}</p>
              </div>
            </div>
            <div className="mt-3 flex justify-end">
              <Button 
                size="small" 
                variant={dietChecked ? "outlined" : "contained"}
                color={dietChecked ? "success" : "inherit"}
                onClick={() => handleToggleCheck('diet')}
                sx={dietChecked ? {} : { bgcolor: '#2c2c2c', color: '#fff', '&:hover': { bgcolor: '#000' }, fontSize: '11px' }}
              >
                {dietChecked ? '饮食已合规达标' : '确认执行饮食目标'}
              </Button>
            </div>
          </div>

          {/* 运动行为打卡 */}
          <div className={`p-4 rounded-lg border transition ${exerciseChecked ? 'bg-green-50/40 border-green-200' : 'bg-[#fcfcfc] border-gray-100'}`}>
            <div className="flex items-start gap-3">
              <Dumbbell size={18} className={exerciseChecked ? 'text-green-600 mt-1' : 'text-gray-400 mt-1'} />
              <div className="flex-1">
                <p className={`text-sm font-bold ${exerciseChecked ? 'text-green-800 line-through' : 'text-[#2c2c2c]'}`}>精准燃脂热量消耗执行</p>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{tasks.exeTask}</p>
              </div>
            </div>
            <div className="mt-3 flex justify-end">
              <Button 
                size="small" 
                variant={exerciseChecked ? "outlined" : "contained"}
                color={exerciseChecked ? "success" : "inherit"}
                onClick={() => handleToggleCheck('exe')}
                sx={exerciseChecked ? {} : { bgcolor: '#2c2c2c', color: '#fff', '&:hover': { bgcolor: '#000' }, fontSize: '11px' }}
              >
                {exerciseChecked ? '运动消耗已达标' : '确认完成今日消耗'}
              </Button>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
