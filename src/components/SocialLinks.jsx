import { extractTopLevelDomain } from '../utils/utils';
import { Icon } from './Icon';

export const SocialLinks = ({ data = null }) => {
  if (!data) {
    return null;
  }

  /**
   * `icon` maps to the symbol id in the SVG sprite.
   */
  const KNOWN_SOCIALS = {
    'artstation': { icon: 'artstation', label: 'Artstation' },
    'bsky': { icon: 'bluesky', label: 'Bluesky' },
    'flickr': { icon: 'flickr', label: 'Flickr' }, 
    'instagram': { icon: 'instagram', label: 'Instagram' }, 
    'picashot': { icon: 'picashot', label: 'Picashot' },
    'steam': { icon: 'steam', label: 'Steam' }, 
    'tumblr': { icon: 'tumblr', label: 'Tumblr' },
    'twitter': { icon: 'twitter', label: 'Twitter' },
    'x.com': { icon: 'xdotcom', label: 'X' },
    'youtube': { icon: 'youtube', label: 'YouTube' },
  }

  const renderSocials = (linkList) => {
    return (
      <>
        {linkList.map((social, index) => {
          const socialText = social.label ? social.label : extractTopLevelDomain(social.link);

          return (
            <li className="author-link" key={index}>
              <a
                className="social-link"
                rel="noreferrer"
                target="_blank"
                href={social.link}
                onClick={(event) => event.stopPropagation()}
              >
                <Icon icon={social.icon} className="social-link-icon" />
                <span>{socialText}</span>
              </a>
            </li>
          );
        })}
      </>
    );
  };

  let authorSocials = [];
  let otherSocials = [];

  Object.entries(KNOWN_SOCIALS).forEach(([key, social]) => {
    if (data[key]) {
      authorSocials.push({
        label: social.label,
        icon: social.icon,
        link: data[key],
      });
    }
  });

  for (let i = 0; i < data.othersocials.length; i++) {
    otherSocials.push({ icon: 'globe', link: data.othersocials[i] });
  }

  return !authorSocials.length && !otherSocials.length ? (
    <p className="author-links-list">This author has not listed their socials on Framed</p>
  ) : (
    <ul className="author-links-list">
      {authorSocials.length > 0 && renderSocials(authorSocials)}
      {otherSocials.length > 0 && renderSocials(otherSocials)}
    </ul>
  );
};

export default SocialLinks;
