import classNames from "classnames";
import Spinner from "../Spinner";

interface Props extends React.ComponentPropsWithoutRef<"button"> {
    // Specifies the button size (default: 'md')
    size?: "xs" | "sm" | "md";

    // Specifies the button color (default: 'black')
    color?:
        | "black"
        | "grey"
        | "orange"
        | "red"
        | "uclaBlue"
        | "darkestBlue"
        | "darkerBlue"
        | "lighterBlue"
        | "lightestBlue"
        | "uclaGold"
        | "darkestGold"
        | "darkerGold";

    // Specifies whether the button has an outlined style
    outline?: boolean;

    // Indicates if an interaction (loading) is in progress
    isLoading?: boolean;

    // Makes the button take the full width of the container
    fullWidth?: boolean;
}

// Component for displaying a button
export default function Button({
    color = "black",
    size = "md",
    outline,
    fullWidth,
    isLoading,
    children,
    ...props
}: Props) {
    return (
        <button
            {...props}
            disabled={isLoading || props.disabled}
            className={classNames(
                props.className,
                "disabled:opacity-50 relative",
                size === "xs" && "text-xs px-2",
                size === "sm" && "text-sm px-3 py-1",
                size === "md" && "text-base px-5 py-2",
                fullWidth && "w-full",
                outline === true
                    ? {
                          "text-black": color === "black",
                          border: true,
                          "border-black": color === "black",
                          "border-slate-300": color === "grey",
                          "border-orange-500": color === "orange",
                          "border-red-700": color === "red",
                          "border-uclaBlue": color === "uclaBlue",
                          "border-darkestBlue": color === "darkestBlue",
                          "border-darkerBlue": color === "darkerBlue",
                          "border-lighterBlue": color === "lighterBlue",
                          "border-lightestBlue": color === "lightestBlue",
                          "border-uclaGold": color === "uclaGold",
                          "border-darkestGold": color === "darkestGold",
                          "border-darkerGold": color === "darkerGold",
                      }
                    : {
                          "text-white":
                              color !== "uclaGold" &&
                              color !== "darkerGold" &&
                              color !== "lightestBlue",
                          "bg-black": color === "black",
                          "bg-slate-300": color === "grey",
                          "bg-orange-500": color === "orange",
                          "bg-red-500": color === "red",
                          "bg-uclaBlue": color === "uclaBlue",
                          "bg-darkestBlue": color === "darkestBlue",
                          "bg-darkerBlue": color === "darkerBlue",
                          "bg-lighterBlue": color === "lighterBlue",
                          "bg-lightestBlue": color === "lightestBlue",
                          "bg-uclaGold": color === "uclaGold",
                          "bg-darkestGold": color === "darkestGold",
                          "bg-darkerGold": color === "darkerGold",
                      }
            )}
        >
            {isLoading ? (
                <>
                    <div className="absolute top-0 left-0 h-full w-full flex justify-center items-center">
                        <Spinner size={size} />
                    </div>
                    <div className="opacity-0">{children}</div>
                </>
            ) : (
                children
            )}
        </button>
    );
}
