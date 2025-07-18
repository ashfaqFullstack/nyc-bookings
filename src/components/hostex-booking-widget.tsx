// "use client";
// import { useEffect, useRef } from "react";

// interface HostexBookingWidgetProps {
//   listingId?: string;
//   widgetId?: string;
//   className?: string;
// }

// export function HostexBookingWidget({
//   listingId,
//   widgetId,
//   // widgetId = "eyJob3N0X2lkIjoiMTAyODU2Iiwid2lkZ2V0X2hvc3QiOiJodHRwczovL3cuaG9zdGV4Ym9va2luZy5zaXRlIn0=",
//   className = ""
// }: HostexBookingWidgetProps) {
//   const containerRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (!containerRef.current) return;

//     // Clear any existing content
//     containerRef.current.innerHTML = '';

//     // Create the exact widget HTML as provided by Hostex
//       // <script src="https://hostex.io/app/assets/js/hostex-widget.js?version=20250714104930" type="module"></script>

//     const widgetHTML = `
//       <script src="https://hostex.io/app/assets/js/hostex-widget.js?version=20250626192333" type="module"></script>
//       <hostex-booking-widget listing-id="${listingId}" id="${widgetId}"></hostex-booking-widget>
//     `;

//     // Insert the widget HTML directly
//     containerRef.current.innerHTML = widgetHTML;

//     // Add CSS to fix dropdown positioning
//     const style = document.createElement('style');
//     style.id = 'hostex-dropdown-positioning-fix';
//     style.textContent = `
//       /* Fix Hostex dropdown positioning */
//       hostex-booking-widget {
//         position: relative !important;
//         z-index: 10 !important;
//       }

//       hostex-booking-widget * {
//         box-sizing: border-box !important;
//       }

//       /* Ensure dropdowns position correctly */
//       hostex-booking-widget [role="combobox"],
//       hostex-booking-widget [role="listbox"],
//       hostex-booking-widget .dropdown,
//       hostex-booking-widget .dropdown-menu,
//       hostex-booking-widget [data-testid*="guest"],
//       hostex-booking-widget [data-testid*="dropdown"] {
//         position: relative !important;
//         z-index: 9999 !important;
//       }

//       /* Fix dropdown container positioning */
//       hostex-booking-widget [role="listbox"],
//       hostex-booking-widget .dropdown-menu {
//         position: absolute !important;
//         top: 100% !important;
//         left: 0 !important;
//         right: auto !important;
//         transform: none !important;
//         margin-top: 4px !important;
//       }
//     `;

//     // Remove existing style if it exists
//     const existingStyle = document.getElementById('hostex-dropdown-positioning-fix');
//     if (existingStyle) {
//       existingStyle.remove();
//     }

//     document.head.appendChild(style);

//     // Execute the script
//     const scripts = containerRef.current.querySelectorAll('script');
//     for (const script of scripts) {
//       const newScript = document.createElement('script');
//       newScript.innerHTML = script.innerHTML;
//       for (const attr of script.attributes) {
//         newScript.setAttribute(attr.name, attr.value);
//       }
//       document.head.appendChild(newScript);
//     }

//     return () => {
//       // Cleanup styles when component unmounts
//       const styleToRemove = document.getElementById('hostex-dropdown-positioning-fix');
//       if (styleToRemove) {
//         styleToRemove.remove();
//       }
//     };
//   }, [listingId, widgetId]);

//   return (
//     <div className={className} style={{ position: 'relative', isolation: 'isolate' }}>
//       <div
//         className="bg-white rounded-lg shadow-sm border p-4 mb-4"
//         style={{
//           position: 'relative',
//           overflow: 'visible',
//           zIndex: 1
//         }}
//       >
//         <div className="text-center mb-4">
//           <h3 className="text-lg font-semibold text-gray-800">Book Your Stay</h3>
//           <p className="text-sm text-gray-600">
//             Secure booking through Hostex
//           </p>
//         </div>

//         {/* Pure Hostex Widget Container - Positioned for dropdowns */}
//         <div
//           ref={containerRef}
//           style={{
//             minHeight: '500px',
//             width: '100%',
//             position: 'relative',
//             overflow: 'visible',
//             zIndex: 10
//           }}
//         />

//         <div className="text-center mt-4">
//           <p className="text-xs text-gray-500">🔒 Secure • ✅ Instant Confirmation</p>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";
import { useEffect } from "react";

interface HostexBookingWidgetProps {
  listingId?: string;
  widgetId?: string;
  className?: string;
  scriptsrc?: string;
}

export function HostexBookingWidget({
  listingId,
  widgetId,
  className = "",
  scriptsrc
}: HostexBookingWidgetProps) {
  useEffect(() => {
    const scriptId = "hostex-widget-script";

    // Only load the widget script once globally
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = scriptsrc || "https://hostex.io/app/assets/js/hostex-widget.js?version=20250714104930";
      script.type = "module";
      document.body.appendChild(script);
    }
  }, [scriptsrc]);

  if (!listingId || !widgetId) return null;

  return (
    <div className={className} style={{ position: "relative", isolation: "isolate" }}>
      <div
        className="bg-white rounded-lg shadow-sm border p-4 mb-4"
        style={{
          position: "relative",
          overflow: "visible",
          zIndex: 1,
        }}
      >
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Book Your Stay</h3>
          <p className="text-sm text-gray-600">Secure booking through Hostex</p>
        </div>

        {/* Widget as JSX */}
        <div className="min-h-[500px] max-w-[1350px] mx-auto relative z-10">
          <hostex-booking-widget
            listing-id={listingId}
            id={widgetId}
          />
        </div>

        {/* <div style={{
          minHeight: "500px",
          width: "1350px",
          maxWidth: "1350px",
          margin: '0 auto 0 auto',
          position: "relative",
          zIndex: 10,
        }}>
          <hostex-booking-widget
            listing-id={listingId}
            id={widgetId}
          />
        </div> */}

        <div className="text-center mt-4">
          <p className="text-xs text-gray-500">🔒 Secure • ✅ Instant Confirmation</p>
        </div>
      </div>
    </div>
  );
}
