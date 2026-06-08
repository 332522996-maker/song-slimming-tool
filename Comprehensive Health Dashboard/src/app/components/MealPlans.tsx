// @ts-nocheck
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@mui/material';
import { Wheat, Beef, Droplet, Flame } from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';

export function MealPlans() {
  const DEMO_PROFILE = { weight: 75, height: 170 };
  const [profile, setProfile] = useState(DEMO_PROFILE);

  useEffect(() => {
    const loadData = async (currentUser) => {
      if (currentUser) {
        if (currentUser.uid === "mock_user_123") {
          const localData = localStorage.getItem('user_data_mock');
          if (localData) setProfile(JSON.parse(localData));
        } else {
          try {
            const snap = await getDoc(doc(db, 'users', currentUser.uid));
            if (snap.exists()) setProfile(snap.data());
          } catch (e) {
            console.error(e);
          }
        }
      } else {
        setProfile(DEMO_PROFILE);
      }
    };

    // 初始加载检查
    const localMock = localStorage.getItem('mock_user');
    if (localMock) {
      loadData({ uid: "mock_user_123" });
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!localStorage.getItem('mock_user')) {
        loadData(currentUser);
      }
    });

    // 关键核心：实时监听 Profile 页面的任意数值改动事件
    const handleLocalUpdate = () => {
      const hasMock = localStorage.getItem('mock_user');
      if (hasMock) {
        loadData({ uid: "mock_user_123" });
      } else {
        loadData(auth.currentUser);
      }
    };

    window.addEventListener('user_data_updated', handleLocalUpdate);
    return () => {
      unsubscribe();
      window.removeEventListener('user_data_updated', handleLocalUpdate);
    };
  }, []);

  return (
    <div className="h-full overflow-y-auto bg-[#fafaf9] p-6 space-y-5 pb-20">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-xl font-serif text-[#2c2c2c] tracking-widest">智能食谱</h1>
      </div>

      <Card sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)', borderRadius: '12px' }}>
        <CardContent className="p-5 text-center">
          <p className="text-xs text-gray-400 mb-4 tracking-widest">根据动态体重 ({profile.weight}kg) 实时定制的今日摄入</p>
          <div className="grid grid-cols-4 divide-x divide-gray-100 text-center">
            <div><Wheat size={18} className="mx-auto text-amber-600 mb-2" /><p className="text-sm font-bold text-[#2c2c2c]">{Math.round(profile.weight * 1.6)}g</p><p className="text-[10px] text-gray-400">碳水</p></div>
            <div><Beef size={18} className="mx-auto text-rose-500 mb-2" /><p className="text-sm font-bold text-[#2c2c2c]">{Math.round(profile.weight * 1.2)}g</p><p className="text-[10px] text-gray-400">蛋白质</p></div>
            <div><Droplet size={18} className="mx-auto text-yellow-500 mb-2" /><p className="text-sm font-bold text-[#2c2c2c]">{Math.round(profile.weight * 0.6)}g</p><p className="text-[10px] text-gray-400">脂肪</p></div>
            <div><Flame size={18} className="mx-auto text-blue-500 mb-2" /><p className="text-sm font-bold text-[#2c2c2c]">{Math.round(profile.weight * 20)}</p><p className="text-[10px] text-gray-400">大卡</p></div>
          </div>
        </CardContent>
      </Card>

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
