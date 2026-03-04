import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { 
  Briefcase, CreditCard, Stethoscope, MapPin, Utensils, 
  Beef, Clock, Smartphone, Bus, GraduationCap, PhoneCall, 
  Search, Plus, LogIn, Check, X, Trash2, Edit2,
  ChevronRight, ArrowLeft, Menu, Info, Send,
  Home, User, Users, Settings, Mail, Calendar, Camera, Music, Video, Image, Map, 
  Book, Coffee, ShoppingBag, Heart, Star, Shield, Zap, Globe, Cloud, 
  Moon, Sun, Umbrella, Anchor, Award, Bike, Car, Plane, Train, 
  Truck, Activity, AlertCircle, AlertTriangle, Archive, AtSign, BarChart,
  LayoutDashboard, FileText, Bell, FolderTree, LogOut,
  Battery, Bluetooth, Box, CameraOff, Cast, CheckCircle, Clipboard, 
  Code, Compass, Cpu, Database, DollarSign, Download, Droplet, Eye, 
  Facebook, FastForward, Feather, File, Filter, Flag, Folder, Gift, 
  Github, HardDrive, Hash, Headphones, HelpCircle, Inbox, Instagram, 
  Key, Laptop, Layers, LifeBuoy, Link as LucideLink, Linkedin, List, Lock, 
  Maximize, Mic, Minimize, Monitor, MousePointer, Package, Paperclip, 
  Pause, PenTool, Percent, PieChart, Play, Power, Printer, Radio, 
  RefreshCw, Repeat, Rewind, Save, Scissors, Server, Share, 
  ShoppingCart, Shuffle, SkipBack, SkipForward, Slack, Speaker, Square, 
  Tablet, Tag, Target, Terminal, Thermometer, ThumbsDown, ThumbsUp, 
  ToggleLeft, ToggleRight, Trash, TrendingDown, TrendingUp, Tv, Twitter, 
  Type, Unlock, Upload, VideoOff, Volume, Watch, Wifi, Wind, Youtube,
  Smile, Frown, Meh, Ghost, Crown, Gem, Flame, Rocket, Hammer, Wrench
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useForm, Controller } from 'react-hook-form';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import ReactQuill from 'react-quill-new';
import DOMPurify from 'dompurify';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
  description: string;
}

interface Post {
  id: number;
  category_id: number;
  category_name?: string;
  title: string;
  description: string;
  location: string;
  contact: string;
  image_url: string;
  map_link: string;
  submitted_by?: string;
  email?: string;
  status: 'pending' | 'approved';
  created_at: string;
}

interface Notice {
  id: number;
  content: string;
  type: 'info' | 'warning' | 'success';
  active: number;
  created_at: string;
}

// --- Components ---

const IconMap: Record<string, React.ReactNode> = {
  FileText: <FileText className="w-full h-full" />,
  Briefcase: <Briefcase className="w-full h-full" />,
  CreditCard: <CreditCard className="w-full h-full" />,
  Stethoscope: <Stethoscope className="w-full h-full" />,
  MapPin: <MapPin className="w-full h-full" />,
  Utensils: <Utensils className="w-full h-full" />,
  Beef: <Beef className="w-full h-full" />,
  Clock: <Clock className="w-full h-full" />,
  Smartphone: <Smartphone className="w-full h-full" />,
  Bus: <Bus className="w-full h-full" />,
  GraduationCap: <GraduationCap className="w-full h-full" />,
  PhoneCall: <PhoneCall className="w-full h-full" />,
  Home: <Home className="w-full h-full" />,
  User: <User className="w-full h-full" />,
  Settings: <Settings className="w-full h-full" />,
  Mail: <Mail className="w-full h-full" />,
  Calendar: <Calendar className="w-full h-full" />,
  Camera: <Camera className="w-full h-full" />,
  Music: <Music className="w-full h-full" />,
  Video: <Video className="w-full h-full" />,
  Image: <Image className="w-full h-full" />,
  Map: <Map className="w-full h-full" />,
  Book: <Book className="w-full h-full" />,
  Coffee: <Coffee className="w-full h-full" />,
  ShoppingBag: <ShoppingBag className="w-full h-full" />,
  Heart: <Heart className="w-full h-full" />,
  Star: <Star className="w-full h-full" />,
  Shield: <Shield className="w-full h-full" />,
  Zap: <Zap className="w-full h-full" />,
  Globe: <Globe className="w-full h-full" />,
  Cloud: <Cloud className="w-full h-full" />,
  Moon: <Moon className="w-full h-full" />,
  Sun: <Sun className="w-full h-full" />,
  Umbrella: <Umbrella className="w-full h-full" />,
  Anchor: <Anchor className="w-full h-full" />,
  Award: <Award className="w-full h-full" />,
  Bike: <Bike className="w-full h-full" />,
  Car: <Car className="w-full h-full" />,
  Plane: <Plane className="w-full h-full" />,
  Train: <Train className="w-full h-full" />,
  Truck: <Truck className="w-full h-full" />,
  Activity: <Activity className="w-full h-full" />,
  AlertCircle: <AlertCircle className="w-full h-full" />,
  AlertTriangle: <AlertTriangle className="w-full h-full" />,
  Archive: <Archive className="w-full h-full" />,
  AtSign: <AtSign className="w-full h-full" />,
  BarChart: <BarChart className="w-full h-full" />,
  Battery: <Battery className="w-full h-full" />,
  Bluetooth: <Bluetooth className="w-full h-full" />,
  Box: <Box className="w-full h-full" />,
  CameraOff: <CameraOff className="w-full h-full" />,
  Cast: <Cast className="w-full h-full" />,
  CheckCircle: <CheckCircle className="w-full h-full" />,
  Clipboard: <Clipboard className="w-full h-full" />,
  Code: <Code className="w-full h-full" />,
  Compass: <Compass className="w-full h-full" />,
  Cpu: <Cpu className="w-full h-full" />,
  Database: <Database className="w-full h-full" />,
  DollarSign: <DollarSign className="w-full h-full" />,
  Download: <Download className="w-full h-full" />,
  Droplet: <Droplet className="w-full h-full" />,
  Eye: <Eye className="w-full h-full" />,
  Facebook: <Facebook className="w-full h-full" />,
  FastForward: <FastForward className="w-full h-full" />,
  Feather: <Feather className="w-full h-full" />,
  File: <File className="w-full h-full" />,
  Filter: <Filter className="w-full h-full" />,
  Flag: <Flag className="w-full h-full" />,
  Folder: <Folder className="w-full h-full" />,
  Gift: <Gift className="w-full h-full" />,
  Github: <Github className="w-full h-full" />,
  HardDrive: <HardDrive className="w-full h-full" />,
  Hash: <Hash className="w-full h-full" />,
  Headphones: <Headphones className="w-full h-full" />,
  HelpCircle: <HelpCircle className="w-full h-full" />,
  Inbox: <Inbox className="w-full h-full" />,
  Instagram: <Instagram className="w-full h-full" />,
  Key: <Key className="w-full h-full" />,
  Laptop: <Laptop className="w-full h-full" />,
  Layers: <Layers className="w-full h-full" />,
  LifeBuoy: <LifeBuoy className="w-full h-full" />,
  Link: <LucideLink className="w-full h-full" />,
  Linkedin: <Linkedin className="w-full h-full" />,
  List: <List className="w-full h-full" />,
  Lock: <Lock className="w-full h-full" />,
  Maximize: <Maximize className="w-full h-full" />,
  Mic: <Mic className="w-full h-full" />,
  Minimize: <Minimize className="w-full h-full" />,
  Monitor: <Monitor className="w-full h-full" />,
  MousePointer: <MousePointer className="w-full h-full" />,
  Package: <Package className="w-full h-full" />,
  Paperclip: <Paperclip className="w-full h-full" />,
  Pause: <Pause className="w-full h-full" />,
  PenTool: <PenTool className="w-full h-full" />,
  Percent: <Percent className="w-full h-full" />,
  PieChart: <PieChart className="w-full h-full" />,
  Play: <Play className="w-full h-full" />,
  Power: <Power className="w-full h-full" />,
  Printer: <Printer className="w-full h-full" />,
  Radio: <Radio className="w-full h-full" />,
  RefreshCw: <RefreshCw className="w-full h-full" />,
  Repeat: <Repeat className="w-full h-full" />,
  Rewind: <Rewind className="w-full h-full" />,
  Save: <Save className="w-full h-full" />,
  Scissors: <Scissors className="w-full h-full" />,
  Server: <Server className="w-full h-full" />,
  Share: <Share className="w-full h-full" />,
  ShoppingCart: <ShoppingCart className="w-full h-full" />,
  Shuffle: <Shuffle className="w-full h-full" />,
  SkipBack: <SkipBack className="w-full h-full" />,
  SkipForward: <SkipForward className="w-full h-full" />,
  Slack: <Slack className="w-full h-full" />,
  Speaker: <Speaker className="w-full h-full" />,
  Square: <Square className="w-full h-full" />,
  Tablet: <Tablet className="w-full h-full" />,
  Tag: <Tag className="w-full h-full" />,
  Target: <Target className="w-full h-full" />,
  Terminal: <Terminal className="w-full h-full" />,
  Thermometer: <Thermometer className="w-full h-full" />,
  ThumbsDown: <ThumbsDown className="w-full h-full" />,
  ThumbsUp: <ThumbsUp className="w-full h-full" />,
  ToggleLeft: <ToggleLeft className="w-full h-full" />,
  ToggleRight: <ToggleRight className="w-full h-full" />,
  Trash: <Trash className="w-full h-full" />,
  TrendingDown: <TrendingDown className="w-full h-full" />,
  TrendingUp: <TrendingUp className="w-full h-full" />,
  Tv: <Tv className="w-full h-full" />,
  Twitter: <Twitter className="w-full h-full" />,
  Type: <Type className="w-full h-full" />,
  Unlock: <Unlock className="w-full h-full" />,
  Upload: <Upload className="w-full h-full" />,
  VideoOff: <VideoOff className="w-full h-full" />,
  Volume: <Volume className="w-full h-full" />,
  Watch: <Watch className="w-full h-full" />,
  Wifi: <Wifi className="w-full h-full" />,
  Wind: <Wind className="w-full h-full" />,
  Youtube: <Youtube className="w-full h-full" />,
  Smile: <Smile className="w-full h-full" />,
  Frown: <Frown className="w-full h-full" />,
  Meh: <Meh className="w-full h-full" />,
  Ghost: <Ghost className="w-full h-full" />,
  Crown: <Crown className="w-full h-full" />,
  Gem: <Gem className="w-full h-full" />,
  Flame: <Flame className="w-full h-full" />,
  Rocket: <Rocket className="w-full h-full" />,
  Hammer: <Hammer className="w-full h-full" />,
  Wrench: <Wrench className="w-full h-full" />,
};

const Navbar = ({ pendingCount }: { pendingCount?: number }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const token = localStorage.getItem('adminToken');

  return (
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-zinc-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group">
            <img 
              src="/logobd.png" 
              alt="KDU Community Logo" 
              className="w-10 h-10 sm:w-12 sm:h-12 object-contain group-hover:scale-110 transition-transform"
              onError={(e) => {
                e.currentTarget.src = "https://picsum.photos/seed/community-logo/100/100";
              }}
            />
            <div className="flex flex-col">
              <span className="font-bold text-zinc-900 leading-none text-sm sm:text-base">KDU Community</span>
              <span className="text-[9px] sm:text-[10px] text-emerald-600 font-bold uppercase tracking-widest">Bangladeshi Students</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/add" className="flex items-center space-x-2 px-5 py-2.5 bg-zinc-900 text-white rounded-full hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-900/10 hover:shadow-zinc-900/20 active:scale-95">
              <Plus className="w-4 h-4" />
              <span className="font-medium">Add Information</span>
            </Link>
            <div className="h-6 w-px bg-zinc-200" />
            {token ? (
              <Link to="/admin" className="relative p-2 text-zinc-600 hover:text-emerald-600 transition-colors">
                <LayoutDashboard className="w-6 h-6" />
                {pendingCount && pendingCount > 0 ? (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                    {pendingCount}
                  </span>
                ) : null}
              </Link>
            ) : (
              <Link to="/login" className="p-2 text-zinc-600 hover:text-emerald-600 transition-colors">
                <LogIn className="w-6 h-6" />
              </Link>
            )}
          </div>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-zinc-600">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-zinc-200 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              <Link to="/add" onClick={() => setIsMenuOpen(false)} className="block w-full text-center px-4 py-3 bg-emerald-600 text-white rounded-xl font-medium">
                Add Information
              </Link>
              {token ? (
                <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="block w-full text-center px-4 py-3 bg-zinc-100 text-zinc-900 rounded-xl font-medium">
                  Admin Dashboard
                </Link>
              ) : (
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block w-full text-center px-4 py-3 bg-zinc-100 text-zinc-900 rounded-xl font-medium">
                  Admin Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// --- Pages ---

const HomePage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data));
    
    fetch('/api/notices')
      .then(res => res.json())
      .then(data => setNotices(data));
  }, []);

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(search.toLowerCase()) ||
    cat.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <div className="relative pt-16 pb-12 md:pt-24 md:pb-16 hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl sm:text-5xl md:text-7xl font-black text-zinc-900 mb-3 sm:mb-6 tracking-tight px-2 leading-tight"
            >
              Everything you need <br />
              <span className="text-emerald-600">in South Korea.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-zinc-600 text-sm sm:text-lg md:text-xl max-w-2xl mx-auto mb-6 sm:mb-10 leading-relaxed px-6"
            >
              A collaborative platform for Bangladeshi students at Kyungdong University. 
              Find visa guides, jobs, halal food, and more.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-2xl mx-auto relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative px-4 sm:px-0">
                <Search className="absolute left-8 sm:left-6 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4 sm:w-6 sm:h-6" />
                <input 
                  type="text" 
                  placeholder="Search for visa, halal food, jobs..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 sm:pl-16 pr-6 py-3.5 sm:py-6 bg-white border border-zinc-200 rounded-xl sm:rounded-2xl shadow-2xl shadow-emerald-900/5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-sm sm:text-lg"
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Dynamic Notice Section */}
        <div className="max-w-4xl mx-auto px-4 mt-12">
          <AnimatePresence>
            {notices.map((notice, idx) => (
              <motion.div
                key={notice.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: idx * 0.1 }}
                className={cn(
                  "mb-4 p-4 rounded-2xl border flex items-start space-x-4 shadow-sm backdrop-blur-md",
                  notice.type === 'warning' ? "bg-amber-50/80 border-amber-200 text-amber-800" : 
                  notice.type === 'success' ? "bg-emerald-50/80 border-emerald-200 text-emerald-800" :
                  "bg-blue-50/80 border-blue-200 text-blue-800"
                )}
              >
                <div className="mt-1">
                  {notice.type === 'warning' ? <Info className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm md:text-base">{notice.content}</p>
                  <span className="text-[10px] opacity-60 uppercase font-bold tracking-wider">
                    Posted {new Date(notice.created_at).toLocaleDateString()}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl"></div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 pb-20">
        <div className="flex items-center justify-between mb-8 sm:mb-12">
          <div>
            <h2 className="text-xl sm:text-3xl font-bold text-zinc-900">Explore Services</h2>
            <p className="text-xs sm:text-base text-zinc-500">Find exactly what you're looking for</p>
          </div>
          <div className="hidden sm:flex items-center space-x-2 text-sm text-zinc-400">
            <span>{filteredCategories.length} Categories</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-6 md:gap-10">
          <AnimatePresence mode="popLayout">
            {filteredCategories.map((cat, idx) => (
              <motion.div
                key={cat.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ delay: idx * 0.03 }}
              >
                <Link 
                  to={`/category/${cat.slug}`}
                  className="group flex flex-col items-center text-center"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-white rounded-2xl sm:rounded-[1.75rem] shadow-lg shadow-zinc-200/50 flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 group-hover:shadow-emerald-500/20 transition-all duration-300 border border-zinc-100 group-hover:border-emerald-200 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="text-emerald-600 group-hover:text-emerald-500 transition-colors relative z-10 scale-110 sm:scale-125">
                      {IconMap[cat.icon] || <Info />}
                    </div>
                  </div>
                  <span className="text-xs sm:text-sm md:text-base font-bold text-zinc-700 group-hover:text-emerald-600 transition-colors line-clamp-2 px-1">
                    {cat.name}
                  </span>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Quick Info Section */}
      <div className="bg-zinc-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-emerald-600/20 text-emerald-500 rounded-xl flex items-center justify-center mx-auto md:mx-0">
                <Bell className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white">Latest Updates</h4>
              <p className="text-zinc-400 text-sm">Stay informed about visa policy changes and university announcements.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-emerald-600/20 text-emerald-500 rounded-xl flex items-center justify-center mx-auto md:mx-0">
                <Plus className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white">Community Driven</h4>
              <p className="text-zinc-400 text-sm">Contribute your own findings to help fellow students navigate life in Korea.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-emerald-600/20 text-emerald-500 rounded-xl flex items-center justify-center mx-auto md:mx-0">
                <PhoneCall className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white">Emergency Support</h4>
              <p className="text-zinc-400 text-sm">Quick access to essential contact numbers for any urgent situation.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PrayerTimes = () => {
  const [timings, setTimings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const fetchTimings = async () => {
      try {
        const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=Sokcho&country=South%20Korea&method=3`);
        const data = await res.json();
        setTimings(data.data.timings);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching prayer times:", error);
        setLoading(false);
      }
    };
    fetchTimings();
  }, []);

  const ramadan2026 = [
    { day: 1, date: "Feb 18", sehri: "05:42", iftar: "18:08" },
    { day: 2, date: "Feb 19", sehri: "05:41", iftar: "18:09" },
    { day: 3, date: "Feb 20", sehri: "05:40", iftar: "18:10" },
    { day: 4, date: "Feb 21", sehri: "05:38", iftar: "18:11" },
    { day: 5, date: "Feb 22", sehri: "05:37", iftar: "18:12" },
    { day: 6, date: "Feb 23", sehri: "05:36", iftar: "18:13" },
    { day: 7, date: "Feb 24", sehri: "05:34", iftar: "18:14" },
    { day: 8, date: "Feb 25", sehri: "05:33", iftar: "18:15" },
    { day: 9, date: "Feb 26", sehri: "05:32", iftar: "18:16" },
    { day: 10, date: "Feb 27", sehri: "05:30", iftar: "18:17" },
    { day: 11, date: "Feb 28", sehri: "05:29", iftar: "18:18" },
    { day: 12, date: "Mar 01", sehri: "05:27", iftar: "18:19" },
    { day: 13, date: "Mar 02", sehri: "05:26", iftar: "18:20" },
    { day: 14, date: "Mar 03", sehri: "05:24", iftar: "18:21" },
    { day: 15, date: "Mar 04", sehri: "05:23", iftar: "18:22" },
    { day: 16, date: "Mar 05", sehri: "05:21", iftar: "18:23" },
    { day: 17, date: "Mar 06", sehri: "05:20", iftar: "18:24" },
    { day: 18, date: "Mar 07", sehri: "05:18", iftar: "18:25" },
    { day: 19, date: "Mar 08", sehri: "05:17", iftar: "18:26" },
    { day: 20, date: "Mar 09", sehri: "05:15", iftar: "18:27" },
    { day: 21, date: "Mar 10", sehri: "05:14", iftar: "18:28" },
    { day: 22, date: "Mar 11", sehri: "05:12", iftar: "18:29" },
    { day: 23, date: "Mar 12", sehri: "05:11", iftar: "18:30" },
    { day: 24, date: "Mar 13", sehri: "05:09", iftar: "18:31" },
    { day: 25, date: "Mar 14", sehri: "05:08", iftar: "18:32" },
    { day: 26, date: "Mar 15", sehri: "05:06", iftar: "18:33" },
    { day: 27, date: "Mar 16", sehri: "05:05", iftar: "18:34" },
    { day: 28, date: "Mar 17", sehri: "05:03", iftar: "18:35" },
    { day: 29, date: "Mar 18", sehri: "05:02", iftar: "18:36" },
    { day: 30, date: "Mar 19", sehri: "05:00", iftar: "18:37" },
  ];

  const currentDay = ramadan2026.find(d => d.date === date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }));

  return (
    <div className="space-y-12">
      {/* Daily Prayer Times */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-zinc-900">Today's Prayer Times (Sokcho)</h2>
          <div className="text-sm text-zinc-500 font-medium">{date.toDateString()}</div>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-20 sm:h-24 bg-zinc-100 animate-pulse rounded-xl sm:rounded-2xl"></div>
            ))}
          </div>
        ) : timings ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
            {[
              { name: "Fajr", time: timings.Fajr },
              { name: "Dhuhr", time: timings.Dhuhr },
              { name: "Asr", time: timings.Asr },
              { name: "Maghrib", time: timings.Maghrib },
              { name: "Isha", time: timings.Isha },
            ].map((p) => (
              <div key={p.name} className="bg-white border border-zinc-200 p-4 sm:p-6 rounded-xl sm:rounded-2xl text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="text-emerald-600 font-bold text-[10px] sm:text-xs uppercase tracking-widest mb-1 sm:mb-2">{p.name}</div>
                <div className="text-xl sm:text-2xl font-black text-zinc-900">{p.time}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-red-500">Failed to load prayer times.</p>
        )}
      </section>

      {/* Ramadan Schedule */}
      <section>
        <div className="bg-emerald-900 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div>
                <h2 className="text-3xl font-black mb-2">Ramadan 2026 Schedule</h2>
                <p className="text-emerald-200">Sokcho, Gangwon-do, South Korea</p>
              </div>
              {currentDay && (
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl">
                  <div className="text-xs font-bold text-emerald-300 uppercase mb-1">Today (Ramadan {currentDay.day})</div>
                  <div className="flex space-x-6">
                    <div>
                      <div className="text-[10px] uppercase opacity-60">Sehri</div>
                      <div className="text-xl font-bold">{currentDay.sehri}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase opacity-60">Iftar</div>
                      <div className="text-xl font-bold">{currentDay.iftar}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-emerald-300 text-xs uppercase font-bold border-b border-white/10">
                  <tr>
                    <th className="px-4 py-4">Ramadan</th>
                    <th className="px-4 py-4">Date</th>
                    <th className="px-4 py-4">Sehri</th>
                    <th className="px-4 py-4">Iftar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {ramadan2026.map((d) => (
                    <tr key={d.day} className={cn("hover:bg-white/5 transition-colors", d.date === currentDay?.date && "bg-emerald-800")}>
                      <td className="px-4 py-3 font-medium text-sm">Day {d.day}</td>
                      <td className="px-4 py-3 text-sm">{d.date}</td>
                      <td className="px-4 py-3 font-bold text-sm">{d.sehri}</td>
                      <td className="px-4 py-3 font-bold text-sm">{d.iftar}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl"></div>
        </div>
      </section>
    </div>
  );
};

const CategoryPage = () => {
  const { slug } = useParams();
  const [posts, setPosts] = useState<Post[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('/api/categories')
      .then(res => res.json())
      .then(cats => {
        const found = cats.find((c: Category) => c.slug === slug);
        setCategory(found);
      });

    fetch(`/api/posts/category/${slug}`)
      .then(res => res.json())
      .then(data => {
        setPosts(data);
        setLoading(false);
      });
  }, [slug]);

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(search.toLowerCase()) ||
    post.description.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 sm:mb-8 gap-3 sm:gap-4">
        <Link to="/" className="inline-flex items-center text-zinc-500 hover:text-emerald-600 transition-colors text-xs sm:text-base">
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
          Back to Home
        </Link>
        {slug !== 'prayer' && (
          <Link 
            to={`/add?category=${category?.id}`} 
            className="inline-flex items-center justify-center px-4 py-2.5 sm:px-6 sm:py-3 bg-emerald-600 text-white rounded-xl sm:rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 active:scale-95 text-xs sm:text-base"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add {slug === 'emergency' ? 'Contact' : 'Information'}
          </Link>
        )}
      </div>

      <div className="mb-6 sm:mb-12">
        <div className="flex items-center space-x-3 sm:space-x-4 mb-2 sm:mb-4">
          <div className="w-10 h-10 sm:w-16 sm:h-16 bg-emerald-50 text-emerald-600 rounded-lg sm:rounded-2xl flex items-center justify-center scale-90 sm:scale-100">
            {category && IconMap[category.icon]}
          </div>
          <h1 className="text-xl sm:text-3xl md:text-4xl font-black text-zinc-900">{category?.name}</h1>
        </div>
        <p className="text-zinc-600 text-xs sm:text-base md:text-lg max-w-3xl leading-relaxed">{category?.description}</p>
      </div>

      {slug === 'emergency' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 p-8 bg-red-50 border border-red-100 rounded-[2.5rem] relative overflow-hidden"
        >
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-red-900 mb-4 flex items-center">
              <Info className="w-6 h-6 mr-2" />
              How to communicate in an Emergency
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-red-800">
              <div className="space-y-2">
                <p className="font-bold">1. Use English Keywords</p>
                <p className="text-sm opacity-80">If you don't know Korean, immediately say "English" or "Interpreter". Most emergency centers have 24/7 translation services.</p>
              </div>
              <div className="space-y-2">
                <p className="font-bold">2. Dial 1330 for Help</p>
                <p className="text-sm opacity-80">If you are struggling to explain your situation, call 1330 first. They provide 3-way interpretation between you and the emergency service.</p>
              </div>
              <div className="space-y-2">
                <p className="font-bold">3. Stay Calm & Give Location</p>
                <p className="text-sm opacity-80">Try to find a nearby landmark or use your phone's GPS to give your location. Stay on the line until help arrives.</p>
              </div>
              <div className="space-y-2">
                <p className="font-bold">4. Bangla Support</p>
                <p className="text-sm opacity-80">For non-urgent issues (Immigration/Visa), call 1345 and ask for a Bangla speaker during business hours.</p>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-red-200/20 rounded-full blur-3xl"></div>
        </motion.div>
      )}

      <div className="max-w-xl mb-6 sm:mb-12 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4 sm:w-5 sm:h-5" />
        <input 
          type="text" 
          placeholder={`Search in ${category?.name}...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 sm:pl-12 sm:py-4 bg-white border border-zinc-200 rounded-xl sm:rounded-2xl shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-xs sm:text-base"
        />
      </div>

      {slug === 'prayer' && <PrayerTimes />}

      {slug === 'emergency' ? (
        <div className="max-w-3xl mx-auto space-y-3 sm:space-y-4">
          {filteredPosts.map((post) => (
            <motion.div 
              key={post.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white border border-zinc-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex items-center justify-between shadow-sm hover:shadow-md transition-all group relative"
            >
              <div className="flex items-center space-x-3 sm:space-x-5">
                <div className="w-10 h-10 sm:w-14 sm:h-14 bg-red-50 text-red-600 rounded-lg sm:rounded-2xl flex items-center justify-center font-black text-base sm:text-xl shadow-inner group-hover:bg-red-600 group-hover:text-white transition-colors">
                  {post.title.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base sm:text-xl font-bold text-zinc-900">{post.title}</h3>
                  <p className="text-xs sm:text-base text-zinc-500 font-medium">{post.contact || 'No number'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                {post.contact && (
                  <a 
                    href={`tel:${post.contact.replace(/[^0-9]/g, '')}`}
                    className="w-9 h-9 sm:w-12 sm:h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all shadow-sm active:scale-90"
                    title="Call"
                  >
                    <PhoneCall className="w-4 h-4 sm:w-5 sm:h-5" />
                  </a>
                )}
                <button 
                  onClick={() => {
                    const el = document.getElementById(`desc-${post.id}`);
                    if (el) el.classList.toggle('hidden');
                  }}
                  className="w-9 h-9 sm:w-12 sm:h-12 bg-zinc-50 text-zinc-400 rounded-full flex items-center justify-center hover:bg-zinc-200 hover:text-zinc-600 transition-all shadow-sm"
                  title="Details"
                >
                  <Info className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
              <div id={`desc-${post.id}`} className="hidden absolute left-0 right-0 top-full mt-2 z-20 p-4 sm:p-6 bg-white border border-zinc-200 rounded-2xl sm:rounded-3xl shadow-2xl text-zinc-600 text-xs sm:text-sm">
                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.description) }} />
              </div>
            </motion.div>
          ))}
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-[2.5rem] border border-dashed border-zinc-200">
          <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Info className="w-10 h-10 text-zinc-300" />
          </div>
          <h3 className="text-xl font-bold text-zinc-900 mb-2">No guides found yet</h3>
          <p className="text-zinc-500 mb-8">Be the first to share helpful information with fellow students.</p>
          {slug !== 'prayer' && (
            <Link 
              to={`/add?category=${category?.id}`}
              className="inline-flex items-center px-8 py-4 bg-zinc-900 text-white rounded-2xl font-bold hover:bg-zinc-800 transition-all"
            >
              <Plus className="w-5 h-5 mr-2" />
              Start Writing
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:gap-8">
          {filteredPosts.map((post) => (
            <motion.div 
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-zinc-200 rounded-2xl sm:rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all p-5 sm:p-8 md:p-10"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 sm:gap-6 mb-4 sm:mb-8">
                <div>
                  <h3 className="text-lg sm:text-3xl font-black text-zinc-900 mb-2 sm:mb-4 leading-tight">{post.title}</h3>
                  <div className="flex flex-wrap gap-2 sm:gap-4">
                    <div className="flex items-center text-[10px] sm:text-sm text-zinc-500 bg-zinc-50 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-emerald-600" />
                      {new Date(post.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                    </div>
                    {post.submitted_by && (
                      <div className="flex items-center text-[10px] sm:text-sm text-zinc-500 bg-zinc-50 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full">
                        <GraduationCap className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-emerald-600" />
                        By {post.submitted_by}
                      </div>
                    )}
                  </div>
                </div>
                {post.contact && (
                  <a 
                    href={`tel:${post.contact.replace(/[^0-9]/g, '')}`}
                    className="inline-flex items-center justify-center px-4 py-2.5 sm:px-6 sm:py-4 bg-red-600 text-white rounded-xl sm:rounded-2xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 active:scale-95 whitespace-nowrap text-xs sm:text-base"
                  >
                    <PhoneCall className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
                    Call {post.contact}
                  </a>
                )}
              </div>

              <div 
                className="prose-content text-zinc-700 text-sm sm:text-lg leading-relaxed"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.description) }}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

const SubmissionForm = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const { register, handleSubmit, reset, control, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      category_id: searchParams.get('category') || '',
      title: '',
      description: '',
      contact: '',
      submitted_by: ''
    }
  });

  const selectedCategoryId = watch('category_id');
  const selectedCategory = categories.find(c => c.id.toString() === selectedCategoryId.toString());
  const isEmergency = selectedCategory?.slug === 'emergency';

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        setCategories(data);
        const catId = searchParams.get('category');
        if (catId) {
          setValue('category_id', catId);
        }
      });
  }, [searchParams, setValue]);

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setSubmitted(true);
        reset();
      }
    } catch (error) {
      alert('Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'clean'],
      ['emoji']
    ],
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8"
        >
          <Check className="w-12 h-12" />
        </motion.div>
        <h2 className="text-4xl font-black text-zinc-900 mb-4">Submission Successful!</h2>
        <p className="text-zinc-600 text-lg mb-10">Your guide has been sent to the admin for review. It will appear on the platform once approved.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={() => setSubmitted(false)}
            className="w-full sm:w-auto px-10 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
          >
            Submit Another
          </button>
          <Link to="/" className="w-full sm:w-auto px-10 py-4 bg-zinc-100 text-zinc-900 rounded-2xl font-bold hover:bg-zinc-200 transition-all">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-12">
      <div className="bg-white border border-zinc-200 rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-8 md:p-12 shadow-xl shadow-zinc-200/50">
        <div className="mb-6 sm:mb-10">
          <h1 className="text-xl sm:text-3xl md:text-4xl font-black text-zinc-900 mb-2 sm:mb-3">
            {isEmergency ? 'Add Emergency Contact' : 'Share Your Knowledge'}
          </h1>
          <p className="text-zinc-600 text-xs sm:text-base md:text-lg">
            {isEmergency 
              ? 'Add a new emergency number or important service contact for the community.' 
              : 'Help fellow students by writing a detailed guide or sharing a useful place.'}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
            <div className="space-y-2 sm:space-y-3">
              <label className="text-[10px] sm:text-sm font-bold text-zinc-700 uppercase tracking-wider">
                {isEmergency ? 'Contact Name *' : 'Title *'}
              </label>
              <input 
                {...register('title', { required: true })}
                placeholder={isEmergency ? "e.g., Police Station" : "e.g., How to extend D2 Visa"}
                className="w-full px-4 py-3 sm:px-6 sm:py-4 bg-zinc-50 border border-zinc-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm sm:text-lg"
              />
              {errors.title && <span className="text-red-500 text-[10px] font-bold">This field is required</span>}
            </div>
            <div className="space-y-2 sm:space-y-3">
              <label className="text-[10px] sm:text-sm font-bold text-zinc-700 uppercase tracking-wider">Category *</label>
              <select 
                {...register('category_id', { required: true })}
                className="w-full px-4 py-3 sm:px-6 sm:py-4 bg-zinc-50 border border-zinc-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm sm:text-lg appearance-none"
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              {errors.category_id && <span className="text-red-500 text-[10px] font-bold">Category is required</span>}
            </div>
          </div>

          {isEmergency && (
            <div className="space-y-2 sm:space-y-3">
              <label className="text-[10px] sm:text-sm font-bold text-zinc-700 uppercase tracking-wider">Phone Number *</label>
              <input 
                {...register('contact', { required: isEmergency })}
                placeholder="e.g., 112 or 010-XXXX-XXXX"
                className="w-full px-4 py-3 sm:px-6 sm:py-4 bg-zinc-50 border border-zinc-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm sm:text-lg"
              />
              {errors.contact && <span className="text-red-500 text-[10px] font-bold">Phone number is required</span>}
            </div>
          )}

          <div className="space-y-2 sm:space-y-3">
            <label className="text-[10px] sm:text-sm font-bold text-zinc-700 uppercase tracking-wider">
              {isEmergency ? 'Instructions / Notes (Optional)' : 'Description / Guide Content *'}
            </label>
            <div className="rounded-xl sm:rounded-2xl overflow-hidden border border-zinc-200">
              <Controller
                name="description"
                control={control}
                rules={{ required: !isEmergency }}
                render={({ field }) => (
                  <ReactQuill 
                    theme="snow"
                    value={field.value}
                    onChange={field.onChange}
                    modules={quillModules}
                    placeholder={isEmergency ? "How to call or what to say..." : "Write your guide here... You can use bold, lists, and links!"}
                  />
                )}
              />
            </div>
            {!isEmergency && errors.description && <span className="text-red-500 text-[10px] font-bold">Description is required</span>}
          </div>

          <div className="pt-4 sm:pt-6 border-t border-zinc-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
              <div className="flex-1 space-y-2 sm:space-y-3">
                <label className="text-[10px] sm:text-sm font-bold text-zinc-700 uppercase tracking-wider">Your Name (Optional)</label>
                <input 
                  {...register('submitted_by')}
                  placeholder="Anonymous Student"
                  className="w-full px-4 py-3 sm:px-6 sm:py-4 bg-zinc-50 border border-zinc-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm"
                />
              </div>
              <div className="md:pt-8">
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full md:w-auto px-8 py-3.5 sm:px-12 sm:py-5 bg-emerald-600 text-white rounded-xl sm:rounded-2xl font-bold text-sm sm:text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 disabled:opacity-50 flex items-center justify-center group"
                >
                  {loading ? 'Submitting...' : (
                    <>
                      {isEmergency ? 'Submit Contact' : 'Submit Guide'}
                      <Send className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const AdminLogin = () => {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (res.ok) {
        localStorage.setItem('adminToken', result.token);
        localStorage.setItem('adminUser', JSON.stringify(result.user));
        navigate('/admin');
      } else {
        alert(result.error);
      }
    } catch (error) {
      alert('Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-24">
      <div className="bg-white border border-zinc-200 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-emerald-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white font-bold text-xl sm:text-2xl mx-auto mb-4">
            K
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900">Admin Login</h1>
          <p className="text-zinc-500 text-sm sm:text-base">Access the community dashboard</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-700">Username</label>
            <input 
              {...register('username')}
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-700">Password</label>
            <input 
              {...register('password')}
              type="password"
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
          <button 
            type="submit"
            className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-bold hover:bg-zinc-800 transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [moderators, setModerators] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'pending' | 'approved' | 'notices' | 'categories' | 'moderators' | 'settings' | 'bulk-manage'>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPostIds, setSelectedPostIds] = useState<number[]>([]);
  const [selectedBulkCategoryId, setSelectedBulkCategoryId] = useState<number | null>(null);
  const [previewPost, setPreviewPost] = useState<Post | null>(null);
  
  const [newNotice, setNewNotice] = useState({ content: '', type: 'info' });
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [newModerator, setNewModerator] = useState({ username: '', password: '', name: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const navigate = useNavigate();
  const token = localStorage.getItem('adminToken');
  const user = JSON.parse(localStorage.getItem('adminUser') || '{}');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [token]);

  const fetchData = async () => {
    const headers = { 'Authorization': `Bearer ${token}` };
    try {
      const requests = [
        fetch('/api/admin/posts', { headers }),
        fetch('/api/admin/analytics', { headers }),
        fetch('/api/admin/notices', { headers }),
        fetch('/api/categories')
      ];

      if (user.role === 'admin') {
        requests.push(fetch('/api/admin/moderators', { headers }));
      }

      const responses = await Promise.all(requests);

      if (responses[0].status === 401 || responses[0].status === 403) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/login');
        return;
      }

      setPosts(await responses[0].json());
      setAnalytics(await responses[1].json());
      setNotices(await responses[2].json());
      setCategories(await responses[3].json());
      if (user.role === 'admin' && responses[4]) {
        setModerators(await responses[4].json());
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    const res = await fetch(`/api/admin/posts/${id}`, {
      method: 'PATCH',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
    });
    if (res.ok) fetchData();
  };

  const deletePost = async (id: number) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    const res = await fetch(`/api/admin/posts/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) fetchData();
  };

  const createNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotice.content) return;
    const res = await fetch('/api/admin/notices', {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newNotice)
    });
    if (res.ok) {
      setNewNotice({ content: '', type: 'info' });
      fetchData();
    }
  };

  const deleteNotice = async (id: number) => {
    if (!confirm('Delete this notice?')) return;
    const res = await fetch(`/api/admin/notices/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) fetchData();
  };

  const toggleNotice = async (id: number) => {
    const res = await fetch(`/api/admin/notices/${id}/toggle`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) fetchData();
  };

  const saveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory?.name || !editingCategory?.slug) return;
    
    const method = editingCategory.id ? 'PATCH' : 'POST';
    const url = editingCategory.id ? `/api/admin/categories/${editingCategory.id}` : '/api/admin/categories';
    
    const res = await fetch(url, {
      method,
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(editingCategory)
    });
    
    if (res.ok) {
      setEditingCategory(null);
      fetchData();
    } else {
      const err = await res.json();
      alert(err.error || 'Failed to save category');
    }
  };

  const deleteCategory = async (id: number) => {
    if (!confirm('Are you sure? This will fail if there are posts in this category.')) return;
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      fetchData();
    } else {
      const err = await res.json();
      alert(err.error || 'Failed to delete category');
    }
  };

  const createModerator = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/moderators', {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newModerator)
    });
    if (res.ok) {
      setNewModerator({ username: '', password: '', name: '' });
      fetchData();
    } else {
      const err = await res.json();
      alert(err.error || 'Failed to create moderator');
    }
  };

  const deleteModerator = async (id: number) => {
    if (!confirm('Delete this moderator?')) return;
    const res = await fetch(`/api/admin/moderators/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) fetchData();
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("New passwords don't match");
      return;
    }
    const res = await fetch('/api/admin/change-password', {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      })
    });
    if (res.ok) {
      alert('Password updated successfully');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      const err = await res.json();
      alert(err.error || 'Failed to update password');
    }
  };

  const bulkDeletePosts = async () => {
    if (selectedPostIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedPostIds.length} selected posts?`)) return;
    
    const res = await fetch('/api/admin/posts/bulk-delete', {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ids: selectedPostIds })
    });
    
    if (res.ok) {
      setSelectedPostIds([]);
      fetchData();
    } else {
      const err = await res.json();
      alert(err.error || 'Failed to delete posts');
    }
  };

  const filteredPosts = posts.filter(p => {
    const matchesTab = activeTab === 'dashboard' ? true : p.status === activeTab;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const menuItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'pending', label: 'Pending Submissions', icon: Clock, count: posts.filter(p => p.status === 'pending').length },
    { id: 'approved', label: 'Approved Content', icon: CheckCircle },
    { id: 'notices', label: 'Community Notices', icon: Bell, count: notices.length },
    { id: 'bulk-manage', label: 'Bulk Manage', icon: List },
    { id: 'categories', label: 'Categories', icon: FolderTree },
    ...(user.role === 'admin' ? [{ id: 'moderators', label: 'Moderators', icon: Users }] : []),
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-zinc-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <img 
            src="/logobd.png" 
            alt="Logo" 
            className="w-8 h-8 object-contain"
            onError={(e) => {
              e.currentTarget.src = "https://picsum.photos/seed/community-logo/100/100";
            }}
          />
          <span className="font-bold text-zinc-900">Admin Panel</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-zinc-500">
          {sidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Post Preview Modal */}
      <AnimatePresence>
        {previewPost && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewPost(null)}
              className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-2xl sm:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-4 sm:p-6 border-b border-zinc-100 flex items-center justify-between bg-white sticky top-0 z-10">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-50 text-emerald-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                    <Eye className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-zinc-900 leading-none">Post Preview</h3>
                    <p className="text-[9px] sm:text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1">Reviewing submission</p>
                  </div>
                </div>
                <button 
                  onClick={() => setPreviewPost(null)}
                  className="p-1.5 sm:p-2 hover:bg-zinc-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 sm:p-8">
                <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
                  {previewPost.image_url && (
                    <div className="aspect-video w-full rounded-2xl sm:rounded-[2rem] overflow-hidden bg-zinc-100 border border-zinc-200">
                      <img 
                        src={previewPost.image_url} 
                        alt={previewPost.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.src = "https://picsum.photos/seed/error/800/400";
                        }}
                      />
                    </div>
                  )}

                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider">
                        {previewPost.category_name}
                      </span>
                      <span className="text-[9px] sm:text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                        Submitted on {new Date(previewPost.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-4xl font-black text-zinc-900 leading-tight">
                      {previewPost.title}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="p-4 sm:p-6 bg-zinc-50 rounded-2xl sm:rounded-3xl border border-zinc-100">
                      <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-lg sm:rounded-xl flex items-center justify-center text-emerald-600 shadow-sm">
                          <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </div>
                        <span className="text-[9px] sm:text-xs font-black text-zinc-400 uppercase tracking-widest">Location</span>
                      </div>
                      <p className="text-sm sm:text-base text-zinc-900 font-bold">{previewPost.location || 'Not specified'}</p>
                    </div>
                    <div className="p-4 sm:p-6 bg-zinc-50 rounded-2xl sm:rounded-3xl border border-zinc-100">
                      <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-lg sm:rounded-xl flex items-center justify-center text-emerald-600 shadow-sm">
                          <PhoneCall className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </div>
                        <span className="text-[9px] sm:text-xs font-black text-zinc-400 uppercase tracking-widest">Contact</span>
                      </div>
                      <p className="text-sm sm:text-base text-zinc-900 font-bold">{previewPost.contact || 'Not specified'}</p>
                    </div>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <h4 className="text-[10px] sm:text-sm font-black text-zinc-900 uppercase tracking-widest">Description</h4>
                    <div 
                      className="prose prose-zinc max-w-none text-zinc-600 leading-relaxed text-sm sm:text-base"
                      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(previewPost.description) }}
                    />
                  </div>

                  {previewPost.map_link && (
                    <a 
                      href={previewPost.map_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-full p-4 bg-zinc-900 text-white rounded-2xl font-black hover:bg-zinc-800 transition-all group"
                    >
                      <Map className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                      View on Google Maps
                    </a>
                  )}

                  <div className="pt-8 border-t border-zinc-100">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-400 font-bold">
                        {previewPost.submitted_by?.[0] || 'A'}
                      </div>
                      <div>
                        <p className="text-xs font-black text-zinc-400 uppercase tracking-widest">Submitted By</p>
                        <p className="font-bold text-zinc-900">{previewPost.submitted_by || 'Anonymous'}</p>
                        <p className="text-xs text-zinc-500">{previewPost.email || 'No email provided'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6 border-t border-zinc-100 bg-zinc-50 flex items-center justify-end space-x-3 sm:space-x-4">
                <button 
                  onClick={() => setPreviewPost(null)}
                  className="px-4 py-2 sm:px-6 sm:py-3 text-zinc-500 font-bold hover:text-zinc-900 transition-colors text-sm sm:text-base"
                >
                  Close
                </button>
                {previewPost.status === 'pending' && (
                  <button 
                    onClick={() => {
                      updateStatus(previewPost.id, 'approved');
                      setPreviewPost(null);
                    }}
                    className="px-5 py-2.5 sm:px-8 sm:py-3 bg-emerald-600 text-white rounded-lg sm:rounded-xl font-black hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 text-sm sm:text-base"
                  >
                    Approve
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={cn(
        "fixed md:sticky top-0 left-0 h-screen w-72 bg-white border-r border-zinc-200 z-50 transition-transform duration-300 md:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-zinc-100 hidden md:block">
            <div className="flex items-center space-x-3">
              <img 
                src="/logobd.png" 
                alt="Logo" 
                className="w-10 h-10 object-contain"
                onError={(e) => {
                  e.currentTarget.src = "https://picsum.photos/seed/community-logo/100/100";
                }}
              />
              <div>
                <h2 className="font-black text-zinc-900 leading-none">KDU Community</h2>
                <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mt-1">Admin Dashboard</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id as any); setSidebarOpen(false); }}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group",
                  activeTab === item.id 
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20" 
                    : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                )}
              >
                <div className="flex items-center">
                  <item.icon className={cn("w-5 h-5 mr-3", activeTab === item.id ? "text-white" : "text-zinc-400 group-hover:text-emerald-600")} />
                  <span className="font-bold text-sm">{item.label}</span>
                </div>
                {item.count !== undefined && item.count > 0 && (
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-[10px] font-black",
                    activeTab === item.id ? "bg-white text-emerald-600" : "bg-emerald-100 text-emerald-600"
                  )}>
                    {item.count}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-zinc-100">
            <div className="bg-zinc-50 rounded-2xl p-4 mb-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-zinc-200 rounded-full flex items-center justify-center text-zinc-500">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-zinc-900 text-sm">{user.name || 'Moderator'}</p>
                  <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">{user.role}</p>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center px-4 py-2 bg-white border border-zinc-200 rounded-xl text-red-600 text-xs font-bold hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        <header className="bg-white border-b border-zinc-200 px-8 py-6 sticky top-0 z-30 hidden md:block">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-zinc-900">
                {menuItems.find(i => i.id === activeTab)?.label}
              </h1>
              <p className="text-sm text-zinc-500">Welcome back, {user.name}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Search everything..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none w-64 transition-all"
                />
              </div>
              <button className="p-2 text-zinc-400 hover:text-emerald-600 transition-colors relative">
                <Bell className="w-6 h-6" />
                {notices.length > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />}
              </button>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8">
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              {analytics && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: 'Total Posts', value: analytics.totalPosts, icon: FileText, color: 'emerald' },
                    { label: 'Pending Review', value: analytics.pendingPosts, icon: Clock, color: 'amber' },
                    { label: 'Categories', value: analytics.categoryCounts.length, icon: FolderTree, color: 'blue' },
                    { label: 'Active Notices', value: notices.filter(n => n.active).length, icon: Bell, color: 'purple' },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <div className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center",
                          stat.color === 'emerald' ? "bg-emerald-50 text-emerald-600" :
                          stat.color === 'amber' ? "bg-amber-50 text-amber-600" :
                          stat.color === 'blue' ? "bg-blue-50 text-blue-600" :
                          "bg-purple-50 text-purple-600"
                        )}>
                          <stat.icon className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Live</span>
                      </div>
                      <p className="text-zinc-500 text-sm font-bold">{stat.label}</p>
                      <p className="text-4xl font-black text-zinc-900 mt-1">{stat.value}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <div className="bg-white border border-zinc-200 rounded-[2.5rem] p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-xl font-black text-zinc-900">Recent Submissions</h3>
                      <button onClick={() => setActiveTab('pending')} className="text-emerald-600 font-bold text-sm hover:underline">View All</button>
                    </div>
                    <div className="space-y-4">
                      {posts.slice(0, 5).map((post) => (
                        <div key={post.id} className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-100 group hover:border-emerald-200 transition-all">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-sm">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-bold text-zinc-900 text-sm line-clamp-1">{post.title}</p>
                              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{post.category_name} â€¢ {new Date(post.created_at).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={cn(
                              "px-2 py-1 rounded-lg text-[10px] font-black uppercase",
                              post.status === 'approved' ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                            )}>
                              {post.status}
                            </span>
                          </div>
                        </div>
                      ))}
                      {posts.length === 0 && <p className="text-center py-8 text-zinc-400 font-bold">No recent submissions</p>}
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="bg-zinc-900 rounded-[2.5rem] p-8 text-white shadow-xl shadow-zinc-900/20">
                    <h3 className="text-xl font-black mb-6">Quick Actions</h3>
                    <div className="grid grid-cols-1 gap-3">
                      <button 
                        onClick={() => setActiveTab('notices')}
                        className="w-full flex items-center p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-all group"
                      >
                        <Bell className="w-5 h-5 mr-3 text-emerald-400 group-hover:scale-110 transition-transform" />
                        <span className="font-bold text-sm">Post New Notice</span>
                      </button>
                      <button 
                        onClick={() => setActiveTab('categories')}
                        className="w-full flex items-center p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-all group"
                      >
                        <Plus className="w-5 h-5 mr-3 text-emerald-400 group-hover:scale-110 transition-transform" />
                        <span className="font-bold text-sm">Manage Categories</span>
                      </button>
                      <button 
                        onClick={() => setActiveTab('settings')}
                        className="w-full flex items-center p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-all group"
                      >
                        <Shield className="w-5 h-5 mr-3 text-emerald-400 group-hover:scale-110 transition-transform" />
                        <span className="font-bold text-sm">Security Settings</span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-white border border-zinc-200 rounded-[2.5rem] p-8 shadow-sm">
                    <h3 className="text-xl font-black text-zinc-900 mb-6">Category Distribution</h3>
                    <div className="space-y-4">
                      {analytics?.categoryCounts.map((cat: any) => (
                        <div key={cat.name} className="space-y-2">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-zinc-700">{cat.name}</span>
                            <span className="text-zinc-400">{cat.count} posts</span>
                          </div>
                          <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-emerald-500 rounded-full" 
                              style={{ width: `${(cat.count / analytics.totalPosts) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {(activeTab === 'pending' || activeTab === 'approved') && (
            <div className="bg-white border border-zinc-200 rounded-[2.5rem] overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-4">
              <div className="p-8 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-black text-zinc-900">{activeTab === 'pending' ? 'Pending Review' : 'Approved Content'}</h3>
                  <p className="text-sm text-zinc-500">Showing {filteredPosts.length} results</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-500 hover:text-emerald-600 transition-all">
                    <Filter className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left">
                  <thead className="bg-zinc-50 text-zinc-500 text-[10px] uppercase font-black tracking-widest">
                    <tr>
                      <th className="px-8 py-4">Content Details</th>
                      <th className="px-8 py-4">Category</th>
                      <th className="px-8 py-4">Author</th>
                      <th className="px-8 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {filteredPosts.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-8 py-16 text-center">
                          <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center text-zinc-300 mb-4">
                              <FileText className="w-8 h-8" />
                            </div>
                            <p className="text-zinc-400 font-bold">No posts found in this section</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredPosts.map((post) => (
                        <tr key={post.id} className="hover:bg-zinc-50 transition-colors group">
                          <td className="px-8 py-6">
                            <button 
                              onClick={() => setPreviewPost(post)}
                              className="text-left group/title"
                            >
                              <div className="font-black text-zinc-900 text-base mb-1 line-clamp-1 group-hover/title:text-emerald-600 transition-colors">{post.title}</div>
                              <div className="text-xs text-zinc-500 line-clamp-1 max-w-md">{post.description.replace(/<[^>]*>/g, '')}</div>
                            </button>
                            <div className="mt-2 flex items-center text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                              <Clock className="w-3 h-3 mr-1" />
                              {new Date(post.created_at).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-wider">
                              {post.category_name}
                            </span>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-400 text-xs font-bold">
                                {post.submitted_by?.[0] || 'A'}
                              </div>
                              <div>
                                <div className="text-sm font-bold text-zinc-900">{post.submitted_by || 'Anonymous'}</div>
                                <div className="text-[10px] text-zinc-500">{post.email || 'No email'}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              {post.status === 'pending' ? (
                                <button 
                                  onClick={() => updateStatus(post.id, 'approved')}
                                  className="p-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
                                  title="Approve"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                              ) : (
                                <button 
                                  onClick={() => updateStatus(post.id, 'pending')}
                                  className="p-3 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-900/20 active:scale-95"
                                  title="Move to Pending"
                                >
                                  <Clock className="w-4 h-4" />
                                </button>
                              )}
                              <button 
                                onClick={() => deletePost(post.id)}
                                className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all active:scale-95"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'notices' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <div className="bg-white border border-zinc-200 rounded-[2.5rem] p-8 shadow-sm">
                <h3 className="text-xl font-black text-zinc-900 mb-6">Create New Notice</h3>
                <form onSubmit={createNotice} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-zinc-400 uppercase tracking-widest">Notice Content</label>
                    <textarea 
                      value={newNotice.content}
                      onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                      placeholder="What should the community know?"
                      className="w-full px-6 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                      rows={3}
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 space-y-2">
                      <label className="text-xs font-black text-zinc-400 uppercase tracking-widest">Notice Type</label>
                      <select 
                        value={newNotice.type}
                        onChange={(e) => setNewNotice({ ...newNotice, type: e.target.value as any })}
                        className="w-full px-6 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all appearance-none"
                      >
                        <option value="info">Information (Blue)</option>
                        <option value="warning">Important Warning (Amber)</option>
                        <option value="success">Success / Good News (Emerald)</option>
                      </select>
                    </div>
                    <div className="sm:pt-8">
                      <button 
                        type="submit"
                        className="w-full sm:w-auto px-10 py-4 bg-emerald-600 text-white rounded-2xl font-black hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 active:scale-95"
                      >
                        Post Community Notice
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {notices.map((notice) => (
                  <div key={notice.id} className="bg-white border border-zinc-200 rounded-[2.5rem] p-6 shadow-sm flex flex-col justify-between group">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                          notice.type === 'warning' ? "bg-amber-100 text-amber-700" : 
                          notice.type === 'success' ? "bg-emerald-100 text-emerald-700" :
                          "bg-blue-100 text-blue-700"
                        )}>
                          {notice.type}
                        </div>
                        <span className="text-[10px] text-zinc-400 font-bold">
                          {new Date(notice.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-zinc-700 font-medium leading-relaxed mb-6">{notice.content}</p>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-zinc-50">
                      <button 
                        onClick={() => toggleNotice(notice.id)}
                        className={cn(
                          "px-4 py-2 rounded-xl text-xs font-black transition-all",
                          notice.active ? "bg-emerald-50 text-emerald-600" : "bg-zinc-100 text-zinc-400"
                        )}
                      >
                        {notice.active ? 'Visible to All' : 'Hidden'}
                      </button>
                      <button 
                        onClick={() => deleteNotice(notice.id)}
                        className="p-2 text-red-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'bulk-manage' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  {selectedBulkCategoryId && (
                    <button 
                      onClick={() => setSelectedBulkCategoryId(null)}
                      className="p-3 bg-white border border-zinc-200 rounded-xl text-zinc-500 hover:text-emerald-600 transition-all shadow-sm"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                  )}
                  <div>
                    <h3 className="text-2xl font-black text-zinc-900">Bulk Manage Posts</h3>
                    <p className="text-sm text-zinc-500">
                      {selectedBulkCategoryId 
                        ? `Managing posts for ${categories.find(c => c.id === selectedBulkCategoryId)?.name}`
                        : 'Select a category to manage its posts'}
                    </p>
                  </div>
                </div>
                {selectedPostIds.length > 0 && (
                  <button 
                    onClick={bulkDeletePosts}
                    className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-2xl font-black hover:bg-red-700 transition-all shadow-xl shadow-red-600/20 active:scale-95"
                  >
                    <Trash2 className="w-5 h-5 mr-2" />
                    Delete Selected ({selectedPostIds.length})
                  </button>
                )}
              </div>

              {!selectedBulkCategoryId ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categories.map(category => {
                    const count = posts.filter(p => p.category_id === category.id).length;
                    return (
                      <button
                        key={category.id}
                        onClick={() => setSelectedBulkCategoryId(category.id)}
                        className="bg-white p-8 rounded-[2.5rem] border border-zinc-200 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all text-left group"
                      >
                        <div className="flex items-center justify-between mb-6">
                          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            {IconMap[category.icon] || <FileText className="w-7 h-7" />}
                          </div>
                          <ChevronRight className="w-6 h-6 text-zinc-300 group-hover:text-emerald-600 transition-colors" />
                        </div>
                        <h4 className="text-xl font-black text-zinc-900 mb-1">{category.name}</h4>
                        <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">{count} Total Posts</p>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-8">
                  {(() => {
                    const category = categories.find(c => c.id === selectedBulkCategoryId);
                    if (!category) return null;
                    const categoryPosts = posts.filter(p => p.category_id === category.id);
                    
                    const allCategorySelected = categoryPosts.length > 0 && categoryPosts.every(p => selectedPostIds.includes(p.id));

                    return (
                      <div className="bg-white border border-zinc-200 rounded-[2.5rem] overflow-hidden shadow-sm">
                        <div className="p-6 bg-zinc-50 border-b border-zinc-100 flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                              {IconMap[category.icon] || <FileText className="w-5 h-5" />}
                            </div>
                            <div>
                              <h4 className="font-black text-zinc-900">{category.name}</h4>
                              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{categoryPosts.length} Posts</p>
                            </div>
                          </div>
                          <label className="flex items-center space-x-2 cursor-pointer group">
                            <span className="text-xs font-bold text-zinc-500 group-hover:text-emerald-600 transition-colors">Select All in Category</span>
                            <input 
                              type="checkbox"
                              checked={allCategorySelected}
                              onChange={(e) => {
                                const ids = categoryPosts.map(p => p.id);
                                if (e.target.checked) {
                                  setSelectedPostIds(prev => Array.from(new Set([...prev, ...ids])));
                                } else {
                                  setSelectedPostIds(prev => prev.filter(id => !ids.includes(id)));
                                }
                              }}
                              className="w-5 h-5 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500"
                            />
                          </label>
                        </div>
                        <div className="divide-y divide-zinc-100">
                          {categoryPosts.length === 0 ? (
                            <div className="p-12 text-center text-zinc-400 font-bold">No posts in this category</div>
                          ) : (
                            categoryPosts.map(post => (
                              <div 
                                key={post.id} 
                                className={cn(
                                  "flex items-center justify-between p-4 hover:bg-zinc-50 transition-colors group",
                                  selectedPostIds.includes(post.id) ? "bg-emerald-50/30" : ""
                                )}
                              >
                                <div className="flex items-center space-x-4">
                                  <input 
                                    type="checkbox"
                                    checked={selectedPostIds.includes(post.id)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedPostIds(prev => [...prev, post.id]);
                                      } else {
                                        setSelectedPostIds(prev => prev.filter(id => id !== post.id));
                                      }
                                    }}
                                    className="w-5 h-5 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                                  />
                                  <button 
                                    onClick={() => setPreviewPost(post)}
                                    className="text-left group/title"
                                  >
                                    <p className="font-bold text-zinc-900 text-sm group-hover/title:text-emerald-600 transition-colors">{post.title}</p>
                                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                                      Status: <span className={post.status === 'approved' ? 'text-emerald-600' : 'text-amber-600'}>{post.status}</span>
                                    </p>
                                  </button>
                                </div>
                                <div className="text-[10px] text-zinc-400 font-bold">
                                  {new Date(post.created_at).toLocaleDateString()}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-black text-zinc-900">Content Categories</h3>
                  <p className="text-sm text-zinc-500">Organize and manage how content is grouped</p>
                </div>
                <button 
                  onClick={() => setEditingCategory({ name: '', slug: '', icon: 'FileText', description: '' })}
                  className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-2xl font-black hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 active:scale-95"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  New Category
                </button>
              </div>

              {editingCategory && (
                <div className="bg-white border border-zinc-200 rounded-[2.5rem] p-8 shadow-xl animate-in zoom-in-95">
                  <div className="flex justify-between items-center mb-8">
                    <h4 className="text-xl font-black text-zinc-900">{editingCategory.id ? 'Edit Category' : 'Create New Category'}</h4>
                    <button onClick={() => setEditingCategory(null)} className="p-2 text-zinc-400 hover:text-zinc-900">
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  <form onSubmit={saveCategory} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-zinc-400 uppercase tracking-widest">Display Name</label>
                        <input 
                          value={editingCategory.name}
                          onChange={e => setEditingCategory({ ...editingCategory, name: e.target.value })}
                          className="w-full px-6 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                          placeholder="e.g., Visa Guide"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-zinc-400 uppercase tracking-widest">URL Slug</label>
                        <input 
                          value={editingCategory.slug}
                          onChange={e => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                          className="w-full px-6 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                          placeholder="e.g., visa-guide"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-zinc-400 uppercase tracking-widest">Description</label>
                      <textarea 
                        value={editingCategory.description}
                        onChange={e => setEditingCategory({ ...editingCategory, description: e.target.value })}
                        className="w-full px-6 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                        placeholder="What kind of content goes here?"
                        rows={2}
                      />
                    </div>
                    <div className="flex justify-end space-x-4">
                      <button 
                        type="button" 
                        onClick={() => setEditingCategory(null)}
                        className="px-8 py-4 text-zinc-500 font-bold hover:text-zinc-900"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        className="px-10 py-4 bg-emerald-600 text-white rounded-2xl font-black hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20"
                      >
                        {editingCategory.id ? 'Save Changes' : 'Create Category'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((cat) => (
                  <div key={cat.id} className="bg-white border border-zinc-200 rounded-[2.5rem] p-6 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        {IconMap[cat.icon] || <FileText className="w-6 h-6" />}
                      </div>
                      <div className="flex items-center space-x-1">
                        <button 
                          onClick={() => setEditingCategory(cat)}
                          className="p-2 text-zinc-400 hover:text-emerald-600 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => deleteCategory(cat.id)}
                          className="p-2 text-zinc-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <h4 className="text-lg font-black text-zinc-900 mb-1">{cat.name}</h4>
                    <p className="text-xs text-zinc-500 line-clamp-2 mb-4">{cat.description || 'No description provided.'}</p>
                    <div className="pt-4 border-t border-zinc-50 flex items-center justify-between">
                      <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">/{cat.slug}</span>
                      <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                        {posts.filter(p => p.category_id === cat.id).length} Posts
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'moderators' && user.role === 'admin' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <div className="bg-white border border-zinc-200 rounded-[2.5rem] p-8 shadow-sm">
                <h3 className="text-xl font-black text-zinc-900 mb-6">Add New Moderator</h3>
                <form onSubmit={createModerator} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-zinc-400 uppercase tracking-widest">Full Name</label>
                      <input 
                        value={newModerator.name}
                        onChange={(e) => setNewModerator({ ...newModerator, name: e.target.value })}
                        className="w-full px-6 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                        placeholder="e.g., John Doe"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-zinc-400 uppercase tracking-widest">Username</label>
                      <input 
                        value={newModerator.username}
                        onChange={(e) => setNewModerator({ ...newModerator, username: e.target.value })}
                        className="w-full px-6 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                        placeholder="e.g., johndoe"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-zinc-400 uppercase tracking-widest">Password</label>
                      <input 
                        type="password"
                        value={newModerator.password}
                        onChange={(e) => setNewModerator({ ...newModerator, password: e.target.value })}
                        className="w-full px-6 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                        placeholder="********"
                        required
                      />
                    </div>
                  </div>
                  <button 
                    type="submit"
                    className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-black hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-900/20 active:scale-95"
                  >
                    Create Moderator Account
                  </button>
                </form>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {moderators.map((mod) => (
                  <div key={mod.id} className="bg-white border border-zinc-200 rounded-[2.5rem] p-6 shadow-sm flex items-center justify-between group">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-zinc-100 rounded-2xl flex items-center justify-center text-zinc-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all">
                        <User className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-black text-zinc-900">{mod.name}</h4>
                        <p className="text-xs text-zinc-500">@{mod.username}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => deleteModerator(mod.id)}
                      className="p-2 text-zinc-300 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4">
              <div className="bg-white border border-zinc-200 rounded-[2.5rem] p-8 shadow-sm">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center text-zinc-400">
                    <Shield className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-zinc-900">Security Settings</h3>
                    <p className="text-sm text-zinc-500">Update your administrative credentials</p>
                  </div>
                </div>
                
                <form onSubmit={changePassword} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-zinc-400 uppercase tracking-widest">Current Password</label>
                    <input 
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      className="w-full px-6 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-zinc-400 uppercase tracking-widest">New Password</label>
                      <input 
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        className="w-full px-6 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-zinc-400 uppercase tracking-widest">Confirm Password</label>
                      <input 
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        className="w-full px-6 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                        required
                      />
                    </div>
                  </div>
                  <button 
                    type="submit"
                    className="w-full py-5 bg-zinc-900 text-white rounded-2xl font-black hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-900/20 active:scale-95"
                  >
                    Update Security Credentials
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [pendingCount, setPendingCount] = useState(0);
  const [visitorCount, setVisitorCount] = useState<number | null>(null);

  useEffect(() => {
    // Fetch pending posts count for admin
    const token = localStorage.getItem('adminToken');
    if (token) {
      fetch('/api/admin/analytics', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => setPendingCount(data.pendingPosts))
      .catch(() => {});
    }

    // Fetch and track visitor count
    fetch('/api/visitors/today')
      .then(res => res.json())
      .then(data => setVisitorCount(data.count))
      .catch(() => {});
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900">
        <Navbar pendingCount={pendingCount} />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/add" element={<SubmissionForm />} />
            <Route path="/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
        
        <footer className="bg-white border-t border-zinc-200 py-12 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center space-x-3">
                <img 
                  src="/logobd.png" 
                  alt="Logo" 
                  className="w-10 h-10 object-contain"
                  onError={(e) => {
                    e.currentTarget.src = "https://picsum.photos/seed/community-logo/100/100";
                  }}
                />
                <span className="font-bold text-zinc-900">KDU Community BD</span>
              </div>
              <div className="flex space-x-6 text-sm text-zinc-500">
                <Link to="/" className="hover:text-emerald-600 transition-colors">Home</Link>
                <Link to="/add" className="hover:text-emerald-600 transition-colors">Add Info</Link>
                <Link to="/login" className="hover:text-emerald-600 transition-colors">Admin</Link>
              </div>
              <div className="flex flex-col items-center md:items-end space-y-2">
                {visitorCount !== null && (
                  <div className="flex items-center space-x-2 text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                    <Users className="w-3 h-3" />
                    <span>{visitorCount} Visitors Today</span>
                  </div>
                )}
                <p className="text-sm text-zinc-400">© 2026 KDU Bangladeshi Community. Built for students.</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}
