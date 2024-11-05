import classNames from "classnames";
import { ForwardedRef, forwardRef } from "react";

interface Props extends React.ComponentPropsWithoutRef<"input"> {}
/**
 * Input components
 */
const Input = forwardRef(function Input(
    { ...props }: Props,
    ref: ForwardedRef<HTMLInputElement>
) {
    return (
        <input
            {...props}
            ref={ref}
            className={classNames(
                props.className,
                "border text-base p-2 outline-none text-black disabled:opacity-50"
            )}
        />
    );
});
export default Input;
