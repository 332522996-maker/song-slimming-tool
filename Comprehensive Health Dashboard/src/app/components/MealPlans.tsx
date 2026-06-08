import { useState, useEffect } from 'react';
import { Card, CardContent, Button, Tabs, Tab } from '@mui/material';
import { Camera, Wheat, Beef, Droplet, Flame, Info, Utensils } from 'lucide-react';

export function MealPlans() {
  const [profile, setProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState(0); // 0:低碳, 1:中碳, 2:高碳, 3:恢复
  const [todayTypeIndex, setTodayTypeIndex] = useState(0);

  // 营养学数据状态
  const [macros, setMacros] = useState({ calories: 0, carbs: 0, protein: 0, fat: 0 });

  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setProfile(parsed);

      // 1. 测算今天是循环的哪一天
      const start = new Date(parsed.startDate);
      start.setHours(0, 0, 0, 0);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const diffDays = Math.max(0, Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
      
      // 循环逻辑: 0=高碳, 1=中碳, 2=低碳
      const currentCycle = diffDays % 3; 
      // 映射到 Tab 的 Index (我们设计 Tab 顺序为: 低碳0, 中碳1, 高碳2)
      const tabIndexMap = currentCycle === 0 ? 2 : (currentCycle === 1 ? 1 : 0);
      
      setTodayTypeIndex(tabIndexMap);
      setActiveTab(tabIndexMap); // 默认选中今天
      
      // 2. 初始计算营养素
      calculateMacros(parsed, tabIndexMap);
    }
  }, []);

  // 核心医学/营养学计算引擎 (BMR + TDEE)
  const calculateMacros = (user: any, tabIndex: number) => {
    // Mifflin-St Jeor 公式计算基础代谢 (BMR)
    let bmr = 10 * user.weight + 6.25 * user.height - 5 * user.age;
    bmr += user.gender === 'female' ? -161 : 5;

    // 估算日常总消耗 (TDEE) - 假设处于减脂期的中等活动量
    const tdee = bmr * 1.375;

    let targetCalories = 0;
    let carbsRatio = 0, proteinRatio = 0, fatRatio = 0;

    // 根据碳水循环阶段，动态分配热量缺口和宏量营养素比例
    if (tabIndex === 0) { // 低碳日
      targetCalories = tdee - 500; // 制造较大缺口
      carbsRatio = 0.15; proteinRatio = 0.45; fatRatio = 0.40;
    } else if (tabIndex === 1) { // 中碳日
      targetCalories = tdee - 300; // 平稳缺口
      carbsRatio = 0.35; proteinRatio = 0.40; fatRatio = 0.25;
    } else if (tabIndex === 2) { // 高碳日
      targetCalories = tdee; // 不制造缺口，补充糖原
      carbsRatio = 0.50; proteinRatio = 0.30; fatRatio = 0.20;
    }

    // 换算成具体的克数 (碳水4kcal/g, 蛋白4kcal/g, 脂肪9kcal/g)
    setMacros({
      calories: Math.round(targetCalories),
      carbs: Math.round((targetCalories * carbsRatio) / 4),
      protein: Math.round((targetCalories * proteinRatio) / 4),
      fat: Math.round((targetCalories * fatRatio) / 9),
    });
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    if (profile) calculateMacros(profile, newValue);
  };

  if (!profile) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-[#fafaf9] text-[#757575]">
        <p className="text-sm tracking-widest">请先前往「我的」完成登录与基础配置</p>
      </div>
    );
  }

  // 动态食谱与科普文案库
  const planDetails = [
    {
      type: '低碳日',
      why: '低碳日的核心理念是通过严格限制碳水化合物摄入（<50g），耗尽肝脏和肌肉中的糖原储备，迫使身体切换能量代谢模式，将顽固脂肪转化为酮体供能。今天请务必保证优质脂肪摄入以维持激素水平。',
      meals: [
        { name: '早餐：黑咖啡 + 菠菜煎双蛋配半个牛油果', cal: 320, c: 5, p: 18, f: 25 },
        { name: '午餐：香煎三文鱼排 + 蒜香西兰花 + 橄榄油沙拉', cal: 450, c: 12, p: 35, f: 28 },
        { name: '晚餐：清蒸海鲈鱼 + 炒青菜（控制烹饪油用量）', cal: 300, c: 8, p: 32, f: 15 }
      ]
    },
    {
      type: '中碳日',
      why: '中碳日是身体的平稳过渡期。适量的碳水（主要来自低GI粗粮）能维持中枢神经系统的活跃度，防止代谢受损和肌肉流失。今天是进行抗阻力训练（如举铁）的绝佳时机。',
      meals: [
        { name: '早餐：全麦面包1片 + 鸡胸肉片 + 无糖豆浆', cal: 350, c: 30, p: 25, f: 10 },
        { name: '午餐：藜麦饭（半碗） + 青椒炒牛肉 + 凉拌黄瓜', cal: 500, c: 45, p: 38, f: 18 },
        { name: '晚餐：虾仁蒸蛋 + 蒜蓉油麦菜', cal: 280, c: 10, p: 28, f: 12 }
      ]
    },
    {
      type: '高碳日',
      why: '高碳日（欺骗日）的医学意义在于：通过大量复合碳水的摄入，刺激瘦素（Leptin）分泌，恢复甲状腺激素 T3 水平，重新点燃下降的基础代谢率。今天适合安排大重量下肢训练，让碳水全部进入肌肉而非脂肪细胞。',
      meals: [
        { name: '早餐：燕麦粥（大份） + 香蕉1根 + 蛋白2个', cal: 420, c: 65, p: 15, f: 5 },
        { name: '午餐：紫薯/红薯 + 照烧鸡腿肉（去皮） + 炒菠菜', cal: 600, c: 75, p: 40, f: 15 },
        { name: '晚餐：意面（番茄肉酱） + 蔬果沙拉', cal: 550, c: 60, p: 25, f: 12 }
      ]
    }
  ];

  const currentPlan = planDetails[activeTab];

  return (
    <div className="h-full overflow-y-auto bg-[#fafaf9] p-6 space-y-5 pb-20">
      
      {/* 顶部 AI 拍照互动区 */}
      <Card sx={{ bgcolor: '#ffffff', border: '0.5px solid #e7e5e4', boxShadow: 'none' }}>
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#2c2c2c] flex items-center gap-1"><Camera size={16}/> 拍照解析</h3>
            <p className="text-xs text-gray-400 mt-1">上传食物照片，AI 为你分析营养成分</p>
          </div>
          <Button variant="outlined" size="small" sx={{ borderColor: '#e7e5e4', color: '#2c2c2c' }} startIcon={<Camera size={14} />}>拍照</Button>
        </CardContent>
      </Card>

      {/* 碳水循环选择器 */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Tabs value={activeTab} onChange={handleTabChange} variant="fullWidth" TabIndicatorProps={{ style: { backgroundColor: '#2c2c2c' } }}>
          <Tab label="低碳日" sx={{ fontSize: '13px', color: activeTab === 0 ? '#2c2c2c' : '#9e9e9e', fontWeight: activeTab === 0 ? 'bold' : 'normal' }} />
          <Tab label="中碳日" sx={{ fontSize: '13px', color: activeTab === 1 ? '#2c2c2c' : '#9e9e9e', fontWeight: activeTab === 1 ? 'bold' : 'normal' }} />
          <Tab label="高碳日" sx={{ fontSize: '13px', color: activeTab === 2 ? '#2c2c2c' : '#9e9e9e', fontWeight: activeTab === 2 ? 'bold' : 'normal' }} />
        </Tabs>
      </div>

      {/* 专属计算出的每日营养总计 */}
      <Card sx={{ bgcolor: '#ffffff', border: '0.5px solid #e7e5e4', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
        <CardContent className="p-5">
          <p className="text-xs text-[#757575] mb-4">为您量身定制的今日营养指标</p>
          <div className="grid grid-cols-4 divide-x divide-gray-100 text-center">
            <div>
              <Wheat size={18} className="mx-auto text-amber-600 mb-2" />
              <p className="text-lg font-bold text-[#2c2c2c]">{macros.carbs}g</p>
              <p className="text-[10px] text-gray-400">碳水</p>
            </div>
            <div>
              <Beef size={18} className="mx-auto text-rose-500 mb-2" />
              <p className="text-lg font-bold text-[#2c2c2c]">{macros.protein}g</p>
              <p className="text-[10px] text-gray-400">蛋白质</p>
            </div>
            <div>
              <Droplet size={18} className="mx-auto text-yellow-500 mb-2" />
              <p className="text-lg font-bold text-[#2c2c2c]">{macros.fat}g</p>
              <p className="text-[10px] text-gray-400">脂肪</p>
            </div>
            <div>
              <Flame size={18} className="mx-auto text-blue-500 mb-2" />
              <p className="text-lg font-bold text-[#2c2c2c]">{macros.calories}</p>
              <p className="text-[10px] text-gray-400">卡路里</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 营养学科普说明 */}
      <Card sx={{ bgcolor: '#fafaf9', border: '1px solid #e7e5e4', boxShadow: 'none' }}>
        <CardContent className="p-4">
          <h3 className="text-sm font-bold text-[#2c2c2c] flex items-center gap-2 mb-2"><Info size={16} className="text-blue-500"/> 为什么这样吃？</h3>
          <p className="text-xs text-gray-600 leading-relaxed text-justify">{currentPlan.why}</p>
        </CardContent>
      </Card>

      {/* 智能生成的一日三餐 */}
      <Card sx={{ bgcolor: '#ffffff', border: '0.5px solid #e7e5e4', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
        <CardContent className="p-0">
          <div className="p-4 border-b border-gray-100 flex items-center gap-2">
            <Utensils size={16} className="text-orange-500" />
            <h3 className="text-sm font-bold text-[#2c2c2c]">今日智能推荐食谱</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {currentPlan.meals.map((meal, index) => (
              <div key={index} className="p-4 hover:bg-gray-50 transition">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm font-medium text-[#2c2c2c] w-3/4">{meal.name}</p>
                  <p className="text-xs font-bold text-gray-500">{meal.cal} kcal</p>
                </div>
                <div className="flex gap-4 text-[11px] text-gray-400">
                  <span>碳水 {meal.c}g</span>
                  <span>蛋白 {meal.p}g</span>
                  <span>脂肪 {meal.f}g</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
