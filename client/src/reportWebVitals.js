/**
 * A function that imports and utilizes the `web-vitals` library to measure important performance metrics
 * for the app. It's designed to help improve the quality of the user experience.
 * 
 * @param {Function} onPerfEntry - Callback function that will receive each performance metric as an argument.
 * 
 * The metrics measured are:
 * - CLS (Cumulative Layout Shift): Measures how often users experience unexpected layout shifts.
 * - FID (First Input Delay): Measures the time from when a user first interacts with your site to the time
 *   when the browser is actually able to respond to that interaction.
 * - FCP (First Contentful Paint): Measures the time from when the page starts loading to when any part of the
 *   page's content is rendered on the screen.
 * - LCP (Largest Contentful Paint): Measures the time from when the page starts loading to when the largest
 *   text block or image is rendered.
 * - TTFB (Time to First Byte): Measures the time it takes for a user's browser to receive the first byte of
 *   page content.
 */
const reportWebVitals = onPerfEntry => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;
