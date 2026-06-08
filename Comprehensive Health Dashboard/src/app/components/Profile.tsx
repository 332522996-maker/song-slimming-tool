// @ts-nocheck
import { useState, useEffect } from 'react';
import { Card, CardContent, TextField, Button, Grid, MenuItem } from '@mui/material';
import { Edit3, MapPin, Calendar, LogOut, LogIn } from 'lucide-react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db, signInWithGoogle } from '../../firebase';

const DEMO_DATA = {
  name: "演示用户", 
  age: 28, 
  gender: 'male', 
  height: 170, 
  weight: 75, 
  targetWeight: 65, 
  region: 'east', 
  startDate: new Date().toISOString().split('T')[0]
};

const REGIONS = {
  'east': { title: '华东地区', desc: '米面结合·口味偏甜' },
  'south': { title: '华南地区', desc: '米饭为主·口味清淡' },
  'north': { title: '华北地区', desc: '面食为主·口味偏咸' }
};

export function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(null);
  const [data, setData] = useState(DEMO_DATA);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setUser(authUser);
        try {
          const snap = await getDoc(doc(db, 'users', authUser.uid));
          if (snap.exists()) {
            setData(snap.data());
          } else {
            setData(prev => ({ ...prev, name: authUser.displayName || "新用户" }));
          }
        } catch (e) {
          console.error("数据同步异常", e);
        }
      } else {
        setUser(null);
        setData(DEMO_DATA);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleEditTrigger = async () => {
    if (!user) {
      try {
        await signInWithGoogle();
      } catch (error) {
        alert("登录授权失败，请稍后重试");
      }
      return;
    }
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsEditing(false);
    if (user) {
      await setDoc(doc(db, 'users', user.uid), data, { merge: true });
    }
  };

  const weightDiff = Math.max(0, data.weight - data.targetWeight).toFixed(1);
  const diffDays = Math.max(0, Math.floor((new Date().getTime() - new Date(data.startDate).getTime()) / (1000 * 60 * 60 * 24)));

  return (
    <div className="p-4 pb-24 bg-[#fafaf9] min-h-screen space-y-4">
      <div className="flex justify-between items-center px-1 mb-2">
        <h1 className="text-xl font-serif text-[#2c2c2c] tracking-widest">个人档案</h1>
        {user ? (
          <button onClick={() => signOut(auth)} className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 transition">
            <LogOut size={14}/> 退出账号
          </button>
        ) : (
          <button onClick={handleEditTrigger} className="flex items-center gap-1 text-xs text-white bg-black px-3 py-1.5 rounded-full shadow hover:bg-gray-800 transition">
            <LogIn size={14}/> 登录同步
          </button>
        )}
      </div>

      <Card sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #f0f0f0', borderRadius: '12px' }}>
        <CardContent className="p-6 text-center">
          <p className="text-xs text-gray-400 mb-6 tracking-widest">减重目标</p>
          <div className="flex justify-center items-center gap-6">
            <div className="text-center">
              <p className="text-[10px] text-gray-400 mb-1">当前</p>
              <p className="text-4xl font-light text-[#2c2c2c]">{data.weight}</p>
            </div>
            
            <div className="flex flex-col items-center w-24">
              <p className="text-[10px] text-gray-400 mb-1">{weightDiff}kg</p>
              <div className="w-full h-px bg-gray-200"></div>
            </div>

            <div className="text-center">
              <p className="text-[10px] text-gray-400 mb-1">目标</p>
              <p className="text-4xl font-light text-[#2c2c2c]">{data.targetWeight}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #f0f0f0', borderRadius: '12px' }}>
        <CardContent className="p-4 flex items-start gap-3">
          <MapPin size={18} className="text-gray-400 mt-0.5" />
          <div>
            <p className="text-xs text-gray-400 mb-1 tracking-wider">地区饮食</p>
            <p className="text-base font-medium text-[#2c2c2c]">{REGIONS[data.region]?.title || data.region}</p>
            <p className="text-xs text-gray-400 mt-1">{REGIONS[data.region]?.desc}</p>
          </div>
        </CardContent>
      </Card>

      <Card sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #f0f0f0', borderRadius: '12px' }}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3 mb-4">
            <Calendar size={18} className="text-gray-400 mt-0.5" />
            <div>
              <p className="text-xs text-gray-400 mb-1 tracking-wider">开始日期</p>
              <p className="text-base font-medium text-[#2c2c2c]">{data.startDate.replace(/-/g, '/')}</p>
            </div>
          </div>
          <div className="text-center border-t border-gray-50 pt-3">
            <p className="text-xs text-gray-400">已坚持 <span className="font-medium text-[#2c2c2c] text-sm">{diffDays}</span> 天</p>
          </div>
        </CardContent>
      </Card>

      <Card sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #f0f0f0', borderRadius: '12px' }}>
        <CardContent className="p-5">
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-gray-500 tracking-wider">个人信息</p>
            {!isEditing && (
              <button onClick={handleEditTrigger} className="flex items-center gap-1 text-xs text-[#2c2c2c] hover:text-black transition">
                <Edit3 size={14} /> 编辑
              </button>
            )}
          </div>

          <Grid container spacing={3}>
            <Grid item xs={12}><TextField fullWidth label="姓名" size="small" disabled={!isEditing} value={data.name} onChange={(e) => setData({...data, name: e.target.value})} InputProps={{ sx: { fontSize: '14px' } }} InputLabelProps={{ sx: { fontSize: '13px' } }} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="年龄" type="number" size="small" disabled={!isEditing} value={data.age} onChange={(e) => setData({...data, age: Number(e.target.value)})} InputProps={{ sx: { fontSize: '14px' } }} InputLabelProps={{ sx: { fontSize: '13px' } }} /></Grid>
            <Grid item xs={6}>
              <TextField select fullWidth label="性别" size="small" disabled={!isEditing} value={data.gender} onChange={(e) => setData({...data, gender: e.target.value})} InputProps={{ sx: { fontSize: '14px' } }} InputLabelProps={{ sx: { fontSize: '13px' } }}>
                <MenuItem value="male">男</MenuItem>
                <MenuItem value="female">女</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6}><TextField fullWidth label="身高(cm)" type="number" size="small" disabled={!isEditing} value={data.height} onChange={(e) => setData({...data, height: Number(e.target.value)})} InputProps={{ sx: { fontSize: '14px' } }} InputLabelProps={{ sx: { fontSize: '13px' } }} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="当前体重(kg)" type="number" size="small" disabled={!isEditing} value={data.weight} onChange={(e) => setData({...data, weight: Number(e.target.value)})} InputProps={{ sx: { fontSize: '14px' } }} InputLabelProps={{ sx: { fontSize: '13px' } }} /></Grid>
            
            {isEditing && (
              <>
                <Grid item xs={6}><TextField fullWidth label="目标体重(kg)" type="number" size="small" value={data.targetWeight} onChange={(e) => setData({...data, targetWeight: Number(e.target.value)})} /></Grid>
                <Grid item xs={6}><TextField type="date" fullWidth label="起始日期" size="small" value={data.startDate} onChange={(e) => setData({...data, startDate: e.target.value})} InputLabelProps={{ shrink: true }} /></Grid>
                <Grid item xs={12}>
                  <TextField select fullWidth label="地区饮食" size="small" value={data.region} onChange={(e) => setData({...data, region: e.target.value})}>
                    {Object.entries(REGIONS).map(([key, val]) => (
                      <MenuItem key={key} value={key}>{val.title}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <Button fullWidth variant="contained" onClick={handleSave} sx={{ bgcolor: '#2c2c2c', color: '#fff', py: 1.5, borderRadius: '8px', '&:hover': { bgcolor: '#000' } }}>
                    确认保存
                  </Button>
                </Grid>
              </>
            )}
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
}
