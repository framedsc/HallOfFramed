import spritePath from '../assets/icon-sprite.svg'

/**
 * @typedef {import('react').SVGProps<SVGSVGElement>} IconProps
 * @prop {string} icon
 * @prop {'14' | '16' | '20' | '24' | '32'} size
 */

/**
 * 
 * @param {IconProps} props 
 */
export function Icon({ icon, size = '20', ...props }) {
    const sizeAttributes = {
        width: size,
        height: size,
    }
    const a11yAttributes =  {
        role: 'img',
        'aria-hidden': true,
    }

    return (
        <svg fill="currentColor" {...sizeAttributes} {...a11yAttributes} {...props} focusable="false">
            <use xlinkHref={`${spritePath}#${icon}`} />
        </svg>
    )
}