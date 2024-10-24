import { Icon } from './Icon'

/**
 * @param {string[]} links
 */
export const SocialLinks = ({ links = null }) => {
  if (!links) return null

  return links.length > 0 ? (
    <ul className="author-links-list">
      {links.map((link, index) => <SocialLink key={index} link={link} />)}
    </ul>
  ) : (
    <p className="author-links-list">This author has not listed their socials on Framed</p>
  )
}

export default SocialLinks

/**
 * Returns the icon and label for a given link based on its hostname.
 * 
 * @param {string} link 
 * @returns {{icon: string, label: string}}
 */
function getLinkIconAndLabel(link) {
  const hostname = new URL(link).hostname.replace('www.', '')

  switch (hostname) {
    case hostname.includes('artstation.com'):
      return { icon: 'artstation', label: 'Artstation' }

    case hostname.includes('bsky.app'):
      return { icon: 'bluesky', label: 'Bluesky' }

    case hostname.includes('flickr.com'):
    case hostname.includes('flic.kr'):
      return { icon: 'flickr', label: 'Flickr' }

    case hostname.includes('instagram.com'):
    case hostname.includes('instagr.am'):
      return { icon: 'instagram', label: 'Instagram' }

    case hostname.includes('picashot.co'):
      return { icon: 'picashot', label: 'Picashot' }

    case hostname.includes('steamcommunity.com'):
      return { icon: 'steam', label: 'Steam' }

    case hostname.includes('tumblr.com'):
      return { icon: 'tumblr', label: 'Tumblr' }

    case hostname.includes('twitter.com'):
      return { icon: 'twitter', label: 'Twitter' }

    case hostname.includes('x.com'):
      return { icon: 'xdotcom', label: 'X' }

    case hostname.includes('youtube.com'):
    case hostname.includes('youtu.be'):
      return { icon: 'youtube', label: 'YouTube' }

    default:
      return { icon: 'globe', label: hostname }
  }
}

function SocialLink({ link, ...props }) {
  const { icon, label } = getLinkIconAndLabel(link)

  return (
    <li className="author-link" {...props}>
      <a
        className="social-link"
        rel="noreferrer"
        target="_blank"
        href={link}
        onClick={(event) => event.stopPropagation()}
      >
        <Icon icon={icon} className="social-link-icon" />
        <span>{label}</span>
      </a>
    </li>
  )
}
