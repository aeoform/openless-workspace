"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";

const VERT = `
  attribute vec2 a;
  void main() { gl_Position = vec4(a, 0.0, 1.0); }
`;

const FRAG = `
  precision highp float;
  uniform vec2  u_res;
  uniform float u_time;
  uniform float u_speed;
  uniform float u_intensity;
  uniform float u_density;
  uniform float u_beams;
  uniform vec2  u_mouse;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f*f*(3.0 - 2.0*f);
    return mix(a, b, u.x) + (c - a)*u.y*(1.0 - u.x) + (d - b)*u.x*u.y;
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float amp = 0.55;
    mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
    for (int i = 0; i < 5; i++) {
      v += amp * noise(p);
      p = m * p;
      amp *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y;
    vec2 p = uv * (1.6 + u_density * 1.6);
    float t = u_time * u_speed * 0.10;

    vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, -t)));
    vec2 r = vec2(fbm(p + 4.0*q + vec2(1.7, 9.2) + t*0.7),
                  fbm(p + 4.0*q + vec2(8.3, 2.8) - t*0.5));
    float f = fbm(p + 4.0*r);

    float beams = 0.0;
    float n = max(1.0, u_beams);
    for (float i = 0.0; i < 16.0; i++) {
      if (i >= n) break;
      float seed = i * 13.37;
      float x = -0.95 + 1.9 * fract(0.317 + i * 0.193 + seed * 0.011);
      float drift = 0.10 * sin(t * 1.3 + seed);
      float bx = x + drift;
      float dist = abs(uv.x - bx);
      float vert = smoothstep(0.45, -0.15, uv.y);
      float beam = exp(-dist * 90.0) * 0.35 + exp(-dist * 22.0) * 0.06;
      beams += beam * vert;
    }
    beams *= 0.6;

    vec2 m = (u_mouse - 0.5 * u_res) / u_res.y;
    float halo = exp(-length(uv - m) * 3.4) * 0.18;

    vec3 white = vec3(1.0, 1.0, 1.0);
    vec3 paper = vec3(0.985, 0.985, 0.99);

    float flow = smoothstep(0.30, 0.85, f);
    float shade = (flow - 0.5) * 0.10 * u_intensity;

    float vein = smoothstep(0.55, 0.95, f) - smoothstep(0.85, 1.0, f);
    vec3 blue = vec3(0.118, 0.388, 1.0);

    vec3 col = mix(paper, white, 0.5);
    col -= shade;
    col += vein * blue * 0.07 * u_intensity;
    col += beams * blue * 0.55;
    col += halo * blue;

    float vign = smoothstep(1.4, 0.2, length(uv * vec2(0.85, 1.0)));
    col *= mix(0.985, 1.0, vign);

    float grain = (hash(gl_FragCoord.xy + u_time) - 0.5) * 0.012;
    col += grain;

    gl_FragColor = vec4(col, 1.0);
  }
`;

export function ShaderBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { antialias: true, premultipliedAlpha: true, alpha: true });
    if (!gl) {
      canvas.style.background = "linear-gradient(180deg, #fff, #f4f6fb)";
      return;
    }

    // Reduced motion: still paint the backdrop, just do not animate it.
    const reducedMotion = prefersReducedMotion();

    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(s));
      }
      return s;
    };

    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const aLoc = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(aLoc);
    gl.vertexAttribPointer(aLoc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_res");
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uSpeed = gl.getUniformLocation(prog, "u_speed");
    const uInt = gl.getUniformLocation(prog, "u_intensity");
    const uDen = gl.getUniformLocation(prog, "u_density");
    const uBeam = gl.getUniformLocation(prog, "u_beams");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");

    const state = { speed: 1.0, intensity: 1.0, density: 0.5, beams: 8, mouse: [0, 0] as [number, number] };

    const resize = () => {
      const w = Math.floor(window.innerWidth * dpr);
      const h = Math.floor(window.innerHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };
    window.addEventListener("resize", resize);
    resize();

    const onMouse = (e: MouseEvent) => {
      state.mouse[0] = e.clientX * dpr;
      state.mouse[1] = (window.innerHeight - e.clientY) * dpr;
    };
    window.addEventListener("mousemove", onMouse);

    let raf = 0;
    let running = true;
    const t0 = performance.now();
    const draw = (now: number) => {
      const t = (now - t0) / 1000;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, t);
      gl.uniform1f(uSpeed, state.speed);
      gl.uniform1f(uInt, state.intensity);
      gl.uniform1f(uDen, state.density);
      gl.uniform1f(uBeam, state.beams);
      gl.uniform2f(uMouse, state.mouse[0], state.mouse[1]);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };
    const tick = (now: number) => {
      if (!running) return;
      draw(now);
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (raf || reducedMotion) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    if (reducedMotion) {
      draw(t0);
    } else {
      start();
    }

    // Background tab: stop burning GPU on a canvas nobody is looking at.
    const onVisibility = () => {
      if (document.visibilityState === "visible") start();
      else stop();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
      stop();
    };
  }, []);

  return <canvas id="shader-bg" ref={canvasRef} />;
}
