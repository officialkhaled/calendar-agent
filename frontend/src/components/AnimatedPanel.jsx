import {useEffect, useRef} from "react";
import gsap from "gsap";

function AnimatedPanel({children, animationKey}) {
    const panelRef = useRef(null);

    useEffect(() => {
        gsap.fromTo(
            panelRef.current,
            {
                opacity: 0,
                y: 16,
                scale: 0.98,
            },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.4,
                ease: "power3.out",
            }
        );
    }, [animationKey]);

    return <div ref={panelRef}>{children}</div>;
}

export default AnimatedPanel;