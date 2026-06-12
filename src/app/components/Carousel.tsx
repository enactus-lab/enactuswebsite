"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, PanInfo, useMotionValue, useTransform } from "motion/react";
import React from "react";
import { FiCalendar } from "react-icons/fi";
import { supabase } from "@/lib/supabase";

export interface CarouselItem {
  title: string;
  description: string;
  id: number;
  icon: React.ReactNode;
}

export interface CarouselProps {
  baseWidth?: number;
  autoplay?: boolean;
  autoplayDelay?: number;
  pauseOnHover?: boolean;
  loop?: boolean;
  round?: boolean;
}

const DRAG_BUFFER = 0;
const VELOCITY_THRESHOLD = 500;
const GAP = 16;
const SPRING_OPTIONS = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
};

function CarouselItem({ item, index, itemWidth, round, trackItemOffset, x, transition }: any) {
  const range = [
    -(index + 1) * trackItemOffset,
    -index * trackItemOffset,
    -(index - 1) * trackItemOffset,
  ];
  const outputRange = [90, 0, -90];
  const rotateY = useTransform(x, range, outputRange, { clamp: false });

  return (
    <motion.div
      className="relative shrink-0 flex flex-col items-start justify-between bg-black/60 border border-amber-400/20 rounded-[14px] overflow-hidden cursor-grab active:cursor-grabbing"
      style={{
        width: itemWidth,
        height: "100%",
        rotateY,
      }}
      transition={transition}
    >
      <div className="p-4">
        <span className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-amber-400/10 border border-amber-400/30">
          {item.icon}
        </span>
      </div>
      <div className="p-4 pt-0">
        <div className="mb-1 font-bold text-base text-white">{item.title}</div>
        <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
      </div>
    </motion.div>
  );
}

export default function Carousel({
  baseWidth = 300,
  autoplay = false,
  autoplayDelay = 3000,
  pauseOnHover = false,
  loop = false,
  round = false,
}: CarouselProps) {
  const [items, setItems] = useState<CarouselItem[]>([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const { data } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false });

      if (data && data.length > 0) {
        setItems(
          data.map((ann: any, i: number) => ({
            id: i + 1,
            title: ann.title,
            description: ann.content,
            icon: <FiCalendar className="h-[14px] w-[14px] text-amber-400" />,
          }))
        );
      } else {
        setItems([
          {
            id: 1,
            title: "Welcome to Enactus",
            description: "Stay tuned for announcements.",
            icon: <FiCalendar className="h-[14px] w-[14px] text-amber-400" />,
          },
        ]);
      }
    };

    fetchAnnouncements();
  }, []);

  const containerPadding = 16;
  const itemWidth = baseWidth - containerPadding * 2;
  const trackItemOffset = itemWidth + GAP;

  const itemsForRender = useMemo(() => {
    if (!loop) return items;
    if (items.length === 0) return [];
    return [items[items.length - 1], ...items, items[0]];
  }, [items, loop]);

  const [position, setPosition] = useState(loop ? 1 : 0);
  const x = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pauseOnHover || !containerRef.current) return;
    const el = containerRef.current;
    const enter = () => setIsHovered(true);
    const leave = () => setIsHovered(false);
    el.addEventListener("mouseenter", enter);
    el.addEventListener("mouseleave", leave);
    return () => {
      el.removeEventListener("mouseenter", enter);
      el.removeEventListener("mouseleave", leave);
    };
  }, [pauseOnHover]);

  useEffect(() => {
    if (!autoplay || itemsForRender.length <= 1) return;
    if (pauseOnHover && isHovered) return;
    const timer = setInterval(() => {
      setPosition((p) => Math.min(p + 1, itemsForRender.length - 1));
    }, autoplayDelay);
    return () => clearInterval(timer);
  }, [autoplay, autoplayDelay, pauseOnHover, isHovered, itemsForRender.length]);

  useEffect(() => {
    const start = loop ? 1 : 0;
    setPosition(start);
    x.set(-start * trackItemOffset);
  }, [items.length, loop, trackItemOffset, x]);

  const transition = SPRING_OPTIONS;

  const handleDragEnd = (_: any, info: PanInfo) => {
    const { offset, velocity } = info;
    const direction =
      offset.x < -DRAG_BUFFER || velocity.x < -VELOCITY_THRESHOLD
        ? 1
        : offset.x > DRAG_BUFFER || velocity.x > VELOCITY_THRESHOLD
        ? -1
        : 0;
    if (direction === 0) return;
    setPosition((prev) =>
      Math.max(0, Math.min(prev + direction, itemsForRender.length - 1))
    );
  };

  const activeIndex = loop
    ? (position - 1 + items.length) % items.length
    : Math.min(position, items.length - 1);

  if (items.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md p-4"
      style={{ width: `${baseWidth}px`, maxWidth: "100%" }}
    >
      <div className="mb-3 flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
        <span className="text-[10px] font-semibold tracking-widest text-amber-400/80 uppercase">
          Announcements
        </span>
      </div>
      <motion.div
        className="flex"
        drag={isAnimating ? false : "x"}
        style={{
          gap: `${GAP}px`,
          perspective: 1000,
          perspectiveOrigin: `${position * trackItemOffset + itemWidth / 2}px 50%`,
          x,
        }}
        onDragEnd={handleDragEnd}
        animate={{ x: -(position * trackItemOffset) }}
        transition={transition}
        onAnimationStart={() => setIsAnimating(true)}
        onAnimationComplete={() => setIsAnimating(false)}
      >
        {itemsForRender.map((item, index) => (
          <CarouselItem
            key={`${item.id}-${index}`}
            item={item}
            index={index}
            itemWidth={itemWidth}
            round={round}
            trackItemOffset={trackItemOffset}
            x={x}
            transition={transition}
          />
        ))}
      </motion.div>
      <div className="mt-3 flex justify-center gap-2">
        {items.map((_, index) => (
          <motion.div
            key={index}
            className={`h-1.5 rounded-full cursor-pointer transition-all ${
              activeIndex === index ? "bg-amber-400 w-4" : "bg-white/20 w-1.5"
            }`}
            animate={{ scale: activeIndex === index ? 1 : 0.8 }}
            onClick={() => setPosition(loop ? index + 1 : index)}
          />
        ))}
      </div>
    </div>
  );
}