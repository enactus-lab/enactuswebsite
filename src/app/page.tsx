"use client";

import StaggeredMenu from "@/app/components/ui/StaggeredMenu";
import TextPressure from "./components/TextPressure";
import BlurText from "./BlurText";
import InfiniteMenu from "@/app/components/ui/InfiniteMenu";
import LiquidEther from "@/app/components/ui/LiquidEther";
import Carousel from "./components/Carousel";
import Masonry from "@/app/components/Masonry";
import FlowingMenu from "@/app/components/FlowingMenu";
import { AnimatedModalDemo } from "@/app/components/ui/AnimatedModalDemo";

export default function Home() {
  const menuItems = [
    { label: "Home", ariaLabel: "Go to home page", link: "/" },
    { label: "About", ariaLabel: "Learn about Enactus", link: "#about" },
    { label: "Projects", ariaLabel: "View our projects", link: "/projects" },
    { label: "Team", ariaLabel: "Meet our team", link: "/core-team" },
    { label: "Admin", ariaLabel: "Admin Dashboard", link: "/admin" },
    { label: "Tasks", ariaLabel: "View team tasks", link: "/admin/tasks" },
  ];

  const socialItems = [
    { label: "LinkedIn", link: "https://linkedin.com/company/enactus-aryabhatta" },
    { label: "Instagram", link: "https://instagram.com/enactusaryabhatta" },
    { label: "Twitter", link: "https://twitter.com/enactusaryabhatta" },
  ];

  const infiniteItems = [
    {
      image: "/image1.png",
      link: "https://www.instagram.com/p/CjdQKGbLncM/",
      title: "",
      description: "Jar candles",
    },
    {
      image: "/image2.png",
      link: "https://www.instagram.com/p/C-ske3TSwKY/",
      title: "Resin Rakhi",
      description: "Rakhi",
      titleSize: "2rem",
      descriptionSize: "1rem",
    },
    {
      image: "/image3.png",
      link: "https://www.instagram.com/reel/DGsNQT-x35L/",
      title: "Organic Gulaal",
      description: "Abir",
    },
    {
      image: "/image4.png",
      link: "https://www.instagram.com/reel/DGsNQT-x35L/",
      description: "Jar with Lid Candles",
    },
  ];

  const masonryItems = [
  { id: "1", img: "tanmay1.jpg", url: "/projects", height: 520 },
  { id: "2", img: "tanmay2.png", url: "/projects", height: 380 },
  { id: "3", img: "tanmay3.png", url: "/projects", height: 620 },
  { id: "4", img: "tanmay4.png", url: "/projects", height: 300 },
  { id: "5", img: "tanmay5.png", url: "/projects", height: 580 },
  { id: "6", img: "tanmay6.png", url: "/projects", height: 420 },
  { id: "7", img: "tanmay7.jpg", url: "/projects", height: 680 },
  { id: "8", img: "tanmay8.jpeg", url: "/projects", height: 350 },

  ];

  return (
    <main className="min-h-screen bg-black text-slate-100 relative">

      {/* MENU */}
      <div className="fixed top-0 left-0 w-full z-[9999]">
        <StaggeredMenu
          isFixed
          position="right"
          items={menuItems}
          socialItems={socialItems}
          displaySocials
          displayItemNumbering
          menuButtonColor="#f8fafc"
          openMenuButtonColor="#fbbf24"
          changeMenuColorOnOpen
          colors={["#1e293b", "#0f172a", "#334155"]}
          accentColor="#fbbf24"
        />
      </div>

      {/* HERO */}
      <section className="relative w-full min-h-screen overflow-hidden">
        <div className="absolute inset-0 z-0">
          <LiquidEther />
        </div>
        <div className="relative z-10 flex items-center min-h-screen px-4 pt-24 pb-12 max-w-6xl mx-auto">
          <div className="w-full">
            <p className="text-amber-400 text-xs tracking-[0.3em] uppercase mb-4 font-medium">
              Enactus · Aryabhatta College · New Delhi
            </p>
            <h1 className="mb-4 font-extrabold">
              <span className="block text-6xl md:text-9xl text-white leading-none">Enactus</span>
              <span className="block text-4xl md:text-8xl text-amber-300 mt-2 leading-none">
                Aryabhatta College
              </span>
            </h1>
            <p className="max-w-xl mt-6 mb-8 text-sm md:text-base text-slate-400 font-normal leading-relaxed">
              We build student-led projects that create measurable impact for
              communities while helping members grow as leaders.
            </p>
            <Carousel baseWidth={300} autoplay={true} autoplayDelay={4000} loop={false} />
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="border-t border-slate-800/60 bg-black">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-20 flex flex-col gap-12 md:gap-24">

          {/* ABOUT US HEADING */}
          <div>
            <TextPressure text="ABOUT US" textColor="#ffffff" minFontSize={60} />
          </div>

          {/* INTRO TEXT */}
          <BlurText
            text="Since 2016, we have been empowering communities through bold entrepreneurial action. From sustainability to social transformation, our work is driven by the mission to create meaningful and measurable impact."
            animateBy="words"
            direction="bottom"
            delay={35}
            stepDuration={0.4}
            className="max-w-3xl mx-auto text-slate-300 text-center text-base md:text-xl leading-relaxed tracking-wide font-light"
          />

          {/* TEXT + IMAGE */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
            <div>
              <div className="w-12 h-1 bg-amber-400 mb-6 rounded-full" />
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-6">
                We are shaping leaders{" "}
                <span className="text-amber-300">through action</span>
              </h2>
              <p className="text-slate-300 text-base leading-relaxed mb-4">
                Focused on long-term systems, we design solutions that create sustainable livelihoods and responsible consumption. From value-added food products to organic colours, diyas and rakhis that make celebrations safer.
              </p>
              <p className="text-slate-500 text-sm leading-relaxed">
                We further promote natural farming alternatives like organic pesticides and climate-conscious materials made from hemp.
              </p>
            </div>
            <div className="w-full flex justify-center">
              <img
                src="/nice.jpg"
                alt="About Enactus"
                className="w-full max-w-md rounded-2xl object-cover shadow-2xl border border-slate-800"
              />
            </div>
          </section>

          {/* MASONRY */}
          <section className="relative w-full min-h-[400px] md:min-h-[600px]">
            <Masonry items={masonryItems} />
          </section>

          {/* MISSION + STATS */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-start">
            <div>
              <div className="w-12 h-1 bg-amber-400 mb-6 rounded-full" />
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
                Our <span className="text-amber-300">mission</span>
              </h2>
              <p className="text-slate-400 text-base leading-relaxed">
                We empower students to become socially responsible leaders and changemakers.
              </p>
            </div>
            <div className="grid grid-cols-3 lg:grid-cols-1 gap-4 lg:gap-0 lg:space-y-6">
              {[
                { num: "44+", label: "Active initiatives" },
                { num: "₹1Cr+", label: "Community value generated" },
                { num: "10,000+", label: "Lives impacted" },
              ].map((stat) => (
                <div key={stat.num} className="border-l-2 border-amber-400/40 pl-4 lg:pl-6">
                  <h3 className="text-2xl md:text-5xl font-extrabold text-amber-300">{stat.num}</h3>
                  <p className="text-slate-400 text-xs md:text-base mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </section>

          {/* PROJECTS LABEL */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-1 bg-amber-400" />
            <p className="text-amber-400 text-3xl tracking-[0.2em] uppercase font-medium">Our Projects</p>
          </div>

        </div>
      </section>

      {/* FLOWING MENU — FULL BLEED */}
      <div className="relative w-full overflow-hidden">
        <div className="h-[360px] md:h-[560px]">
          <FlowingMenu
            items={[
              { link: "/projects", text: "Palaash", image: "/palaash.png" },
              { link: "/projects", text: "Aarazi", image: "/Aarazi.png" },
              { link: "/projects", text: "Ibtida", image: "/Ibtida.png" },
              { link: "/projects", text: "Utkarsh", image: "/utkarsh.png" },
            ]}
            speed={15}
            textColor="#ffffff"
            bgColor="#060010"
            marqueeBgColor="#ffffff"
            marqueeTextColor="#060010"
            borderColor="#ffffff"
          />
        </div>
      </div>

      {/* PRODUCTS + ORDER */}
      <section className="bg-black">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-20 flex flex-col gap-8 md:gap-12">

          {/* PRODUCTS HEADER */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-1 bg-amber-400 rounded-full" />
            <h2 className="text-3xl md:text-5xl font-bold text-white">Our Products</h2>
          </div>

          {/* INFINITE MENU */}
          <div className="w-full h-[360px] md:h-[480px] overflow-hidden">
  <InfiniteMenu items={infiniteItems} scale={1.2} />
</div>

          {/* ORDER NOW */}
          <div className="flex flex-col items-center gap-4 py-10 md:py-16 border border-slate-800 rounded-2xl bg-slate-950">
            <p className="text-xs tracking-[0.3em] text-amber-400 uppercase">Place an order</p>
            <h3 className="text-2xl md:text-4xl font-bold text-white text-center">
              Support our community products
            </h3>
            <p className="text-slate-400 text-sm text-center max-w-md">
              Every purchase directly supports the communities and artisans we work with.
            </p>
            <AnimatedModalDemo />
          </div>

        </div>
      </section>

    </main>
  );
}