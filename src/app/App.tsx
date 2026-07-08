import { useState } from "react";
import {
  Heart, Calendar, MapPin, BookOpen, User, Bell, Search,
  ChevronRight, ChevronLeft, Clock, Building2,
  CheckCircle, XCircle, AlertCircle, Settings, LogOut,
  Shield, Phone, Mail, Edit3, Star, Navigation,
  Droplets, Award, Activity, Info, Filter,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────

const USER = {
  name: "Sarah Johnson",
  firstName: "Sarah",
  bloodType: "O+",
  donationCount: 7,
  livesSaved: 21,
  nextEligible: "Aug 15, 2026",
  phone: "+1 (555) 234-5678",
  email: "sarah.johnson@email.com",
  dob: "March 14, 1992",
  weight: "62 kg",
  lastDonation: "May 12, 2026",
  memberSince: "2019",
};

const CAMPS = [
  {
    id: 1,
    name: "City General Hospital",
    address: "123 Medical Drive, Downtown",
    distance: "0.8 km",
    slots: 12,
    date: "Thu, Jul 10",
    time: "08:00 – 16:00",
    rating: 4.8,
    phone: "+1 (555) 100-2000",
    bloodTypes: ["O+", "A+", "AB−"],
    urgent: true,
  },
  {
    id: 2,
    name: "St. Mary Medical Center",
    address: "456 Health Avenue, Midtown",
    distance: "1.4 km",
    slots: 5,
    date: "Fri, Jul 11",
    time: "09:00 – 17:00",
    rating: 4.6,
    phone: "+1 (555) 200-3000",
    bloodTypes: ["B+", "O−", "O+"],
    urgent: false,
  },
  {
    id: 3,
    name: "Red Cross Community Center",
    address: "789 Charity Blvd, Eastside",
    distance: "2.1 km",
    slots: 18,
    date: "Sat, Jul 12",
    time: "07:00 – 15:00",
    rating: 4.9,
    phone: "+1 (555) 300-4000",
    bloodTypes: ["A−", "B−", "AB+"],
    urgent: false,
  },
  {
    id: 4,
    name: "Northside Blood Bank",
    address: "321 Care Street, Northside",
    distance: "3.5 km",
    slots: 8,
    date: "Mon, Jul 14",
    time: "08:30 – 14:30",
    rating: 4.5,
    phone: "+1 (555) 400-5000",
    bloodTypes: ["O+", "B+", "A+"],
    urgent: false,
  },
];

const TIME_SLOTS = [
  "08:00 AM","08:30 AM","09:00 AM","09:30 AM",
  "10:00 AM","10:30 AM","11:00 AM","11:30 AM",
  "01:00 PM","01:30 PM","02:00 PM","02:30 PM",
  "03:00 PM","03:30 PM","04:00 PM",
];

const TAKEN_SLOTS = ["09:00 AM", "10:00 AM", "01:30 PM"];

const UPCOMING_APPTS = [
  {
    id: 1,
    camp: "City General Hospital",
    address: "123 Medical Drive, Downtown",
    date: "Thu, Jul 10, 2026",
    time: "10:00 AM",
    status: "confirmed",
    ref: "REM-2026-0742",
  },
];

const PAST_APPTS = [
  {
    id: 2,
    camp: "St. Mary Medical Center",
    address: "456 Health Avenue, Midtown",
    date: "Mon, May 12, 2026",
    time: "09:30 AM",
    status: "completed",
    ref: "REM-2026-0588",
    units: "450 ml",
  },
  {
    id: 3,
    camp: "Red Cross Community Center",
    address: "789 Charity Blvd, Eastside",
    date: "Fri, Feb 20, 2026",
    time: "11:00 AM",
    status: "completed",
    ref: "REM-2026-0312",
    units: "450 ml",
  },
  {
    id: 4,
    camp: "Northside Blood Bank",
    address: "321 Care Street, Northside",
    date: "Tue, Nov 5, 2025",
    time: "02:00 PM",
    status: "cancelled",
    ref: "REM-2025-0988",
  },
  {
    id: 5,
    camp: "City General Hospital",
    address: "123 Medical Drive, Downtown",
    date: "Fri, Aug 15, 2025",
    time: "10:30 AM",
    status: "completed",
    ref: "REM-2025-0744",
    units: "450 ml",
  },
];

// July 2026: Jul 1 = Wednesday (offset 3 from Sunday)
const CAL_OFFSET = 3;
const CAL_DAYS = 31;
const TODAY_DAY = 7;
const AVAILABLE_DAYS = [8,9,10,11,12,14,15,16,17,18,21,22,23,24,25,28,29,30,31];

// ─────────────────────────────────────────────────────────────
// SHARED COMPONENTS
// ─────────────────────────────────────────────────────────────

function StatusBar() {
  return (
    <div className="flex items-center justify-between px-6 bg-white" style={{ paddingTop: 14, paddingBottom: 6 }}>
      <span className="text-xs font-bold text-[#1E293B]">9:41</span>
      <div className="w-[120px] h-[34px] bg-black rounded-full" />
      <div className="flex items-center gap-1.5">
        {/* Signal */}
        <div className="flex gap-[2px] items-end">
          {[3,5,7,9].map((h,i) => (
            <div key={i} className="w-[3px] rounded-[1px] bg-[#1E293B]" style={{ height: h }} />
          ))}
        </div>
        {/* WiFi */}
        <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
          <path d="M7.5 8.5C8.3 8.5 9 9.2 9 10S8.3 11.5 7.5 11.5 6 10.8 6 10 6.7 8.5 7.5 8.5Z" fill="#1E293B"/>
          <path d="M4.5 6.5C5.5 5.5 6.5 5 7.5 5C8.5 5 9.5 5.5 10.5 6.5" stroke="#1E293B" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
          <path d="M2 4C3.6 2.4 5.4 1.5 7.5 1.5C9.6 1.5 11.4 2.4 13 4" stroke="#1E293B" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
        </svg>
        {/* Battery */}
        <div className="flex items-center gap-[1px]">
          <div className="w-[22px] h-[11px] border border-[#1E293B] rounded-[3px] relative">
            <div className="absolute inset-[2px] bg-[#1E293B] rounded-[1px]" style={{ right: "20%" }} />
          </div>
          <div className="w-[2px] h-[5px] bg-[#1E293B] rounded-r-sm" />
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; text: string; Icon: any; label: string }> = {
    confirmed: { bg: "bg-green-50",   text: "text-green-700",  Icon: CheckCircle,  label: "Confirmed" },
    pending:   { bg: "bg-amber-50",   text: "text-amber-700",  Icon: AlertCircle,  label: "Pending"   },
    cancelled: { bg: "bg-red-50",     text: "text-red-800",    Icon: XCircle,      label: "Cancelled" },
    completed: { bg: "bg-slate-100",  text: "text-slate-600",  Icon: CheckCircle,  label: "Completed" },
    eligible:  { bg: "bg-blue-50",    text: "text-blue-700",   Icon: Shield,       label: "Eligible"  },
  };
  const c = map[status] ?? map.pending;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${c.bg} ${c.text}`}>
      <c.Icon size={11} />
      {c.label}
    </span>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[#64748B] text-[11px] font-bold uppercase tracking-widest mb-2 px-1">
      {children}
    </p>
  );
}

// ─────────────────────────────────────────────────────────────
// HOME SCREEN
// ─────────────────────────────────────────────────────────────

function HomeScreen({ onNavigate, onBook }: { onNavigate: (s: string) => void; onBook: (c: any) => void }) {
  return (
    <div className="bg-[#F8FAFC] min-h-full">

      {/* Red hero header */}
      <div className="px-5 pt-4 pb-10" style={{ background: "linear-gradient(135deg, #D62828 0%, #B91C1C 100%)" }}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-red-200 text-sm font-medium">Good morning,</p>
            <h1 className="text-white text-xl font-extrabold tracking-tight">Sarah Johnson 👋</h1>
          </div>
          <button className="relative w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Bell size={20} className="text-white" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-amber-400 rounded-full border-[1.5px] border-[#D62828]" />
          </button>
        </div>

        {/* Blood type card */}
        <div className="bg-white/15 rounded-2xl p-4 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-200 text-xs font-semibold mb-1">Your Blood Type</p>
              <div className="flex items-center gap-2.5">
                <span className="text-white text-4xl font-black">{USER.bloodType}</span>
                <span className="bg-white/20 text-white text-[11px] px-2.5 py-1 rounded-full font-semibold">
                  Universal Donor
                </span>
              </div>
              <p className="text-red-200 text-xs mt-2">Next eligible: <span className="text-white font-semibold">{USER.nextEligible}</span></p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Droplets size={30} className="text-white" />
              </div>
              <span className="text-white text-xs font-semibold">{USER.donationCount} donations</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lifted stats card */}
      <div className="mx-4 -mt-6 bg-white rounded-2xl border border-[#CBD5E1] p-4 mb-4" style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
        <div className="grid grid-cols-3 divide-x divide-[#E2E8F0]">
          {[
            { label: "Donations", value: USER.donationCount, Icon: Droplets, color: "text-[#D62828]" },
            { label: "Lives Saved", value: USER.livesSaved, Icon: Heart, color: "text-[#16A34A]" },
            { label: "Years Active", value: new Date().getFullYear() - parseInt(USER.memberSince), Icon: Award, color: "text-[#2563EB]" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-1 px-2">
              <s.Icon size={18} className={s.color} />
              <span className="text-[#1E293B] text-2xl font-black">{s.value}</span>
              <span className="text-[#64748B] text-[10px] text-center leading-tight">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Eligibility banner */}
      <div className="mx-4 mb-4 bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-start gap-3">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
          <Shield size={16} className="text-blue-600" />
        </div>
        <div>
          <p className="text-blue-900 text-sm font-bold">You&apos;re eligible to donate!</p>
          <p className="text-blue-600 text-xs mt-0.5 leading-relaxed">
            Your donation window is open. Schedule today and help save lives in your community.
          </p>
        </div>
      </div>

      {/* Upcoming appointment */}
      <div className="mx-4 mb-4">
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-[#1E293B] text-base font-bold">Upcoming Appointment</h2>
        </div>
        <div className="bg-white rounded-2xl border border-[#CBD5E1] overflow-hidden" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <div className="flex items-center justify-between px-4 py-2.5" style={{ background: "linear-gradient(90deg, #D62828, #B91C1C)" }}>
            <div className="flex items-center gap-2">
              <Calendar size={13} className="text-white" />
              <span className="text-white text-xs font-semibold">{UPCOMING_APPTS[0].date}</span>
            </div>
            <StatusBadge status={UPCOMING_APPTS[0].status} />
          </div>
          <div className="p-4">
            <p className="text-[#1E293B] font-bold text-sm mb-1">{UPCOMING_APPTS[0].camp}</p>
            <div className="flex items-center gap-1 mb-3">
              <MapPin size={12} className="text-[#16A34A]" />
              <span className="text-[#64748B] text-xs">{UPCOMING_APPTS[0].address}</span>
            </div>
            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-1.5">
                <Clock size={13} className="text-[#2563EB]" />
                <span className="text-[#64748B] text-xs">{UPCOMING_APPTS[0].time}</span>
              </div>
            </div>
            <div className="bg-[#F8FAFC] rounded-xl px-3 py-2 mb-3">
              <p className="text-[#64748B] text-[11px]">Reference No.</p>
              <p className="text-[#D62828] font-bold text-sm">{UPCOMING_APPTS[0].ref}</p>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 bg-white border border-[#CBD5E1] text-[#64748B] text-xs font-semibold py-2.5 rounded-xl">
                Cancel
              </button>
              <button className="flex-1 bg-[#D62828] text-white text-xs font-semibold py-2.5 rounded-xl" style={{ boxShadow: "0 2px 8px rgba(214,40,40,0.3)" }}>
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Nearby camps */}
      <div className="mx-4 mb-4">
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-[#1E293B] text-base font-bold">Nearby Donation Camps</h2>
          <button onClick={() => onNavigate("find")} className="text-[#D62828] text-xs font-bold flex items-center gap-0.5">
            See All <ChevronRight size={14} />
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {CAMPS.slice(0, 2).map((camp) => (
            <div key={camp.id} className="bg-white rounded-2xl border border-[#CBD5E1]" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Building2 size={22} className="text-[#D62828]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <p className="text-[#1E293B] font-bold text-sm">{camp.name}</p>
                      {camp.urgent && (
                        <span className="bg-red-50 text-[#D62828] text-[10px] font-black px-2 py-0.5 rounded-full flex-shrink-0">
                          URGENT
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin size={11} className="text-[#16A34A]" />
                      <span className="text-[#64748B] text-xs">{camp.distance} away</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5">
                      <div className="flex items-center gap-1">
                        <Calendar size={11} className="text-[#2563EB]" />
                        <span className="text-[#64748B] text-xs">{camp.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={11} className="text-[#64748B]" />
                        <span className="text-[#64748B] text-xs">{camp.slots} slots left</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-4 pb-4">
                <button
                  onClick={() => onBook(camp)}
                  className="w-full bg-[#D62828] text-white text-sm font-bold py-3 rounded-xl"
                  style={{ boxShadow: "0 3px 10px rgba(214,40,40,0.35)" }}
                >
                  Book Appointment
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Health tip */}
      <div className="mx-4 mb-6 bg-green-50 border border-green-200 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-1.5">
          <Activity size={15} className="text-green-600" />
          <p className="text-green-800 text-sm font-bold">Health Tip</p>
        </div>
        <p className="text-green-700 text-xs leading-relaxed">
          Drink at least 500 ml of water 2 hours before your donation appointment. Staying well-hydrated makes the process faster and more comfortable.
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// FIND CAMPS SCREEN
// ─────────────────────────────────────────────────────────────

function FindScreen({ onBook }: { onBook: (c: any) => void }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const FILTERS = [
    { id: "all",    label: "All Camps" },
    { id: "near",   label: "< 2 km" },
    { id: "urgent", label: "Urgent" },
    { id: "today",  label: "Today" },
  ];

  const filtered = CAMPS.filter((c) => {
    const matchQ = !query || c.name.toLowerCase().includes(query.toLowerCase()) || c.address.toLowerCase().includes(query.toLowerCase());
    const matchF =
      filter === "all" ||
      (filter === "near" && parseFloat(c.distance) < 2) ||
      (filter === "urgent" && c.urgent);
    return matchQ && matchF;
  });

  return (
    <div className="bg-[#F8FAFC] min-h-full pb-4">
      {/* Header */}
      <div className="bg-white px-5 pt-4 pb-4 border-b border-[#CBD5E1]">
        <h1 className="text-[#1E293B] text-xl font-extrabold mb-4">Find Donation Camps</h1>
        <div className="flex items-center gap-3 bg-[#F1F5F9] rounded-xl px-3 py-2.5 border border-[#CBD5E1]">
          <Search size={18} className="text-[#94A3B8] flex-shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search hospitals, locations..."
            className="flex-1 bg-transparent text-sm text-[#1E293B] placeholder-[#94A3B8] outline-none"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-[#94A3B8]">
              <XCircle size={16} />
            </button>
          )}
        </div>
        <div className="flex gap-2 mt-3 overflow-x-auto pb-0.5" style={{ scrollbarWidth: "none" }}>
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors ${
                filter === f.id
                  ? "bg-[#D62828] text-white"
                  : "bg-[#F1F5F9] text-[#64748B] border border-[#CBD5E1]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="px-4 pt-4">
        <p className="text-[#64748B] text-xs font-medium mb-3">
          <span className="font-bold text-[#1E293B]">{filtered.length}</span> camps found near Brooklyn, NY
        </p>
        <div className="flex flex-col gap-4">
          {filtered.map((camp) => (
            <div key={camp.id} className="bg-white rounded-2xl border border-[#CBD5E1] overflow-hidden" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Building2 size={24} className="text-[#D62828]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-[#1E293B] font-bold text-sm">{camp.name}</p>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Star size={12} className="text-amber-400 fill-amber-400" />
                        <span className="text-[#64748B] text-xs font-semibold">{camp.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin size={11} className="text-[#16A34A]" />
                      <span className="text-[#64748B] text-xs">{camp.address}</span>
                    </div>
                    {camp.urgent && (
                      <span className="inline-flex items-center gap-1 mt-1.5 bg-red-50 text-[#D62828] text-[10px] font-black px-2 py-0.5 rounded-full">
                        ⚡ URGENT NEED
                      </span>
                    )}
                  </div>
                </div>

                {/* Info grid */}
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {[
                    { Icon: Navigation, value: camp.distance, label: "Distance", color: "text-[#16A34A]" },
                    { Icon: Calendar,   value: String(camp.slots), label: "Slots Left", color: "text-[#2563EB]" },
                    { Icon: Clock,      value: camp.date.split(",")[1]?.trim() ?? camp.date, label: "Date", color: "text-[#64748B]" },
                  ].map(({ Icon, value, label, color }) => (
                    <div key={label} className="bg-[#F8FAFC] rounded-xl p-2 text-center">
                      <Icon size={13} className={`${color} mx-auto mb-0.5`} />
                      <p className="text-[#1E293B] text-xs font-bold">{value}</p>
                      <p className="text-[#94A3B8] text-[10px]">{label}</p>
                    </div>
                  ))}
                </div>

                {/* Blood types */}
                <div className="mt-3">
                  <p className="text-[#64748B] text-[11px] mb-1.5">Blood types urgently needed:</p>
                  <div className="flex gap-1.5 flex-wrap">
                    {camp.bloodTypes.map((bt) => (
                      <span
                        key={bt}
                        className={`px-2.5 py-0.5 rounded text-xs font-black ${
                          bt === USER.bloodType
                            ? "bg-[#D62828] text-white"
                            : "bg-[#F1F5F9] text-[#64748B]"
                        }`}
                      >
                        {bt}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="px-4 pb-4 flex gap-2">
                <button className="flex-1 bg-white border border-[#D62828] text-[#D62828] text-xs font-bold py-3 rounded-xl">
                  Get Directions
                </button>
                <button
                  onClick={() => onBook(camp)}
                  className="flex-1 bg-[#D62828] text-white text-xs font-bold py-3 rounded-xl"
                  style={{ boxShadow: "0 3px 10px rgba(214,40,40,0.35)" }}
                >
                  Book Slot
                </button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-12">
              <Search size={40} className="text-[#CBD5E1] mx-auto mb-3" />
              <p className="text-[#1E293B] font-semibold">No camps found</p>
              <p className="text-[#64748B] text-sm mt-1">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CALENDAR COMPONENT
// ─────────────────────────────────────────────────────────────

function CalendarGrid({ selected, onSelect }: { selected: number | null; onSelect: (d: number) => void }) {
  const DAY_LABELS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const cells: (number | null)[] = [];
  for (let i = 0; i < CAL_OFFSET; i++) cells.push(null);
  for (let d = 1; d <= CAL_DAYS; d++) cells.push(d);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[#1E293B] font-extrabold text-base">July 2026</h3>
        <div className="flex gap-1.5">
          <button className="w-8 h-8 rounded-full bg-[#F1F5F9] flex items-center justify-center">
            <ChevronLeft size={16} className="text-[#64748B]" />
          </button>
          <button className="w-8 h-8 rounded-full bg-[#F1F5F9] flex items-center justify-center">
            <ChevronRight size={16} className="text-[#64748B]" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 mb-2">
        {DAY_LABELS.map((d) => (
          <div key={d} className="text-center text-[#94A3B8] text-[11px] font-bold py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, i) => {
          if (day === null) return <div key={i} />;
          const isToday = day === TODAY_DAY;
          const isAvail = AVAILABLE_DAYS.includes(day);
          const isSel = day === selected;
          const isPast = day < TODAY_DAY;
          return (
            <button
              key={i}
              onClick={() => isAvail && onSelect(day)}
              disabled={isPast || !isAvail}
              className={`
                mx-auto w-9 h-9 rounded-xl text-xs font-bold transition-all flex items-center justify-center
                ${isSel ? "bg-[#D62828] text-white" : ""}
                ${isToday && !isSel ? "border-2 border-[#D62828] text-[#D62828]" : ""}
                ${isAvail && !isSel && !isToday ? "text-[#1E293B] hover:bg-red-50 hover:text-[#D62828]" : ""}
                ${(isPast || !isAvail) && !isSel && !isToday ? "text-[#CBD5E1] cursor-not-allowed" : ""}
              `}
            >
              {day}
            </button>
          );
        })}
      </div>
      <div className="flex gap-4 mt-3 justify-center">
        {[
          { cls: "bg-[#D62828]", label: "Selected" },
          { cls: "border-2 border-[#D62828]", label: "Today" },
          { cls: "bg-[#E2E8F0]", label: "Unavailable" },
        ].map(({ cls, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded-full ${cls}`} />
            <span className="text-[#64748B] text-[11px]">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// BOOKING SCREEN
// ─────────────────────────────────────────────────────────────

function BookingScreen({
  camp, onBack, onSuccess, onHome,
}: {
  camp: any; onBack: () => void; onSuccess: () => void; onHome: () => void;
}) {
  const [step, setStep] = useState<"datetime" | "confirm" | "success">("datetime");
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);

  // ── Success ──
  if (step === "success") {
    return (
      <div className="bg-[#F8FAFC] min-h-full flex flex-col items-center justify-center px-6 py-8">
        <div
          className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6"
          style={{ boxShadow: "0 0 0 14px rgba(22,163,74,0.08)" }}
        >
          <CheckCircle size={50} className="text-[#16A34A]" />
        </div>
        <h1 className="text-[#1E293B] text-2xl font-black text-center mb-2">Booking Confirmed!</h1>
        <p className="text-[#64748B] text-sm text-center mb-6 leading-relaxed">
          Your appointment has been successfully scheduled. See you soon!
        </p>

        <div className="w-full bg-white rounded-2xl border border-[#CBD5E1] p-4 mb-4" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#F1F5F9]">
            <span className="text-[#64748B] text-xs">Reference No.</span>
            <span className="text-[#D62828] text-sm font-black">REM-2026-0743</span>
          </div>
          {[
            { label: "Donation Camp", value: camp.name },
            { label: "Address", value: camp.address },
            { label: "Date", value: `July ${selectedDay}, 2026` },
            { label: "Time", value: selectedTime ?? "" },
            { label: "Blood Type", value: USER.bloodType },
            { label: "Donor", value: USER.name },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-start justify-between py-2 border-b border-[#F8FAFC] last:border-0">
              <span className="text-[#64748B] text-xs">{label}</span>
              <span className="text-[#1E293B] text-xs font-semibold text-right" style={{ maxWidth: 180 }}>{value}</span>
            </div>
          ))}
        </div>

        <div className="w-full bg-amber-50 border border-amber-200 rounded-xl p-3 mb-6">
          <p className="text-amber-800 text-xs text-center">
            📲 Confirmation sent to <span className="font-semibold">{USER.email}</span>
          </p>
        </div>

        <button
          onClick={onSuccess}
          className="w-full bg-[#D62828] text-white font-bold py-3.5 rounded-xl mb-3"
          style={{ boxShadow: "0 4px 16px rgba(214,40,40,0.35)" }}
        >
          View My Appointments
        </button>
        <button
          onClick={onHome}
          className="w-full bg-white border border-[#CBD5E1] text-[#64748B] font-semibold py-3.5 rounded-xl"
        >
          Return Home
        </button>
      </div>
    );
  }

  // ── Confirm ──
  if (step === "confirm") {
    return (
      <div className="bg-[#F8FAFC] min-h-full pb-6">
        <div className="bg-white px-5 pt-4 pb-4 border-b border-[#CBD5E1]">
          <div className="flex items-center gap-3 mb-3">
            <button onClick={() => setStep("datetime")} className="w-9 h-9 rounded-full bg-[#F1F5F9] flex items-center justify-center">
              <ChevronLeft size={20} className="text-[#1E293B]" />
            </button>
            <div>
              <h1 className="text-[#1E293B] text-lg font-extrabold">Confirm Booking</h1>
              <p className="text-[#64748B] text-xs">Step 2 of 2</p>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex-1 h-1.5 bg-[#D62828] rounded-full" />
            <div className="flex-1 h-1.5 bg-[#D62828] rounded-full" />
          </div>
        </div>

        <div className="px-4 pt-4">
          {/* Summary */}
          <div className="bg-white rounded-2xl border border-[#CBD5E1] p-4 mb-4" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <h3 className="text-[#1E293B] font-bold text-sm mb-3">Appointment Summary</h3>
            <div className="space-y-3">
              {[
                { Icon: Building2, bg: "bg-red-50", iconColor: "text-[#D62828]", title: camp.name, sub: camp.address },
                { Icon: Calendar, bg: "bg-blue-50", iconColor: "text-[#2563EB]", title: `July ${selectedDay}, 2026`, sub: `at ${selectedTime}` },
                { Icon: Droplets, bg: "bg-green-50", iconColor: "text-[#16A34A]", title: `Blood Type ${USER.bloodType}`, sub: "Whole blood donation · ~450 ml" },
              ].map(({ Icon, bg, iconColor, title, sub }) => (
                <div key={title} className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <Icon size={20} className={iconColor} />
                  </div>
                  <div>
                    <p className="text-[#1E293B] text-sm font-semibold">{title}</p>
                    <p className="text-[#64748B] text-xs">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Donor info */}
          <div className="bg-white rounded-2xl border border-[#CBD5E1] p-4 mb-4" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <h3 className="text-[#1E293B] font-bold text-sm mb-3">Donor Information</h3>
            <div>
              {[
                { label: "Full Name", value: USER.name },
                { label: "Phone",     value: USER.phone },
                { label: "Email",     value: USER.email },
                { label: "Date of Birth", value: USER.dob },
                { label: "Weight",    value: USER.weight },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between py-2.5 border-b border-[#F8FAFC] last:border-0">
                  <span className="text-[#64748B] text-xs">{label}</span>
                  <span className="text-[#1E293B] text-xs font-semibold">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reminder */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-4 flex items-start gap-2">
            <Info size={15} className="text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-blue-700 text-xs leading-relaxed">
              Arrive 15 minutes early. Bring a valid photo ID. Eat a light meal and drink plenty of water before your appointment.
            </p>
          </div>

          {/* Agreement */}
          <button
            onClick={() => setAgreed(!agreed)}
            className="flex items-start gap-3 bg-white rounded-xl border border-[#CBD5E1] p-3.5 mb-5 w-full text-left"
          >
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${agreed ? "bg-[#D62828] border-[#D62828]" : "border-[#CBD5E1] bg-white"}`}>
              {agreed && <CheckCircle size={12} className="text-white" />}
            </div>
            <p className="text-[#64748B] text-xs leading-relaxed">
              I confirm I meet the blood donation eligibility criteria and agree to the{" "}
              <span className="text-[#D62828] font-semibold">terms and conditions</span>.
            </p>
          </button>

          <button
            onClick={() => agreed && setStep("success")}
            disabled={!agreed}
            className={`w-full py-4 rounded-xl font-bold text-sm transition-all ${
              agreed ? "bg-[#D62828] text-white" : "bg-[#F1F5F9] text-[#94A3B8] cursor-not-allowed"
            }`}
            style={agreed ? { boxShadow: "0 4px 16px rgba(214,40,40,0.35)" } : {}}
          >
            Confirm Booking
          </button>
        </div>
      </div>
    );
  }

  // ── Step 1: Date & Time ──
  const canContinue = selectedDay !== null && selectedTime !== null;

  return (
    <div className="bg-[#F8FAFC] min-h-full pb-6">
      <div className="bg-white px-5 pt-4 pb-4 border-b border-[#CBD5E1]">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={onBack} className="w-9 h-9 rounded-full bg-[#F1F5F9] flex items-center justify-center">
            <ChevronLeft size={20} className="text-[#1E293B]" />
          </button>
          <div>
            <h1 className="text-[#1E293B] text-lg font-extrabold">Book Appointment</h1>
            <p className="text-[#64748B] text-xs">Step 1 of 2 · Select date &amp; time</p>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex-1 h-1.5 bg-[#D62828] rounded-full" />
          <div className="flex-1 h-1.5 bg-[#E2E8F0] rounded-full" />
        </div>
      </div>

      <div className="px-4 pt-4">
        {/* Camp card */}
        <div className="bg-white rounded-2xl border border-[#CBD5E1] p-4 mb-4" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <Building2 size={24} className="text-[#D62828]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[#1E293B] font-extrabold text-sm">{camp.name}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <MapPin size={11} className="text-[#16A34A]" />
                <span className="text-[#64748B] text-xs truncate">{camp.address}</span>
              </div>
              <div className="flex items-center gap-4 mt-1">
                <div className="flex items-center gap-1">
                  <Clock size={11} className="text-[#64748B]" />
                  <span className="text-[#64748B] text-xs">{camp.time}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Phone size={11} className="text-[#64748B]" />
                  <span className="text-[#64748B] text-xs">{camp.phone}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-2xl border border-[#CBD5E1] p-4 mb-4" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <CalendarGrid selected={selectedDay} onSelect={setSelectedDay} />
        </div>

        {/* Time slots */}
        {selectedDay && (
          <div className="bg-white rounded-2xl border border-[#CBD5E1] p-4 mb-4" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <h3 className="text-[#1E293B] font-bold text-sm mb-3">
              Available Times · <span className="text-[#64748B] font-normal">July {selectedDay}</span>
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {TIME_SLOTS.map((time) => {
                const isTaken = TAKEN_SLOTS.includes(time);
                const isSel = time === selectedTime;
                return (
                  <button
                    key={time}
                    onClick={() => !isTaken && setSelectedTime(time)}
                    disabled={isTaken}
                    className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                      isSel
                        ? "bg-[#D62828] text-white"
                        : isTaken
                        ? "bg-[#F1F5F9] text-[#CBD5E1] cursor-not-allowed line-through"
                        : "bg-[#F8FAFC] text-[#1E293B] border border-[#CBD5E1] hover:border-[#D62828] hover:text-[#D62828]"
                    }`}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <button
          onClick={() => canContinue && setStep("confirm")}
          disabled={!canContinue}
          className={`w-full py-4 rounded-xl font-bold text-sm transition-all ${
            canContinue ? "bg-[#D62828] text-white" : "bg-[#F1F5F9] text-[#94A3B8] cursor-not-allowed"
          }`}
          style={canContinue ? { boxShadow: "0 4px 16px rgba(214,40,40,0.35)" } : {}}
        >
          {canContinue ? "Continue to Confirm" : "Select a Date & Time to Continue"}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// APPOINTMENTS SCREEN
// ─────────────────────────────────────────────────────────────

function AppointmentsScreen() {
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");

  return (
    <div className="bg-[#F8FAFC] min-h-full pb-4">
      <div className="bg-white px-5 pt-4 pb-4 border-b border-[#CBD5E1]">
        <h1 className="text-[#1E293B] text-xl font-extrabold mb-4">My Appointments</h1>
        <div className="flex bg-[#F1F5F9] rounded-xl p-1">
          {(["upcoming", "past"] as const).map((id) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all capitalize ${
                tab === id ? "bg-white text-[#1E293B] shadow-sm" : "text-[#64748B]"
              }`}
            >
              {id === "upcoming" ? `Upcoming (${UPCOMING_APPTS.length})` : `Past (${PAST_APPTS.length})`}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-4">
        {tab === "upcoming" ? (
          <div className="flex flex-col gap-4">
            {UPCOMING_APPTS.map((apt) => (
              <div key={apt.id} className="bg-white rounded-2xl border border-[#CBD5E1] overflow-hidden" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                <div className="flex items-center justify-between px-4 py-3" style={{ background: "linear-gradient(90deg, #D62828, #B91C1C)" }}>
                  <div className="flex items-center gap-2">
                    <Calendar size={13} className="text-white" />
                    <span className="text-white text-xs font-bold">{apt.date}</span>
                  </div>
                  <StatusBadge status={apt.status} />
                </div>
                <div className="p-4">
                  <p className="text-[#1E293B] font-extrabold text-sm mb-1">{apt.camp}</p>
                  <div className="flex items-center gap-1 mb-3">
                    <MapPin size={12} className="text-[#16A34A]" />
                    <span className="text-[#64748B] text-xs">{apt.address}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mb-3">
                    <Clock size={13} className="text-[#2563EB]" />
                    <span className="text-[#64748B] text-xs">{apt.time}</span>
                  </div>
                  <div className="bg-[#F8FAFC] rounded-xl px-3 py-2.5 mb-4">
                    <p className="text-[#64748B] text-[11px] mb-0.5">Reference Number</p>
                    <p className="text-[#D62828] font-extrabold text-sm">{apt.ref}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-white border border-[#CBD5E1] text-[#64748B] text-xs font-bold py-3 rounded-xl">
                      Cancel
                    </button>
                    <button className="flex-1 bg-[#D62828] text-white text-xs font-bold py-3 rounded-xl" style={{ boxShadow: "0 2px 8px rgba(214,40,40,0.3)" }}>
                      Reschedule
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {PAST_APPTS.map((apt) => (
              <div key={apt.id} className="bg-white rounded-2xl border border-[#CBD5E1] p-4" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0 mr-2">
                    <p className="text-[#1E293B] font-bold text-sm">{apt.camp}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin size={11} className="text-[#16A34A]" />
                      <span className="text-[#64748B] text-xs truncate">{apt.address}</span>
                    </div>
                  </div>
                  <StatusBadge status={apt.status} />
                </div>
                <div className="flex items-center gap-4 mt-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={12} className="text-[#2563EB]" />
                    <span className="text-[#64748B] text-xs">{apt.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={12} className="text-[#64748B]" />
                    <span className="text-[#64748B] text-xs">{apt.time}</span>
                  </div>
                </div>
                {"units" in apt && apt.status === "completed" && (
                  <div className="bg-green-50 rounded-lg px-3 py-2 flex items-center gap-2 mb-2">
                    <Droplets size={13} className="text-[#16A34A]" />
                    <span className="text-green-700 text-xs font-semibold">{(apt as any).units} donated · helped save 3 lives</span>
                  </div>
                )}
                <p className="text-[#94A3B8] text-[11px]">Ref: {apt.ref}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// HISTORY SCREEN (donation stats)
// ─────────────────────────────────────────────────────────────

function HistoryScreen() {
  return (
    <div className="bg-[#F8FAFC] min-h-full pb-6">
      <div className="bg-white px-5 pt-4 pb-4 border-b border-[#CBD5E1]">
        <h1 className="text-[#1E293B] text-xl font-extrabold">Donation History</h1>
        <p className="text-[#64748B] text-xs mt-1">Your complete blood donation record</p>
      </div>

      <div className="px-4 pt-4">
        {/* Summary card */}
        <div
          className="rounded-2xl p-4 mb-4 text-white"
          style={{ background: "linear-gradient(135deg, #D62828 0%, #B91C1C 100%)", boxShadow: "0 4px 16px rgba(214,40,40,0.3)" }}
        >
          <p className="text-red-200 text-xs font-semibold mb-3">Lifetime Impact</p>
          <div className="grid grid-cols-3 divide-x divide-white/20">
            {[
              { value: USER.donationCount, label: "Donations", unit: "total" },
              { value: USER.livesSaved, label: "Lives Saved", unit: "people" },
              { value: "3.15", label: "Litres Given", unit: "blood" },
            ].map(({ value, label, unit }) => (
              <div key={label} className="text-center px-2">
                <p className="text-2xl font-black">{value}</p>
                <p className="text-red-200 text-[11px] font-semibold">{label}</p>
                <p className="text-white/50 text-[10px]">{unit}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Certificate badge */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 mb-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Award size={22} className="text-amber-600" />
          </div>
          <div>
            <p className="text-amber-900 text-sm font-bold">Bronze Donor Badge</p>
            <p className="text-amber-700 text-xs">5+ donations completed · Earn Silver at 10</p>
          </div>
        </div>

        {/* History list */}
        <SectionLabel>All Completed Donations</SectionLabel>
        <div className="flex flex-col gap-3">
          {PAST_APPTS.filter((a) => a.status === "completed").map((apt) => (
            <div key={apt.id} className="bg-white rounded-2xl border border-[#CBD5E1] p-4" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[#1E293B] font-bold text-sm">{apt.camp}</p>
                  <p className="text-[#64748B] text-xs mt-0.5">{apt.date}</p>
                </div>
                <div className="bg-green-50 rounded-xl px-2.5 py-1.5 text-center">
                  <Droplets size={14} className="text-[#16A34A] mx-auto mb-0.5" />
                  <p className="text-green-700 text-[10px] font-bold">{(apt as any).units}</p>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-1.5">
                <CheckCircle size={13} className="text-[#16A34A]" />
                <span className="text-green-700 text-xs">3 lives helped · Ref: {apt.ref}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Cancelled */}
        {PAST_APPTS.filter((a) => a.status === "cancelled").length > 0 && (
          <div className="mt-4">
            <SectionLabel>Cancelled</SectionLabel>
            {PAST_APPTS.filter((a) => a.status === "cancelled").map((apt) => (
              <div key={apt.id} className="bg-white rounded-2xl border border-[#CBD5E1] p-4" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[#1E293B] font-bold text-sm">{apt.camp}</p>
                    <p className="text-[#64748B] text-xs mt-0.5">{apt.date} · {apt.time}</p>
                  </div>
                  <StatusBadge status="cancelled" />
                </div>
                <p className="text-[#94A3B8] text-[11px] mt-2">Ref: {apt.ref}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PROFILE SCREEN
// ─────────────────────────────────────────────────────────────

function ProfileScreen() {
  return (
    <div className="bg-[#F8FAFC] min-h-full pb-6">
      {/* Red header */}
      <div className="px-5 pt-4 pb-10" style={{ background: "linear-gradient(135deg, #D62828 0%, #B91C1C 100%)" }}>
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-white text-xl font-extrabold">My Profile</h1>
          <button className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
            <Edit3 size={16} className="text-white" />
          </button>
        </div>
        <div className="flex items-center gap-4">
          <div
            className="w-20 h-20 bg-white rounded-full flex items-center justify-center flex-shrink-0"
            style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.25)" }}
          >
            <span className="text-[#D62828] text-2xl font-black">SJ</span>
          </div>
          <div>
            <p className="text-white text-lg font-extrabold">{USER.name}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-white/20 text-white text-xs px-2.5 py-1 rounded-full font-semibold">
                Blood Type: {USER.bloodType}
              </span>
            </div>
            <div className="flex items-center gap-1 mt-1.5">
              <Shield size={12} className="text-green-300" />
              <span className="text-red-200 text-xs font-medium">Eligible to donate</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lifted stats */}
      <div className="mx-4 -mt-6 bg-white rounded-2xl border border-[#CBD5E1] p-4 mb-4" style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
        <div className="grid grid-cols-3 divide-x divide-[#E2E8F0]">
          {[
            { value: USER.donationCount, label: "Donations", color: "text-[#D62828]" },
            { value: USER.livesSaved,    label: "Lives Saved", color: "text-[#16A34A]" },
            { value: USER.memberSince,   label: "Member Since", color: "text-[#2563EB]" },
          ].map(({ value, label, color }) => (
            <div key={label} className="flex flex-col items-center gap-0.5 px-2">
              <span className={`text-xl font-black ${color}`}>{value}</span>
              <span className="text-[#64748B] text-[10px] text-center">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4">
        {/* Personal info */}
        <SectionLabel>Personal Information</SectionLabel>
        <div className="bg-white rounded-2xl border border-[#CBD5E1] mb-4 overflow-hidden" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          {[
            { Icon: User,     label: "Full Name",    value: USER.name },
            { Icon: Phone,    label: "Phone",        value: USER.phone },
            { Icon: Mail,     label: "Email",        value: USER.email },
            { Icon: Calendar, label: "Date of Birth", value: USER.dob },
            { Icon: MapPin,   label: "Address",      value: "142 Maple St, Brooklyn, NY" },
          ].map(({ Icon, label, value }, i, arr) => (
            <div key={label} className={`flex items-center gap-3 px-4 py-3.5 ${i < arr.length - 1 ? "border-b border-[#F8FAFC]" : ""}`}>
              <div className="w-9 h-9 bg-[#F1F5F9] rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon size={16} className="text-[#64748B]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[#94A3B8] text-[11px]">{label}</p>
                <p className="text-[#1E293B] text-sm font-semibold truncate">{value}</p>
              </div>
              <ChevronRight size={15} className="text-[#CBD5E1] flex-shrink-0" />
            </div>
          ))}
        </div>

        {/* Health info */}
        <SectionLabel>Health Information</SectionLabel>
        <div className="bg-white rounded-2xl border border-[#CBD5E1] mb-4 overflow-hidden" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          {[
            { label: "Blood Type",     value: USER.bloodType,     valueClass: "text-[#D62828] font-extrabold" },
            { label: "Weight",         value: USER.weight,        valueClass: "text-[#1E293B] font-semibold" },
            { label: "Last Donation",  value: USER.lastDonation,  valueClass: "text-[#1E293B] font-semibold" },
            { label: "Next Eligible",  value: USER.nextEligible,  valueClass: "text-[#16A34A] font-bold" },
          ].map(({ label, value, valueClass }, i, arr) => (
            <div key={label} className={`flex items-center justify-between px-4 py-3.5 ${i < arr.length - 1 ? "border-b border-[#F8FAFC]" : ""}`}>
              <span className="text-[#64748B] text-sm">{label}</span>
              <span className={`text-sm ${valueClass}`}>{value}</span>
            </div>
          ))}
        </div>

        {/* Settings */}
        <SectionLabel>Settings &amp; Support</SectionLabel>
        <div className="bg-white rounded-2xl border border-[#CBD5E1] mb-4 overflow-hidden" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          {[
            { Icon: Bell,     label: "Notifications",      sub: "Enabled" },
            { Icon: Shield,   label: "Privacy & Security", sub: "" },
            { Icon: Info,     label: "Help & Support",     sub: "" },
            { Icon: Settings, label: "App Preferences",   sub: "" },
          ].map(({ Icon, label, sub }, i, arr) => (
            <div key={label} className={`flex items-center gap-3 px-4 py-3.5 ${i < arr.length - 1 ? "border-b border-[#F8FAFC]" : ""}`}>
              <div className="w-9 h-9 bg-[#F1F5F9] rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon size={16} className="text-[#64748B]" />
              </div>
              <span className="flex-1 text-[#1E293B] text-sm font-medium">{label}</span>
              {sub && <span className="text-[#64748B] text-xs">{sub}</span>}
              <ChevronRight size={15} className="text-[#CBD5E1] flex-shrink-0" />
            </div>
          ))}
        </div>

        {/* Logout */}
        <button className="w-full bg-red-50 border border-red-200 text-[#D62828] font-bold py-4 rounded-xl flex items-center justify-center gap-2">
          <LogOut size={18} />
          Log Out
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// BOTTOM NAV
// ─────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: "home",         label: "Home",     Icon: Heart    },
  { id: "find",         label: "Donate",   Icon: MapPin   },
  { id: "appointments", label: "Schedule", Icon: Calendar },
  { id: "history",      label: "History",  Icon: BookOpen },
  { id: "profile",      label: "Profile",  Icon: User     },
] as const;

function BottomNav({ active, onChange }: { active: string; onChange: (s: string) => void }) {
  return (
    <div className="bg-white border-t border-[#CBD5E1] px-1 pt-2 pb-3">
      <div className="flex">
        {NAV_ITEMS.map(({ id, label, Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className="flex-1 flex flex-col items-center gap-1"
            >
              <div className={`w-10 h-8 rounded-xl flex items-center justify-center transition-colors ${isActive ? "bg-red-50" : ""}`}>
                <Icon
                  size={22}
                  className={isActive ? "text-[#D62828]" : "text-[#64748B]"}
                  fill={isActive && id === "home" ? "#D62828" : "none"}
                />
              </div>
              <span className={`text-[10px] font-bold ${isActive ? "text-[#D62828]" : "text-[#64748B]"}`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// APP ROOT
// ─────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState("home");
  const [bookingCamp, setBookingCamp] = useState<any>(null);

  function handleBook(camp: any) {
    setBookingCamp(camp);
    setScreen("booking");
  }

  const navActive =
    screen === "booking" ? "find" : screen;

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)" }}
    >
      {/* App name watermark */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
        <Heart size={16} className="text-[#D62828] fill-[#D62828]" />
        <span className="text-white/60 text-sm font-bold tracking-wide">Remo Donations</span>
        <Heart size={16} className="text-[#D62828] fill-[#D62828]" />
      </div>

      {/* Phone frame */}
      <div
        className="relative flex flex-col overflow-hidden"
        style={{
          width: 390,
          height: 844,
          borderRadius: 47,
          background: "#F8FAFC",
          boxShadow: "0 0 0 10px #0F172A, 0 0 0 12px #334155, 0 40px 100px rgba(0,0,0,0.7)",
          fontFamily: "'Inter', system-ui, sans-serif",
        }}
      >
        {/* Status bar */}
        <div className="bg-white flex-shrink-0">
          <StatusBar />
        </div>

        {/* Screen content */}
        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          {screen === "home" && (
            <HomeScreen onNavigate={setScreen} onBook={handleBook} />
          )}
          {screen === "find" && (
            <FindScreen onBook={handleBook} />
          )}
          {screen === "booking" && bookingCamp && (
            <BookingScreen
              camp={bookingCamp}
              onBack={() => setScreen("find")}
              onSuccess={() => setScreen("appointments")}
              onHome={() => setScreen("home")}
            />
          )}
          {screen === "appointments" && <AppointmentsScreen />}
          {screen === "history" && <HistoryScreen />}
          {screen === "profile" && <ProfileScreen />}
        </div>

        {/* Bottom nav */}
        {screen !== "booking" && (
          <BottomNav active={navActive} onChange={setScreen} />
        )}
      </div>
    </div>
  );
}
