import { useState } from 'react';
import { Card, CardContent, Button, Tabs, Tab, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Camera, BookOpen, Lightbulb, ChefHat, Apple, Beef, Wheat, Droplets } from 'lucide-react';

interface MealPlan {
  type: 'low' | 'medium' | 'high' | 'recovery';
  label: string;
  color: string;
  meals: {
    breakfast: { name: string; carbs: number; protein: number; fat: number; calories: number; };
    lunch: { name: string; carbs: number; protein: number; fat: number; calories: number; };
    dinner: { name: string; carbs: number; protein: number; fat: number; calories: number; };
    snacks: { name: string; carbs: number; protein: number; fat: number; calories: number; };
  };
  philosophy: string;
  benefits: string[];
  tips: string[];
}

const MEAL_PLANS: MealPlan[] = [
  {
    type: 'low',
    label: '低碳日',
    color: 'text-blue-600',
    meals: {
      breakfast: { name: '煎蛋配牛油果', carbs: 15, protein: 25, fat: 18, calories: 320 },
      lunch: { name: '烤鸡胸肉沙拉', carbs: 20, protein: 35, fat: 12, calories: 340 },
      dinner: { name: '清蒸鱼配西兰花', carbs: 10, protein: 30, fat: 10, calories: 260 },
      snacks: { name: '坚果一小把', carbs: 8, protein: 6, fat: 14, calories: 180 },
    },
    philosophy: '低碳日的核心理念是通过限制碳水化合物摄入，促使身体进入脂肪燃烧模式。这一天我们将碳水控制在50-100g之间，同时保证充足的蛋白质摄入来维持肌肉量。',
    benefits: [
      '促进脂肪分解和利用',
      '提高胰岛素敏感性',
      '加速脂肪代谢',
      '保持肌肉量不流失',
    ],
    tips: [
      '多喝水，帮助代谢',
      '选择优质蛋白质来源',
      '增加绿色蔬菜摄入',
      '避免加工食品和糖分',
    ],
  },
  {
    type: 'medium',
    label: '中碳日',
    color: 'text-green-600',
    meals: {
      breakfast: { name: '燕麦粥配水果', carbs: 45, protein: 15, fat: 8, calories: 320 },
      lunch: { name: '糙米饭配鸡肉', carbs: 50, protein: 30, fat: 10, calories: 420 },
      dinner: { name: '全麦意面配虾仁', carbs: 40, protein: 25, fat: 12, calories: 380 },
      snacks: { name: '希腊酸奶', carbs: 15, protein: 10, fat: 5, calories: 150 },
    },
    philosophy: '中碳日是一个过渡阶段，适度增加碳水化合物（100-150g）为身体补充能量，同时继续保持脂肪燃烧状态。这样的设计能让代谢保持活跃，避免身体适应低碳状态。',
    benefits: [
      '补充肝糖储备',
      '维持代谢率',
      '提供训练能量',
      '平衡激素水平',
    ],
    tips: [
      '选择复杂碳水化合物',
      '避免精制糖和白面',
      '碳水集中在训练前后',
      '保持蛋白质摄入稳定',
    ],
  },
  {
    type: 'high',
    label: '高碳日',
    color: 'text-orange-600',
    meals: {
      breakfast: { name: '全麦面包配鸡蛋', carbs: 60, protein: 20, fat: 10, calories: 420 },
      lunch: { name: '米饭配瘦肉蔬菜', carbs: 80, protein: 30, fat: 8, calories: 520 },
      dinner: { name: '红薯配鸡胸肉', carbs: 70, protein: 35, fat: 6, calories: 480 },
      snacks: { name: '香蕉配花生酱', carbs: 35, protein: 8, fat: 10, calories: 260 },
    },
    philosophy: '高碳日（200-300g碳水）是为了给身体充分补充糖原，修复肌肉，提升代谢。这一天我们适当降低脂肪摄入，让碳水化合物成为主要能量来源，同时刺激瘦素分泌，防止代谢下降。',
    benefits: [
      '充分恢复肌糖原',
      '刺激瘦素分泌',
      '提升代谢率',
      '改善训练表现',
      '心理满足感',
    ],
    tips: [
      '优先选择天然碳水',
      '配合力量训练',
      '降低脂肪摄入',
      '保持蛋白质适中',
    ],
  },
  {
    type: 'recovery',
    label: '恢复日',
    color: 'text-purple-600',
    meals: {
      breakfast: { name: '自由选择', carbs: 50, protein: 20, fat: 15, calories: 420 },
      lunch: { name: '自由选择', carbs: 60, protein: 25, fat: 18, calories: 520 },
      dinner: { name: '自由选择', carbs: 55, protein: 28, fat: 16, calories: 480 },
      snacks: { name: '自由选择', carbs: 30, protein: 10, fat: 12, calories: 260 },
    },
    philosophy: '恢复日是碳循环中的"自由日"，允许更灵活的饮食选择。这一阶段的设计基于心理学和行为学原理，通过适度放松饮食限制，提高长期坚持的可能性，避免过度节食导致的心理压力和反弹。',
    benefits: [
      '心理压力释放',
      '社交生活平衡',
      '代谢灵活性',
      '长期可持续性',
    ],
    tips: [
      '享受美食但适度',
      '保持正念饮食',
      '不要过度补偿',
      '记录身体反应',
    ],
  },
];

export function MealPlans() {
  const [activeTab, setActiveTab] = useState(0);
  const [showPhotoAnalysis, setShowPhotoAnalysis] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const currentPlan = MEAL_PLANS[activeTab];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const totalNutrition = {
    carbs: currentPlan.meals.breakfast.carbs + currentPlan.meals.lunch.carbs + currentPlan.meals.dinner.carbs + currentPlan.meals.snacks.carbs,
    protein: currentPlan.meals.breakfast.protein + currentPlan.meals.lunch.protein + currentPlan.meals.dinner.protein + currentPlan.meals.snacks.protein,
    fat: currentPlan.meals.breakfast.fat + currentPlan.meals.lunch.fat + currentPlan.meals.dinner.fat + currentPlan.meals.snacks.fat,
    calories: currentPlan.meals.breakfast.calories + currentPlan.meals.lunch.calories + currentPlan.meals.dinner.calories + currentPlan.meals.snacks.calories,
  };

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">饮食食谱</h1>
        <p className="text-sm text-gray-500 mt-1">科学饮食，健康减脂</p>
      </div>

      {/* Photo Analysis Button */}
      <Card className="shadow-sm bg-gradient-to-r from-blue-500 to-purple-500 text-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold mb-1">📸 拍照解析</p>
              <p className="text-xs opacity-90">上传食物照片，AI 为你分析营养成分</p>
            </div>
            <Button
              variant="contained"
              startIcon={<Camera />}
              onClick={() => setShowPhotoAnalysis(true)}
              sx={{ bgcolor: 'white', color: '#3b82f6', '&:hover': { bgcolor: '#f3f4f6' } }}
            >
              拍照
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card className="shadow-sm">
        <Tabs
          value={activeTab}
          onChange={(_, value) => setActiveTab(value)}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          {MEAL_PLANS.map((plan, index) => (
            <Tab key={index} label={plan.label} />
          ))}
        </Tabs>
      </Card>

      {/* Daily Nutrition Summary */}
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <p className="text-sm font-medium text-gray-700 mb-3">每日营养总计</p>
          <div className="grid grid-cols-4 gap-3">
            <div className="text-center">
              <Wheat className="text-orange-500 mx-auto mb-1" size={24} />
              <p className="text-lg font-bold text-gray-900">{totalNutrition.carbs}g</p>
              <p className="text-xs text-gray-500">碳水</p>
            </div>
            <div className="text-center">
              <Beef className="text-red-500 mx-auto mb-1" size={24} />
              <p className="text-lg font-bold text-gray-900">{totalNutrition.protein}g</p>
              <p className="text-xs text-gray-500">蛋白质</p>
            </div>
            <div className="text-center">
              <Droplets className="text-yellow-500 mx-auto mb-1" size={24} />
              <p className="text-lg font-bold text-gray-900">{totalNutrition.fat}g</p>
              <p className="text-xs text-gray-500">脂肪</p>
            </div>
            <div className="text-center">
              <Lightbulb className="text-blue-500 mx-auto mb-1" size={24} />
              <p className="text-lg font-bold text-gray-900">{totalNutrition.calories}</p>
              <p className="text-xs text-gray-500">卡路里</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Philosophy */}
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen size={18} className={currentPlan.color} />
            <p className="text-sm font-medium text-gray-700">为什么这样吃？</p>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">{currentPlan.philosophy}</p>
        </CardContent>
      </Card>

      {/* Meals */}
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <ChefHat size={18} className={currentPlan.color} />
            <p className="text-sm font-medium text-gray-700">今日推荐食谱</p>
          </div>
          <div className="space-y-3">
            {Object.entries(currentPlan.meals).map(([mealType, meal]) => (
              <div key={mealType} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-gray-900">
                    {mealType === 'breakfast' && '早餐'}
                    {mealType === 'lunch' && '午餐'}
                    {mealType === 'dinner' && '晚餐'}
                    {mealType === 'snacks' && '加餐'}
                  </p>
                  <p className="text-sm text-gray-500">{meal.calories} 卡</p>
                </div>
                <p className="text-sm text-gray-700 mb-2">{meal.name}</p>
                <div className="flex gap-4 text-xs text-gray-500">
                  <span>碳水 {meal.carbs}g</span>
                  <span>蛋白 {meal.protein}g</span>
                  <span>脂肪 {meal.fat}g</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Benefits */}
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Apple size={18} className={currentPlan.color} />
            <p className="text-sm font-medium text-gray-700">好处是什么？</p>
          </div>
          <div className="space-y-2">
            {currentPlan.benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <p className="text-sm text-gray-600">{benefit}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb size={18} className={currentPlan.color} />
            <p className="text-sm font-medium text-gray-700">实用建议</p>
          </div>
          <div className="space-y-2">
            {currentPlan.tips.map((tip, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="text-blue-500">💡</span>
                <p className="text-sm text-gray-600">{tip}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Photo Analysis Dialog */}
      <Dialog open={showPhotoAnalysis} onClose={() => setShowPhotoAnalysis(false)} maxWidth="sm" fullWidth>
        <DialogTitle>拍照解析食物</DialogTitle>
        <DialogContent>
          <div className="space-y-4 pt-2">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {uploadedImage ? (
                <img src={uploadedImage} alt="Uploaded food" className="max-w-full h-auto mx-auto rounded" />
              ) : (
                <div>
                  <Camera size={48} className="text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">上传食物照片</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="food-upload"
                  />
                  <label htmlFor="food-upload">
                    <Button component="span" variant="outlined">
                      选择照片
                    </Button>
                  </label>
                </div>
              )}
            </div>

            {uploadedImage && (
              <div className="bg-blue-50 p-4 rounded-lg space-y-3">
                <p className="text-sm font-medium text-gray-900">AI 分析结果：</p>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-700">📊 <strong>识别食物：</strong>烤鸡胸肉配蔬菜沙拉</p>
                  <p className="text-gray-700">🔢 <strong>估算营养：</strong></p>
                  <div className="ml-4 space-y-1 text-xs text-gray-600">
                    <p>• 热量: 约 380 卡路里</p>
                    <p>• 蛋白质: 35g</p>
                    <p>• 碳水化合物: 18g</p>
                    <p>• 脂肪: 12g</p>
                  </div>
                  <p className="text-gray-700">💡 <strong>建议：</strong></p>
                  <div className="ml-4 space-y-1 text-xs text-gray-600">
                    <p>• 适合低碳日或中碳日食用</p>
                    <p>• 蛋白质含量充足，有助于肌肉恢复</p>
                    <p>• 建议搭配一小份糙米饭增加饱腹感</p>
                    <p>• 可以增加健康脂肪如橄榄油拌菜</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setShowPhotoAnalysis(false);
            setUploadedImage(null);
          }}>
            关闭
          </Button>
          {uploadedImage && (
            <Button variant="contained" onClick={() => {
              // Save to meal log
              setShowPhotoAnalysis(false);
              setUploadedImage(null);
            }}>
              保存记录
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}
