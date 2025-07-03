import type { HydrogenComponentProps } from "@weaverse/hydrogen";
import { forwardRef } from "react";
import { createSchema } from "@weaverse/hydrogen";
import clsx from "clsx";

interface HeadingData {
  text: string;
  color: string;
  size: "small" | "medium" | "large";
  alignment: "left" | "center" | "right";
}

type HeadingProps = HydrogenComponentProps & HeadingData;

export let schema = createSchema({
  type: "hero-heading",
  title: "Heading",
  settings: [
    {
      group: "Content",
      inputs: [
        {
          type: "text",
          name: "text",
          label: "Text",
          defaultValue: "Welcome to our store",
        },
        {
          type: "select",
          name: "size",
          label: "Size",
          defaultValue: "large",
          configs: {
            options: [
              { value: "small", label: "Small" },
              { value: "medium", label: "Medium" },
              { value: "large", label: "Large" },
            ],
          },
        },
      ],
    },
    {
      group: "Style",
      inputs: [
        {
          type: "color",
          name: "color",
          label: "Color",
          defaultValue: "#ffffff",
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

const sizeClasses = {
  small: "text-3xl md:text-4xl",
  medium: "text-4xl md:text-5xl",
  large: "text-5xl md:text-6xl",
};

const alignmentClasses = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const HeroHeading = forwardRef<HTMLHeadingElement, HeadingProps>((props, ref) => {
  const {
    text = "Welcome to our store",
    color = "#ffffff",
    size = "large",
    alignment = "center",
    className,
  } = props;

  return (
    <h1
      ref={ref}
      className={clsx(
        "font-bold",
        sizeClasses[size],
        alignmentClasses[alignment],
        className
      )}
      style={{ color }}
    >
      {text}
    </h1>
  );
});

export default HeroHeading; 