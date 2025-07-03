import type { HydrogenComponentProps } from "@weaverse/hydrogen";
import { forwardRef } from "react";
import { createSchema } from "@weaverse/hydrogen";
import clsx from "clsx";
import { Image } from "@shopify/hydrogen";
import type { CSSProperties } from "react";
import { useAnimation } from "~/hooks/use-animation";
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import Icon from './components/icon';

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

const variants = cva(
  "relative w-full flex flex-col items-center",
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

interface HeroData extends VariantProps<typeof variants> {
  height: "small" | "medium" | "large" | "custom" | "100vh";
  heightOnDesktop: number;
  heightOnMobile: number;
  backgroundType: "image" | "video";
  backgroundImage: {
    id: string;
    url: string;
    altText: string;
    width: number;
    height: number;
  };
  backgroundVideo: {
    url: string;
    type: string;
  };
  overlayOpacity: number;
  overlayColor: string;
  contentWidth: number;
}

type HeroProps = HydrogenComponentProps & HeroData;

export let schema = createSchema({
  type: "hero",
  title: "Hero",
  limit: 1,
  settings: [
    {
      group: "Layout",
      inputs: [
        {
          type: "select",
          name: "height",
          label: "Section height",
          defaultValue: "medium",
          configs: {
            options: [
              { value: "small", label: "Small" },
              { value: "medium", label: "Medium" },
              { value: "large", label: "Large" },
              { value: "custom", label: "Custom" },
              { value: "100vh", label: "Full Viewport (100vh)" },
            ],
          },
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
          condition: (data: HeroData) => data.height === "custom",
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
          condition: (data: HeroData) => data.height === "custom",
        },
        {
          type: "range",
          name: "contentWidth",
          label: "Content width",
          defaultValue: 800,
          configs: {
            min: 400,
            max: 1200,
            step: 50,
            unit: "px",
          },
        },
        {
          type: "range",
          name: "gap",
          label: "Items spacing",
          configs: {
            min: 0,
            max: 60,
            step: 4,
            unit: "px",
          },
          defaultValue: 20,
        },
      ],
    },
    {
      group: "Background",
      inputs: [
        {
          type: "select",
          name: "backgroundType",
          label: "Background type",
          defaultValue: "image",
          configs: {
            options: [
              { value: "image", label: "Image" },
              { value: "video", label: "Video" },
            ],
          },
        },
        {
          type: "image",
          name: "backgroundImage",
          label: "Background image",
          defaultValue: {
            id: "",
            url: "",
            altText: "",
            width: 0,
            height: 0,
          },
          condition: "backgroundType === 'image'",
        },
        {
          type: "video",
          name: "backgroundVideo",
          label: "Background video",
          defaultValue: {
            url: "",
            type: "video/mp4",
          },
          condition: "backgroundType === 'video'",
        },
        {
          type: "color",
          name: "overlayColor",
          label: "Overlay color",
          defaultValue: "#000000",
        },
        {
          type: "range",
          name: "overlayOpacity",
          label: "Overlay opacity",
          defaultValue: 40,
          configs: {
            min: 0,
            max: 100,
            step: 5,
            unit: "%",
          },
        },
      ],
    },
  ],
  childTypes: ["subheading", "heading", "paragraph", "button", "hero-icon"],
  presets: {
    name: "Hero",
    data: {
      height: "medium",
      backgroundType: "image",
      contentWidth: 800,
      gap: 20,
      overlayColor: "#000000",
      overlayOpacity: 40,
    },
    children: [
      {
        type: "hero-icon",
        iconType: "star",
        iconSize: 32,
        iconColor: "#ffffff",
        alignment: "center",
      },
      {
        type: "heading",
        content: "Create stunning hero sections",
        as: "h2",
        color: "#fff",
      },
      {
        type: "paragraph",
        content: "Showcase your products with beautiful hero layouts",
        color: "#fff",
      },
      {
        type: "button",
        content: "Shop Now",
        style: "primary",
        link: "/collections/all",
      },
    ],
  },
});

const Hero = forwardRef<HTMLElement, HeroProps>((props, ref) => {
  const {
    height = "medium",
    heightOnDesktop = 650,
    heightOnMobile = 300,
    backgroundType = "image",
    backgroundImage,
    backgroundVideo,
    overlayOpacity = 40,
    overlayColor = "#000000",
    contentWidth = 800,
    gap = 20,
    children,
    className,
  } = props;

  const [scope] = useAnimation();

  const getHeight = () => {
    if (height === "100vh") return "h-screen";
    if (height === "custom") return `h-[${heightOnMobile}px] sm:h-[${heightOnDesktop}px]`;
    return SECTION_HEIGHTS[height] ? 
      `h-[${SECTION_HEIGHTS[height].mobile}] sm:h-[${SECTION_HEIGHTS[height].desktop}]` : 
      "h-[50vh] sm:h-[60vh]";
  };

  return (
    <section
      ref={ref}
      className={clsx(
        "relative flex items-center justify-center overflow-hidden",
        getHeight(),
        className
      )}
    >
      {/* Background */}
      {backgroundType === "image" && backgroundImage?.url && (
        <Image
          data={backgroundImage}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          sizes="100vw"
        />
      )}
      {backgroundType === "video" && backgroundVideo?.url && (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={backgroundVideo.url} type={backgroundVideo.type} />
        </video>
      )}

      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: overlayColor,
          opacity: overlayOpacity / 100,
        }}
      />

      {/* Content */}
      <div
        ref={scope}
        className={clsx(variants({ gap }))}
        style={{ 
          maxWidth: `${contentWidth}px`,
          padding: "0 1rem",
        }}
      >
        {children}
      </div>
    </section>
  );
});

export default Hero;
