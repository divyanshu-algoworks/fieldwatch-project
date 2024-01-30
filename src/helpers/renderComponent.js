import { createElement } from 'react';
import { render } from 'react-dom';

/**
 * Function render component in container element with props in container 'data' attribute
 * @param {*} componentFn Root component of page
 * @param {*} container Dom element with component props in 'data' attribute
 */
function renderComponent(componentFn, containerId = 'react-content') {
  const container = document.getElementById(containerId);
  if(!container) {
    return null;
  }
  const props = JSON.parse(container.getAttribute('data'));
  return render(
    createElement(componentFn, props),
    container,
  );
}

export default renderComponent;