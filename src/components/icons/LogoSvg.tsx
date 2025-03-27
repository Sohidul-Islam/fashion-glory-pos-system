// import React, { ImgHTMLAttributes } from "react";
import logo from "../../assets/logo.png";

const LogoSvg: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = (
  props
) => (
  <img src={logo} alt="Logo" className={props.className} />

  // <svg
  //   id="Layer_1"
  //   data-name="Layer 1"
  //   xmlns="http://www.w3.org/2000/svg"
  //   viewBox="0 0 1080 1080"
  //   {...props}
  // >
  //   <defs>
  //     <style>{`.cls-1{fill:#a3cf61;}.cls-2{fill:#5fbe78;}`}</style>
  //   </defs>
  //   <path
  //     className="cls-1"
  //     d="M551.53,450.65q-15-8-36.24-8h-67.5V641.34h36.77V565.06h30.73q22.58,0,37.42-8.53T574.51,534a66,66,0,0,0,7-29.88q0-17.66-7.48-31.6A53,53,0,0,0,551.53,450.65ZM536.3,525.36q-7.37,7.54-22.59,7.54H484.56V475.12h29.15q29.94,0,29.94,29Q543.65,517.81,536.3,525.36Z"
  //   />
  //   <path
  //     className="cls-1"
  //     d="M740,452.92a92.15,92.15,0,0,0-94.68,0,94.1,94.1,0,0,0-34.14,36.29q-12.61,23.2-12.61,52.23,0,29.32,12.61,52.51a94,94,0,0,0,34.14,36.29,91.91,91.91,0,0,0,94.55,0,93,93,0,0,0,34-36.29q12.48-23.19,12.48-52.51,0-29-12.48-52.23A93.47,93.47,0,0,0,740,452.92Zm1.45,123.53q-7.09,15.09-19.7,23.2t-29.15,8.11q-16.55,0-29.29-8.11t-19.83-23.2q-7.1-15.09-7.09-35t7.09-34.87q7.09-14.94,19.83-22.91t29.29-8q16.54,0,29.15,8t19.7,22.91q7.1,15,7.09,34.87T741.42,576.45Z"
  //   />
  //   <path
  //     className="cls-1"
  //     d="M933.67,554a53.46,53.46,0,0,0-19.44-17.07,203.16,203.16,0,0,0-29.15-11.39A204.65,204.65,0,0,1,864.73,518a36.9,36.9,0,0,1-12.09-8.54,18.75,18.75,0,0,1-4.85-13.23q0-11.38,6.43-17.37t17.2-6q12.35,0,19.83,6.69a23.43,23.43,0,0,1,8,16.93h40.45q-1.85-26.75-19.57-41.7t-46.09-14.94q-18.91,0-33.62,7a52.93,52.93,0,0,0-22.85,20.07q-8.15,13.1-8.14,30.74,0,18.78,8,30a51.87,51.87,0,0,0,19.17,16.79,209.56,209.56,0,0,0,29,11.24,196.22,196.22,0,0,1,20.62,7.26,34.88,34.88,0,0,1,12.48,9q5,5.69,5,14.51,0,10.82-7.36,17.5t-20.22,6.69q-12.6,0-19.83-7.11t-8-19.36h-39.4q.27,18.23,9.2,31.6a57.58,57.58,0,0,0,24.29,20.49q15.36,7.11,34.54,7.11,20.22,0,34.93-8.11a55.54,55.54,0,0,0,22.32-21.77,59.76,59.76,0,0,0,7.62-29.6Q941.81,565.36,933.67,554Z"
  //   />
  //   <path
  //     className="cls-2"
  //     d="M410.33,485.69c-.77-2.41-1.37-4.52-2.12-6.56a169.65,169.65,0,0,0-27.86-49.46,160,160,0,0,0-38.75-34.61,147.38,147.38,0,0,0-46.43-19.44,134,134,0,0,0-27.58-3.45,164.11,164.11,0,0,0-17.3.84,142.46,142.46,0,0,0-35.94,8.24,146.17,146.17,0,0,0-46.42,27.45,167.09,167.09,0,0,0-47.21,68.39,177.64,177.64,0,0,0-10.61,46.09,179.87,179.87,0,0,0,1.06,43.06,172.52,172.52,0,0,0,24.33,66.91,15.42,15.42,0,0,0,1.49,1.76,13.44,13.44,0,0,0,1.34-2.06q7.81-18.93,15.57-37.87a5,5,0,0,0,0-3.89c-1.11-2.8-2.18-5.64-3.09-8.52a139.74,139.74,0,0,1-6.56-49,136.49,136.49,0,0,1,10.65-47.22,133.24,133.24,0,0,1,26.88-40.86,113.68,113.68,0,0,1,46.08-29.54,109.82,109.82,0,0,1,42.3-5.51,113.85,113.85,0,0,1,45.11,12.48,118.59,118.59,0,0,1,27.62,19.57,129.16,129.16,0,0,1,29.36,41.88,2.07,2.07,0,0,0,2.2,1.47c11.33,0,22.66,0,34,0C408.92,485.78,409.39,485.74,410.33,485.69Z"
  //   />
  //   <path
  //     className="cls-2"
  //     d="M173.91,677c.7-1.33,1.23-2.19,1.62-3.12q5.43-13.19,10.82-26.38,10.1-24.8,20.13-49.61c.77-1.91,1.83-2.7,3.82-2.69,19,.07,38,0,56.95.09,2.08,0,3.06-.79,3.84-2.75,3.37-8.47,6.85-16.87,10.28-25.3,1.21-3,2.39-6,3.75-9.33-1.71-.08-3.15-.2-4.59-.2l-53.08.08a24.66,24.66,0,0,1-2.85-.2c-1-.11-1.34-.68-.91-1.72s.75-1.9,1.14-2.84q5.59-13.62,11.19-27.23c1.11-2.7,1.46-3,4.18-3q47.55,0,95.11,0a2.8,2.8,0,0,0,3-2.13c2.28-5.81,4.7-11.56,7.06-17.33q3.3-8.1,6.58-16.21c.63-1.55.38-1.89-1.22-1.93H174c.49.84.71,1.27,1,1.67q11.57,16.8,23.17,33.59a3.67,3.67,0,0,1,.4,3.87Q191.24,542,184,559.76q-11.36,27.84-22.69,55.69c-4.37,10.7-8.67,21.42-13.18,32a4,4,0,0,0,.87,4.9c2.79,3.06,5.46,6.26,8.41,9.12C162.73,666.69,168.23,671.66,173.91,677Z"
  //   />
  //   <path
  //     className="cls-2"
  //     d="M200.85,650.75c-.65,1.59-1.25,3-1.84,4.48q-5.62,13.78-11.24,27.56c-1.07,2.63-1.08,2.61,1.18,4a151,151,0,0,0,27.44,12.88,145.48,145.48,0,0,0,32.76,7.4,137.23,137.23,0,0,0,29.5,0,144.78,144.78,0,0,0,29.61-6.34,151.9,151.9,0,0,0,55.56-32.57,162.71,162.71,0,0,0,26.12-30.58,160.44,160.44,0,0,0,14.51-26.9c2.44-5.84,4.7-11.8,6.58-17.87a183.33,183.33,0,0,0,4.56-18.27,141.34,141.34,0,0,0,1.84-14.42c.22-2.33,0-2.36-2.18-2.36H308.68a2,2,0,0,0-2,1.44c-4.34,10.76-8.73,21.5-13.09,32.26-.44,1.11-.73,2.3-1.19,3.75h77.84c1.92,0,2.18.28,1.32,2.09-2.61,5.46-5,11.1-8.06,16.25a111.48,111.48,0,0,1-42.06,40.67,118.8,118.8,0,0,1-66.54,14.87,113.7,113.7,0,0,1-20.24-3.26,108.39,108.39,0,0,1-27.11-11.17Z"
  //   />
  //   <path
  //     className="cls-2"
  //     d="M410.33,485.69c-.94.05-1.41.09-1.88.09-11.33,0-22.66,0-34,0a2.07,2.07,0,0,1-2.2-1.47,129.16,129.16,0,0,0-29.36-41.88,118.59,118.59,0,0,0-27.62-19.57,113.85,113.85,0,0,0-45.11-12.48,109.82,109.82,0,0,0-42.3,5.51,113.68,113.68,0,0,0-46.08,29.54,133.24,133.24,0,0,0-26.88,40.86,136.49,136.49,0,0,0-10.65,47.22,139.74,139.74,0,0,0,6.56,49c.91,2.88,2,5.72,3.09,8.52a5,5,0,0,1,0,3.89q-7.77,18.94-15.57,37.87a13.44,13.44,0,0,1-1.34,2.06,15.42,15.42,0,0,1-1.49-1.76,172.52,172.52,0,0,1-24.33-66.91,179.87,179.87,0,0,1-1.06-43.06,177.64,177.64,0,0,1,10.61-46.09,167.09,167.09,0,0,1,47.21-68.39,146.17,146.17,0,0,1,46.42-27.45A142.46,142.46,0,0,1,250.29,373a164.11,164.11,0,0,1,17.3-.84,134,134,0,0,1,27.58,3.45,147.38,147.38,0,0,1,46.43,19.44,160,160,0,0,1,38.75,34.61,169.65,169.65,0,0,1,27.86,49.46C409,481.17,409.56,483.28,410.33,485.69Z"
  //   />
  //   <path
  //     className="cls-2"
  //     d="M173.91,677c-5.68-5.29-11.18-10.26-16.51-15.43-3-2.86-5.62-6.06-8.41-9.12a4,4,0,0,1-.87-4.9c4.51-10.63,8.81-21.35,13.18-32q11.35-27.84,22.69-55.69,7.24-17.75,14.55-35.46a3.67,3.67,0,0,0-.4-3.87Q186.52,503.66,175,486.84c-.27-.4-.49-.83-1-1.67H350.73c1.6,0,1.85.38,1.22,1.93q-3.27,8.11-6.58,16.21c-2.36,5.77-4.78,11.52-7.06,17.33a2.8,2.8,0,0,1-3,2.13q-47.55-.07-95.11,0c-2.72,0-3.07.31-4.18,3q-5.57,13.62-11.19,27.23c-.39.94-.75,1.9-1.14,2.84s-.09,1.61.91,1.72a24.66,24.66,0,0,0,2.85.2l53.08-.08c1.44,0,2.88.12,4.59.2-1.36,3.38-2.54,6.36-3.75,9.33-3.43,8.43-6.91,16.83-10.28,25.3-.78,2-1.76,2.76-3.84,2.75-19-.09-38,0-56.95-.09-2,0-3.05.78-3.82,2.69q-10,24.82-20.13,49.61-5.39,13.2-10.82,26.38C175.14,674.76,174.61,675.62,173.91,677Z"
  //   />
  //   <path
  //     className="cls-2"
  //     d="M200.85,650.75l6.71,3.89a108.39,108.39,0,0,0,27.11,11.17,113.7,113.7,0,0,0,20.24,3.26,118.8,118.8,0,0,0,66.54-14.87,111.48,111.48,0,0,0,42.06-40.67c3.07-5.15,5.45-10.79,8.06-16.25.86-1.81.6-2.09-1.32-2.09H292.41c.46-1.45.75-2.64,1.19-3.75,4.36-10.76,8.75-21.5,13.09-32.26a2,2,0,0,1,2-1.44H415.25c2.18,0,2.4,0,2.18,2.36a141.34,141.34,0,0,1-1.84,14.42A183.33,183.33,0,0,1,411,592.79c-1.88,6.07-4.14,12-6.58,17.87a160.44,160.44,0,0,1-14.51,26.9,162.71,162.71,0,0,1-26.12,30.58,151.9,151.9,0,0,1-55.56,32.57,144.78,144.78,0,0,1-29.61,6.34,137.23,137.23,0,0,1-29.5,0,145.48,145.48,0,0,1-32.76-7.4A151,151,0,0,1,189,686.76c-2.26-1.36-2.25-1.34-1.18-4Q193.4,669,199,655.23C199.6,653.78,200.2,652.34,200.85,650.75Z"
  //   />
  // </svg>
);

export default LogoSvg;
