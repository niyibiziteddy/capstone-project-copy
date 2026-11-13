import { useState } from "react";
import {
  FaClock,
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaMapMarkerAlt,
  FaPhone,
  FaYoutube,
} from "react-icons/fa";
import "./Footer.css";

export default function Footer() {
 
  return (
    <>
      {/* Footer */}
      <footer className="ss-footer">
        <div className="ss-footer-grid">
          <div>
            <h4 className="ss-footer-title">STUDENTSYNC MANAGEMENT APP</h4>
            <p className="ss-kicker">Students management platform</p>
            <h5>Our Address</h5>
            <p className="ss-line ss-line-with-icon">
              <FaMapMarkerAlt aria-hidden="true" />
              Gasabo District, Kinyinya Sector Murama Cell, Rusenyi Village KG
              29 AVe 16 Kigali, Rwanda
            </p>
            <p className="ss-line ss-line-with-icon">
              <FaClock aria-hidden="true" />
              Working Hours: Monday - Friday 08:00 - 17:00
            </p>
          </div>

          <div>
            <h5>Contact Us</h5>
            <p className="ss-line ss-line-with-icon">
              <FaEnvelope aria-hidden="true" />
              info@studentsync.com
            </p>
            <p className="ss-line ss-line-with-icon">
              <FaPhone aria-hidden="true" />
              +250 123 456 789
            </p>
          </div>

          <div>
            <h5>Social Media</h5>
            <div className="ss-social">
              <a href="#" aria-label="Facebook">
                <FaFacebookF aria-hidden="true" />
              </a>
              <a href="#" aria-label="Instagram">
                <FaInstagram aria-hidden="true" />
              </a>
              <a href="#" aria-label="YouTube">
                <FaYoutube aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        <p className="ss-copy">© Copyright StudentSync. All Rights Reserved.</p>
      </footer>
    </>
  );
}
