import { Flickr, Globe, Instagram, Steam, Twitter } from '../assets/svgIcons';
import { extractTopLevelDomain } from '../utils/utils';

export const SocialLinks = ({ data = null }) => {
  if (!data) {
    return null;
  }

  const renderSocials = (linkList) => {
    return (
      <>
        {linkList.map((social, index) => {
          const socialText = social.label ? social.label : extractTopLevelDomain(social.link);
          return (
            <li className="author-link" key={`social-button-${index}`}>
              <a
                className="social-link"
                key={`social-link-${index}`}
                rel="noreferrer"
                target="_blank"
                href={social.link}
                title={social.link}
              >
                <span>{socialText}</span>
              </a>
            </li>
          );
        })}
      </>
    );
  };

  const socials = [
    { key: 'twitter', icon: <Twitter />, label: 'Twitter' },
    { key: 'steam', icon: <Steam />, label: 'Steam' },
    { key: 'flickr', icon: <Flickr />, label: 'Flickr' },
    { key: 'instagram', icon: <Instagram />, label: 'Instagram' },
  ];
  let authorSocials = [];
  let otherSocials = [];
  for (const social of socials) {
    if (data[social.key].length) {
      authorSocials.push({
        label: social.label,
        key: social.key,
        icon: social.icon,
        link: data[social.key],
      });
    }
  }

  for (let i = 0; i < data.othersocials.length; i++) {
    otherSocials.push({ key: 'other', icon: <Globe />, link: data.othersocials[i] });
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
