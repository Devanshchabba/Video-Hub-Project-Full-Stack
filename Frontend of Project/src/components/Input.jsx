import React, { useId } from 'react'

const Input = React.forwardRef(function Input({
    placeholder,
    name,
    icon,
    type = "text",
    required = 'true',
    label,
    className = '',
    ...props
}, ref) {
    const id = useId();
    return (
        <div>
            {label || <label
                htmlFor={id}
                className="block text-sm font-semibold text-gray-300 mb-2"
            >
                {label}
            </label>}
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                {icon}
            </span>
            <input
                type={type}
                id={id}
                name={name}
                className={`w-full rounded-lg border border-gray-700 bg-gray-800 py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${className}`}
                placeholder={placeholder}
                required={required}
                ref={ref}
                {...props}
            />
        </div>
    )
}
)

export default Input