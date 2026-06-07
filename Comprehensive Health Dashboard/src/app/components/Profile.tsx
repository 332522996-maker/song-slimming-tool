import { useState, useEffect } from 'react';
import { Card, CardContent, TextField, Button, MenuItem, Avatar } from '@mui/material';
import { User, MapPin, Calendar, Edit3, Check, X } from 'lucide-react';
import { motion } from 'motion/react';

interface UserProfile {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number;
  weight: number;
  targetWeight: number;
  region: string;
  startDate: string;
  avatar?: string;
}

const REGIONS = [
  { value: 'north', label: '华北地区', cuisine: '面食为主·口味偏咸' },
  { value: 'south', label: '华南地区', cuisine: '米饭为主·口味清淡' },
  { value: 'east', label: '华东地区', cuisine: '米面结合·口味偏甜' },
  { value: 'west', label: '西部地区', cuisine: '牛羊肉·辛辣口味' },
  { value: 'central', label: '华中地区', cuisine: '米饭为主·口味适中' },
  { value: 'northeast', label: '东北地区', cuisine: '炖菜为主·口味偏重' },
];

export function Profile() {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('userProfile');
    return saved ? JSON.parse(saved) : {
      name: '',
      age: 28,
      gender: 'male',
      height: 170,
      weight: 75,
      targetWeight: 65,
      region: 'east',
      startDate: new Date().toISOString().split('T')[0],
    };
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState(profile);

  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(profile));
    const userData = {
      age: profile.age,
      weight: profile.weight,
      height: profile.height,
      targetWeight: profile.targetWeight,
      startWeight: profile.weight,
      steps: 8500,
      cycleCount: 3,
      currentCycleDay: 12,
      startDate: profile.startDate,
    };
    localStorage.setItem('userData', JSON.stringify(userData));
  }, [profile]);

  const handleSave = () => {
    setProfile(tempProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempProfile(profile);
    setIsEditing(false);
  };

  const bmi = (profile.weight / ((profile.height / 100) ** 2)).toFixed(1);
  const bmiStatus = parseFloat(bmi) < 18.5 ? '偏瘦' : parseFloat(bmi) < 24 ? '正常' : parseFloat(bmi) < 28 ? '偏胖' : '肥胖';
  const currentRegion = REGIONS.find(r => r.value === profile.region);

  return (
    <div className="h-full overflow-y-auto bg-[#fafaf9]">
      <div className="h-6" />

      <div className="px-6 space-y-6 pb-6">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center pt-4"
        >
          <h1 className="text-2xl font-light text-[#2c2c2c] tracking-[0.3em] mb-2">
            个人档案
          </h1>
          <div className="w-16 h-px bg-[#2c2c2c] mx-auto" />
        </motion.div>

        {/* 头像与基本信息 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card sx={{ bgcolor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '0.5px solid #e7e5e4', borderRadius: '2px' }}>
            <CardContent className="p-8">
              <div className="flex flex-col items-center mb-6">
                <div className="relative mb-4">
                  <Avatar
                    sx={{
                      width: 72,
                      height: 72,
                      border: '1px solid #e7e5e4',
                      bgcolor: '#f5f5f4',
                      color: '#4a4a4a',
                      fontSize: '1.5rem',
                      fontWeight: 300
                    }}
                    src={profile.avatar}
                  >
                    {profile.name ? profile.name[0].toUpperCase() : <User size={32} strokeWidth={1.5} />}
                  </Avatar>
                </div>

                <h2 className="text-xl font-light text-[#2c2c2c] tracking-[0.15em] mb-1">
                  {profile.name || '未设置姓名'}
                </h2>
                <p className="text-xs text-[#a8a8a8] tracking-wider">
                  {profile.age}岁 · {profile.gender === 'male' ? '男' : profile.gender === 'female' ? '女' : '其他'}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#f5f5f4]">
                <div className="text-center">
                  <p className="text-xs text-[#a8a8a8] tracking-wider mb-1 font-light">身高</p>
                  <p className="text-2xl font-light text-[#2c2c2c]">{profile.height}</p>
                  <p className="text-[0.625rem] text-[#a8a8a8]">cm</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-[#a8a8a8] tracking-wider mb-1 font-light">体重</p>
                  <p className="text-2xl font-light text-[#2c2c2c]">{profile.weight}</p>
                  <p className="text-[0.625rem] text-[#a8a8a8]">kg</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-[#a8a8a8] tracking-wider mb-1 font-light">BMI</p>
                  <p className="text-2xl font-light text-[#2c2c2c]">{bmi}</p>
                  <p className="text-[0.625rem] text-[#a8a8a8]">{bmiStatus}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 目标与进度 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card sx={{ bgcolor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '0.5px solid #e7e5e4', borderRadius: '2px' }}>
            <CardContent className="p-6">
              <div className="text-center mb-4">
                <p className="text-xs text-[#757575] tracking-[0.2em] font-light">减重目标</p>
                <div className="w-12 h-px bg-[#d4d4d4] mx-auto mt-3 mb-4" />
              </div>

              <div className="flex justify-center items-center gap-8 mb-4">
                <div className="text-center">
                  <p className="text-xs text-[#a8a8a8] mb-1 tracking-wide">当前</p>
                  <p className="text-3xl font-light text-[#2c2c2c]">{profile.weight}</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-px bg-[#e7e5e4] mb-1" />
                  <p className="text-[0.625rem] text-[#a8a8a8] tracking-wider">
                    {(profile.weight - profile.targetWeight).toFixed(1)}kg
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-[#a8a8a8] mb-1 tracking-wide">目标</p>
                  <p className="text-3xl font-light text-[#2c2c2c]">{profile.targetWeight}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 地区饮食特点 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card sx={{ bgcolor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '0.5px solid #e7e5e4', borderRadius: '2px' }}>
            <CardContent className="p-6">
              <div className="flex items-start gap-3 mb-4">
                <MapPin size={16} strokeWidth={1.5} className="text-[#757575] mt-1" />
                <div className="flex-1">
                  <p className="text-xs text-[#757575] tracking-[0.15em] mb-2 font-light">地区饮食</p>
                  <h3 className="text-base font-light text-[#2c2c2c] tracking-wide mb-1">
                    {currentRegion?.label}
                  </h3>
                  <p className="text-xs text-[#a8a8a8] tracking-wide leading-relaxed">
                    {currentRegion?.cuisine}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 健身旅程 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card sx={{ bgcolor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '0.5px solid #e7e5e4', borderRadius: '2px' }}>
            <CardContent className="p-6">
              <div className="flex items-start gap-3 mb-4">
                <Calendar size={16} strokeWidth={1.5} className="text-[#757575] mt-1" />
                <div className="flex-1">
                  <p className="text-xs text-[#757575] tracking-[0.15em] mb-2 font-light">开始日期</p>
                  <p className="text-sm text-[#2c2c2c] tracking-wide">
                    {new Date(profile.startDate).toLocaleDateString('zh-CN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#f5f5f4]">
                <p className="text-xs text-[#a8a8a8] text-center tracking-wide leading-relaxed">
                  已坚持 {Math.floor((new Date().getTime() - new Date(profile.startDate).getTime()) / (1000 * 60 * 60 * 24))} 天
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 编辑表单 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card sx={{ bgcolor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '0.5px solid #e7e5e4', borderRadius: '2px' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <p className="text-xs text-[#757575] tracking-[0.2em] font-light">个人信息</p>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1 text-xs text-[#4a4a4a] tracking-wide hover:text-[#2c2c2c] transition-colors"
                  >
                    <Edit3 size={14} strokeWidth={1.5} />
                    编辑
                  </button>
                ) : null}
              </div>

              <div className="space-y-4">
                <TextField
                  label="姓名"
                  fullWidth
                  size="small"
                  value={isEditing ? tempProfile.name : profile.name}
                  onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                  disabled={!isEditing}
                  placeholder="输入你的名字"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontFamily: '"Source Han Serif CN", serif',
                      fontSize: '0.875rem',
                      '& fieldset': { borderColor: '#e7e5e4' },
                    },
                    '& .MuiInputLabel-root': {
                      fontFamily: '"Source Han Serif CN", serif',
                      fontSize: '0.75rem',
                      color: '#a8a8a8',
                    }
                  }}
                />

                <div className="grid grid-cols-2 gap-3">
                  <TextField
                    label="年龄"
                    type="number"
                    fullWidth
                    size="small"
                    value={isEditing ? tempProfile.age : profile.age}
                    onChange={(e) => setTempProfile({ ...tempProfile, age: parseInt(e.target.value) })}
                    disabled={!isEditing}
                    InputProps={{ inputProps: { min: 10, max: 100 } }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        fontFamily: '"Source Han Serif CN", serif',
                        fontSize: '0.875rem',
                        '& fieldset': { borderColor: '#e7e5e4' },
                      },
                      '& .MuiInputLabel-root': {
                        fontFamily: '"Source Han Serif CN", serif',
                        fontSize: '0.75rem',
                        color: '#a8a8a8',
                      }
                    }}
                  />

                  <TextField
                    label="性别"
                    select
                    fullWidth
                    size="small"
                    value={isEditing ? tempProfile.gender : profile.gender}
                    onChange={(e) => setTempProfile({ ...tempProfile, gender: e.target.value as any })}
                    disabled={!isEditing}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        fontFamily: '"Source Han Serif CN", serif',
                        fontSize: '0.875rem',
                        '& fieldset': { borderColor: '#e7e5e4' },
                      },
                      '& .MuiInputLabel-root': {
                        fontFamily: '"Source Han Serif CN", serif',
                        fontSize: '0.75rem',
                        color: '#a8a8a8',
                      }
                    }}
                  >
                    <MenuItem value="male">男</MenuItem>
                    <MenuItem value="female">女</MenuItem>
                    <MenuItem value="other">其他</MenuItem>
                  </TextField>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <TextField
                    label="身高 (cm)"
                    type="number"
                    fullWidth
                    size="small"
                    value={isEditing ? tempProfile.height : profile.height}
                    onChange={(e) => setTempProfile({ ...tempProfile, height: parseInt(e.target.value) })}
                    disabled={!isEditing}
                    InputProps={{ inputProps: { min: 100, max: 250 } }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        fontFamily: '"Source Han Serif CN", serif',
                        fontSize: '0.875rem',
                        '& fieldset': { borderColor: '#e7e5e4' },
                      },
                      '& .MuiInputLabel-root': {
                        fontFamily: '"Source Han Serif CN", serif',
                        fontSize: '0.75rem',
                        color: '#a8a8a8',
                      }
                    }}
                  />

                  <TextField
                    label="当前体重 (kg)"
                    type="number"
                    fullWidth
                    size="small"
                    value={isEditing ? tempProfile.weight : profile.weight}
                    onChange={(e) => setTempProfile({ ...tempProfile, weight: parseFloat(e.target.value) })}
                    disabled={!isEditing}
                    InputProps={{ inputProps: { min: 30, max: 300, step: 0.1 } }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        fontFamily: '"Source Han Serif CN", serif',
                        fontSize: '0.875rem',
                        '& fieldset': { borderColor: '#e7e5e4' },
                      },
                      '& .MuiInputLabel-root': {
                        fontFamily: '"Source Han Serif CN", serif',
                        fontSize: '0.75rem',
                        color: '#a8a8a8',
                      }
                    }}
                  />
                </div>

                <TextField
                  label="目标体重 (kg)"
                  type="number"
                  fullWidth
                  size="small"
                  value={isEditing ? tempProfile.targetWeight : profile.targetWeight}
                  onChange={(e) => setTempProfile({ ...tempProfile, targetWeight: parseFloat(e.target.value) })}
                  disabled={!isEditing}
                  InputProps={{ inputProps: { min: 30, max: 300, step: 0.1 } }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontFamily: '"Source Han Serif CN", serif',
                      fontSize: '0.875rem',
                      '& fieldset': { borderColor: '#e7e5e4' },
                    },
                    '& .MuiInputLabel-root': {
                      fontFamily: '"Source Han Serif CN", serif',
                      fontSize: '0.75rem',
                      color: '#a8a8a8',
                    }
                  }}
                />

                <TextField
                  label="所在地区"
                  select
                  fullWidth
                  size="small"
                  value={isEditing ? tempProfile.region : profile.region}
                  onChange={(e) => setTempProfile({ ...tempProfile, region: e.target.value })}
                  disabled={!isEditing}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontFamily: '"Source Han Serif CN", serif',
                      fontSize: '0.875rem',
                      '& fieldset': { borderColor: '#e7e5e4' },
                    },
                    '& .MuiInputLabel-root': {
                      fontFamily: '"Source Han Serif CN", serif',
                      fontSize: '0.75rem',
                      color: '#a8a8a8',
                    }
                  }}
                >
                  {REGIONS.map((region) => (
                    <MenuItem key={region.value} value={region.value}>
                      {region.label}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  label="开始日期"
                  type="date"
                  fullWidth
                  size="small"
                  value={isEditing ? tempProfile.startDate : profile.startDate}
                  onChange={(e) => setTempProfile({ ...tempProfile, startDate: e.target.value })}
                  disabled={!isEditing}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontFamily: '"Source Han Serif CN", serif',
                      fontSize: '0.875rem',
                      '& fieldset': { borderColor: '#e7e5e4' },
                    },
                    '& .MuiInputLabel-root': {
                      fontFamily: '"Source Han Serif CN", serif',
                      fontSize: '0.75rem',
                      color: '#a8a8a8',
                    }
                  }}
                />

                {isEditing && (
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleSave}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#2c2c2c] text-white text-xs tracking-wider hover:bg-[#4a4a4a] transition-colors"
                    >
                      <Check size={14} strokeWidth={1.5} />
                      保存
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-[#e7e5e4] text-[#757575] text-xs tracking-wider hover:bg-[#f5f5f4] transition-colors"
                    >
                      <X size={14} strokeWidth={1.5} />
                      取消
                    </button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="h-4" />
      </div>
    </div>
  );
}
