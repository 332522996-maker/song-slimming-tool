import { useState, useEffect } from 'react';
import { Card, CardContent, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Calendar, CheckCircle2, Trophy, Flame, Zap, Star } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DayLog {
  date: string;
  type: 'low' | 'medium' | 'high' | 'recovery';
  checkedIn: boolean;
  weight?: number;
  notes?: string;
  meals: boolean;
  exercise: boolean;
  water: boolean;
}

const CYCLE_PATTERN = [
  { days: '1-5', type: 'low', label: '低碳日', color: 'bg-blue-100 text-blue-700', icon: '🥗' },
  { days: '6-10', type: 'medium', label: '中碳日', color: 'bg-green-100 text-green-700', icon: '🥙' },
  { days: '11-15', type: 'high', label: '高碳日', color: 'bg-orange-100 text-orange-700', icon: '🍚' },
  { days: '16-21', type: 'recovery', label: '恢复日', color: 'bg-purple-100 text-purple-700', icon: '🌟' },
];

export function CheckIn() {
  const [logs, setLogs] = useState<DayLog[]>(() => {
    const saved = localStorage.getItem('checkInLogs');
    return saved ? JSON.parse(saved) : [];
  });

  const [showCheckIn, setShowCheckIn] = useState(false);
  const [todayLog, setTodayLog] = useState<DayLog>({
    date: new Date().toISOString().split('T')[0],
    type: 'low',
    checkedIn: false,
    meals: false,
    exercise: false,
    water: false,
  });

  const [streak, setStreak] = useState(0);
  const [totalPoints, setTotalPoints] = useState(() => {
    const saved = localStorage.getItem('rewardPoints');
    return saved ? parseInt(saved) : 0;
  });

  useEffect(() => {
    localStorage.setItem('checkInLogs', JSON.stringify(logs));
    calculateStreak();
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('rewardPoints', totalPoints.toString());
  }, [totalPoints]);

  const calculateStreak = () => {
    let count = 0;
    const sortedLogs = [...logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    for (let i = 0; i < sortedLogs.length; i++) {
      if (sortedLogs[i].checkedIn) {
        count++;
      } else {
        break;
      }
    }
    setStreak(count);
  };

  const getDayType = (dayNumber: number) => {
    const mod = dayNumber % 21;
    if (mod >= 1 && mod <= 5) return 'low';
    if (mod >= 6 && mod <= 10) return 'medium';
    if (mod >= 11 && mod <= 15) return 'high';
    return 'recovery';
  };

  const handleCheckIn = () => {
    const points = (todayLog.meals ? 10 : 0) + (todayLog.exercise ? 15 : 0) + (todayLog.water ? 5 : 0) + 20;

    const newLog = { ...todayLog, checkedIn: true };
    setLogs([...logs, newLog]);
    setTotalPoints(totalPoints + points);
    setShowCheckIn(false);

    // Celebration
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const getTodayDayNumber = () => {
    const startDate = new Date('2026-05-01');
    const today = new Date();
    const diff = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return diff + 1;
  };

  const todayDayNumber = getTodayDayNumber();
  const todayType = getDayType(todayDayNumber);
  const todayInfo = CYCLE_PATTERN.find(p => p.type === todayType);

  const hasCheckedInToday = logs.some(log => log.date === new Date().toISOString().split('T')[0] && log.checkedIn);

  // Generate calendar for current month
  const generateCalendar = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      const dateStr = date.toISOString().split('T')[0];
      const log = logs.find(l => l.date === dateStr);
      const dayNum = getTodayDayNumber() - (today.getDate() - i);
      const type = getDayType(dayNum);

      days.push({
        date: i,
        dateStr,
        type,
        log,
        isToday: i === today.getDate(),
      });
    }

    return days;
  };

  const calendar = generateCalendar();

  const achievements = [
    { icon: '🔥', title: '连续打卡', value: `${streak}天`, unlocked: streak >= 7 },
    { icon: '💪', title: '运动达人', value: '12次', unlocked: totalPoints >= 100 },
    { icon: '🥇', title: '黄金会员', value: '已解锁', unlocked: totalPoints >= 500 },
    { icon: '⭐', title: '完美周', value: '3周', unlocked: streak >= 21 },
  ];

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">每日打卡</h1>
        <p className="text-sm text-gray-500 mt-1">坚持记录，见证改变</p>
      </div>

      {/* Today's Status */}
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{todayInfo?.icon}</span>
              <div>
                <p className="text-lg font-bold text-gray-900">{todayInfo?.label}</p>
                <p className="text-xs text-gray-500">循环第 {todayDayNumber % 21 || 21} 天</p>
              </div>
            </div>
            {hasCheckedInToday ? (
              <CheckCircle2 size={32} className="text-green-500" />
            ) : (
              <Button
                variant="contained"
                onClick={() => setShowCheckIn(true)}
                sx={{ bgcolor: '#3b82f6', '&:hover': { bgcolor: '#2563eb' } }}
              >
                立即打卡
              </Button>
            )}
          </div>

          {todayInfo && (
            <div className={`p-3 rounded-lg ${todayInfo.color}`}>
              <p className="text-sm font-medium">今日碳水建议</p>
              <p className="text-xs mt-1">
                {todayType === 'low' && '碳水: 50-100g | 蛋白质: 高 | 脂肪: 适中'}
                {todayType === 'medium' && '碳水: 100-150g | 蛋白质: 适中 | 脂肪: 适中'}
                {todayType === 'high' && '碳水: 200-300g | 蛋白质: 适中 | 脂肪: 低'}
                {todayType === 'recovery' && '碳水: 自由 | 蛋白质: 适中 | 脂肪: 适中'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="shadow-sm">
          <CardContent className="p-3 text-center">
            <Flame size={24} className="text-orange-500 mx-auto mb-1" />
            <p className="text-xl font-bold text-gray-900">{streak}</p>
            <p className="text-xs text-gray-500">连续天数</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-3 text-center">
            <Star size={24} className="text-yellow-500 mx-auto mb-1" />
            <p className="text-xl font-bold text-gray-900">{totalPoints}</p>
            <p className="text-xs text-gray-500">积分</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-3 text-center">
            <Trophy size={24} className="text-purple-500 mx-auto mb-1" />
            <p className="text-xl font-bold text-gray-900">{logs.filter(l => l.checkedIn).length}</p>
            <p className="text-xs text-gray-500">总打卡</p>
          </CardContent>
        </Card>
      </div>

      {/* Calendar */}
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <p className="text-sm font-medium text-gray-700 mb-3">本月记录</p>
          <div className="grid grid-cols-7 gap-2">
            {['日', '一', '二', '三', '四', '五', '六'].map(day => (
              <div key={day} className="text-center text-xs text-gray-500 font-medium">
                {day}
              </div>
            ))}
            {Array(new Date(new Date().getFullYear(), new Date().getMonth(), 1).getDay()).fill(null).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {calendar.map((day, index) => {
              const typeInfo = CYCLE_PATTERN.find(p => p.type === day.type);
              return (
                <div
                  key={index}
                  className={`aspect-square flex items-center justify-center rounded-lg text-sm relative ${
                    day.isToday ? 'ring-2 ring-blue-500' : ''
                  } ${day.log?.checkedIn ? typeInfo?.color : 'bg-gray-100 text-gray-400'}`}
                >
                  {day.date}
                  {day.log?.checkedIn && (
                    <CheckCircle2 size={12} className="absolute top-0 right-0 text-green-600" />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <p className="text-sm font-medium text-gray-700 mb-3">成就勋章</p>
          <div className="grid grid-cols-2 gap-3">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border-2 ${
                  achievement.unlocked ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 bg-gray-50 opacity-50'
                }`}
              >
                <div className="text-2xl mb-1">{achievement.icon}</div>
                <p className="text-sm font-medium text-gray-900">{achievement.title}</p>
                <p className="text-xs text-gray-500">{achievement.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Rewards */}
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <p className="text-sm font-medium text-gray-700 mb-3">积分兑换</p>
          <div className="space-y-2">
            {[
              { name: '自定义饮食计划', points: 100, icon: '🎁' },
              { name: '专业教练咨询', points: 300, icon: '💝' },
              { name: '高级数据分析', points: 500, icon: '🏆' },
              { name: '定制训练方案', points: 800, icon: '👑' },
            ].map((reward, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{reward.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{reward.name}</p>
                    <p className="text-xs text-gray-500">{reward.points} 积分</p>
                  </div>
                </div>
                <Button
                  variant="outlined"
                  size="small"
                  disabled={totalPoints < reward.points}
                  sx={{ fontSize: '0.75rem' }}
                >
                  兑换
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Check-in Dialog */}
      <Dialog open={showCheckIn} onClose={() => setShowCheckIn(false)}>
        <DialogTitle>今日打卡</DialogTitle>
        <DialogContent>
          <div className="space-y-4 pt-2">
            <TextField
              label="今日体重 (kg)"
              type="number"
              fullWidth
              value={todayLog.weight || ''}
              onChange={(e) => setTodayLog({ ...todayLog, weight: parseFloat(e.target.value) })}
            />

            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">完成情况</p>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={todayLog.meals}
                    onChange={(e) => setTodayLog({ ...todayLog, meals: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">按计划饮食 (+10分)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={todayLog.exercise}
                    onChange={(e) => setTodayLog({ ...todayLog, exercise: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">完成运动训练 (+15分)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={todayLog.water}
                    onChange={(e) => setTodayLog({ ...todayLog, water: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">喝足够水分 (+5分)</span>
                </label>
              </div>
            </div>

            <TextField
              label="今日备注"
              multiline
              rows={3}
              fullWidth
              value={todayLog.notes || ''}
              onChange={(e) => setTodayLog({ ...todayLog, notes: e.target.value })}
              placeholder="记录今天的感受、遇到的挑战等..."
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCheckIn(false)}>取消</Button>
          <Button onClick={handleCheckIn} variant="contained">
            确认打卡
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
