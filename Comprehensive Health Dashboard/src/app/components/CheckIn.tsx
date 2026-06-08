import { Card, CardContent, Button } from '@mui/material';

export function CheckIn() {
  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="h-full overflow-y-auto bg-[#fafaf9] p-4 pb-24 space-y-4">
      <div className="pt-4 pb-2">
        <h1 className="text-xl font-serif text-[#2c2c2c] tracking-widest mb-1">每日打卡</h1>
        <p className="text-xs text-gray-400">坚持记录，见证改变</p>
      </div>

      {/* 顶部状态与打卡按钮 */}
      <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.02)', borderRadius: '12px', border: '1px solid #f0f0f0' }}>
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <div className="text-2xl">🌟</div>
              <div>
                <p className="text-base font-bold text-[#2c2c2c]">恢复日</p>
                <p className="text-[10px] text-gray-400">循环第 18 天</p>
              </div>
            </div>
            <Button variant="contained" size="small" sx={{ bgcolor: '#4285F4', borderRadius: '8px', boxShadow: 'none' }}>立即打卡</Button>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
            <p className="text-xs text-purple-700 font-medium mb-1">今日碳水建议</p>
            <p className="text-[10px] text-purple-600">碳水: 自由 | 蛋白质: 适中 | 脂肪: 适中</p>
          </div>
        </CardContent>
      </Card>

      {/* 核心统计 */}
      <div className="grid grid-cols-3 gap-2">
        <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.02)', borderRadius: '12px' }}><CardContent className="p-4 text-center"><span className="text-red-500 text-lg mb-1 block">🔥</span><p className="text-xl font-medium">3</p><p className="text-[9px] text-gray-400">连续天数</p></CardContent></Card>
        <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.02)', borderRadius: '12px' }}><CardContent className="p-4 text-center"><span className="text-yellow-500 text-lg mb-1 block">⭐</span><p className="text-xl font-medium">150</p><p className="text-[9px] text-gray-400">积分</p></CardContent></Card>
        <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.02)', borderRadius: '12px' }}><CardContent className="p-4 text-center"><span className="text-purple-500 text-lg mb-1 block">🏆</span><p className="text-xl font-medium">18</p><p className="text-[9px] text-gray-400">总打卡</p></CardContent></Card>
      </div>

      {/* 日历网格 */}
      <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.02)', borderRadius: '12px' }}>
        <CardContent className="p-4">
          <p className="text-xs text-[#2c2c2c] font-medium mb-4">本月记录</p>
          <div className="grid grid-cols-7 text-center mb-2">
            {['日', '一', '二', '三', '四', '五', '六'].map(day => <span key={day} className="text-[10px] text-gray-400">{day}</span>)}
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {days.map(day => (
              <div key={day} className={`aspect-square flex items-center justify-center rounded-lg text-xs ${day === 8 ? 'border-2 border-blue-400 text-blue-500 font-bold bg-blue-50' : day < 8 ? 'bg-gray-100 text-gray-400' : 'bg-gray-50 text-gray-300'}`}>
                {day}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
