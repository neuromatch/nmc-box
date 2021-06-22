class IO {
  static downloadFile(apiGetEndpoint, filename) {
    // https://medium.com/yellowcode/download-api-files-with-react-fetch-393e4dae0d9e
    fetch(apiGetEndpoint)
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        // 3. Append to html page
        document.body.appendChild(link);
        // 4. Force download
        link.click();
        // 5. Clean up and remove the link
        link.parentNode.removeChild(link);
      });
  }
}

export default IO;
