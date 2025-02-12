import React from 'react'
import './Home.css'
import img1 from '../../assets/Carousel-img1.jpg';
import img2 from '../../assets/Carousel-img2.jpg';
import img3 from '../../assets/Carousel-img3.jpg';
import img4 from '../../assets/Carousel-img4.jpg';

const Home = () => {
  return (
    <div className="container">
    <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">
  <div class="carousel-indicators">
    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="3" aria-label="Slide 4"></button>
  </div>
  <div class="carousel-inner">
    <div class="carousel-item active">
    <img src={img1} className="d-block w-100" alt="Carousel Image 1" />
    </div>
    <div class="carousel-item">
      <img src={img2} class="d-block w-100" alt="Carousel Image 2"/>
    </div>
    <div class="carousel-item">
      <img src={img3} class="d-block w-100" alt="Carousel Image 3"/>
    </div>
    <div class="carousel-item">
      <img src={img4} class="d-block w-100" alt="Carousel Image 4"/>
    </div>
  </div>
  <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Previous</span>
  </button>
  <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Next</span>
  </button>
</div>
</div>
  )
}

export default Home