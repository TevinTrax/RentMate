import { NavLink, useLocation } from "react-router-dom";
import { DollarSign, User2, FileText, Clock } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function PaymentsNavbar() {
  const location = useLocation();
  const containerRef = useRef(null);
  const linkRefs = useRef([]);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const activeIndex = linkRefs.current.findIndex(
      (el) => el?.dataset.path === location.pathname
    );

    if (activeIndex !== -1) {
      const el = linkRefs.current[activeIndex];
      setIndicator({
        left: el.offsetLeft,
        width: el.offsetWidth,
      });
    }
  }, [location.pathname]);

  const navLinkClass = ({ isActive }) =>
    `relative flex items-center gap-2 px-4 py-2 text-sm font-semibold z-10
     ${isActive ? "text-white" : "text-gray-700 hover:text-green-600"}`;

  return (
    <nav
      ref={containerRef}
      className="relative max-w-4xl bg-white shadow-md p-2 rounded-2xl"
    >
      {/* Animated Indicator */}
      <span
        className="absolute top-2 bottom-2 rounded-xl bg-green-500 transition-all duration-300 ease-out"
        style={{
          left: indicator.left,
          width: indicator.width,
        }}
      />

      <div className="flex gap-2">
        <NavLink
          to="/admin/payments/transactions"
          ref={(el) => (linkRefs.current[0] = el)}
          data-path="/admin/payments/transactions"
          className={navLinkClass}
        >
          <DollarSign size={18} />
          Transactions
        </NavLink>

        <NavLink
          to="/admin/payments/package-subscriptions"
          ref={(el) => (linkRefs.current[1] = el)}
          data-path="/admin/payments/package-subscriptions"
          className={navLinkClass}
        >
          <User2 size={18} />
          Subscriptions
        </NavLink>

        <NavLink
          to="/admin/payments/payment-reports"
          ref={(el) => (linkRefs.current[2] = el)}
          data-path="/admin/payments/payment-reports"
          className={navLinkClass}
        >
          <FileText size={18} />
          Payment Reports
        </NavLink>

        <NavLink
          to="/admin/payments/fees-discounts"
          ref={(el) => (linkRefs.current[3] = el)}
          data-path="/admin/payments/fees-discounts"
          className={navLinkClass}
        >
          <DollarSign size={18} />
          Fees & Discounts
        </NavLink>

        <NavLink
          to="/admin/payments/audit-logs"
          ref={(el) => (linkRefs.current[4] = el)}
          data-path="/admin/payments/audit-logs"
          className={navLinkClass}
        >
          <Clock size={18} />
          Audit Logs
        </NavLink>
      </div>
    </nav>
  );
}

export default PaymentsNavbar;