"use client";

import React, { useState, useEffect } from "react";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import { 
  GraduationCap, MapPin, Clock, CalendarDays, MessageCircle, AlertCircle
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Typography Configurations
const sans = Plus_Jakarta_Sans({ subsets: ["latin"] });
const mono = JetBrains_Mono({ subsets: ["latin"] });

// TypeScript Interfaces for Schedule and Class Data
interface ScheduleItem {
  time: string;
  title: string;
  type: string;
  color: string;
  text?: string;
  room: string;
  sks: number;
  isLive?: boolean;
}

type ClassDays = {
  [key: string]: ScheduleItem[];
};

type ScheduleStructure = {
  [className: string]: ClassDays;
};

// Main Weekly Class Schedules Data
const SCHEDULE_DATA: ScheduleStructure = {
  "TIF RP24B": {
    senin: [
      { time: "20:20 - 22:20", title: "Intelegensi Buatan", type: "Teori", color: "bg-secondary", room: "Online", sks: 3 }
    ],
    selasa: [
      { time: "10:00 - 12:00", title: "Sistem Informasi Enterprise", type: "Teori", color: "bg-primary", room: "Online", sks: 3 },
      { time: "18:20 - 20:20", title: "Project Integration Methodology of Excellence", type: "Teori", color: "bg-tertiary", text: "text-dark", room: "Online", sks: 3 }
    ],
    rabu: [
      { time: "08:00 - 10:00", title: "Pemrograman Mobile II", type: "Praktikum", color: "bg-primary", room: "Ruang A 101", sks: 3 },
      { time: "14:00 - 16:00", title: "Desain Kreatif Aplikasi dan Game", type: "Praktikum", color: "bg-secondary", room: "Ruang A 306", sks: 3 }
    ],
    kamis: [
      { time: "10:00 - 12:00", title: "Augmented & Virtual Reality", type: "Praktikum", color: "bg-tertiary", text: "text-dark", room: "Ruang B 101", sks: 3 },
      { time: "15:00 - 16:20", title: "Bahasa Indonesia", type: "Teori", color: "bg-primary", room: "Online", sks: 2 }
    ],
    jumat: [
      { time: "15:00 - 17:00", title: "Sistem Mikroprosesor", type: "Teori", color: "bg-primary", room: "Ruang A 401", sks: 3 }
    ]
  },
  "TIF RP24E": {
    senin: [],
    selasa: [
      { time: "15:00 - 17:00", title: "Keamanan Informasi", type: "Teori", color: "bg-primary", room: "Ruang A 101", sks: 3 }
    ],
    rabu: [
      { time: "10:00 - 12:00", title: "Sistem Informasi Enterprise", type: "Teori", color: "bg-secondary", room: "Online", sks: 3 },
      { time: "13:00 - 15:00", title: "Keamanan Jaringan", type: "Praktikum", color: "bg-tertiary", text: "text-dark", room: "Ruang B 201", sks: 3 }
    ],
    kamis: [
      { time: "10:00 - 12:00", title: "Pemrograman Mobile II", type: "Praktikum", color: "bg-primary", room: "Ruang B 203", sks: 3 },
      { time: "13:00 - 14:20", title: "Bahasa Indonesia", type: "Teori", color: "bg-secondary", room: "Online", sks: 2 },
      { time: "16:00 - 18:00", title: "Sistem Mikroprosesor", type: "Teori", color: "bg-tertiary", text: "text-dark", room: "Ruang A 402", sks: 3 }
    ],
    jumat: []
  }
};

// Course Lecturers Contact Information Data
const LECTURERS_DATA: Record<string, Array<{ name: string; role: string; initials: string; color: string; room: string; phone: string }>> = {
  "TIF RP24B": [
    { name: "Muhammad Shalahuddin, ST., MT.", role: "Dosen Intelegensi Buatan", initials: "MS", color: "bg-secondary text-white", room: "Online", phone: "6281234567890" },
    { name: "Deni Heryanto, A.Md.Kom., ST., M.Kom", role: "Dosen Sistem Informasi Enterprise", initials: "DH", color: "bg-primary text-white", room: "Online", phone: "6281234567891" },
    { name: "Rudhi Wahyudi Febrianto, S.Kom., M.Kom.", role: "Dosen Project Integration", initials: "RW", color: "bg-tertiary text-dark", room: "Online", phone: "6281234567892" },
    { name: "Dedi Rosadi, S.Kom.", role: "Dosen Pemrograman Mobile II", initials: "DR", color: "bg-primary text-white", room: "Ruang A 101", phone: "6281234567893" },
    { name: "Syarif Hidayat, S.Kom.", role: "Dosen Desain Kreatif Aplikasi & Game", initials: "SH", color: "bg-secondary text-white", room: "Ruang A 306", phone: "6281234567894" },
    { name: "Yayat Sutrayana, S.T., M.Kom.", role: "Dosen Augmented & Virtual Reality", initials: "YS", color: "bg-tertiary text-dark", room: "Ruang B 101", phone: "6281234567895" },
    { name: "Haura Zahra Salsabila", role: "Dosen Bahasa Indonesia", initials: "HZ", color: "bg-primary text-white", room: "Online", phone: "6281234567896" },
    { name: "Kristian Ismail, ST., MT.", role: "Dosen Sistem Mikroprosesor", initials: "KI", color: "bg-primary text-white", room: "Ruang A 401", phone: "6281234567897" }
  ],
  "TIF RP24E": [
    { name: "Eka Hidayat, M.Kom.", role: "Dosen Keamanan Informasi", initials: "EH", color: "bg-primary text-white", room: "Ruang A 101", phone: "6281234567898" },
    { name: "Dede Sulaeman", role: "Dosen Sistem Informasi Enterprise", initials: "DS", color: "bg-secondary text-white", room: "Online", phone: "6281234567899" },
    { name: "Yasti Aisyah Primianjani, S.Kom.", role: "Dosen Keamanan Jaringan", initials: "YA", color: "bg-tertiary text-dark", room: "Ruang B 201", phone: "6281234567800" },
    { name: "Sutani, S.T.", role: "Dosen Pemrograman Mobile II", initials: "SU", color: "bg-primary text-white", room: "Ruang B 203", phone: "6281234567801" },
    { name: "Haura Zahra Salsabila", role: "Dosen Bahasa Indonesia", initials: "HZ", color: "bg-secondary text-white", room: "Online", phone: "6281234567896" },
    { name: "Ari Hadhiwibowo, S.T., M.Kom.", role: "Dosen Sistem Mikroprosesor", initials: "AH", color: "bg-tertiary text-dark", room: "Ruang A 402", phone: "6281234567802" }
  ]
};

// Featured rotation announcements or quotes (Index 0 loads by default)
const CUSTOM_QUOTES = [
  "Awas, King Aan mulai aktif ngajak bolos. Amankan iman kalian!", 
  "Jadilah seperti A Diki yang selalu sigap jadi problem solver sejati tanpa kabur dari masalah.",
  "Jadilah orang yang berhati baik, tidak sombong, dan soft-spoken seperti Yusuf.",
  "Hati-hati kalau musim hujan, Baleendah rawan banjir mending siapin perahu dari sekarang!"
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("TIF RP24B");
  const [currentQuote, setCurrentQuote] = useState("");
  const currentLecturers = LECTURERS_DATA[activeTab] || [];

  const today = new Date();
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('id-ID', options);
  
  const dayNames = ["minggu", "senin", "selasa", "rabu", "kamis", "jumat", "sabtu"];
  const currentDayKey = dayNames[today.getDay()];
  const isWeekend = currentDayKey === "sabtu" || currentDayKey === "minggu";

  useEffect(() => {
    // Initialize default primary quote from index 0
    setCurrentQuote(CUSTOM_QUOTES[0]);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.99 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`min-h-screen flex flex-col justify-between selection:bg-tertiary selection:text-black ${sans.className}`}
    >
      {/* STICKY HEADER */}
      <motion.header 
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="sticky top-0 z-50 bg-canvas/95 backdrop-blur-md border-b-2 border-dark px-4 md:px-8 py-3"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-dark">Jadwal CoolYeah</span>
              </div>
              <p className="text-xs font-semibold text-gray-600 flex items-center gap-1">
                Childfruit king aan <span className="w-1 h-1 rounded-full bg-black inline-block"></span> UTB
              </p>
            </div>
          </div>

          {/* CLASS TAB SWITCHER NAVIGATION */}
          <nav className="relative bg-white border-2 border-dark rounded-xl p-1 shadow-[2px_2px_0px_#0A0A0A] flex items-center w-full md:w-auto overflow-x-auto">
            {["TIF RP24B", "TIF RP24E"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative z-10 px-6 py-2 text-xs md:text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2 flex-1 md:flex-none cursor-pointer ${
                  activeTab === tab ? "text-white" : "text-dark hover:bg-gray-100"
                }`}
              >
                {activeTab === tab && (
                  <motion.div
                    layoutId="active-tab"
                    className="absolute inset-0 bg-primary border-2 border-dark rounded-lg -z-10"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className={`w-2 h-2 rounded-full border border-black ${activeTab === tab ? "bg-green-500 animate-pulse" : "bg-gray-400"}`} />
                {tab}
              </button>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <motion.div 
              whileHover={{ y: -2 }}
              className="bg-white border-2 border-dark px-3.5 py-1.5 rounded-lg shadow-[2px_2px_0px_#0A0A0A] flex items-center gap-2 text-xs font-bold"
            >
              <CalendarDays className="w-4 h-4 text-primary" strokeWidth={2.5} />
              <span className={mono.className}>{formattedDate}</span>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* DAILY STATUS BAR & ANNOUNCEMENT BANNER */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="bg-tertiary border-b-2 border-dark px-4 py-2.5 font-bold text-xs text-dark overflow-hidden"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className={`bg-dark text-white px-2 py-0.5 rounded text-[10px] tracking-wider uppercase font-bold ${mono.className}`}>
              INFO HARI INI
            </span>
            <span>
              {isWeekend 
                ? `Hari ini hari ${currentDayKey.toUpperCase()} (Akhir Pekan) • Tidak ada jadwal perkuliahan aktif. Selamat beristirahat!`
                : `Hari ini hari ${currentDayKey.toUpperCase()} • Perkuliahan dan praktikum berjalan sesuai jadwal mingguan.`
              }
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-secondary font-extrabold bg-white/60 px-2.5 py-1 rounded border border-dark/20 w-fit">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{currentQuote}</span>
          </div>
        </div>
      </motion.div>

      {/* MAIN LAYOUT CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-6 w-full flex-1">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6"
        >
          <div>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary px-2.5 py-0.5 rounded-full text-xs font-bold mb-2 shadow-sm"
            >
              Semester 5
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-dark flex items-center gap-2">
              Jadwal <span className="text-primary">{activeTab}</span>
            </h1>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: FULL WEEKLY SCHEDULE ACCORDION */}
          <motion.section 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-8 bg-white rounded-2xl brutal-card p-6 md:p-8"
          >
            <div className="flex items-center gap-3 pb-4 border-b-2 border-dark mb-6">
              <motion.div 
                whileHover={{ rotate: -10, scale: 1.1 }}
                className="w-10 h-10 rounded-xl bg-primary text-white border-2 border-dark shadow-[2px_2px_0px_#0A0A0A] flex items-center justify-center font-bold"
              >
                <Clock className="w-5 h-5" strokeWidth={2.5} />
              </motion.div>
              <div>
                <h2 className="text-xl font-extrabold text-dark tracking-tight">Jadwal Lengkap Mingguan</h2>
                <p className="text-xs font-semibold text-gray-500">Senin - Jumat (Tatap Muka & Online)</p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: -15, scale: 0.99 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 15, scale: 0.99 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <Accordion type="single" collapsible defaultValue={isWeekend ? "senin" : currentDayKey} className="w-full space-y-4">
                  {(["senin", "selasa", "rabu", "kamis", "jumat"] as const).map((day, index) => {
                    const classSchedule = SCHEDULE_DATA[activeTab];
                    const schedules: ScheduleItem[] = classSchedule ? classSchedule[day] || [] : [];
                    const isToday = !isWeekend && day === currentDayKey;
                    
                    return (
                      <motion.div
                        key={day}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.06 }}
                      >
                        <AccordionItem value={day} className="border-2 border-dark rounded-xl px-4 bg-gray-50/50 data-[state=open]:bg-white overflow-hidden shadow-sm">
                          <AccordionTrigger className="hover:no-underline py-4 cursor-pointer">
                            <div className="flex items-center gap-3">
                              <span className={`text-lg font-extrabold uppercase ${isToday ? 'text-primary' : 'text-dark'}`}>
                                {day}
                              </span>
                              {isToday && (
                                <motion.span 
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ type: "spring", stiffness: 500, damping: 20 }}
                                  className="bg-tertiary text-dark text-[10px] font-extrabold px-2 py-0.5 rounded border border-dark"
                                >
                                  HARI INI
                                </motion.span>
                              )}
                              <span className="text-xs font-semibold text-gray-500 ml-2">{schedules.length} Sesi</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pt-2 pb-6 space-y-4">
                            {schedules.length === 0 ? (
                              <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-sm font-semibold text-gray-500 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center"
                              >
                                Tidak ada jadwal kuliah di hari {day}. Waktunya rebahan 
                              </motion.div>
                            ) : (
                              schedules.map((item, idx) => (
                                <motion.div 
                                  key={idx} 
                                  initial={{ opacity: 0, y: 10, scale: 0.97 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  transition={{ duration: 0.25, delay: idx * 0.08 }}
                                  whileHover={{ y: -2, x: 2 }}
                                  className={`relative border-2 border-dark rounded-xl p-4 shadow-[2px_2px_0px_#0A0A0A] transition-all ${item.isLive ? 'bg-[#FFFDF0] ring-2 ring-tertiary' : 'bg-white'}`}
                                >
                                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                                    <div className="flex items-center gap-2">
                                      <span className={`font-bold text-xs px-2 py-0.5 border border-dark rounded bg-white ${mono.className}`}>
                                        {item.time}
                                      </span>
                                      <span className={`border-2 border-dark text-[11px] font-bold px-2.5 py-0.5 rounded-full ${item.color} ${item.text || 'text-white'}`}>
                                        {item.type}
                                      </span>
                                    </div>
                                    {item.isLive && (
                                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-dark text-white rounded-full text-[10px] font-bold tracking-wide">
                                        <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-ping" />
                                        BERLANGSUNG
                                      </span>
                                    )}
                                  </div>
                                  <h3 className="text-base md:text-lg font-extrabold text-dark leading-snug">{item.title}</h3>
                                  <div className="mt-3 pt-3 border-t-2 border-dark/10 flex flex-wrap items-center justify-between text-xs font-bold text-dark gap-2">
                                    <div className="flex items-center gap-1.5">
                                      <MapPin className="w-4 h-4 text-gray-600" />
                                      <span>{item.room}</span>
                                    </div>
                                    <span className="text-gray-500">{item.sks} SKS</span>
                                  </div>
                                </motion.div>
                              ))
                            )}
                          </AccordionContent>
                        </AccordionItem>
                      </motion.div>
                    );
                  })}
                </Accordion>
              </motion.div>
            </AnimatePresence>
          </motion.section>

          {/* RIGHT COLUMN: LECTURERS DIRECTORY */}
          <motion.section 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-4 space-y-6"
          >
            <div className="bg-white rounded-2xl brutal-card p-6">
              <div className="flex items-center justify-between pb-3 border-b-2 border-dark mb-4">
                <div className="flex items-center gap-2.5">
                  <motion.div 
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    className="w-8 h-8 rounded-lg bg-green-500 text-dark border-2 border-dark shadow-[2px_2px_0px_#0A0A0A] flex items-center justify-center font-bold"
                  >
                    <GraduationCap className="w-5 h-5" strokeWidth={2.5} />
                  </motion.div>
                  <div>
                    <h2 className="text-lg font-extrabold text-dark tracking-tight">Dosen Pengampu</h2>
                    <p className="text-[11px] font-semibold text-gray-500">Daftar pengajar {activeTab}</p>
                  </div>
                </div>
              </div>
              
              <AnimatePresence mode="wait">
                <motion.div 
                  key={activeTab}
                  initial={{ opacity: 0, x: 15, scale: 0.99 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -15, scale: 0.99 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="space-y-4 max-h-[600px] overflow-y-auto pr-1"
                >
                  {currentLecturers.map((dosen, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25, delay: i * 0.04 }}
                      whileHover={{ x: -3, y: -3 }}
                      className="border-2 border-dark rounded-xl p-3 bg-white transition-all shadow-[2px_2px_0px_#0A0A0A] flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg border-2 border-dark flex items-center justify-center font-bold text-xs ${mono.className} ${dosen.color}`}>
                          {dosen.initials}
                        </div>
                        <div>
                          <h4 className="text-xs font-extrabold text-dark leading-tight">{dosen.name}</h4>
                          <p className="text-[10px] text-gray-600 font-bold mt-1">{dosen.role}</p>
                          <p className="text-[10px] text-gray-500 mt-0.5">{dosen.room}</p>
                        </div>
                      </div>
                      <motion.a 
                        whileHover={{ scale: 1.15, rotate: 5 }}
                        whileTap={{ scale: 0.85 }}
                        href={`https://wa.me/${dosen.phone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={`Kirim WhatsApp ke ${dosen.name}`}
                        className="w-8 h-8 rounded-lg border-2 border-dark bg-green-500 text-dark flex items-center justify-center shadow-[2px_2px_0px_#0A0A0A] hover:bg-green-400 transition-all shrink-0 cursor-pointer"
                      >
                        <MessageCircle className="w-4 h-4" strokeWidth={3} />
                      </motion.a>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.section>
        </div>
      </main>
    </motion.div>
  );
}