import { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import "./Home.css";

const features = [
  {
    title: "Digital Transformation",
    icon: "/images/Frame%20363.png",
    text: "Kepler College uses modern tools to manage student records, attendance and learning outcomes in one place.",
  },
  {
    title: "Disciplined and Productive",
    icon: "/images/timer-flash-line%201.png",
    text: "Discipline helps our students stay focused, meet deadlines and turn their potential into results.",
  },
  {
    title: "Race Towards Goodness",
    icon: "/images/hand-heart-line%201.png",
    text: "Building good character in graduates through service, teamwork and compassion for others.",
  },
];

const categories = [
  "All",
  "Foundation period",
  "Sports Culture",
  "Physical effort",
];

const photos = [
  {
    id: 1,
    category: "Foundation period",
    caption: "Foundation class",
    src: "/images/gallery1.jpg",
  },
  {
    id: 2,
    category: "Sports Culture",
    caption: "Sports Culture",
    src: "/images/gallery2.jpg",
  },
  {
    id: 3,
    category: "Physical effort",
    caption: "Campus gathering",
    src: "/images/gallery3.jpg",
  },
];

export default function Home() {
  const [category, setCategory] = useState("All");

  const shownPhotos =
    category === "All" ? photos : photos.filter((p) => p.category === category);

  return (
    <>
      {/* Hero */}
      <section id="home" className="ss-hero">
        <div className="ss-hero-text">
          <p className="ss-kicker">Students management platform</p>
          <h1>
            STUDENTSYNC <br /> MANAGEMENT WEB APP
          </h1>
          <p className="ss-sub">Students for the Academic Year 2025/2026</p>
          <div className="ss-actions">
            <a href="#culture" className="ss-btn ss-btn-outline">
              Learn more
            </a>
            <Link to="/students" className="ss-btn ss-btn-solid">
              All Students
            </Link>
          </div>
        </div>

        <div className="ss-hero-media">
          <img
            className="ss-hero-main"
            src="/images/hero.jpg"
            alt="Students smiling together"
          />
          <div className="ss-thumbs">
            <img
              className="ss-thumb"
              src="/images/thumb1.jpg"
              alt="Campus life 1"
            />
            <img
              className="ss-thumb"
              src="/images/thumb2.jpg"
              alt="Campus life 2"
            />
            <img
              className="ss-thumb"
              src="/images/thumb3.jpg"
              alt="Campus life 3"
            />
          </div>
        </div>
      </section>

      {/* Culture cards */}
      <section id="culture" className="ss-section">
        <p className="ss-eyebrow">Vibrant Culture</p>
        <h2>Kepler College Students management</h2>

        <div className="ss-cards">
          {features.map((item, index) => (
            <article
              key={item.title}
              className={index === 1 ? "ss-card featured" : "ss-card"}
            >
              <div className="ss-card-head">
                <img className="ss-card-icon" src={item.icon} alt="" />
                <h3>{item.title}</h3>
              </div>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section id="students" className="ss-section">
        <p className="ss-eyebrow">Gallery</p>
        <h2>Kepler College Students Lifestyle</h2>

        <div className="ss-filters">
          {categories.map((name) => (
            <button
              key={name}
              className={category === name ? "active" : ""}
              onClick={() => setCategory(name)}
            >
              {name}
            </button>
          ))}
        </div>

        <div className="ss-gallery">
          {shownPhotos.map((photo) => (
            <figure key={photo.id} className="ss-shot">
              <img src={photo.src} alt={photo.caption} />
              <figcaption>{photo.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </>
  );
}
