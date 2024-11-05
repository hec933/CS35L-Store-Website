import classNames from "classnames";

interface Props {
    // Specifies the size of the spinner (default: 'md')
    size?: "xs" | "sm" | "md";
}

// Component for displaying a spinner
export default function Spinner({ size = "md" }: Props) {
    return (
        <span
            className="material-symbols-outlined animate-spin"
            style={{
                fontSize:
                    size === "md"
                        ? "1rem"
                        : size === "sm"
                          ? "0.875rem"
                          : "0.75rem",
            }}
        >
            progress_activity
        </span>
    );
}
