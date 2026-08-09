const CLOUDINARY_BASE =
  'https://res.cloudinary.com/drn6x6hbd/image/upload';

const cloudinary = (path, width = 1600) =>
  `${CLOUDINARY_BASE}/f_auto,q_auto,w_${width},c_limit/${path}`;

export const IMAGES = {
  /* Hero slideshow */
  hero1: cloudinary('hero1', 1920),
  hero2: cloudinary('hero2', 1920),
  hero3: cloudinary('hero3', 1920),

  /* Statement section */
  statement: cloudinary('statement', 1600),

  /* Films section */
  film1: cloudinary('film1', 1600),
  film2: cloudinary('film2', 1600),
  film3: cloudinary('film3', 1600),

  /* Story section */
  story: cloudinary('story', 1600),

  /* Founders section */
  foundersBanner: cloudinary('founders-banner', 1600),
  vrinda: cloudinary('vrinda', 1200),
  shristi: cloudinary('shristi', 1200),

  /* Sphere gallery */
  sphere1: cloudinary('sphere1', 900),
  sphere2: cloudinary('sphere2', 900),
  sphere3: cloudinary('sphere3', 900),
  sphere4: cloudinary('sphere4', 900),
  sphere5: cloudinary('sphere5', 900),
  sphere6: cloudinary('sphere6', 900),
  sphere7: cloudinary('sphere7', 900),
  sphere8: cloudinary('sphere8', 900),
  sphere9: cloudinary('sphere9', 900),
  sphere10: cloudinary('sphere10', 900),
  sphere11: cloudinary('sphere11', 900),
  sphere12: cloudinary('sphere12', 900),
};
