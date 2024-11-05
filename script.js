// Zipping files
document.getElementById('zipButton').addEventListener('click', function () {
    const files = document.getElementById('zipFileInput').files;
    if (files.length === 0) {
      alert('Please select files to zip.');
      return;
    }
  
    const zip = new JSZip();
  
    // Add each file to the zip
    Array.from(files).forEach((file) => {
      zip.file(file.name, file);
    });
  
    // Generate the zip and create a download link
    zip.generateAsync({ type: 'blob' }).then((content) => {
      const downloadLink = document.getElementById('downloadLink');
      downloadLink.href = URL.createObjectURL(content);
      downloadLink.style.display = 'inline-block';
    });
  });
  
  // Unzipping files and handling all file types
  document.getElementById('unzipButton').addEventListener('click', function () {
    const fileInput = document.getElementById('unzipFileInput').files[0];
    if (!fileInput) {
      alert('Please select a zip file to unzip.');
      return;
    }
  
    const unzipOutput = document.getElementById('unzipOutput');
    unzipOutput.innerHTML = ''; // Clear previous output
  
    const zip = new JSZip();
  
    // Read the zip file
    fileInput.arrayBuffer().then((buffer) => {
      zip.loadAsync(buffer).then((zipContent) => {
        // Process each file in the zip
        Object.keys(zipContent.files).forEach((filename) => {
          const fileExtension = filename.split('.').pop().toLowerCase();
  
          // Check the file type by extension
          if (['txt', 'json', 'html', 'css', 'js'].includes(fileExtension)) {
            // For text-based files
            zipContent.files[filename].async('string').then((fileData) => {
              const fileElement = document.createElement('div');
              fileElement.textContent = `File: ${filename}`;
              const contentElement = document.createElement('pre');
              contentElement.textContent = fileData;
              unzipOutput.appendChild(fileElement);
              unzipOutput.appendChild(contentElement);
            });
          } else if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(fileExtension)) {
            // For image files
            zipContent.files[filename].async('blob').then((fileBlob) => {
              const fileElement = document.createElement('div');
              fileElement.textContent = `File: ${filename}`;
              const imgElement = document.createElement('img');
              imgElement.src = URL.createObjectURL(fileBlob);
              imgElement.style.maxWidth = '100%';
              imgElement.style.marginTop = '10px';
              unzipOutput.appendChild(fileElement);
              unzipOutput.appendChild(imgElement);
            });
          } else {
            // For other binary files (e.g., PDF, DOCX)
            zipContent.files[filename].async('blob').then((fileBlob) => {
              const fileElement = document.createElement('div');
              fileElement.textContent = `File: ${filename}`;
              const downloadLink = document.createElement('a');
              downloadLink.href = URL.createObjectURL(fileBlob);
              downloadLink.download = filename;
              downloadLink.textContent = `Download ${filename}`;
              downloadLink.style.display = 'block';
              downloadLink.style.marginTop = '5px';
              unzipOutput.appendChild(fileElement);
              unzipOutput.appendChild(downloadLink);
            });
          }
        });
      });
    });
  });
  