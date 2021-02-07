import { Flickr, Globe, Instagram, Steam, Twitter } from '../assets/svgIcons';

export const SocialLinks = ({ data = null }) => {
  if (!data) {
    return null;
  }

  const renderSocials = (linkList) => {
    return (
      <ul className="author-links-list">
        {linkList.map((social, index) => {
          const socialText = social.label ? social.label : social.link;
          return (
            <li key={`social-button-${index}`}>
              <a
                className="social-link"
                key={`social-link-${index}`}
                rel="noreferrer"
                target="_blank"
                href={social.link}
              >
                <span>{socialText}</span>
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

  console.log('render socials')

  return !authorSocials.length && !otherSocials.length ? (
    <p>This author has not shared their socials within Framed</p>
  ) : (
    <>
      {authorSocials.length > 0 && renderSocials(authorSocials)}
      {otherSocials.length > 0 && renderSocials(otherSocials)}
    </>
  );
};

export default SocialLinks;
