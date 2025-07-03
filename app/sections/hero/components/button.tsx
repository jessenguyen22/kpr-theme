import type { HydrogenComponentProps } from "@weaverse/hydrogen";
import { forwardRef } from "react";
import { createSchema } from "@weaverse/hydrogen";
import { Link } from "react-router";
import clsx from "clsx";

interface ButtonData {
  text: string;
  link: string;
  style: "primary" | "secondary" | "outline";
  size: "small" | "medium" | "large";
  alignment: "left" | "center" | "right";
  openInNewTab: boolean;
}

type ButtonProps = HydrogenComponentProps & ButtonData;

export let schema = createSchema({
  type: "hero-button",
  title: "Button",
  settings: [
    {
      group: "Content",
      inputs: [
        {
          type: "text",
          name: "text",
          label: "Text",
          defaultValue: "Shop Now",
        },
        {
          type: "url",
          name: "link",
          label: "Link",
          defaultValue: "/collections/all",
        },
        {
          type: "switch",
          name: "openInNewTab",
          label: "Open in new tab",
          defaultValue: false,
        },
      ],
    },
    {
      group: "Style",
      inputs: [
        {
          type: "select",
          name: "style",
          label: "Style",
          defaultValue: "primary",
          configs: {
            options: [
              { value: "primary", label: "Primary" },
              { value: "secondary", label: "Secondary" },
              { value: "outline", label: "Outline" },
            ],
          },
        },
        {
          type: "select",
          name: "size",
          label: "Size",
          defaultValue: "medium",
          configs: {
            options: [
              { value: "small", label: "Small" },
              { value: "medium", label: "Medium" },
              { value: "large", label: "Large" },
            ],
          },
        },
        {
          type: "select",
          name: "alignment",
          label: "Alignment",
          defaultValue: "center",
          configs: {
            options: [
              { value: "left", label: "Left" },
              { value: "center", label: "Center" },
              { value: "right", label: "Right" },
            ],
          },
        },
      ],
    },
  ],
});

const styleClasses = {
  primary: "bg-primary text-white hover:bg-primary/90",
  secondary: "bg-secondary text-white hover:bg-secondary/90",
  outline: "bg-transparent border-2 border-white text-white hover:bg-white/10",
};

const sizeClasses = {
  small: "px-6 py-2 text-sm",
  medium: "px-8 py-3 text-base",
  large: "px-10 py-4 text-lg",
};

const alignmentClasses = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const HeroButton = forwardRef<HTMLDivElement, ButtonProps>((props, ref) => {
  const {
    text = "Shop Now",
    link = "/collections/all",
    style = "primary",
    size = "medium",
    alignment = "center",
    openInNewTab = false,
    className,
  } = props;

  return (
    <div
      ref={ref}
      className={clsx(
        "w-full",
        alignmentClasses[alignment],
        className
      )}
    >
      <Link
        to={link}
        target={openInNewTab ? "_blank" : undefined}
        className={clsx(
          "inline-block rounded-md transition-colors duration-200",
          styleClasses[style],
          sizeClasses[size]
        )}
      >
        {text}
      </Link>
    </div>
  );
});

export default HeroButton; 