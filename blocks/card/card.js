export default function init(el) {
  const inner = el.querySelector(':scope > div');
  if (!inner) return;
  inner.classList.add('card-inner');

  // Decorate picture
  const pic = el.querySelector('picture');
  if (pic) {
    const picPara = pic.closest('p');
    if (picPara) {
      const picDiv = document.createElement('div');
      picDiv.className = 'card-picture-container';
      picDiv.append(pic);
      inner.insertAdjacentElement('afterbegin', picDiv);
      picPara.remove();
    }
  }

  // Decorate content container
  const con = inner.querySelector(':scope > div:not([class])');
  if (!con) return;
  con.classList.add('card-content-container');

  // Decorate eyebrow: first <p> in content, must have text, must not be a link
  const eyebrowPara = con.querySelector(':scope > p:first-child');
  if (eyebrowPara && eyebrowPara.textContent.trim() && !eyebrowPara.querySelector('a')) {
    eyebrowPara.classList.add('card-eyebrow');
  }

  // Decorate heading: any h1-h6 inside content
  const heading = con.querySelector('h1, h2, h3, h4, h5, h6');
  if (heading && heading.textContent.trim()) {
    heading.classList.add('card-heading');
  }

  // Decorate description: any <p> that isn't the eyebrow and isn't a link-only paragraph
  con.querySelectorAll(':scope > p').forEach((p) => {
    if (p === eyebrowPara) return;
    if (p.querySelector('a')) return;
    if (!p.textContent.trim()) return;
    p.classList.add('card-description');
  });

  // Decorate CTA: last <p> of last div, must contain a link
  const ctaPara = inner.querySelector(':scope > div:last-of-type > p:last-of-type');
  if (!ctaPara) return;
  const cta = ctaPara.querySelector('a');
  if (!cta) return;

  const hashAware = el.classList.contains('hash-aware');
  if (hashAware) {
    cta.href = `${cta.getAttribute('href')}${window.location.hash}`;
  }
  ctaPara.classList.add('card-cta-container');
  inner.append(ctaPara);
}