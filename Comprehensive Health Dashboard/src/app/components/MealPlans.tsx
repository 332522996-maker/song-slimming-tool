import { useState, useEffect } from 'react';
import { Card, CardContent } from '@mui/material';
import { Wheat, Beef, Droplet, Flame } from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';

export function MealPlans() {
  // 默认演示数据，和 Profile 页面的未登录状态保持一致
  const DEMO_PROFILE = { weight: 75, height: 170 };
  const [profile, setProfile] = useState<any>(DEMO_PROFILE);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // 如果已登录，去拉取真实数据
        try {
          const snap = await getDoc(doc(db, 'users', currentUser.uid));
          if (snap.exists()) {
            setProfile(snap.data());
          }
        } catch (e) {
          console.error("数据拉取失败");
        }
      } else {
        // 没登录就退回演示数据
        setProfile(DEMO_PROFILE);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="h-full overflow-y-auto bg-[#fafaf9] p-6 space-y-5 pb-20">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-xl font-serif text-[#2c2c2c] tracking-widest">智能食谱</h1>
      </div>

      {/* 顶部目标营养素卡片 */}
      <Card sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)', borderRadius: '12px' }}>
        <CardContent className="p-5 text-center">
          <p className="text-xs text-gray-400 mb-4 tracking-widest">根据体重 ({profile.weight}kg) 定制的今日摄入</p>
          <div className="grid grid-cols-4 divide-x divide-gray-100 text-center">
            <div><Wheat size={18} className="mx-auto text-amber-600 mb-2" /><p className="text-sm font-bold text-[#2c2c2c]">120g</p><p className="text-[10px] text-gray-400">碳水</p></div>
            <div><Beef size={18} className="mx-auto text-rose-500 mb-2" /><p className="text-sm font-bold text-[#2c2c2c]">95g</p><p className="text-[10px] text-gray-400">蛋白质</p></div>
            <div><Droplet size={18} className="mx-auto text-yellow-500 mb-2" /><p className="text-sm font-bold text-[#2c2c2c]">45g</p><p className="text-[10px] text-gray-400">脂肪</p></div>
            <div><Flame size={18} className="mx-auto text-blue-500 mb-2" /><p className="text-sm font-bold text-[#2c2c2c]">1500</p><p className="text-[10px] text-gray-400">大卡</p></div>
          </div>
        </CardContent>
      </Card>

      {/* 推荐菜品卡片 */}
      <Card sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)', borderRadius: '12px' }}>
        <CardContent>
          <p className="text-sm font-bold mb-4">今日推荐菜品</p>
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-lg text-sm">早餐：黑咖啡 + 菠菜煎双蛋配半个牛油果</div>
            <div className="p-3 bg-gray-50 rounded-lg text-sm">午餐：香煎三文鱼排 + 蒜香西兰花</div>
            <div className="p-3 bg-gray-50 rounded-lg text-sm">晚餐：清蒸海鲈鱼 + 炒青菜</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
