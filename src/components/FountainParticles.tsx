"use client";
import { useMemo, useEffect } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadFull } from "tsparticles";


export default function FountainParticles({ particleImage }: { particleImage: string }) {
    const min = 10;
    const max = 30;
    console.log("particleImage " + particleImage);

    const skewedRandom = Math.pow(Math.random(), 2);

    const result = Math.floor(min + skewedRandom * (max - min));
    const optionz = useMemo(() => ({
        background: { color: { value: "transparent" } },

        interactivity: {
            events: {
                onClick: {
                    enable: true,
                    mode: "emitter",
                },
                onHover: {
                    enable: true,
                    mode: "repulse",
                },
            },
            modes: {
                emitters: {
                    autoplay: false,
                    fill: true,
                    life: { wait: false, delay: 0, duration: 0.4, count: 0.4 },
                    rate: { quantity: 1, delay: 0 },
                    particles: {
                        shape: {
                            type: "image",
                            options: {
                                image: {
                                    // any path or url to your image that will be used as a particle
                                    src: particleImage,
                                    // the pixel width of the image, you can use any value, the image will be scaled
                                    width: 200,
                                    // the pixel height of the image, you can use any value, the image will be scaled
                                    height: 200,
                                    // if true and the image type is SVG, it will replace all the colors with the particle color
                                    replaceColor: false
                                }
                            },
                        },
                        move: {
                            enable: true, gravity: { enable: false, acceleration: 6 }, speed: result, direction: "none", outModes: {
                                default: "destroy",
                                bottom: "destroy",
                                left: "destroy",
                                right: "destroy",
                                top: "destroy",

                            }
                        },
                        number: {
                            limit: {
                                mode: "delete",
                                value: 50,
                            },
                            value: 100,
                        },
                        size: { value: { min: 10, max: 20 } },
                        color: { value: "#000000" },
                        opacity: { value: 0.5 },


                    },

                },
                repulse: {
                    distance: 100,
                    duration: 2,
                },

            },
        },

        detectRetina: true,
    }), [particleImage]);

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadFull(engine);
        });
    }, []);


    return (
        <Particles id="tsparticles" options={optionz} className="absolute inset-0 z-0" />
    );
}


