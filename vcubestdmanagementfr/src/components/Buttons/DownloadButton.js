import React, { useEffect, useRef, useState } from 'react';
import { gsap, Elastic } from 'gsap';
import './DownloadButton.css';

const DownloadButtonComponent = () => {
  const buttonRef = useRef(null);
  const countRef = useRef(null);
  const arrowRef = useRef(null);
  const iconDivRef = useRef(null);
  const [count, setCount] = useState(0);
  const svgPath = useRef({
    y: 30,
    s: 0,
    f: 8,
    l: 32
  });

  useEffect(() => {
    const button = buttonRef.current;
    const countElem = countRef.current;
    const arrow = arrowRef.current;
    const iconDiv = iconDivRef.current;

    const getPath = (update, first, last, smoothing, pointsNew) => {
      const getPoint = (point, i, a, smoothing) => {
        const cp = (current, previous, next, reverse) => {
          const p = previous || current;
          const n = next || current;
          const o = {
            length: Math.sqrt(Math.pow(n[0] - p[0], 2) + Math.pow(n[1] - p[1], 2)),
            angle: Math.atan2(n[1] - p[1], n[0] - p[0])
          };
          const angle = o.angle + (reverse ? Math.PI : 0);
          const length = o.length * smoothing;

          return [
            current[0] + Math.cos(angle) * length,
            current[1] + Math.sin(angle) * length
          ];
        };

        const cps = cp(a[i - 1], a[i - 2], point, false);
        const cpe = cp(point, a[i - 1], a[i + 1], true);
        return `C ${cps[0]},${cps[1]} ${cpe[0]},${cpe[1]} ${point[0]},${point[1]}`;
      };

      const points = pointsNew || [
        [first, 16],
        [20, update],
        [last, 16]
      ];

      const d = points.reduce((acc, point, i, a) => {
        return i === 0
          ? `M ${point[0]},${point[1]}`
          : `${acc} ${getPoint(point, i, a, smoothing)}`;
      }, '');

      return `<path d="${d}" />`;
    };

    const handleClick = (e) => {
      e.preventDefault();
      if (!button.classList.contains('loading')) {
        if (!button.classList.contains('animation')) {
          button.classList.add('loading', 'animation');
          gsap.to(svgPath.current, {
            f: 2,
            l: 38,
            duration: 0.3,
            delay: 0.15
          });
          gsap.to(svgPath.current, {
            s: 0.2,
            y: 16,
            duration: 0.8,
            delay: 0.15,
            ease: Elastic.easeOut.config(1, 0.4)
          });
          gsap.to({ number: 0 }, {
            number: 100,
            duration: 3.8,
            delay: 0.8,
            onUpdate: function () {
              setCount(Math.round(this.targets()[0].number));
            }
          });

          setTimeout(() => {
            iconDiv.style.setProperty('overflow', 'visible');
            setTimeout(() => {
              button.classList.remove('animation');
            }, 600);
          }, 4820);
        }
      } else {
        if (!button.classList.contains('animation')) {
          button.classList.add('reset');
          gsap.to(svgPath.current, {
            f: 8,
            l: 32,
            duration: 0.4
          });
          gsap.to(svgPath.current, {
            s: 0,
            y: 30,
            duration: 0.4
          });

          setTimeout(() => {
            button.classList.remove('loading', 'reset');
            iconDiv.removeAttribute('style');
          }, 400);
        }
      }
    };

    button.addEventListener('click', handleClick);

    return () => {
      button.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <button ref={buttonRef} className="download_button">
      <svg className="circle" viewBox="0 0 76 76">
        <circle className="default" cx="38" cy="38" r="36"></circle>
        <circle className="active" cx="38" cy="38" r="36"></circle>
      </svg>
      <div className="icon">
        <svg className="line" viewBox="0 0 4 37">
          <line x1="2" y1="2" x2="2" y2="35"></line>
        </svg>
        <div ref={iconDivRef}>
          <svg className="arrow" viewBox="0 0 40 32" ref={arrowRef}></svg>
          <svg className="progress" viewBox="0 0 444 10">
            <path
              d="M2,5 L42,5 C60.0089086,6.33131695 73.3422419,6.99798362 82,
              7 C87.572404,7.00129781 91.0932494,1.72677301 102,1.99944178 C112.906751,
              2.27211054 112.000464,7.99986045 122,8 C131.999536,8.00013955 132,2 142,
              2 C152,2 152,8 162,8 C172,8 172,2 182,2 C192,2 192,8 202,8 C212,8 212,2 222,
              2 C232,2 232,8 242,8 C252,8 252,2 262,2 C272,2 272,8 282,8 C292,8 292,2 302,
              2 C312,2 312,8 322,8 C332,8 332,2 342,2 C352,2 351.897852,7.49489262 362,
              8 C372.102148,8.50510738 378.620177,5.22532154 402,5 L442,5"
            ></path>
          </svg>
        </div>
      </div>
      <span ref={countRef}>{count}%</span>
    </button>
  );
};

export default DownloadButtonComponent;
