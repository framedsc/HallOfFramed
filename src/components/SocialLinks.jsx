import { Flickr, Globe, Instagram, Steam, Twitter } from '../assets/svgIcons';

export const SocialLinks = ({ data = null }) => {
  if (!data) {
    return null;
  }

  const renderSocials = (linkList) => {
    return (
      <ul className="social-links">
        {linkList.map((social, index) => {
          const socialText = social.label ? social.label : social.link;
          return (
            <li key={`social-button-${index}`} className="social-button">
              <a
                className="social-link"
                key={`social-link-${index}`}
                rel="noreferrer"
                target="_blank"
                href={social.link}
              >
                {social.icon}
                <span className="social">{socialText}</span>
              </a>
            </li>
          );
        })}
      </ul>
    );
  };

  const socials = [
    { key: 'twitter', icon: <Twitter />, label: 'Twitter' },
    { key: 'steam', icon: <Steam />, label: 'Steam' },
    { key: 'flickr', icon: <Flickr />, label: 'Twitter' },
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

  return !authorSocials.length && !otherSocials.length ? null : (
    <div className="social-links-container">
      {authorSocials.length > 0 && (<h4>Social media</h4>)}
      {renderSocials(authorSocials)}

      {otherSocials.length > 0 && (<h4>Other</h4>)}
      {renderSocials(otherSocials)}
    </div>
  );
};

export default SocialLinks;
