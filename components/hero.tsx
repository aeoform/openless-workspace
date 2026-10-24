"use client";

import Image from "next/image";
import { useI18n } from "@/components/i18n-provider";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { BorderBeam } from "@/components/ui/border-beam";

function DownloadIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v12m0 0l-5-5m5 5l5-5M5 21h14"/></svg>;
}
function GitHubIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.4-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2 1-.3 2-.4 3-.4 1 0 2 .1 3 .4 2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.1.7.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z"/></svg>;
}

export function Hero() {
  const { t } = useI18n();
  return (
    <section className="ol-section first hero">
      <div className="ol-container">
        <div className="hero-inner">
          <div className="hero-logo-wrap">
            <Image src="/logo-512.png" alt="OpenLess" width={96} height={96} className="hero-logo" priority />
            <BorderBeam size={70} duration={6} colorFrom="#1E63FF" colorTo="#7AA7FF" borderWidth={2} />
            <div className="hero-logo-halo" />
          </div>
          <h1 className="hero-title">
            <AnimatedGradientText
              speed={1.2}
              colorFrom="#1E63FF"
              colorTo="#0A0A0C"
              className="ht-glow"
            >
              OpenLess
            </AnimatedGradientText>
          </h1>
          <p className="hero-vision" style={{ whiteSpace: "pre-line" }}>{t.hero.vision}</p>
          <div className="hero-ctas">
            <a href="#download" className="ol-btn ol-btn-primary">
              <DownloadIcon />
              {t.hero.cta_download}
            </a>
            <a href="https://github.com/Open-Less/openless" target="_blank" rel="noreferrer" className="ol-btn ol-btn-ghost">
              <GitHubIcon />
              GitHub
            </a>
          </div>
          <div className="hero-meta">
            <span className="ol-pill">{t.hero.cta_version}</span>
          </div>
        </div>
        <div className="hero-visual">
          <Image
            src="/dashboard.png"
            alt="OpenLess dashboard"
            width={2704}
            height={1824}
            sizes="(max-width: 1240px) 96vw, 1200px"
            className="hero-shot"
            priority
          />
        </div>
      </div>
      <style>{`
        .hero { padding: 60px 0 40px; position: relative; }
        .hero-inner { text-align: center; max-width: 980px; margin: 0 auto; padding-top: 20px; display: flex; flex-direction: column; align-items: center; position: relative; z-index: 1; }
        .hero-logo-wrap { position: relative; width: 96px; height: 96px; margin-bottom: 28px; border-radius: 22px; }
        .hero-logo { width: 96px; height: 96px; border-radius: 22px; box-shadow: 0 18px 50px -10px rgba(30,99,255,0.32); position: relative; z-index: 2; }
        .hero-logo-halo { position: absolute; inset: -40%; background: radial-gradient(circle, rgba(30,99,255,0.35), transparent 60%); z-index: 1; filter: blur(20px); }
        .hero-title {
          position: relative;
          font-size: clamp(72px, 10vw, 140px);
          line-height: 1;
          letter-spacing: -0.05em;
          font-weight: 600;
          margin: 0;
          color: #0A0A0C;
        }
        .hero-title .ht-glow {
          filter: drop-shadow(0 0 24px rgba(30,99,255,0.45)) drop-shadow(0 0 60px rgba(30,99,255,0.30));
          animation: ht-pulse 3.6s ease-in-out infinite;
        }
        @keyframes ht-pulse {
          0%, 100% { filter: drop-shadow(0 0 22px rgba(30,99,255,0.40)) drop-shadow(0 0 56px rgba(30,99,255,0.25)); }
          50%      { filter: drop-shadow(0 0 32px rgba(30,99,255,0.65)) drop-shadow(0 0 80px rgba(30,99,255,0.45)); }
        }
        .hero-vision { font-size: clamp(15px, 1.4vw, 18px); color: var(--ol-ink-3); max-width: 640px; margin: 24px auto 0; line-height: 1.6; }
        .hero-ctas { display: flex; gap: 12px; justify-content: center; margin-top: 36px; flex-wrap: wrap; }
        .hero-meta { display: flex; gap: 16px; justify-content: center; align-items: center; margin-top: 20px; }
        .hero-visual { margin-top: 80px; max-width: 1200px; margin-left: auto; margin-right: auto; }
        .hero-shot {
          width: 100%;
          height: auto;
          display: block;
          filter: drop-shadow(0 30px 60px rgba(10,10,12,0.18));
        }
      `}</style>
    </section>
  );
}
