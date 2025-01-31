import { DetailedHTMLProps, InputHTMLAttributes } from "react";

export function UrlInput(
    props: DetailedHTMLProps<
        InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
    >,
) {
    return (
        <div>
            <input
                {...props}
                type='url'
                className='my-2 bg-gray-800 border border-gray-700 text-white text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-3 placeholder-gray-500'
                placeholder='www.example.com'
                required
            />
        </div>
    );
}
