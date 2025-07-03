import {
  createSchema,
  type HydrogenComponentProps,
  isBrowser,
} from "@weaverse/hydrogen";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import clsx from "clsx";
import type { CSSProperties } from "react";
import {
  forwardRef,
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useInView } from "react-intersection-observer";
import type { OverlayProps } from "~/components/overlay";
import { Overlay, overlayInputs } from "~/components/overlay";
import { useAnimation } from "~/hooks/use-animation";

const SECTION_HEIGHTS = {
  small: {
    desktop: "40vh",
    mobile: "50vh",
  },
  medium: {
    desktop: "50vh",
    mobile: "60vh",
  },
  large: {
    desktop: "70vh",
    mobile: "80vh",
  },
  custom: null,
};

interface HeroVideoData extends OverlayProps, VariantProps<typeof variants> {
  videoURL: string;
  height: "small" | "medium" | "large" | "custom";
  heightOnDesktop: number;
  heightOnMobile: number;
}

export interface HeroVideoProps extends HeroVideoData, HydrogenComponentProps {}

const variants = cva(
  "absolute inset-0 max-w-screen mx-auto px-3 flex flex-col justify-center items-center z-10",
  {
    variants: {
      gap: {
        0: "",
        4: "space-y-1",
        8: "space-y-2",
        12: "space-y-3",
        16: "space-y-4",
        20: "space-y-5",
        24: "space-y-3 lg:space-y-6",
        28: "space-y-3.5 lg:space-y-7",
        32: "space-y-4 lg:space-y-8",
        36: "space-y-4 lg:space-y-9",
        40: "space-y-5 lg:space-y-10",
        44: "space-y-5 lg:space-y-11",
        48: "space-y-6 lg:space-y-12",
        52: "space-y-6 lg:space-y-[52px]",
        56: "space-y-7 lg:space-y-14",
        60: "space-y-7 lg:space-y-[60px]",
      },
    },
    defaultVariants: {
      gap: 20,
    },
  },
);

function getPlayerSize(id: string) {
  if (isBrowser) {
    const section = document.querySelector(`[data-wv-id="${id}"]`);
    if (section) {
      const rect = section.getBoundingClientRect();
      const aspectRatio = rect.width / rect.height;
      if (aspectRatio < 16 / 9) {
        return { width: "auto", height: "100%" };
      }
    }
  }
  return { width: "100%", height: "auto" };
}

// Helper function to check if URL is YouTube
function isYouTubeUrl(url: string): boolean {
  return url.includes('youtube.com') || url.includes('youtu.be');
}

// Helper function to check if URL is a direct video file
function isVideoFile(url: string): boolean {
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv'];
  return videoExtensions.some(ext => url.toLowerCase().includes(ext));
}

// Helper function to convert YouTube URL to embed URL
function getYouTubeEmbedUrl(url: string): string {
  let videoId = '';
  
  if (url.includes('youtube.com/watch')) {
    const urlParams = new URLSearchParams(url.split('?')[1]);
    videoId = urlParams.get('v') || '';
  } else if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
  }
  
  return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1` : url;
}



// Custom Video Player Component
function CustomVideoPlayer({ 
  url, 
  width, 
  height, 
  className 
}: {
  url: string;
  width: string | number;
  height: string | number;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && isVideoFile(url)) {
      // Auto-play video files
      videoRef.current.play().catch(() => {
        // Ignore autoplay errors
      });
    }
  }, [url]);

  // For YouTube, use iframe
  if (isYouTubeUrl(url)) {
    return (
      <div className={clsx(className, "relative overflow-hidden")} style={{ width, height }}>
        <iframe
          src={getYouTubeEmbedUrl(url)}
          width="100%"
          height="100%"
          className="absolute inset-0 w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="YouTube video player"
        />
      </div>
    );
  }

  // For direct video files, use HTML5 video
  if (isVideoFile(url)) {
    return (
      <div className={clsx(className, "relative overflow-hidden")} style={{ width, height }}>
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          controls={false}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        >
          <source src={url} type="video/mp4" />
          <source src={url} type="video/webm" />
          <source src={url} type="video/ogg" />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  // Fallback for unsupported URLs
  return (
    <div 
      className={clsx(className, "flex items-center justify-center bg-gray-100 text-gray-500")}
      style={{ width, height }}
    >
      <div className="text-center">
        <p className="text-sm">Unsupported video format</p>
        <p className="text-xs mt-1">Please use YouTube or direct video files</p>
      </div>
    </div>
  );
}

const HeroVideo = forwardRef<HTMLElement, HeroVideoProps>((props, ref) => {
  const {
    videoURL,
    gap,
    height,
    heightOnDesktop,
    heightOnMobile,
    enableOverlay,
    overlayColor,
    overlayColorHover,
    overlayOpacity,
    children,
    ...rest
  } = props;

  const id = rest["data-wv-id"];
  const [size, setSize] = useState(() => getPlayerSize(id));

  const desktopHeight =
    SECTION_HEIGHTS[height]?.desktop || `${heightOnDesktop}px`;
  const mobileHeight = SECTION_HEIGHTS[height]?.mobile || `${heightOnMobile}px`;
  const sectionStyle: CSSProperties = {
    "--desktop-height": desktopHeight,
    "--mobile-height": mobileHeight,
  } as CSSProperties;

  const { ref: inViewRef, inView } = useInView({
    triggerOnce: true,
  });

  // Use `useCallback` so we don't recreate the function on each render
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation> --- IGNORE ---
  const setRefs = useCallback(
    (node: HTMLElement) => {
      // Ref's from useRef needs to have the node assigned to `current`
      ref && Object.assign(ref, { current: node });
      // Callback refs, like the one from `useInView`, is a function that takes the node as an argument
      inViewRef(node);
    },
    [inViewRef],
  );

  function handleResize() {
    setSize(getPlayerSize(id));
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation> --- IGNORE ---
  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [inView, height, heightOnDesktop, heightOnMobile]);

  const [scope] = useAnimation();

  return (
    <section
      ref={setRefs}
      {...rest}
      className="overflow-hidden w-full h-full"
      style={sectionStyle}
    >
      <div
        className={clsx(
          "flex items-center justify-center relative overflow-hidden",
          "h-(--mobile-height) sm:h-(--desktop-height)",
          "w-[max(var(--mobile-height)/9*16,100vw)] sm:w-[max(var(--desktop-height)/9*16,100vw)]",
          "translate-x-[min(0px,calc((var(--mobile-height)/9*16-100vw)/-2))]",
          "sm:translate-x-[min(0px,calc((var(--desktop-height)/9*16-100vw)/-2))]",
        )}
      >
        {inView && videoURL && (
          <Suspense fallback={null}>
            <CustomVideoPlayer
              url={videoURL}
              width={size.width}
              height={size.height}
              className="aspect-video"
            />
          </Suspense>
        )}
        <Overlay
          enableOverlay={enableOverlay}
          overlayColor={overlayColor}
          overlayColorHover={overlayColorHover}
          overlayOpacity={overlayOpacity}
          className="z-0"
        />
        <div ref={scope} className={clsx(variants({ gap }))}>
          {children}
        </div>
      </div>
    </section>
  );
});

export default HeroVideo;

export const schema = createSchema({
  type: "hero-video",
  title: "Hero video",
  settings: [
    {
      group: "Video",
      inputs: [
        {
          type: "text",
          name: "videoURL",
          label: "Video URL",
          defaultValue: "https://www.youtube.com/watch?v=Su-x4Mo5xmU",
          placeholder: "https://www.youtube.com/watch?v=Su-x4Mo5xmU",
          helpText: "Support YouTube, MP4, WebM, and HLS streams.",
        },
        {
          type: "heading",
          label: "Layout",
        },
        {
          type: "select",
          name: "height",
          label: "Section height",
          configs: {
            options: [
              { value: "small", label: "Small" },
              { value: "medium", label: "Medium" },
              { value: "large", label: "Large" },
              { value: "custom", label: "Custom" },
            ],
          },
          defaultValue: "medium",
        },
        {
          type: "range",
          name: "heightOnDesktop",
          label: "Height on desktop",
          defaultValue: 650,
          configs: {
            min: 400,
            max: 800,
            step: 10,
            unit: "px",
          },
          condition: (data: HeroVideoData) => data.height === "custom",
        },
        {
          type: "range",
          name: "heightOnMobile",
          label: "Height on mobile",
          defaultValue: 300,
          configs: {
            min: 250,
            max: 500,
            step: 10,
            unit: "px",
          },
          condition: (data: HeroVideoData) => data.height === "custom",
        },
        {
          type: "range",
          name: "gap",
          label: "Items spacing",
          configs: {
            min: 0,
            max: 40,
            step: 4,
            unit: "px",
          },
          defaultValue: 20,
        },
      ],
    },
    {
      group: "Overlay",
      inputs: overlayInputs,
    },
  ],
  childTypes: ["subheading", "heading", "paragraph", "button"],
  presets: {
    enableOverlay: true,
    overlayColor: "#000000",
    overlayOpacity: 40,
    videoURL: "https://www.youtube.com/watch?v=gbLmku5QACM",
    height: "large",
    gap: 20,
    children: [
      {
        type: "subheading",
        content: "Seamless hero videos",
        color: "#fff",
      },
      {
        type: "heading",
        content: "Bring your brand to life.",
        as: "h2",
        color: "#fff",
      },
      {
        type: "paragraph",
        content:
          "Pair large video with a compelling message to captivate your audience.",
        color: "#fff",
      },
    ],
  },
});
