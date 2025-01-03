const AboutModalContent = () => {
  return (
    <div className="about-modal-content">
      {/* <img alt="Welcome to Framed" src={framedBanner}></img> */}
      <h2>About the Hall of FRAMED</h2>
      <div className='about-modal-columns'>
        <section>
          <p>
            The Hall of FRAMED is a gallery that curates and celebrates the most popular shots that we've
            have taken and shared over the years. In 2019, the <a href="https://framedsc.github.io/">FRAMED Screenshot Community</a> began
            as a place to collate and discuss all we knew about screenshotting. It soon overflowed
            with so many incredible screenshots that we decided it was time to create a gallery to highlight
            the ones we loved the most. And so, in 2021, the Hall of FRAMED was born. 
          </p>
          <p>
            This page continuously updates on its own, thanks to an automated curation system that
            publishes entries to the Hall based on popular vote.
          </p>
          <p>
            We hope this gallery serves as an exhibition of the depth and variety of creativity within this space,
            showcasing what's possible in the field of virtual photography. Maybe you'll find it useful as inspiration,
            or just as a <a href="https://framedsc.com/HOFWallpaper/">nice source of wallpapers</a> for your PC and phone. 
          </p>
        </section>
        <section>
          <h4>Gallery Controls</h4>
          <p>
            This gallery can be navigated with both mouse and keyboard shortcuts. You can use the
            left & right arrow keys to cycle between shots, while the F key will open the currently
            selected image in fullscreen and the ESC key can be used to close the viewer. If you’re
            browsing on a mobile or touch device, you can also use swipe motions to navigate the
            images.
          </p>
        </section>
        <section>
          <h4>Copyright and usage</h4>
          <p>
            All shots on this site are &copy; the rightful owner of the work. Shots on this site are
            strictly for personal use only. It's not allowed to use the shots in commercial or other
            non-personal contexts without the written approval of the copyright owner.
          </p>
        </section>
        <section>
          <h4>Search options</h4>
          <div>
            <p>
              You can simply type in the box to search, or you can specify the term you wish to
              search for. Each search you enter will be added as a separate filter, allowing you 
              to narrow the results further. As you type, a window will show you the possible 
              types of data you can search for and will guide you along if you click them. 
              Filters can be removed by clicking them in the window. Examples:
            </p>
            <ol>
              <li><code>cyberpunk</code><span> : searches all data for the text "cyberpunk"</span></li>
              <li><code>title: Cyberpunk</code><span> : finds shots from the game "Cyberpunk"</span></li>
              <li><code>author: Dread</code><span> : finds all shots by "Dread"</span></li>
              <li><code>before: 2021-03-18</code><span> : finds shots posted before March 18th, 2021</span></li>
              <li><code>after: 2020-11-05</code><span> : finds shots posted after November 5th, 2020</span></li>
              <li><code>width:{` > `}3840</code><span> : finds shots with a width greater than or equal 3840</span></li>
              <li><code>height:{` < `}2160</code><span> : finds shots with a height smaller than or equal to 2160</span></li>
            </ol>
            <br />
          </div>
        </section>
        <section>
          <h4>Contact</h4>
          <p>
            <a href="https://x.com/framedsc">X, formerly Twitter</a><br/>
            <a href="https://bsky.app/profile/framedsc.com">Bluesky</a>
          </p>

          <p>
            <a href="https://framedsc.com/joinus.htm">Interested in joining FRAMED?</a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutModalContent;
