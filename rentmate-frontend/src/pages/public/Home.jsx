import {
  ArrowRight,
  Wallet,
  Building2,
  Users,
  Bell,
  Wrench,
  CheckCircle2,
  TrendingUp,
  Clock3,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import bgImage from "@/assets/images/img2.jpg";

function Home() {
  const location = useLocation();
  const navigate = useNavigate();

  const [rentCollected, setRentCollected] = useState(0);
  const [occupiedUnits, setOccupiedUnits] = useState(0);
  const [tenants, setTenants] = useState(0);
  const [repairs, setRepairs] = useState(0);

  const activities = [
    {
      title: "New tenant application received",
      time: "2 mins ago",
      color: "bg-green-50 border-green-100",
    },
    {
      title: "Rent due reminder sent",
      time: "15 mins ago",
      color: "bg-amber-50 border-amber-100",
    },
    {
      title: "Maintenance request updated",
      time: "1 hour ago",
      color: "bg-blue-50 border-blue-100",
    },
    {
      title: "Unit B-04 marked as occupied",
      time: "Today",
      color: "bg-emerald-50 border-emerald-100",
    },
  ];

  const [currentActivity, setCurrentActivity] = useState(0);

  // Scroll to section if URL contains hash
  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  // Animated counters
  useEffect(() => {
    const animateValue = (setter, target, speed = 20) => {
      let start = 0;
      const increment = Math.ceil(target / 50);

      const interval = setInterval(() => {
        start += increment;
        if (start >= target) {
          setter(target);
          clearInterval(interval);
        } else {
          setter(start);
        }
      }, speed);

      return interval;
    };

    const rentInterval = animateValue(setRentCollected, 245000, 15);
    const occupiedInterval = animateValue(setOccupiedUnits, 18, 80);
    const tenantInterval = animateValue(setTenants, 36, 70);
    const repairInterval = animateValue(setRepairs, 4, 120);

    return () => {
      clearInterval(rentInterval);
      clearInterval(occupiedInterval);
      clearInterval(tenantInterval);
      clearInterval(repairInterval);
    };
  }, []);

  // Rotate live activity
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentActivity((prev) => (prev + 1) % activities.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const occupancyPercentage = (occupiedUnits / 20) * 100;

  return (
    <section
      className="w-full min-h-screen h-screen overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage: `
          linear-gradient(to right,
            rgba(248, 250, 252, 0.94),
            rgba(220, 252, 231, 0.68),
            rgba(21, 128, 61, 0.35)
          ),
          url(${bgImage})
        `,
      }}
    >
      <div className="container mx-auto px-6 pt-24 pb-6 h-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* LEFT SIDE */}
        <div className="flex flex-col justify-center h-full">
          {/* Trusted Badge */}
          <div className="max-w-sm bg-green-200 rounded-3xl shadow-sm text-center px-4 py-2 mb-3">
            <h2 className="text-sm md:text-base text-green-700 font-bold">
              Trusted by 10,000+ Property Owners
            </h2>
          </div>

          {/* Heading */}
          <div className="max-w-2xl text-left mb-3">
            <h3 className="text-4xl md:text-6xl font-bold text-gray-800 leading-tight">
              Simplify Your <br />
              <span className="text-green-600">Rental Business</span>
            </h3>
          </div>

          {/* Subheading */}
          <div className="max-w-2xl mb-5">
            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
              Streamline property management, automate rent collection, and provide exceptional tenant experiences with our all-in-one platform.
            </p>
          </div>

          {/* CTA */}
          <div className="mt-2">
            <button
              className="flex items-center justify-center gap-2 bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 hover:scale-[1.02] active:scale-[0.98] transition min-w-[230px] w-full sm:w-auto shadow-md"
              onClick={() => navigate("/free-trial")}
            >
              Start Free Trial
              <ArrowRight size={20} className="font-semibold" />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 max-w-xl mt-7">
            <div className="text-center bg-white/70 backdrop-blur-sm rounded-2xl p-3 shadow-sm border border-green-100">
              <h4 className="text-2xl font-bold text-green-600">99.9%</h4>
              <p className="text-gray-700 text-xs md:text-sm">Uptime</p>
            </div>
            <div className="text-center bg-white/70 backdrop-blur-sm rounded-2xl p-3 shadow-sm border border-green-100">
              <h4 className="text-2xl font-bold text-green-600">24/7</h4>
              <p className="text-gray-700 text-xs md:text-sm">Support</p>
            </div>
            <div className="text-center bg-white/70 backdrop-blur-sm rounded-2xl p-3 shadow-sm border border-green-100">
              <h4 className="text-2xl font-bold text-green-600">15 min</h4>
              <p className="text-gray-700 text-xs md:text-sm">Setup Time</p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full flex items-center justify-center h-full">
          <div className="relative w-full max-w-lg bg-white/85 backdrop-blur-xl border border-green-100 shadow-[0_8px_24px_rgba(0,0,0,0.07)] rounded-[1.8rem] p-5 md:p-6 overflow-hidden">
            
            {/* Soft Glow */}
            <div className="absolute -top-14 -right-14 w-24 h-24 bg-green-300/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-emerald-200/20 rounded-full blur-3xl"></div>

            <div className="relative">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-[11px] text-gray-500 mb-1">Welcome back, Landlord</p>
                  <h3 className="text-lg md:text-xl font-bold text-gray-800">
                    RentMate Dashboard
                  </h3>
                </div>

                <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-[11px] font-medium shadow-sm">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Live
                </div>
              </div>

              {/* TOP CARDS */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {/* Rent */}
                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-4 shadow-sm min-h-[110px] flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <Wallet size={16} />
                    <span className="text-[9px] bg-white/20 px-2 py-1 rounded-full">
                      This Month
                    </span>
                  </div>

                  <div>
                    <p className="text-[11px] text-white/90 mb-1">Rent Collected</p>
                    <h4 className="text-lg md:text-xl font-bold">
                      Ksh {rentCollected.toLocaleString()}
                    </h4>
                  </div>
                </div>

                {/* Occupancy */}
                <div className="bg-white rounded-2xl p-4 border border-green-100 shadow-sm min-h-[110px] flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <Building2 className="text-green-600" size={16} />
                    <span className="text-[9px] bg-green-50 text-green-700 px-2 py-1 rounded-full">
                      Active
                    </span>
                  </div>

                  <div>
                    <p className="text-[11px] text-gray-500 mb-1">Occupied Units</p>
                    <h4 className="text-lg md:text-xl font-bold text-gray-800">
                      {occupiedUnits} / 20
                    </h4>
                  </div>

                  <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden mt-2">
                    <div
                      className="h-full bg-green-500 rounded-full transition-all duration-1000"
                      style={{ width: `${occupancyPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* MIDDLE */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {/* Recent Payments */}
                <div className="bg-white rounded-2xl p-4 border border-green-100 shadow-sm min-h-[140px]">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-xs text-gray-800">Recent Payments</h4>
                    <CheckCircle2 className="text-green-600" size={15} />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="font-medium text-xs text-gray-800">John Kamau</p>
                        <p className="text-[10px] text-gray-500">Unit A-12</p>
                      </div>
                      <span className="text-green-600 text-xs font-semibold whitespace-nowrap">
                        Ksh 12,000
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="font-medium text-xs text-gray-800">Mary Achieng</p>
                        <p className="text-[10px] text-gray-500">Unit B-03</p>
                      </div>
                      <span className="text-green-600 text-xs font-semibold whitespace-nowrap">
                        Ksh 15,500
                      </span>
                    </div>
                  </div>
                </div>

                {/* Live Activity */}
                <div className="bg-white rounded-2xl p-4 border border-green-100 shadow-sm min-h-[140px]">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-xs text-gray-800">Live Activity</h4>
                    <Bell className="text-green-600" size={15} />
                  </div>

                  <div
                    className={`rounded-xl p-3 border transition-all duration-700 h-[90px] flex flex-col justify-between ${activities[currentActivity].color}`}
                  >
                    <p className="text-xs font-medium text-gray-800 leading-relaxed">
                      {activities[currentActivity].title}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-[10px] text-gray-500">
                      <Clock3 size={11} />
                      {activities[currentActivity].time}
                    </div>
                  </div>
                </div>
              </div>

              {/* BOTTOM 3 CARDS */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white rounded-2xl p-3 border border-green-100 shadow-sm min-h-[95px] flex flex-col justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="text-green-600" size={14} />
                    <h5 className="font-semibold text-xs text-gray-800">Tenants</h5>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-800">{tenants}</p>
                    <p className="text-[10px] text-gray-500">Residents</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-3 border border-green-100 shadow-sm min-h-[95px] flex flex-col justify-between">
                  <div className="flex items-center gap-2">
                    <Wrench className="text-green-600" size={14} />
                    <h5 className="font-semibold text-xs text-gray-800">Repairs</h5>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-800">{repairs}</p>
                    <p className="text-[10px] text-gray-500">Pending</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-3 border border-green-100 shadow-sm min-h-[95px] flex flex-col justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="text-green-600" size={14} />
                    <h5 className="font-semibold text-xs text-gray-800">Growth</h5>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-800">+12%</p>
                    <p className="text-[10px] text-gray-500">This month</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* END RIGHT SIDE */}
      </div>
    </section>
  );
}

export default Home;