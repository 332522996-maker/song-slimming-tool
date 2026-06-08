import { useState, useEffect } from 'react';
import { Card, CardContent, Button, Dialog, DialogContent, Typography } from '@mui/material';
import { Camera, Wheat, Beef, Droplet, Flame, AlertTriangle } from 'lucide-react';

const REGIONAL_MEALS = {
  'east': {
    breakfast: '阳春清汤面(控量) + 菠菜煎双蛋',
    lunch: '白斩鸡(去皮) + 蒜蓉炒菜心 + 糙米饭',
    dinner: '清蒸海鲈鱼 + 凉拌木耳'
  },
  'south': {
    breakfast: '生滚鱼片粥(少米) + 水煮蛋',
    lunch: '白灼虾 + 蚝油生菜 + 蒸番薯',
    dinner: '清炖排骨汤(去油) + 蒜香空心菜'
  },
  'north': {
    breakfast: '杂粮煎饼(少酱无脆饼) + 无糖豆浆',
    lunch: '酱牛肉 + 凉拌黄瓜 + 杂面馒头(半个)',
    dinner: '清炒西葫芦鸡蛋 + 豆腐脑(咸干)'
  },
  'default': {
    breakfast: '黑咖啡 + 煎蛋配半个牛油果',
    lunch: '香煎三文鱼排 + 蒜香西兰花',
    dinner: '清蒸鸡胸肉 + 炒青菜'
  }
};

export function MealPlans() {
  const [profile, setProfile] = useState({ weight: 75, region: 'east' });
  const [showPanic, setShowPanic] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      const local = localStorage.getItem('user_data_mock');
      if (local) setProfile(JSON.parse(local));
    };
    handleUpdate();
    window.addEventListener('user_data_updated', handleUpdate);
    return () => window.removeEventListener('user_data_updated', handleUpdate);
  }, []);

  const meals = REGIONAL_MEALS[profile.region as keyof typeof REGIONAL_MEALS] || REGIONAL_MEALS['default'];

  return (
    <div className="h-full overflow-y-auto bg-[#fafaf9] p-4 space-y-4 pb-24">
      <div className="pt-4 pb-2">
        <h1 className="text-xl font-serif text-[#2c2c2c] tracking-widest mb-1">饮食食谱</h1>
        <p className="text-xs text-gray-400">科学饮食，健康减脂</p>
      </div>

      {/* 拍照解析神仙功能 */}
      <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.02)', borderRadius: '12px' }}>
        <CardContent className="p-4 flex justify-between items-center">
          <div>
            <p className="text-sm font-bold text-[#2c2c2c] mb-1 flex items-center gap-2"><Camera size={16}/> 拍照解析</p>
            <p className="text-[10px] text-gray-400">上传食物照片，AI 为你分析营养成分并自动打卡</p>
          </div>
          <Button variant="outlined" size="small" sx={{ borderColor: '#e0e0e0', color: '#2c2c2c' }} startIcon={<Camera size={14}/>}>拍照</Button>
        </CardContent>
      </Card>

      {/* 动态营养素计算 */}
      <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.02)', borderRadius: '12px' }}>
        <CardContent className="p-5 text-center">
          <p className="text-xs text-gray-400 mb-4 tracking-widest">每日营养总计 (基于 {profile.weight}kg)</p>
          <div className="grid grid-cols-4 divide-x divide-gray-100 text-center">
            <div><Wheat size={18} className="mx-auto text-amber-600 mb-2" /><p className="text-sm font-bold">{Math.round(profile.weight * 1.6)}g</p><p className="text-[10px] text-gray-400">碳水</p></div>
            <div><Beef size={18} className="mx-auto text-rose-500 mb-2" /><p className="text-sm font-bold">{Math.round(profile.weight * 1.2)}g</p><p className="text-[10px] text-gray-400">蛋白质</p></div>
            <div><Droplet size={18} className="mx-auto text-yellow-500 mb-2" /><p className="text-sm font-bold">{Math.round(profile.weight * 0.6)}g</p><p className="text-[10px] text-gray-400">脂肪</p></div>
            <div><Flame size={18} className="mx-auto text-blue-500 mb-2" /><p className="text-sm font-bold">{Math.round(profile.weight * 20)}</p><p className="text-[10px] text-gray-400">卡路里</p></div>
          </div>
        </CardContent>
      </Card>

      {/* 地区定制化食谱 */}
      <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.02)', borderRadius: '12px' }}>
        <CardContent className="p-5">
          <p className="text-xs text-gray-400 tracking-widest mb-4">今日推荐食谱 (已匹配地区饮食习惯)</p>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex justify-between items-center mb-2"><span className="text-sm font-medium">早餐</span><span className="text-[10px] text-gray-400">320 卡</span></div>
              <p className="text-xs text-[#2c2c2c] mb-2">{meals.breakfast}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex justify-between items-center mb-2"><span className="text-sm font-medium">午餐</span><span className="text-[10px] text-gray-400">450 卡</span></div>
              <p className="text-xs text-[#2c2c2c] mb-2">{meals.lunch}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex justify-between items-center mb-2"><span className="text-sm font-medium">晚餐</span><span className="text-[10px] text-gray-400">280 卡</span></div>
              <p className="text-xs text-[#2c2c2c] mb-2">{meals.dinner}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 进化心理学防暴食组件 */}
      <div className="pt-4 pb-8">
        <Button 
          fullWidth variant="outlined" color="error" 
          startIcon={<AlertTriangle size={16}/>}
          onClick={() => setShowPanic(true)}
          sx={{ py: 1.5, borderRadius: '12px', borderStyle: 'dashed' }}
        >
          深夜想点外卖？点击开启紧急心理援助
        </Button>
      </div>

      <Dialog open={showPanic} onClose={() => setShowPanic(false)} PaperProps={{ sx: { borderRadius: '16px', p: 1 }}}>
        <DialogContent className="text-center">
          <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4"><AlertTriangle size={24}/></div>
          <Typography variant="h6" className="font-serif font-bold text-[#2c2c2c] mb-2">这不是你的错</Typography>
          <Typography variant="body2" className="text-gray-500 leading-relaxed mb-6 text-left">
            从进化心理学（Evolutionary Psychology）的角度看：你现在极度渴望高糖高脂，是因为你的远古基因误以为环境正在发生饥荒。<br/><br/>
            你的大脑在拼命保护你，这是生存本能，而不是你意志力薄弱。<br/><br/>
            深呼吸 3 次。喝一杯温水或黑咖啡。告诉你的大脑：“食物很充足，我不需要囤积脂肪越冬。” 实在想吃，我们留到明天高碳日光明正大地吃。
          </Typography>
          <Button fullWidth variant="contained" sx={{ bgcolor: '#2c2c2c' }} onClick={() => setShowPanic(false)}>我冷静下来了，去睡觉</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
