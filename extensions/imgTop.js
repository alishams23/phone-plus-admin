export function fixTipTapContent(html) {
  let container = document.createElement('div');
  container.innerHTML = html;

  let el;
  // Move all images out of anchors, and set replacement text for the anchors.
  while ((el = container.querySelector('a > img'))) {
    unwrapLink(el.parentNode, el.getAttribute('alt') || 'Image link');
  }

  // Move all images out of paragraphs.
  while ((el = container.querySelector('p img'))) {
    unwrap(el.parentNode);
  }

  // Wrap all non-paragraph-wrapped anchors in paragraphs.
  while ((el = container.querySelector('a:not(p a)'))) {
    wrap(el, document.createElement('p'));
  }

  // Move youtube iframes out of paragraphs.
  while ((el = container.querySelector('p > iframe[src*="youtube.com"]'))) {
    unwrap(el.parentNode);
  }

  // Wrap youtube iframes in the proper tiptap-element.
  while (
    (el = container.querySelector(
      ':not([data-youtube-video]) > iframe[src*="youtube.com"]'
    ))
  ) {
    let wrapper = document.createElement('div');
    wrapper.dataset.youtubeVideo = true;
    wrap(el, wrapper);
  }

  return container.innerHTML;
}

/**
 * Move all chldren out of an element, and remove the element.
 */
function unwrap(el) {
  let parent = el.parentNode;

  // Move all children to the parent element.
  while (el.firstChild) parent.insertBefore(el.firstChild, el);

  // Remove the empty element.
  parent.removeChild(el);
}

/**
 * Move all chldren out of an anchor, and set a replacement text.
 */
function unwrapLink(el, replacementText) {
  let parent = el.parentNode;

  // Move all children to the parent element.
  while (el.firstChild) parent.insertBefore(el.firstChild, el);

  // Keep the anchor in the dom but since it's empty we'll
  // set a replacement text.
  el.textContent = replacementText;
}

/**
 * Wrap a dom node with another node.
 */
function wrap(el, wrapper) {
  el.parentNode.insertBefore(wrapper, el);
  wrapper.appendChild(el);
}
