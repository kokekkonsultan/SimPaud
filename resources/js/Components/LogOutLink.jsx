import { Link } from '@inertiajs/react';

export default function LogOutLink({ active = false, className = '', children, ...props }) {
    return (
        <Link
            {...props}
            className={`block px-3 py-1 text-sm leading-6 text-gray-900 ${
                active
                    ? ''
                    : ''
            } transition duration-150 ease-in-out ${className}`}
        >
            {children}
        </Link>
    );
}
