const reportWebVitals = onPerfEntry => {
  // Check if onPerfEntry is a function before proceeding
  if (onPerfEntry && onPerfEntry instanceof Function) {
    // Dynamically import 'web-vitals' library using dynamic imports (code splitting)
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      // Call the performance metrics functions from 'web-vitals' library and pass the onPerfEntry callback
      getCLS(onPerfEntry); // Cumulative Layout Shift
      getFID(onPerfEntry); // First Input Delay
      getFCP(onPerfEntry); // First Contentful Paint
      getLCP(onPerfEntry); // Largest Contentful Paint
      getTTFB(onPerfEntry); // Time to First Byte
    });
  }
};

export default reportWebVitals;
