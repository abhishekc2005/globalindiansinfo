"use client";

import { ReactNode, useLayoutEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  useLayoutEffect(() => {
    // Ensure window exists
    if (typeof window === "undefined") return;

    // Register plugins
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    // Create ScrollSmoother
    const smoother = ScrollSmoother.create({
      smooth: 1, // how long (in seconds) it takes to "catch up" to the native scroll position
      effects: true, // looks for data-speed and data-lag attributes on elements
      smoothTouch: 0.1, // much shorter smoothing time on touch devices (default is NO smoothing on touch devices)
    });

    setIsReady(true);

    return () => {
      // Cleanup
      smoother.kill();
    };
  }, []);

  return (
    <div id="smooth-wrapper">
      <div id="smooth-content">{children}</div>
    </div>
  );
}
