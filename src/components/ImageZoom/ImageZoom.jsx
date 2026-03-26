// import React, { useRef, useState } from "react";
// import styles from "./ImageZoom.module.css";

// const ImageZoom = ({ src }) => {
//     const imgRef = useRef(null);
//     const [lensPos, setLensPos] = useState({ x: 0, y: 0 });
//     const [showZoom, setShowZoom] = useState(false);

//     const handleMouseMove = (e) => {
//         const { left, top, width, height } = imgRef.current.getBoundingClientRect();
//         const x = e.clientX - left;
//         const y = e.clientY - top;

//         const lensWidth = 120;
//         const lensHeight = 120;

//         const posX = Math.max(0, Math.min(x - lensWidth / 2, width - lensWidth));
//         const posY = Math.max(0, Math.min(y - lensHeight / 2, height - lensHeight));


//         setLensPos({ x: posX, y: posY });
//     };

//     return (
//         <div
//             className={`${styles.zoomWrapper} ${containerClass || ""}`}
//             onMouseEnter={() => setShowZoom(true)}
//             onMouseLeave={() => setShowZoom(false)}
//             onMouseMove={handleMouseMove}
//         >
//             {/* Left product image */}
//             <div className={styles.imageBox}>
//                 <img ref={imgRef} src={src} alt="product" className={styles.image} />
//                 {showZoom && (
//                     <div
//                         className={styles.lens}
//                         style={{ left: lensPos.x, top: lensPos.y }}
//                     ></div>
//                 )}
//             </div>

//             {/* Right zoom preview */}
//             {showZoom && (
//                 <div
//                     className={styles.zoomPreview}
//                     style={{
//                         backgroundImage: `url(${src})`,
//                         backgroundPosition: `-${lensPos.x * 2}px -${lensPos.y * 2}px`,
//                     }}
//                 ></div>
//             )}
//         </div>
//     );
// };

// export default ImageZoom;
// import React, { useRef, useState } from "react";
// import styles from "./ImageZoom.module.css";

// const ImageZoom = ({ src, containerClass }) => {
//     const imgRef = useRef(null);
//     const [lensPos, setLensPos] = useState({ x: 0, y: 0 });
//     const [showZoom, setShowZoom] = useState(false);

//     const handleMouseMove = (e) => {
//         if (!imgRef.current) return;

//         const { left, top, width, height } =
//             imgRef.current.getBoundingClientRect();

//         const x = e.clientX - left;
//         const y = e.clientY - top;

//         const lensSize = 120;

//         const posX = Math.max(
//             0,
//             Math.min(x - lensSize / 2, width - lensSize)
//         );
//         const posY = Math.max(
//             0,
//             Math.min(y - lensSize / 2, height - lensSize)
//         );

//         setLensPos({ x: posX, y: posY });
//     };

//     return (
//         <div
//             className={`${styles.zoomWrapper} ${containerClass || ""}`}
//             onMouseEnter={() => setShowZoom(true)}
//             onMouseLeave={() => setShowZoom(false)}
//             onMouseMove={handleMouseMove}
//         >
//             {/* Hidden image only for measurements */}
//             <img
//                 ref={imgRef}
//                 src={src}
//                 alt=""
//                 className={styles.hiddenImage}
//             />

//             {/* Lens */}
//             {showZoom && (
//                 <div
//                     className={styles.lens}
//                     style={{
//                         left: lensPos.x,
//                         top: lensPos.y,
//                     }}
//                 />
//             )}

//             {/* Zoom preview */}
//             {showZoom && (
//                 <div
//                     className={styles.zoomPreview}
//                     style={{
//                         backgroundImage: `url(${src})`,
//                         backgroundPosition: `-${lensPos.x * 2}px -${lensPos.y * 2}px`,
//                     }}
//                 />
//             )}
//         </div>
//     );
// };

// export default ImageZoom;


import React, { useRef, useState, useCallback } from "react";
import styles from "./ImageZoom.module.css";

const LENS_SIZE = 130;
const ZOOM_LEVEL = 2.5;

const ImageZoom = ({ src, containerClass }) => {
    const containerRef = useRef(null);
    const imgRef = useRef(null);

    const [lensPos, setLensPos] = useState({
        x: 0,
        y: 0,
        iw: 0,
        ih: 0,
        dw: 0,
        dh: 0,
    });

    const [showZoom, setShowZoom] = useState(false);

    const handleMouseMove = useCallback((e) => {
        if (!containerRef.current || !imgRef.current) return;

        const rect = imgRef.current.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const posX = Math.max(
            0,
            Math.min(x - LENS_SIZE / 2, rect.width - LENS_SIZE)
        );
        const posY = Math.max(
            0,
            Math.min(y - LENS_SIZE / 2, rect.height - LENS_SIZE)
        );

        setLensPos({
            x: posX,
            y: posY,
            iw: imgRef.current.naturalWidth,
            ih: imgRef.current.naturalHeight,
            dw: rect.width,
            dh: rect.height,
        });
    }, []);

    return (
        <div
            ref={containerRef}
            className={`${styles.zoomWrapper} ${containerClass || ""}`}
            onMouseEnter={() => setShowZoom(true)}
            onMouseLeave={() => setShowZoom(false)}
            onMouseMove={handleMouseMove}
        >
            {/* MAIN IMAGE */}
            <img
                ref={imgRef}
                src={src}
                alt="product"
                className={styles.mainImage}
                draggable={false}
            />

            {/* LENS */}
            {showZoom && (
                <div
                    className={styles.lens}
                    style={{
                        left: lensPos.x,
                        top: lensPos.y,
                    }}
                />
            )}

            {/* ZOOM PREVIEW */}
            {showZoom && (
                <div
                    className={styles.zoomPreview}
                    style={{
                        backgroundImage: `url(${src})`,
                        backgroundSize: `${lensPos.iw * ZOOM_LEVEL}px ${lensPos.ih * ZOOM_LEVEL}px`,
                        backgroundPosition: `-${
                            (lensPos.x / lensPos.dw) *
                            lensPos.iw *
                            ZOOM_LEVEL
                        }px -${
                            (lensPos.y / lensPos.dh) *
                            lensPos.ih *
                            ZOOM_LEVEL
                        }px`,
                    }}
                />
            )}
        </div>
    );
};

export default ImageZoom;