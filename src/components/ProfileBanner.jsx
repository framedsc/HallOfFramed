import React from 'react';
import { Icon } from './Icon'

import { getLinkIconAndLabel } from './SocialLinks';

const defaultAvatar = "default_avatar.png";

const avatarStyle = {
  width: '150px',
  height: '150px',
  borderRadius: '50%',
  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
};

const profileNameStyle = {
  padding: '20px',
  fontSize: '32px',
  fontWeight: 'bold',
  color: 'hsla(0, 0%, 90%, 1)',
  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
};

const socialEntryStyle = {
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  margin: '0 10px',
  padding: '10px 15px',
  borderRadius: '20px',
  background: 'hsla(0, 0%, 10%, 0.8)',
  color: 'hsla(0, 0%, 90%, 1)',
  transition: 'all 0.3s ease',
  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
};

const iconStyle = {
  transition: 'all 0.3s ease',
};

const textStyle = {
  marginLeft: '8px',
  textDecoration: 'none',
  transition: 'all 0.3s ease',
};

const ProfileBanner = ({ profileData }) => {
  const shouldDisplay = profileData !== undefined;
  const avatarUrl = shouldDisplay ? profileData.authorsAvatarUrl : '';

  const profileBannerStyle = {
    paddingTop: shouldDisplay ? '80px' : '0',
    justifyItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    alignItems: 'center',
    overflow: 'hidden',
    transition: 'all 0.5s ease',
    height: shouldDisplay ? 'auto' : '0',
    opacity: shouldDisplay ? '1' : '0',
    width: '90%',
    maxWidth: '1200px',
    margin: '0 auto',
    boxSizing: 'border-box',
  };

  const socialIconAndLabels = shouldDisplay ? profileData.socials.map((item) => {
    if (!item.startsWith("http")) {
      item = `https://${item}`;
    }

    return getLinkIconAndLabel(item);
  }
) : [];

  const socialsSectionStyle = {
    flexDirection: 'row',
    borderRadius: '15px',
    padding: '20px',
    display: socialIconAndLabels.length === 0 ? 'none' : 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '10px',
  };

  return (
    <div className="ProfileBanner" style={profileBannerStyle}>
      <img
        className="Avatar"
        alt="Avatar"
        src={avatarUrl}
        style={avatarStyle}
        onError={(e) => {
          (e.target).src = defaultAvatar;
        }}
      ></img>
      <div style={profileNameStyle}>{profileData !== undefined ? profileData.authorNick : ""}</div>
      <div style={socialsSectionStyle}>
        {socialIconAndLabels.map((item, index) => (
          <a
            href={profileData.socials[index]}
            target="_blank"
            rel="noreferrer"
            style={socialEntryStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
              const icon = e.currentTarget.querySelector('.social-link-icon');
              const text = e.currentTarget.querySelector('.social-link-text');
              icon.style.filter = "drop-shadow(0px 0px 4px hsla(0, 0%, 100%, 0.33))";
              icon.style.WebkitFilter = "drop-shadow(0px 0px 4px hsla(0, 0%, 100%, 0.33))";
              text.style.textShadow = '0px 0px 4px hsla(0, 0%, 100%, 0.66)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              const icon = e.currentTarget.querySelector('.social-link-icon');
              const text = e.currentTarget.querySelector('.social-link-text');
              text.style.textShadow = 'none';
              icon.style.filter = "none";
              icon.style.WebkitFilter = "none";
            }}
          >
            <Icon icon={item.icon} className="social-link-icon" style={iconStyle} />
            <span className="social-link-text" style={textStyle}>{item.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default React.memo(ProfileBanner, (prevProps, nextProps) => {
  return prevProps.profileData === nextProps.profileData;
});
