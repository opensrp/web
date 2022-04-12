/**
 * Function to download data to a file
 *
 * @param {string} data - data to be written to file
 * @param {string} filename - name of the file to be saved
 * @param {string} type - MIME type for the file
 */
export const downloadFile = (data: string, filename: string, type: string) => {
  const file = new Blob([data], { type });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((window.navigator as any).msSaveOrOpenBlob) {
    // IE10+
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window.navigator as any).msSaveOrOpenBlob(file, filename);
  } else {
    // Others
    const docElement = document.createElement('a');
    const url = URL.createObjectURL(file);
    docElement.href = url;
    docElement.download = filename;
    document.body.appendChild(docElement);
    docElement.click();
    setTimeout(() => {
      document.body.removeChild(docElement);
      window.URL.revokeObjectURL(url);
    }, 0);
  }
};