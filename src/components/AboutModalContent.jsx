const AboutModalContent = () => {
  return (
    <div className="about-modal-content">
      {/* <img alt="Welcome to Framed" src={framedBanner}></img> */}
      <h2>About the Hall of Framed</h2>
      <p>
        The <a href="https://framedsc.github.io/">Framed Screenshot Community</a> Discord server first started in 2019 as a place to discuss
        and collaborate in the space of video game screenshots, and has since become so full of
        incredible shots that we’ve run out of room to highlight them all. To fix that we created a
        Discord bot that curates the most popular shots within the server, displaying them within a
        dedicated channel that filters to this site. Posted shots can be voted on in the Discord
        server, and our clever bot will publish entries into the Hall of Framed based on popularity,
        which has allowed us to put the power to curate the best shots into the hands of our
        community, helping to showcase the depth and variety of creativity within this space.
      </p>
      <p>
        We hope that this can serve as a showcase for what talented screenshotters can achieve.
        Maybe you'll find it useful as inspiration, or as a nice source of background images for
        your PC or phone.
      </p>
      <h4>Gallery Controls</h4>
      <p>
        This gallery can be navigated with both mouse and keyboard shortcuts. You can use the left &
        right arrow keys to cycle between shots, while the F key will open the currently selected
        image in fullscreen and the ESC key can be used to close the viewer. If you’re browsing on a
        mobile or touch device, you can also use swipe motions to navigate the images.
      </p>

      <h4>Search options</h4>
      <p>
        You can search by using some options. Here's some examples :
      <ol>
        <li>- <code>'gameName:Nier Automata'</code>: searches for all shots on Nier Automata</li>
        <li>- <code>'authorName: Jim'</code>: searches for all shots by Jim</li>
        <li>- <code>'score: 42'</code>: searches for all shots with a score superior or equal (by default) to 42</li>
        <li>- <code>'width: {">"}3840'</code>: searches for all shots with a width superior or equal to 3840</li>
        <li>- <code>'height: {"<"}2160'</code>: searches for all shots with a width inferior or equal to 2160</li>
      </ol>
      </p>

      <h4>Contact</h4>
      <p>
        For general queries, or if you want to get an invite to the Discord server you can contact
        either Jim2Point0 or Otis_Inf on the below links
      </p>

      <p>
      Tweet @Jim2Point0 on <a href="https://twitter.com/jim2point0">Twitter</a>
      </p>

      <p>
      Tweet @FransBouma on <a href="https://twitter.com/FransBouma">Twitter</a><br />
      Or contact him through his <a href="https://fransbouma.com/contact">Website</a>
      </p>
    </div>
  );
};

export default AboutModalContent;
