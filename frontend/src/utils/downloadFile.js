const downloadFile = (url, filename) => {
  // https://medium.com/yellowcode/download-api-files-with-react-fetch-393e4dae0d9e
  fetch(url)
    .then((res) => res.blob())
    .then((blob) => {
      const objectUrl = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');

      link.href = objectUrl;
      link.setAttribute('download', filename);
      // 3. Append to html page
      document.body.appendChild(link);
      // 4. Force download
      link.click();
      // 5. Clean up and remove the link
      link.parentNode.removeChild(link);
    });
};

export default downloadFile;
