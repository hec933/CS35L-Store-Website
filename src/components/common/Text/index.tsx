import classNames from "classnames";

interface Props extends React.ComponentPropsWithoutRef<"span"> {
    // Set the size of the text. (default: md)
    size?: "4xl" | "3xl" | "2xl" | "xl" | "lg" | "md" | "sm" | "xs";

    // Set the color of the text. (default: black)
    color?:
        | "black"
        | "grey"
        | "red"
        | "white"
        | "uclaBlue"
        | "darkestBlue"
        | "darkerBlue"
        | "lighterBlue"
        | "lightestBlue"
        | "uclaGold"
        | "darkestGold"
        | "darkerGold";

    // Set the font weight of the text. (default: normal)
    weight?: "light" | "normal" | "bold";
}

// A component for displaying generic text
export default function Text({
    size = "md",
    color = "black",
    weight = "normal",
    ...props
}: Props) {
    return (
        <span
            {...props}
            className={classNames(
                props.className,
                {
                    "text-4xl": size === "4xl",
                    "text-3xl": size === "3xl",
                    "text-2xl": size === "2xl",
                    "text-xl": size === "xl",
                    "text-lg": size === "lg",
                    "text-base": size === "md",
                    "text-sm": size === "sm",
                    "text-xs": size === "xs",
                },
                {
                    "text-black": color === "black",
                    "text-zinc-400": color === "grey",
                    "text-red-500": color === "red",
                    "text-white": color === "white",
                    "text-uclaBlue": color === "uclaBlue",
                    "text-darkestBlue": color === "darkestBlue",
                    "text-darkerBlue": color === "darkerBlue",
                    "text-lighterBlue": color === "lighterBlue",
                    "text-lightestBlue": color === "lightestBlue",
                    "text-uclaGold": color === "uclaGold",
                    "text-darkestGold": color === "darkestGold",
                    "text-darkerGold": color === "darkerGold",
                },
                {
                    "font-light": weight === "light",
                    "font-normal": weight === "normal",
                    "font-bold": weight === "bold",
                }
            )}
        />
    );
}
