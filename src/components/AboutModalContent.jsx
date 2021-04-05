const AboutModalContent = () => {
  return (
    <div className="about-modal-content">
      {/* <img alt="Welcome to Framed" src={framedBanner}></img> */}
      <h2>About the Hall of Framed</h2>
      <div className='about-modal-columns'>
        <section>
          <p>
            The <a href="https://framedsc.github.io/">Framed Screenshot Community</a> Discord server
            started in 2019 as a place to discuss and collaborate in the space of video game
            screenshots. It has since become so full of incredible images that we’ve run out of pins
            to highlight them all. To fix that we created a Discord bot that curates the most
            popular shots within the server, displays them within a dedicated channel and uploads
            to this site. Posted shots can be voted on in the Discord server. Our clever bot will
            publish entries into the Hall of Framed based on popularity, which has allowed us to put
            the power to curate the best shots into the hands of our community, helping to showcase
            the depth and variety of creativity within this space.
          </p>
          <p>
            We hope that this can serve as a showcase for what talented screenshotters can achieve.
            Maybe you'll find it useful as inspiration, or as a nice source of background images for
            your PC or phone.
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
            For general inquiries, or if you want to get an invite to the Discord server you can
            contact either Jim2Point0 or Otis_Inf via the below links
          </p>

          <p>
            Tweet @Jim2Point0 on <a href="https://twitter.com/jim2point0">Twitter</a>
          </p>

          <p>
            Tweet @FransBouma on <a href="https://twitter.com/FransBouma">Twitter</a>
            <br />
            Or contact him through his <a href="https://fransbouma.com/contact">Website</a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutModalContent;
