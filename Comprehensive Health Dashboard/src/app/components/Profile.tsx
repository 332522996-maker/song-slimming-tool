import { useState, useEffect } from 'react';
import { Card, CardContent, TextField, Button, MenuItem, Avatar } from '@mui/material';
import { User, Edit3 } from 'lucide-react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db, signInWithGoogle } from '../../firebase';

export interface UserProfile {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number;
  weight: number;
  targetWeight: number;
  region: string;
  startDate: string;
  trainingIntensity: 'high' | 'medium' | 'low' | 'rest';
}

const REGIONS = [
  { value: 'east', label: '华东地区 (米面结合·口味偏甜)' },
  { value: 'south', label: '华南地区 (米饭为主·口味清淡)' },
  { value: 'north', label: '华北地区 (面食为主·口味偏咸)' },
];

const DEFAULT_DATA: UserProfile = {
  name: "未登录", age: 30, gender: 'male', height: 170, weight: 75, targetWeight: 65,
  region: 'east', startDate: new Date().toISOString().split('T')[0], trainingIntensity: 'medium'
};

export function Profile() {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_DATA);
  const [isEditing, setIsEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState<UserProfile>(DEFAULT_DATA);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [todayCycle, setTodayCycle] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        try {
          const userRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
            const cloudData = docSnap.data() as UserProfile;
            setProfile(cloudData);
            setTempProfile(cloudData);
            calculateCycle(cloudData.startDate);
          }
        } catch (e) { console.log("云端同步中..."); }
      } else {
        setCurrentUser(null);
        setProfile(DEFAULT_DATA);
      }
    });
    return () => unsubscribe();
  }, []);

  const calculateCycle = (startDate: string) => {
    const start = new Date(startDate);
    const today = new Date();
    const diffDays = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const cycles = ["高碳日", "中碳日", "低碳日"];
    setTodayCycle(cycles[Math.max(0, diffDays) % 3]);
  };

  const handleLogin = async () => { await signInWithGoogle(); };
  const handleLogout = async () => { await signOut(auth); };

  const handleSave = async () => {
    setProfile(tempProfile);
    calculateCycle(tempProfile.startDate);
    setIsEditing(false);
    if (currentUser) {
      try {
        const userRef = doc(db, 'users', currentUser.uid);
        await setDoc(userRef, { ...tempProfile }, { merge: true });
      } catch (e) {}
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-[#fafaf9] p-6 pt-8 pb-20 space-y-6">
      <h1 className="text-2xl font-serif text-center text-[#2c2c2c] tracking-widest mb-6">个人档案</h1>
      <div className="mb-4">
        {currentUser ? (
          <Button onClick={handleLogout} fullWidth variant="outlined" color="error">退出登录</Button>
        ) : (
          <Button onClick={handleLogin} fullWidth variant="contained" sx={{ bgcolor: '#2c2c2c' }}>使用 Google 账号登录</Button>
        )}
      </div>

      <Card sx={{ p: 3 }}>
        <div className="flex items-center gap-4 mb-6">
          <Avatar>{profile.name[0]}</Avatar>
          <div>
            <h2 className="text-xl font-bold">{profile.name}</h2>
            <p className="text-sm text-amber-600 font-bold">今日状态: {todayCycle}</p>
          </div>
        </div>
      </Card>

      <Card sx={{ p: 3 }}>
        <div className="flex justify-between mb-4">
          <p className="text-xs text-gray-500">基础维度配置</p>
          <button onClick={() => setIsEditing(!isEditing)} className="text-xs flex items-center gap-1"><Edit3 size={12}/> 修改</button>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <TextField label="当前体重" size="small" disabled={!isEditing} value={tempProfile.weight} onChange={(e) => setTempProfile({...tempProfile, weight: Number(e.target.value)})} />
            <TextField label="目标体重" size="small" disabled={!isEditing} value={tempProfile.targetWeight} onChange={(e) => setTempProfile({...tempProfile, targetWeight: Number(e.target.value)})} />
          </div>
          <TextField label="计划起始日期" type="date" fullWidth size="small" disabled={!isEditing} value={tempProfile.startDate} onChange={(e) => setTempProfile({...tempProfile, startDate: e.target.value})} InputLabelProps={{ shrink: true }} />
          <TextField label="所属地区" select fullWidth size="small" disabled={!isEditing} value={tempProfile.region} onChange={(e) => setTempProfile({...tempProfile, region: e.target.value})}>
            {REGIONS.map(r => <MenuItem key={r.value} value={r.value}>{r.label}</MenuItem>)}
          </TextField>
          {isEditing && <Button fullWidth variant="contained" onClick={handleSave}>保存设置</Button>}
        </div>
      </Card>
    </div>
  );
}
