// 在 MealPlans.tsx 原有的代码基础上，加入 useRef 和状态
import { useRef } from 'react'; // 记得在顶部 import 引入

// ... 在组件内部增加：
const fileInputRef = useRef<HTMLInputElement>(null);
const [isAnalyzing, setIsAnalyzing] = useState(false);
const [aiResult, setAiResult] = useState<{food: string, carbs: number, protein: number, fat: number} | null>(null);

const handleFileChange = (e: any) => {
  if (e.target.files && e.target.files.length > 0) {
    setIsAnalyzing(true);
    // 模拟调用 AI 接口的延迟
    setTimeout(() => {
      setIsAnalyzing(false);
      setAiResult({ food: '减脂沙拉配香煎鸡胸肉', carbs: 15, protein: 35, fat: 12 });
    }, 2000);
  }
};

// ... 然后将原来的【拍照解析神仙功能 Card】替换为：
<Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.02)', borderRadius: '12px' }}>
  <CardContent className="p-4 flex flex-col gap-3">
    <div className="flex justify-between items-center">
      <div>
        <p className="text-sm font-bold text-[#2c2c2c] mb-1 flex items-center gap-2"><Camera size={16}/> 拍照解析</p>
        <p className="text-[10px] text-gray-400">上传食物照片，AI 自动估算营养</p>
      </div>
      <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
      <Button 
        variant="outlined" size="small" 
        sx={{ borderColor: '#e0e0e0', color: '#2c2c2c' }} 
        startIcon={<Camera size={14}/>}
        onClick={() => fileInputRef.current?.click()}
        disabled={isAnalyzing}
      >
        {isAnalyzing ? '解析中...' : '拍照'}
      </Button>
    </div>
    
    {aiResult && (
      <div className="mt-2 p-3 bg-green-50 rounded-lg border border-green-100">
        <p className="text-xs text-green-700 font-bold mb-1">✅ AI 识别成功：{aiResult.food}</p>
        <p className="text-[10px] text-green-600">
          已自动记录：碳水 {aiResult.carbs}g | 蛋白质 {aiResult.protein}g | 脂肪 {aiResult.fat}g
        </p>
      </div>
    )}
  </CardContent>
</Card>
