import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, TextField, Button, Switch, FormControlLabel, Chip } from '@mui/material';
import { Send, Bot, User, Bell, AlertCircle, Lightbulb, Heart, Brain } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Reminder {
  id: string;
  type: 'water' | 'meal' | 'exercise' | 'sleep' | 'checkin';
  message: string;
  time: string;
  enabled: boolean;
}

const QUICK_QUESTIONS = [
  '今天感觉很累，不想运动怎么办？',
  '我总是晚上想吃宵夜',
  '体重好几天没变化了',
  '如何提高训练动力？',
  '压力大时如何控制饮食？',
];

const AI_RESPONSES: Record<string, string> = {
  '今天感觉很累，不想运动怎么办？': `我理解你的感受。疲劳时，我们需要区分是身体疲劳还是心理疲劳：

**身体疲劳**（肌肉酸痛、睡眠不足）
• 选择轻度活动：散步、瑜伽、拉伸
• 这是身体需要休息的信号
• 良好的恢复也是训练的一部分

**心理疲劳**（工作压力、情绪低落）
• 尝试开始5分钟轻度运动
• 运动会释放内啡肽，改善情绪
• 完成后你往往会感觉更好

**实用技巧：**
降低门槛：今天不需要完美表现，哪怕只做一半也好。行动往往能带来动力，而非相反。记住："最难的是出门那一刻，开始后就容易了。"

如果真的很累，选择主动恢复（散步、拉伸），明天精力充沛地回归训练。`,

  '我总是晚上想吃宵夜': `晚上食欲增加是很常见的现象，有生理和心理两方面原因：

**生理原因：**
• 白天饮食不够：蛋白质或纤维不足导致饱腹感差
• 血糖波动：晚餐碳水太少或吃得太早
• 睡眠不足：会增加饥饿激素ghrelin

**心理原因：**
• 习惯性行为：看电视=吃零食的条件反射
• 情绪性进食：用食物应对压力、无聊或焦虑
• 奖励心理："辛苦一天，应该奖励自己"

**应对策略：**
1. **优化晚餐**：增加蛋白质和纤维，延长饱腹感
2. **推迟晚餐时间**：如果晚上8点饿，可以7点吃晚餐
3. **准备健康零食**：如果真的饿，选择蛋白质（希腊酸奶、鸡蛋）
4. **建立新习惯**：晚上喝花草茶、刷牙（清新口气降低食欲）
5. **识别真假饥饿**：问自己"我愿意吃西兰花吗？"不愿意=不是真饿
6. **改变环境**：不在厨房待着，找其他活动（读书、洗澡）

记住：偶尔的宵夜不会毁掉一切。关键是80%的时间做对，而非100%完美。`,

  '体重好几天没变化了': `体重平台期是减脂过程中最常见的现象，不要焦虑！让我帮你分析：

**短期波动是正常的**
体重每天可能波动0.5-2kg，受以下因素影响：
• 水分储留（高碳日、高盐、女性生理周期）
• 肠道内容物
• 肌糖原储备
• 运动后炎症反应（肌肉修复储水）

**真正的平台期**
如果2-3周体重和围度都没变化，可能是：
• 代谢适应：身体降低代谢以节省能量
• 热量漂移：不知不觉吃多了
• 训练适应：相同训练消耗热量减少

**突破策略：**
1. **重新计算热量**：体重降低后，维持热量也会降低
2. **提高NEAT**：增加日常活动，走更多路
3. **Refeed周**：一周正常吃或略高热量，重启代谢
4. **改变训练**：增加强度、调整项目
5. **关注其他指标**：
   - 围度变化（腰围、臀围）
   - 体脂率
   - 训练表现
   - 衣服松紧度
   - 精神状态

**心态调整：**
减脂不是线性的。即使体重不变，你可能在增肌减脂（身体重塑）。相信过程，坚持2-3周，身体会继续改变。

需要我帮你分析具体数据吗？`,

  '如何提高训练动力？': `动力不是等来的，而是创造出来的。让我分享一些科学有效的方法：

**1. 设定过程目标，而非结果目标**
❌ "我要减10kg"（结果导向，容易受挫）
✅ "我每周训练4次"（过程导向，可控）

**2. 利用承诺设备**
• 告诉朋友你的计划（社会压力）
• 提前预约私教课（金钱承诺）
• 晨起就换好运动服（降低反悔门槛）

**3. 习惯堆叠**
将训练绑定到固定习惯：
"每天早上喝完咖啡后→换运动服→去健身房"

**4. 追踪小胜利**
• 记录训练日志
• 庆祝进步（重量增加、次数提升）
• 拍对比照片

**5. 身份认同**
从"我要去健身"→"我是一个健身的人"
思维转变会改变行为

**6. 降低摩擦力**
• 前一晚准备好装备
• 选择离家近的健身房
• 制定具体计划（周一练什么）

**7. 社交动力**
• 找训练伙伴
• 加入社群
• 分享进展获得正反馈

**8. 重新框架**
"我必须去训练"→"我有机会变强"
从义务感转为特权感

**临时动力boost：**
• 看励志视频
• 听激昂音乐
• 回顾之前的进步照片
• 想象达成目标后的感觉

记住：专业选手也有不想训练的时候。区别在于，他们会去。行动创造动力，而非等动力来了再行动。`,

  '压力大时如何控制饮食？': `压力性进食是身体的本能反应，但我们可以用科学方法管理它：

**为什么压力让我们想吃？**
• 皮质醇升高→增加食欲，尤其是高糖高脂食物
• 大脑寻求多巴胺（快乐激素）→食物是最快的途径
• 战或逃反应→身体认为需要储备能量

**短期应对（当下策略）：**
1. **暂停技巧**：感到冲动时，等待10分钟
   - 喝一大杯水
   - 深呼吸5次（4秒吸-7秒屏-8秒呼）
   - 问自己："我真的饿吗？"

2. **健康替代**：
   - 准备低热量零食（蔬菜条、无糖口香糖）
   - 泡花草茶
   - 吃高蛋白食物（降低后续饥饿感）

3. **转移注意力**：
   - 散步10分钟
   - 打电话给朋友
   - 洗澡
   - 运动（最强的压力缓解）

**长期策略（根源解决）：**
1. **压力管理**：
   - 每日冥想10分钟
   - 渐进式肌肉放松
   - 写压力日志
   - 规律运动

2. **建立应对工具箱**：
   除了食物外的压力应对方法：
   • 创意活动（画画、音乐）
   • 社交支持
   • 大自然散步
   • 宠物互动

3. **认知重构**：
   "吃东西只会让我暂时好受，之后会更糟（罪恶感+体重增加=更大压力）"

4. **自我同情**：
   即使吃了，不要自责。自责→更大压力→更多进食（恶性循环）

**预防措施：**
• 保证充足睡眠（缺觉=压力↑）
• 规律饮食，不要过度节食
• 蛋白质和纤维充足
• 识别压力源并主动管理

需要我教你具体的放松技巧吗？`
};

export function AICounselor() {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('aiMessages');
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        role: 'assistant',
        content: '你好！我是你的AI心理健康顾问。我结合了心理学、营养学、运动科学和行为学知识，可以帮助你解决减脂过程中的各种挑战。\n\n我可以帮你：\n• 应对情绪化饮食\n• 提升训练动力\n• 克服平台期\n• 管理压力和焦虑\n• 建立健康习惯\n\n有什么我可以帮助你的吗？',
        timestamp: new Date(),
      },
    ];
  });

  const [input, setInput] = useState('');
  const [reminders, setReminders] = useState<Reminder[]>(() => {
    const saved = localStorage.getItem('reminders');
    return saved ? JSON.parse(saved) : [
      { id: '1', type: 'water', message: '该喝水了！保持水分充足', time: '09:00', enabled: true },
      { id: '2', type: 'meal', message: '午餐时间到了', time: '12:00', enabled: true },
      { id: '3', type: 'exercise', message: '今天的训练完成了吗？', time: '18:00', enabled: true },
      { id: '4', type: 'sleep', message: '准备睡觉了，明天又是活力满满的一天', time: '22:30', enabled: true },
      { id: '5', type: 'checkin', message: '别忘了今天的打卡哦！', time: '20:00', enabled: true },
    ];
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('aiMessages', JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('reminders', JSON.stringify(reminders));
  }, [reminders]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      const response = AI_RESPONSES[input] || getDefaultResponse(input);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
  };

  const getDefaultResponse = (question: string) => {
    if (question.includes('饮食') || question.includes('吃')) {
      return '关于饮食的问题很重要。请告诉我更具体的情况，比如：\n\n• 你现在遇到的具体挑战是什么？\n• 你的目标是什么？\n• 有哪些因素影响你的饮食选择？\n\n这样我可以给你更针对性的建议。';
    }
    if (question.includes('训练') || question.includes('运动') || question.includes('健身')) {
      return '训练相关的问题我很乐意帮忙。为了给你最佳建议，能告诉我：\n\n• 你现在的训练频率和内容？\n• 遇到的具体困难？\n• 你的健身目标？\n\n这样我可以为你制定更合适的方案。';
    }
    if (question.includes('心理') || question.includes('压力') || question.includes('焦虑') || question.includes('情绪')) {
      return '心理健康对减脂成功至关重要。我理解你的感受。\n\n一些立即可以尝试的方法：\n• 深呼吸：4秒吸气-7秒屏息-8秒呼气，重复5次\n• 正念当下：关注此刻的感受，不评判\n• 写下来：表达情绪可以减轻心理负担\n• 运动：即使10分钟散步也能改善情绪\n\n愿意和我分享更多吗？你不是一个人在战斗。';
    }
    return '感谢你的提问。我会基于心理学、营养学和运动科学为你提供建议。\n\n能否告诉我更多细节？比如：\n• 具体遇到什么挑战？\n• 你尝试过什么方法？\n• 你希望达到什么目标？\n\n这样我可以给你更精准的帮助。';
  };

  const toggleReminder = (id: string) => {
    setReminders(reminders.map(r =>
      r.id === id ? { ...r, enabled: !r.enabled } : r
    ));
  };

  const getReminderIcon = (type: Reminder['type']) => {
    switch (type) {
      case 'water': return '💧';
      case 'meal': return '🍽️';
      case 'exercise': return '💪';
      case 'sleep': return '😴';
      case 'checkin': return '✅';
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header with tabs */}
      <div className="bg-white border-b border-gray-200 p-4">
        <h1 className="text-xl font-bold text-gray-900">AI 心理顾问</h1>
        <p className="text-xs text-gray-500 mt-1">24/7 专业支持</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              message.role === 'user' ? 'bg-blue-500' : 'bg-purple-500'
            }`}>
              {message.role === 'user' ? (
                <User size={18} className="text-white" />
              ) : (
                <Bot size={18} className="text-white" />
              )}
            </div>
            <div className={`flex-1 ${message.role === 'user' ? 'flex justify-end' : ''}`}>
              <div className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-900 shadow-sm'
              }`}>
                <p className="text-sm whitespace-pre-line leading-relaxed">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.role === 'user' ? 'text-blue-100' : 'text-gray-400'
                }`}>
                  {new Date(message.timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Questions */}
      {messages.length <= 2 && (
        <div className="px-4 pb-2">
          <p className="text-xs text-gray-500 mb-2">快速提问：</p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {QUICK_QUESTIONS.map((question, index) => (
              <Chip
                key={index}
                label={question}
                onClick={() => handleQuickQuestion(question)}
                size="small"
                sx={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Reminders Section */}
      <Card className="mx-4 mb-2 shadow-sm">
        <CardContent className="p-3">
          <div className="flex items-center gap-2 mb-2">
            <Bell size={16} className="text-orange-500" />
            <p className="text-sm font-medium text-gray-700">智能提醒</p>
          </div>
          <div className="space-y-1">
            {reminders.map((reminder) => (
              <div key={reminder.id} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span>{getReminderIcon(reminder.type)}</span>
                  <span className="text-gray-700">{reminder.message}</span>
                  <span className="text-gray-400">· {reminder.time}</span>
                </div>
                <Switch
                  size="small"
                  checked={reminder.enabled}
                  onChange={() => toggleReminder(reminder.id)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      <div className="px-4 pb-2 space-y-2">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
          <AlertCircle size={16} className="text-yellow-600 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs font-medium text-yellow-900">预警提示</p>
            <p className="text-xs text-yellow-700 mt-1">你已经连续3天没有完成打卡，可能影响进度。需要调整计划吗？</p>
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex gap-2">
          <TextField
            fullWidth
            size="small"
            placeholder="输入你的问题..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <Button
            variant="contained"
            onClick={handleSend}
            disabled={!input.trim()}
            sx={{ minWidth: '48px', bgcolor: '#3b82f6' }}
          >
            <Send size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}
