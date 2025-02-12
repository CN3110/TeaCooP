import React from 'react';
import './AboutUs.css';
import backgroundImage from '../../assets/about-us-background-img.jpg';

const AboutUs = () => {
  return (
    <div className='aboutus'>
      <div className='aboutus-container' style={{ backgroundImage: `url(${backgroundImage})` }}>
        <h1>About Us</h1>
        <p>Welcome to Morawakkorale Tea Factory, where passion, tradition, and expertise blend to produce the finest Ceylon tea. Nestled in the lush greenery of Deniyaya, Sri Lanka, our tea factory is dedicated to crafting premium-quality teas that capture the true essence of Ceylon's renowned tea heritage.</p>
      </div>

      <div className='our-story-container'>

        <div className='our-heritage-container'>
          <h3>Our Heritage & Commitment to Quality</h3>
          <p>Established in 1955, Morawakkorale Tea Factory is operated by the Morawakkorale Tea Producers' Cooperative Society Ltd., located in Kotapola, Sri Lanka. For decades, we have upheld a legacy of excellence in tea cultivation and processing, ensuring that every leaf we produce meets the highest standards of quality and authenticity. With a daily processing capacity of approximately 15,000 kg of green leaf, our factory specializes in producing high-quality orthodox teas. By blending traditional craftsmanship with modern technology, we guarantee that each batch of tea retains its freshness, aroma, and rich flavors. Our teas have consistently performed well at Sri Lanka’s tea auctions, further reinforcing our reputation for excellence.</p>
        </div>

        <div className='sustainable-ethical-practices-container'>
          <h3>Sustainable & Ethical Practices</h3>
          <p>As an export-only tea producer, we take pride in delivering the purest flavors of Sri Lanka to tea lovers worldwide. Our commitment to sustainability and ethical practices ensures that every tea leaf is cultivated with environmental and social responsibility. Whether you're a tea enthusiast or a business looking for premium Ceylon tea, our diverse range of handpicked and expertly processed teas caters to every preference. We continuously strive to maintain the highest standards in tea production while preserving the rich heritage of Ceylon tea.</p>
        </div>

        <div className='our-tea-varieties-container'>
          <h3>Our Tea Varieties & The Taste of Ceylon</h3>
          <p>We offer a diverse selection of premium tea types, each carefully crafted to highlight the finest flavors of Ceylon tea. Our range includes orthodox black teas, green teas, and specialty blends, all produced with expertise and passion. From our lush plantations to your cup, Morawakkorale Tea Factory ensures that every sip is a celebration of quality, heritage, and sustainability. Join us in exploring the world of authentic Ceylon tea and discover the exquisite flavors that make our teas truly special.</p>
          <button>Discover Our Tea Varieties</button>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
