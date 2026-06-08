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
  avatar?: string;
  trainingIntensity: 'high' | 'medium' | 'low' | 'rest';
}

const REGIONS = [
  { value: 'east', label: '华东地区 (米面结合·口味偏甜)' },
  { value: 'south', label: '华南地区 (米饭为主·口味清淡)' },
  { value: 'north', label: '华北地区 (面食为主·口味偏咸)' },
];

const DEFAULT_DATA: UserProfile = {
  name: "未登录",
  age: 30,
  gender: 'male',
  height: 170,
  weight: 70,
  targetWeight: 65,
  region: 'east',
  startDate: new Date().toISOString().split('T')[0], 
  trainingIntensity: 'medium',
};

export function Profile() {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_DATA);
  const [isEditing, setIsEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState<UserProfile>(DEFAULT_DATA);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // 监听真实的 Google 登录状态
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        // 去真实的云端数据库拉取资料
        try {
          const userRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(userRef);
          
          if (docSnap.exists()) {
            const cloudData = docSnap.data() as UserProfile;
            setProfile(cloudData);
            setTempProfile(cloudData);
            localStorage.setItem('userProfile', JSON.stringify(cloudData)); // 同步给其他页面用
          } else {
            // 新注册的谷歌用户
            const initData = { ...DEFAULT_DATA, name: user.displayName || '新用户', avatar: user.photoURL || '' };
            setProfile(initData);
            setTempProfile(initData);
            localStorage.setItem('userProfile', JSON.stringify(initData));
          }
        } catch (e) {
          console.warn("数据库连接未配置真实密钥，暂用本地缓存");
        }
      } else {
        // 彻底退出状态
        setCurrentUser(null);
        setProfile(DEFAULT_DATA);
        setTempProfile(DEFAULT_DATA);
        localStorage.removeItem('userProfile');
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      alert("请确保系统已配置真实的 Google API 密钥");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('userProfile');
    } catch (error) {
      console.error("退出失败", error);
    }
  };

  const handleEditClick = () => {
    if (!currentUser) {
      alert("必须先使用 Google 账号登录才能修改档案！");
      return;
    }
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!currentUser) return;
    setProfile(tempProfile);
    localStorage.setItem('userProfile', JSON.stringify(tempProfile)); 
    setIsEditing(false);

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await setDoc(userRef, { ...tempProfile }, { merge: true });
    } catch (error) {
      console.warn("未连接真实数据库，数据已在本地保存生效");
    }
  };

  const bmi = (profile.height > 0) ? (profile.weight / ((profile.height / 100) ** 2)).toFixed(1) : "0";
  const bmiStatus = parseFloat(bmi) < 18.5 ? '偏瘦' : parseFloat(bmi) < 24 ? '正常' : parseFloat(bmi) < 28 ? '偏胖' : '肥胖';

  return (
    <div className="h-full overflow-y-auto bg-[#fafaf9] p-6 pt-8 pb-20 space-y-6">
      
      <h1 className="text-2xl font-serif text-center text-[#2c2c2c] tracking-widest mb-6">个人档案</h1>

      <div className="mb-4">
        {currentUser ? (
          <Button onClick={handleLogout} fullWidth variant="outlined" color="error" sx={{ borderColor: '#e7e5e4', color: '#757575' }}>
            退出登录
          </Button>
        ) : (
          <Button onClick={handleLogin} fullWidth variant="contained" sx={{ bgcolor: '#2c2c2c', '&:hover': { bgcolor: '#000' } }}>
            使用 Google 账号登录
          </Button>
        )}
      </div>

      <Card sx={{ bgcolor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '0.5px solid #e7e5e4' }}>
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-6"> 
            <Avatar sx={{ width: 64, height: 64, border: '1px solid #e7e5e4', bgcolor: currentUser ? '#2c2c2c' : '#e0e0e0' }} src={profile.avatar}>
              {profile.name ? profile.name[0].toUpperCase() : <User />}
            </Avatar>
            <div>
              <h2 className="text-xl font-bold text-[#2c2c2c]">{profile.name}</h2>
              <p className="text-sm text-gray-500">{profile.age}岁 · {profile.gender === 'male' ? '男' : '女'}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100 text-center">
            <div><p className="text-xs text-gray-400 mb-1">身高</p><p className="text-lg font-medium">{profile.height} <span className="text-xs text-gray-400">cm</span></p></div>
            <div><p className="text-xs text-gray-400 mb-1">体重</p><p className="text-lg font-medium">{profile.weight} <span className="text-xs text-gray-400">kg</span></p></div>
            <div><p className="text-xs text-gray-400 mb-1">BMI</p><p className="text-lg font-medium">{bmi} <span className="text-xs font-normal text-gray-400">({bmiStatus})</span></p></div>
          </div>
        </CardContent>
      </Card>

      <Card sx={{ bgcolor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '0.5px solid #e7e5e4' }}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <p className="text-xs text-[#757575] tracking-[0.2em] font-light">基础维度配置</p>
            {!isEditing && (
              <button onClick={handleEditClick} className="flex items-center gap-1 text-xs text-[#4a4a4a] hover:text-[#2c2c2c]">
                <Edit3 size={14} /> 修改配置
              </button>
            )}
          </div>

          <div className="space-y-5 relative"> 
            {/* 真实未登录遮罩 */}
            {!currentUser && (
              <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-[1.5px] flex items-center justify-center rounded cursor-pointer" onClick={handleLogin}>
                <span className="bg-black text-white text-xs px-4 py-2 rounded-full shadow-lg transition hover:scale-105">点击登录后解锁数据修改</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <TextField label="当前体重(kg)" size="small" fullWidth disabled={!isEditing} value={isEditing ? tempProfile.weight : profile.weight} onChange={(e) => setTempProfile({ ...tempProfile, weight: parseFloat(e.target.value) || 0 })} />
              <TextField label="目标体重(kg)" size="small" fullWidth disabled={!isEditing} value={isEditing ? tempProfile.targetWeight : profile.targetWeight} onChange={(e) => setTempProfile({ ...tempProfile, targetWeight: parseFloat(e.target.value) || 0 })} />
            </div>
            
            <TextField label="计划起始日期" type="date" size="small" fullWidth disabled={!isEditing} value={isEditing ? tempProfile.startDate : profile.startDate} onChange={(e) => setTempProfile({ ...tempProfile, startDate: e.target.value })} InputLabelProps={{ shrink: true }} />

            <TextField label="所属地区" select fullWidth size="small" disabled={!isEditing} value={isEditing ? tempProfile.region : profile.region} onChange={(e) => setTempProfile({ ...tempProfile, region: e.target.value })}>
              {REGIONS.map(r => <MenuItem key={r.value} value={r.value}>{r.label}</MenuItem>)}
            </TextField>

            {isEditing && currentUser && (
              <div className="flex gap-3 mt-6 pt-2">
                <Button onClick={handleSave} variant="contained" fullWidth sx={{ bgcolor: '#2c2c2c', py: 1, '&:hover': { bgcolor: '#000' } }}>保存设置</Button>
                <Button onClick={() => setIsEditing(false)} variant="outlined" fullWidth sx={{ color: '#757575', borderColor: '#e7e5e4', py: 1 }}>取消</Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
